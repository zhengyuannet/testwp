import fs from "fs";
import path from "path";
import { ProductItem, CategoryItem, BannerItem } from "@/types/catalog";

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");
const BANNERS_FILE = path.join(DATA_DIR, "banners.json");

export const INITIAL_BANNERS: BannerItem[] = [
  {
    id: "banner-1",
    url: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=85",
    alt: "Supermercado pasillo principal",
  },
  {
    id: "banner-2",
    url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85",
    alt: "Frutas y verduras frescas",
  },
  {
    id: "banner-3",
    url: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1200&q=85",
    alt: "Productos frescos todos los días",
  },
];

export const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: "frutas", label: { es: "Frutas", zh: "水果", en: "Fruits" } },
  { id: "verduras", label: { es: "Verduras", zh: "蔬菜", en: "Vegetables" } },
  { id: "lacteos", label: { es: "Lácteos", zh: "乳制品", en: "Dairy" } },
  { id: "carnes", label: { es: "Carnes", zh: "肉类", en: "Meats" } },
  { id: "bebidas", label: { es: "Bebidas", zh: "饮品", en: "Drinks" } },
  { id: "hogar", label: { es: "Hogar", zh: "日用百货", en: "Home" } },
  { id: "dulces", label: { es: "Dulces", zh: "甜品零食", en: "Sweets" } },
  { id: "panaderia", label: { es: "Panadería", zh: "烘焙面包", en: "Bakery" } },
  { id: "congelados", label: { es: "Congelados", zh: "冷冻食品", en: "Frozen" } },
];

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: "mango-fresco",
    name: { es: "Mango Fresco", zh: "新鲜芒果", en: "Fresh Mango" },
    priceUSD: 3.5,
    category: "frutas",
    badge: "BESTSELLER",
    illustrationKey: "mango-fresco",
    active: true,
    skus: [
      { id: "sku-mng-1", code: "MNG-500G", name: "500g", priceUSD: 3.5, stock: 50 },
      { id: "sku-mng-2", code: "MNG-1KG", name: "1kg", priceUSD: 6.5, stock: 35 },
    ],
  },
  {
    id: "bananas",
    name: { es: "Bananas", zh: "香蕉", en: "Bananas" },
    priceUSD: 2.0,
    category: "frutas",
    illustrationKey: "bananas",
    active: true,
    skus: [
      { id: "sku-ban-1", code: "BAN-1KG", name: "1kg (Manojo)", priceUSD: 2.0, stock: 80 },
      { id: "sku-ban-2", code: "BAN-CAJA", name: "Caja 5kg", priceUSD: 8.5, stock: 20 },
    ],
  },
  {
    id: "manzanas-rojas",
    name: { es: "Manzanas Rojas", zh: "红苹果", en: "Red Apples" },
    priceUSD: 4.0,
    category: "frutas",
    badge: "NEW",
    illustrationKey: "manzanas-rojas",
    active: true,
    skus: [
      { id: "sku-app-1", code: "APP-1KG", name: "1kg (4-5 uds)", priceUSD: 4.0, stock: 60 },
      { id: "sku-app-2", code: "APP-2KG", name: "Bolsa 2kg", priceUSD: 7.5, stock: 30 },
    ],
  },
  {
    id: "naranjas",
    name: { es: "Naranjas", zh: "鲜橙 / 柑橘", en: "Oranges" },
    priceUSD: 3.0,
    category: "frutas",
    illustrationKey: "naranjas",
    active: true,
    skus: [
      { id: "sku-ora-1", code: "ORA-1KG", name: "1kg", priceUSD: 3.0, stock: 70 },
      { id: "sku-ora-2", code: "ORA-MALLA", name: "Malla 3kg", priceUSD: 8.0, stock: 25 },
    ],
  },
  {
    id: "leche-entera",
    name: { es: "Leche Entera", zh: "全脂牛奶", en: "Whole Milk" },
    priceUSD: 5.5,
    category: "lacteos",
    illustrationKey: "leche-entera",
    active: true,
    skus: [
      { id: "sku-lec-1", code: "LEC-1L", name: "1 Litro", priceUSD: 5.5, stock: 45 },
      { id: "sku-lec-2", code: "LEC-PACK6", name: "Pack 6x1L", priceUSD: 30.0, stock: 15 },
    ],
  },
  {
    id: "queso",
    name: { es: "Queso", zh: "手工奶酪", en: "Cheese" },
    priceUSD: 8.5,
    category: "lacteos",
    badge: "OFERTA",
    illustrationKey: "queso",
    active: true,
    skus: [
      { id: "sku-que-1", code: "QUE-500G", name: "500g", priceUSD: 8.5, stock: 40 },
      { id: "sku-que-2", code: "QUE-1KG", name: "1kg Bloque", priceUSD: 16.0, stock: 20 },
    ],
  },
  {
    id: "yogurt",
    name: { es: "Yogurt", zh: "风味酸奶", en: "Yogurt" },
    priceUSD: 2.5,
    category: "lacteos",
    illustrationKey: "yogurt",
    active: true,
    skus: [
      { id: "sku-yog-1", code: "YOG-NAT", name: "Natural 400g", priceUSD: 2.5, stock: 50 },
      { id: "sku-yog-2", code: "YOG-FRE", name: "Fresa 400g", priceUSD: 2.8, stock: 45 },
    ],
  },
  {
    id: "carne-de-res",
    name: { es: "Carne de Res", zh: "精选牛肉", en: "Beef" },
    priceUSD: 18.0,
    category: "carnes",
    badge: "BESTSELLER",
    illustrationKey: "carne-de-res",
    active: true,
    skus: [
      { id: "sku-res-1", code: "RES-1KG", name: "Corte 1kg", priceUSD: 18.0, stock: 30 },
      { id: "sku-res-2", code: "RES-500G", name: "Bandeja 500g", priceUSD: 9.5, stock: 40 },
    ],
  },
  {
    id: "tomates-frescos",
    name: { es: "Tomates Frescos", zh: "新鲜番茄", en: "Fresh Tomatoes" },
    priceUSD: 2.8,
    category: "verduras",
    illustrationKey: "tomates-frescos",
    active: true,
    skus: [
      { id: "sku-tom-1", code: "TOM-1KG", name: "1kg", priceUSD: 2.8, stock: 65 },
    ],
  },
  {
    id: "cerveza-pack",
    name: { es: "Pack Refrescos", zh: "冰镇特饮装", en: "Refreshment Pack" },
    priceUSD: 6.5,
    category: "bebidas",
    badge: "NEW",
    illustrationKey: "cerveza-pack",
    active: true,
    skus: [
      { id: "sku-ref-1", code: "REF-6PK", name: "Six Pack 355ml", priceUSD: 6.5, stock: 55 },
      { id: "sku-ref-2", code: "REF-24PK", name: "Caja 24 Latas", priceUSD: 24.0, stock: 20 },
    ],
  },
  {
    id: "aguacate-hass",
    name: { es: "Aguacate Hass", zh: "哈斯牛油果", en: "Hass Avocado" },
    priceUSD: 4.5,
    category: "verduras",
    badge: "BESTSELLER",
    illustrationKey: "aguacate-hass",
    active: true,
    skus: [
      { id: "sku-agu-1", code: "AGU-1KG", name: "1kg", priceUSD: 4.5, stock: 40 },
    ],
  },
  {
    id: "pollo-entero",
    name: { es: "Pollo Fresco", zh: "农家鲜鸡肉", en: "Fresh Chicken" },
    priceUSD: 9.5,
    category: "carnes",
    illustrationKey: "pollo-entero",
    active: true,
    skus: [
      { id: "sku-pol-1", code: "POL-ENT", name: "Pollo Entero (~2kg)", priceUSD: 9.5, stock: 35 },
      { id: "sku-pol-2", code: "POL-PEC", name: "Pechuga Filete 1kg", priceUSD: 11.0, stock: 25 },
    ],
  },
  {
    id: "detergente-hogar",
    name: { es: "Limpiador Multiuso", zh: "多效清洁剂", en: "Multi-purpose Cleaner" },
    priceUSD: 4.2,
    category: "hogar",
    illustrationKey: "detergente-hogar",
    active: true,
    skus: [
      { id: "sku-lim-1", code: "LIM-1L", name: "Botella 1L", priceUSD: 4.2, stock: 60 },
    ],
  },
  {
    id: "chocolate-dulce",
    name: { es: "Barra de Chocolate", zh: "醇香黑巧", en: "Chocolate Bar" },
    priceUSD: 3.2,
    category: "dulces",
    badge: "OFERTA",
    illustrationKey: "chocolate-dulce",
    active: true,
    skus: [
      { id: "sku-cho-1", code: "CHO-100G", name: "Tableta 100g", priceUSD: 3.2, stock: 90 },
    ],
  },
  {
    id: "pan-artesanal",
    name: { es: "Pan Campesino", zh: "手工乡村欧包", en: "Artisan Bread" },
    priceUSD: 2.2,
    category: "panaderia",
    badge: "NEW",
    illustrationKey: "pan-artesanal",
    active: true,
    skus: [
      { id: "sku-pan-1", code: "PAN-500G", name: "Hogaza 500g", priceUSD: 2.2, stock: 30 },
    ],
  },
  {
    id: "helado-cremoso",
    name: { es: "Helado Artesanal", zh: "手工冰淇淋桶", en: "Artisan Ice Cream" },
    priceUSD: 6.0,
    category: "congelados",
    illustrationKey: "helado-cremoso",
    active: true,
    skus: [
      { id: "sku-hel-1", code: "HEL-1L-VAI", name: "1L Vainilla/Fresa", priceUSD: 6.0, stock: 25 },
    ],
  },
];

