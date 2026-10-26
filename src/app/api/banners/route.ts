import { NextRequest, NextResponse } from "next/server";
import { getAllBanners, saveAllBanners } from "@/lib/db";
import { BannerItem } from "@/types/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const banners = getAllBanners();
  return NextResponse.json({ banners });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const banners = getAllBanners();

    if (!body.url || !body.url.trim()) {
      return NextResponse.json(
        { error: "Banner image URL is required" },
        { status: 400 }
      );
    }

    const newBanner: BannerItem = {
      id: `banner-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      url: body.url.trim(),
      alt: body.alt?.trim() || "首页轮播横幅",
    };

    const updated = [...banners, newBanner];
    saveAllBanners(updated);

    return NextResponse.json({ banner: newBanner, banners: updated });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to add banner", details: String(err) },
      { status: 400 }
    );
  }
}

