import { NextResponse } from "next/server";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { getOnboardingUser } from "@/lib/onboarding/server";

const ACCEPTED_TYPES = new Set(["application/pdf", "image/png", "image/jpeg", "image/webp"]);
const BUCKET = "onboarding-files";

function extensionFor(file: File) {
  const name = file.name || "";
  const ext = name.includes(".") ? name.split(".").pop()?.toLowerCase() : "";
  if (ext && ["pdf", "png", "jpg", "jpeg", "webp"].includes(ext)) return ext;
  if (file.type === "application/pdf") return "pdf";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

export async function POST(request: Request) {
  try {
    const user = await getOnboardingUser(request);
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "Choose a PDF, PNG, JPG, JPEG, or WEBP service/product menu file." }, { status: 400 });
    }
    if (!ACCEPTED_TYPES.has(file.type)) {
      return NextResponse.json({ success: false, error: "Accepted menu upload formats are PDF, PNG, JPG/JPEG, and WEBP." }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const { data: workspace, error: workspaceError } = await supabase
      .from("workspaces")
      .select("id,company_id")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (workspaceError) throw workspaceError;
    if (!workspace?.id) {
      return NextResponse.json({ success: false, setupRequired: true, error: "Save onboarding once before uploading a service/product menu." }, { status: 409 });
    }

    const ext = extensionFor(file);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120);
    const path = `${workspace.id}/service-menu/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const bytes = await file.arrayBuffer();
    const upload = await supabase.storage.from(BUCKET).upload(path, bytes, {
      contentType: file.type,
      upsert: false,
    });
    if (upload.error) {
      return NextResponse.json(
        {
          success: false,
          setupRequired: true,
          error: `Onboarding file storage is not ready. Create the ${BUCKET} bucket and retry. ${upload.error.message}`,
        },
        { status: 503 }
      );
    }

    const metadata = {
      source: "onboarding_service_menu",
      original_file_name: file.name,
      storage_bucket: BUCKET,
      storage_path: path,
      content_type: file.type,
      size_bytes: file.size,
      analysis_state: "pending_analysis",
      extraction_state: "needs_review",
      ai_extraction_available: false,
      structured_knowledge: [],
      note: "File uploaded for later AI/admin review. No extraction success is inferred.",
    };

    const { data: uploadRow, error: insertError } = await supabase
      .from("crm_service_menu_uploads")
      .insert({
        workspace_id: workspace.id,
        company_id: workspace.company_id || null,
        user_id: user.id,
        file_name: safeName || file.name,
        content_type: file.type,
        size_bytes: file.size,
        storage_bucket: BUCKET,
        storage_path: path,
        analysis_state: "pending_analysis",
        extraction_state: "needs_review",
        metadata,
      })
      .select()
      .single();
    if (insertError) throw insertError;

    try {
      await supabase.from("crm_ai_recommendations").insert({
        workspace_id: workspace.id,
        type: "onboarding_setup",
        title: "Review uploaded service/product menu",
        description: "A service/product menu was uploaded during onboarding. Analyze it into CRM knowledge before using it for AI assistant, communications, or campaign drafting.",
        action: "review_service_menu",
        status: "open",
        confidence: 0.9,
        metadata,
      });
    } catch {
      // The upload metadata row is the source of truth; recommendations are best-effort.
    }

    return NextResponse.json({
      success: true,
      file: uploadRow,
      message: "Service/product menu uploaded. Analysis is pending review; no extraction success was inferred.",
    });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema, setupRequired: friendly.setupRequired },
      { status: friendly.missingSchema ? 501 : friendly.setupRequired ? 503 : 500 }
    );
  }
}