function ensureDbFiles(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(
      PRODUCTS_FILE,
      JSON.stringify(INITIAL_PRODUCTS, null, 2),
      "utf-8"
    );
  }
  if (!fs.existsSync(CATEGORIES_FILE)) {
    fs.writeFileSync(
      CATEGORIES_FILE,
      JSON.stringify(INITIAL_CATEGORIES, null, 2),
      "utf-8"
    );
  }
  if (!fs.existsSync(BANNERS_FILE)) {
    fs.writeFileSync(
      BANNERS_FILE,
      JSON.stringify(INITIAL_BANNERS, null, 2),
      "utf-8"
    );
  }
}

export function getAllProducts(): ProductItem[] {
  ensureDbFiles();
  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // Fallback
  }
  return INITIAL_PRODUCTS;
}

export function saveAllProducts(products: ProductItem[]): void {
  ensureDbFiles();
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
}

export function getAllCategories(): CategoryItem[] {
  ensureDbFiles();
  try {
    const raw = fs.readFileSync(CATEGORIES_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // Fallback
  }
  return INITIAL_CATEGORIES;
}

export function saveAllCategories(categories: CategoryItem[]): void {
  ensureDbFiles();
  fs.writeFileSync(
    CATEGORIES_FILE,
    JSON.stringify(categories, null, 2),
    "utf-8"
  );
}

export function getAllBanners(): BannerItem[] {
  ensureDbFiles();
  try {
    const raw = fs.readFileSync(BANNERS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // Fallback
  }
  return INITIAL_BANNERS;
}

export function saveAllBanners(banners: BannerItem[]): void {
  ensureDbFiles();
  fs.writeFileSync(BANNERS_FILE, JSON.stringify(banners, null, 2), "utf-8");
}
