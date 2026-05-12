import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { buildWorkspaceIntelligence, generateGeminiInsights } from "@/lib/ai/workspace-intelligence";
import { bootstrapWorkspace } from "@/lib/workspace/bootstrapWorkspace";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ success: false, error: "Missing authorization" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const intelligence = buildWorkspaceIntelligence({
      businessName: body.businessName,
      industry: body.industry,
      monthlyRevenue: body.monthlyRevenue,
      yearlyRevenue: body.yearlyRevenue,
      monthlyProfit: body.monthlyProfit,
      yearlyProfit: body.yearlyProfit,
      customerLTV: body.customerLTV,
      roiTarget: body.roiTarget,
      responseTime: body.responseTime,
      peakMonths: body.peakMonths,
      slowMonths: body.slowMonths,
      aiPersonality: body.aiPersonality,
      products: body.products,
      promotedProducts: body.promotedProducts,
      integrations: body.integrations || [],
      uploadedFiles: body.uploadedFiles || [],
      csvFile: body.csvFile || null,
      geminiKey: body.geminiKey,
    });

    const geminiAnalysis = await generateGeminiInsights(
      body.businessName,
      body.industry,
      body.products,
      body.roiTarget,
      body.geminiKey
    );

    const { data: workspace, error: workspaceError } = await supabase
      .from("workspaces")
      .insert({
        owner_id: user.id,
        name: body.businessName,
        industry: body.industry,
        onboarding_data: body,
        intelligence,
        gemini_analysis: geminiAnalysis,
        monthly_revenue: body.monthlyRevenue || 0,
        yearly_revenue: body.yearlyRevenue || 0,
        customer_ltv: body.customerLTV || 0,
        roi_target: body.roiTarget || "0",
        uploaded_knowledge_count: (body.uploadedFiles || []).length,
        csv_imported: Boolean(body.csvFile),
        integrations: body.integrations || [],
      })
      .select()
      .single();

    if (workspaceError) {
      console.error(workspaceError);
      return NextResponse.json({ success: false, error: workspaceError.message }, { status: 500 });
    }

    if (workspace) {
      await bootstrapWorkspace(workspace);
    }

    return NextResponse.json({ success: true, workspace, redirect: "/dashboard" });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
