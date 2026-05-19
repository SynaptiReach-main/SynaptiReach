import { NextResponse }
from "next/server";

import {
  getFileType,
} from "@/lib/marketing/media/getFileType";

import { createMarketingSupabaseAdmin }
from "@/lib/marketing/supabaseAdmin";

export async function POST(
  request: Request
) {
  try {
    const supabase =
      createMarketingSupabaseAdmin();

    const form =
      await request.formData();

    const file =
      form.get(
        "file"
      ) as File;

    const workspaceId =
      form.get(
        "workspaceId"
      ) as string;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No file uploaded",
        },
        {
          status: 400,
        }
      );
    }

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const filename =
      `${Date.now()}-${file.name}`;

    const path =
      `${workspaceId || "unscoped"}/${filename}`;

    const {
      error:
        uploadError,
    } = await supabase
      .storage
      .from(
        "marketing-media"
      )
      .upload(
        path,
        buffer,
        {
          contentType:
            file.type,
        }
      );

    if (uploadError) {
      throw uploadError;
    }

    const {
      data,
    } = supabase
      .storage
      .from(
        "marketing-media"
      )
      .getPublicUrl(
        path
      );

    const type =
      getFileType(
        file.name
      );

    const mediaInsert: Record<string, any> = {
      name:
        file.name,

      type,

      url:
        data.publicUrl,

      size:
        file.size,
    };

    if (workspaceId) {
      mediaInsert.workspace_id =
        workspaceId;
    }

    const {
      data:
        mediaRecord,
    } = await supabase
      .from(
        "marketing_media"
      )
      .insert(mediaInsert)
      .select()
      .single();

    return NextResponse.json({
      success: true,

      media:
        mediaRecord,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,

        error:
          error.message,
      },
      {
        status: 500,
      }
    );
  }
}
