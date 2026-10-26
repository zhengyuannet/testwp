import { NextRequest, NextResponse } from "next/server";
import { getAllBanners, saveAllBanners } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const banners = getAllBanners();
    const idx = banners.findIndex((b) => b.id === id);

    if (idx === -1) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    const existing = banners[idx];
    const updatedBanner = {
      ...existing,
      url: body.url !== undefined ? body.url.trim() : existing.url,
      alt: body.alt !== undefined ? body.alt.trim() : existing.alt,
    };

    banners[idx] = updatedBanner;
    saveAllBanners(banners);

    return NextResponse.json({ banner: updatedBanner, banners });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update banner", details: String(err) },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const banners = getAllBanners();
    const filtered = banners.filter((b) => b.id !== id);
    saveAllBanners(filtered);

    return NextResponse.json({ success: true, banners: filtered });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete banner", details: String(err) },
      { status: 400 }
    );
  }
}

