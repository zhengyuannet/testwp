import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, saveAllProducts } from "@/lib/db";
import { ProductItem } from "@/types/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = getAllProducts();
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const products = getAllProducts();

    const id =
      body.id ||
      `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    const baseName =
      body.name?.zh?.trim() ||
      body.name?.es?.trim() ||
      body.name?.en?.trim() ||
      "Nuevo Producto";

    const skus =
      Array.isArray(body.skus) && body.skus.length > 0
        ? body.skus
        : [
            {
              id: `sku-${Date.now()}`,
              code: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
              name: "默认规格 / Estándar",
              priceUSD: Number(body.priceUSD) || 1.0,
              stock: 50,
            },
          ];

    const newProduct: ProductItem = {
      id,
      name: {
        es: body.name?.es?.trim() || baseName,
        zh: body.name?.zh?.trim() || baseName,
        en: body.name?.en?.trim() || baseName,
      },
      priceUSD: Number(skus[0]?.priceUSD ?? body.priceUSD ?? 1.0),
      category: body.category || "frutas",
      badge: body.badge || "",
      imageUrl: body.imageUrl || "",
      illustrationKey: body.illustrationKey || "mango-fresco",
      active: body.active !== undefined ? Boolean(body.active) : true,
      skus,
    };

    const updated = [newProduct, ...products];
    saveAllProducts(updated);

    return NextResponse.json({ product: newProduct, products: updated });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create product", details: String(err) },
      { status: 400 }
    );
  }
}

