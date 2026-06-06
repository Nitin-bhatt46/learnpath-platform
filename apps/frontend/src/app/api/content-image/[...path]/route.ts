import { promises as fs } from "fs";
import { NextResponse, type NextRequest } from "next/server";
import { resolveContentAssetPath } from "@/lib/content";

const mimeTypes: Record<string, string> = {
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp"
};

export async function GET(_request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const assetPath = await resolveContentAssetPath(path);
  const extension = assetPath.slice(assetPath.lastIndexOf(".")).toLowerCase();
  const body = await fs.readFile(assetPath);

  return new NextResponse(body, {
    headers: {
      "Content-Type": mimeTypes[extension] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}
