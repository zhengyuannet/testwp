import { NextRequest, NextResponse } from "next/server";
import { getAllCategories, saveAllCategories } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const categories = getAllCategories();
    const idx = categories.findIndex((c) => c.id === id);

    if (idx === -1) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const existing = categories[idx];
    const fallbackLabel =
      body.label?.zh?.trim() ||
      body.label?.es?.trim() ||
      body.label?.en?.trim() ||
      existing.label.zh;

    const updatedCat = {
      ...existing,
      id: existing.id,
      label: {
        zh: body.label?.zh?.trim() || fallbackLabel,
        es: body.label?.es?.trim() || fallbackLabel,
        en: body.label?.en?.trim() || fallbackLabel,
      },
    };

    categories[idx] = updatedCat;
    saveAllCategories(categories);

    return NextResponse.json({ category: updatedCat, categories });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update category", details: String(err) },
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
    const categories = getAllCategories();
    const filtered = categories.filter((c) => c.id !== id);
    saveAllCategories(filtered);

    return NextResponse.json({ success: true, categories: filtered });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete category", details: String(err) },
      { status: 400 }
    );
  }
}

