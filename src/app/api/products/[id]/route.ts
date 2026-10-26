import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, saveAllProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const products = getAllProducts();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const existing = products[index];
    const baseName =
      body.name?.zh?.trim() ||
      body.name?.es?.trim() ||
      body.name?.en?.trim() ||
      existing.name.es;

    const skus =
      Array.isArray(body.skus) && body.skus.length > 0
        ? body.skus
        : existing.skus;

    const updatedProduct = {
      ...existing,
      ...body,
      id: existing.id,
      name: {
        es: body.name?.es?.trim() || baseName,
        zh: body.name?.zh?.trim() || baseName,
        en: body.name?.en?.trim() || baseName,
      },
      priceUSD: Number(
        body.priceUSD !== undefined
          ? body.priceUSD
          : skus[0]?.priceUSD ?? existing.priceUSD
      ),
      skus,
    };

    products[index] = updatedProduct;
    saveAllProducts(products);

    return NextResponse.json({ product: updatedProduct, products });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update product", details: String(err) },
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
    const products = getAllProducts();
    const filtered = products.filter((p) => p.id !== id);
    saveAllProducts(filtered);

    return NextResponse.json({ success: true, products: filtered });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete product", details: String(err) },
      { status: 400 }
    );
  }
}

