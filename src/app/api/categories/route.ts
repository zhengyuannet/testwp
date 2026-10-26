import { NextRequest, NextResponse } from "next/server";
import { getAllCategories, saveAllCategories } from "@/lib/db";
import { CategoryItem } from "@/types/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const categories = getAllCategories();
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const categories = getAllCategories();

    const fallbackLabel =
      body.label?.zh?.trim() ||
      body.label?.es?.trim() ||
      body.label?.en?.trim() ||
      "新类目";

    const rawId =
      body.id?.trim() ||
      body.label?.es
        ?.trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") ||
      `cat-${Date.now()}`;

    const id =
      categories.some((c) => c.id === rawId) || rawId === "todos"
        ? `cat-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`
        : rawId;

    const newCategory: CategoryItem = {
      id,
      label: {
        zh: body.label?.zh?.trim() || fallbackLabel,
        es: body.label?.es?.trim() || fallbackLabel,
        en: body.label?.en?.trim() || fallbackLabel,
      },
    };

    const updated = [...categories, newCategory];
    saveAllCategories(updated);

    return NextResponse.json({ category: newCategory, categories: updated });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create category", details: String(err) },
      { status: 400 }
    );
  }
}

