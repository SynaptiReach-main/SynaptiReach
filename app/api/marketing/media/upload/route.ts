import { NextResponse }
from "next/server";

import { createClient }
from "@supabase/supabase-js";

import {
  getFileType,
} from "@/lib/marketing/media/getFileType";

const supabase = createClient(
  process.env
    .NEXT_PUBLIC_SUPABASE_URL || "",

  process.env
    .SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(
  request: Request
) {
  try {
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
      `${workspaceId}/${filename}`;

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

    const {
      data:
        mediaRecord,
    } = await supabase
      .from(
        "marketing_media"
      )
      .insert({
        workspace_id:
          workspaceId,

        name:
          file.name,

        type,

        url:
          data.publicUrl,

        size:
          file.size,
      })
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
