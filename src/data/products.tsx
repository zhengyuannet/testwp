import React from "react";

export type CategoryId =
  | "todos"
  | "frutas"
  | "verduras"
  | "lacteos"
  | "carnes"
  | "bebidas"
  | "hogar"
  | "dulces"
  | "panaderia"
  | "congelados";

export type BadgeType = "BESTSELLER" | "NEW" | "OFERTA";

export interface Product {
  id: string;
  name: {
    es: string;
    zh: string;
    en: string;
  };
  priceUSD: number;
  category: CategoryId;
  badge?: BadgeType;
  renderIllustration: (className?: string) => React.ReactNode;
}

export const CATEGORIES: {
  id: CategoryId;
  label: { es: string; zh: string; en: string };
}[] = [
  { id: "todos", label: { es: "Todos", zh: "全部", en: "All" } },
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

export const HERO_BANNERS = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=85",
    alt: "Supermercado pasillo principal",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85",
    alt: "Frutas y verduras frescas",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1200&q=85",
    alt: "Productos frescos todos los días",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "mango-fresco",
    name: { es: "Mango Fresco", zh: "新鲜芒果", en: "Fresh Mango" },
    priceUSD: 3.5,
    category: "frutas",
    badge: "BESTSELLER",
    renderIllustration: (className = "w-36 h-36") => (
      <svg viewBox="0 0 200 180" className={className} fill="none">
        {/* Soft un-outlined yellow bananas bunch (matches card 1 in video) */}
        <path
          d="M128 32 C115 75, 75 110, 22 108 C18 108, 14 114, 20 120 C68 135, 128 105, 142 36 Z"
          fill="#FFF36D"
        />
        <path
          d="M138 36 C132 88, 92 135, 34 142 C29 142, 28 150, 36 153 C98 158, 148 112, 152 40 Z"
          fill="#FFEB3B"
        />
        <path
          d="M150 40 C158 95, 130 148, 72 162 C66 163, 68 170, 76 171 C140 165, 178 110, 162 42 Z"
          fill="#FDD835"
        />
        {/* Brown tips and stem */}
        <path d="M126 24 L165 36 L160 45 L125 34 Z" fill="#9CCC65" />
        <circle cx="19" cy="113" r="4.5" fill="#795548" />
        <circle cx="33" cy="147" r="4.5" fill="#795548" />
        <circle cx="72" cy="166" r="4.5" fill="#795548" />
      </svg>
    ),
  },
  {
    id: "bananas",
    name: { es: "Bananas", zh: "香蕉", en: "Bananas" },
    priceUSD: 2.0,
    category: "frutas",
    renderIllustration: (className = "w-36 h-36") => (
      <svg viewBox="0 0 200 180" className={className} fill="none">
        {/* Bold black-outlined banana bunch (matches card 2 in video) */}
        <path
          d="M132 28 C118 75, 72 112, 18 110 C12 110, 12 122, 22 126 C78 138, 132 100, 146 34 Z"
          fill="#FFEB3B"
          stroke="#111"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
        <path
          d="M144 32 C138 88, 94 138, 38 148 C30 149, 32 160, 42 160 C108 160, 154 108, 156 36 Z"
          fill="#FFF176"
          stroke="#111"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
        <path
          d="M154 36 C168 92, 145 145, 92 165 C84 167, 88 175, 98 173 C158 158, 184 98, 164 38 Z"
          fill="#FDD835"
          stroke="#111"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
        <rect
          x="132"
          y="16"
          width="32"
          height="18"
          rx="4"
          transform="rotate(14 132 16)"
          fill="#FDD835"
          stroke="#111"
          strokeWidth="4.5"
        />
      </svg>
    ),
  },
  {
    id: "manzanas-rojas",
    name: { es: "Manzanas Rojas", zh: "红苹果", en: "Red Apples" },
    priceUSD: 4.0,
    category: "frutas",
    badge: "NEW",
    renderIllustration: (className = "w-36 h-36") => (
      <svg viewBox="0 0 200 180" className={className} fill="none">
        {/* Stem */}
        <path
          d="M98 45 C98 28, 108 18, 114 14"
          stroke="#6D4C41"
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* Green leaf */}
        <path
          d="M104 34 C122 14, 156 16, 164 34 C146 48, 120 46, 104 34 Z"
          fill="#43A047"
        />
        {/* Red Apple Body */}
        <path
          d="M100 46 C72 34, 30 50, 30 96 C30 142, 65 170, 92 166 C97 165, 103 165, 108 166 C135 170, 170 142, 170 96 C170 50, 128 34, 100 46 Z"
          fill="#E53935"
        />
        {/* Highlight */}
        <path
          d="M52 72 C44 88, 44 112, 54 128"
          stroke="#EF9A9A"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "naranjas",
    name: { es: "Naranjas", zh: "鲜橙 / 柑橘", en: "Oranges" },
    priceUSD: 3.0,
    category: "frutas",
    renderIllustration: (className = "w-36 h-36") => (
      <svg viewBox="0 0 200 180" className={className} fill="none">
        {/* Top left green orange */}
        <circle cx="62" cy="68" r="44" fill="#689F38" />
        <circle cx="58" cy="64" r="38" fill="#7CB342" />
        <circle cx="48" cy="52" r="9" fill="#DCEDC8" />
        <circle cx="48" cy="52" r="5" fill="#E53935" />
        {/* Top right green orange */}
        <circle cx="140" cy="68" r="42" fill="#558B2F" />
        <circle cx="136" cy="64" r="36" fill="#689F38" />
        <circle cx="152" cy="52" r="8" fill="#DCEDC8" />
        <circle cx="152" cy="52" r="4.5" fill="#E53935" />
        {/* Bottom center green orange */}
        <circle cx="102" cy="122" r="46" fill="#689F38" />
        <circle cx="98" cy="118" r="40" fill="#7CB342" />
        <circle cx="102" cy="118" r="10" fill="#DCEDC8" />
        <circle cx="102" cy="118" r="5.5" fill="#E53935" />
      </svg>
    ),
  },
  {
    id: "leche-entera",
    name: { es: "Leche Entera", zh: "全脂牛奶", en: "Whole Milk" },
    priceUSD: 5.5,
    category: "lacteos",
    renderIllustration: (className = "w-36 h-36") => (
      <svg
        viewBox="0 0 200 180"
        className={`${className} stroke-neutral-900 dark:stroke-neutral-100`}
        fill="none"
      >
        {/* Cup with dome lid & straw line art (matches video card 5) */}
        <path d="M92 38 L92 14 L108 14 L108 38" strokeWidth="5.5" strokeLinejoin="round" />
        <path
          d="M56 64 C56 34, 144 34, 144 64"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        <rect x="48" y="64" width="104" height="14" rx="7" strokeWidth="5.5" />
        <path d="M58 78 L68 164 L132 164 L142 78" strokeWidth="5.5" strokeLinejoin="round" />
        <line x1="62" y1="112" x2="138" y2="112" strokeWidth="5.5" />
        <line x1="65" y1="142" x2="135" y2="142" strokeWidth="5.5" />
        <circle cx="88" cy="95" r="3.5" className="fill-neutral-900 dark:fill-neutral-100" />
        <circle cx="114" cy="127" r="3.5" className="fill-neutral-900 dark:fill-neutral-100" />
        <line x1="82" y1="127" x2="96" y2="127" strokeWidth="5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "queso",
    name: { es: "Queso", zh: "手工奶酪", en: "Cheese" },
    priceUSD: 8.5,
    category: "lacteos",
    badge: "OFERTA",
    renderIllustration: (className = "w-36 h-36") => (
      <svg
        viewBox="0 0 200 180"
        className={`${className} stroke-neutral-900 dark:stroke-neutral-100`}
        fill="none"
      >
        {/* Hat with flower badge line art (matches video card 6) */}
        <path
          d="M52 108 C52 56, 148 56, 148 108"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        <path d="M53 94 C85 88, 115 88, 147 94" strokeWidth="5" />
        <path
          d="M14 112 C48 96, 152 96, 186 112 C152 132, 48 132, 14 112 Z"
          strokeWidth="5.5"
          strokeLinejoin="round"
        />
        {/* Flower accent */}
        <circle
          cx="124"
          cy="98"
          r="12"
          className="fill-white dark:fill-neutral-900"
          strokeWidth="5"
        />
        <circle cx="124" cy="98" r="4" className="fill-neutral-900 dark:fill-neutral-100" />
      </svg>
    ),
  },
  {
    id: "yogurt",
    name: { es: "Yogurt", zh: "风味酸奶", en: "Yogurt" },
    priceUSD: 2.5,
    category: "lacteos",
    renderIllustration: (className = "w-36 h-36") => (
      <svg
        viewBox="0 0 200 180"
        className={`${className} stroke-neutral-900 dark:stroke-neutral-100`}
        fill="none"
      >
        {/* Mask with stick line art (matches video card 7) */}
        <path d="M68 48 L52 24 L84 38" strokeWidth="5" strokeLinejoin="round" />
        <path d="M132 48 L148 24 L116 38" strokeWidth="5" strokeLinejoin="round" />
        <path d="M100 44 L100 18" strokeWidth="5" strokeLinecap="round" />
        <path
          d="M24 56 C52 42, 82 48, 100 62 C118 48, 148 42, 176 56 C174 96, 142 114, 114 102 L100 116 L86 102 C58 114, 26 96, 24 56 Z"
          strokeWidth="5.5"
          strokeLinejoin="round"
        />
        <ellipse cx="64" cy="76" rx="16" ry="10" strokeWidth="5" />
        <ellipse cx="136" cy="76" rx="16" ry="10" strokeWidth="5" />
        <line x1="168" y1="88" x2="168" y2="168" strokeWidth="6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "carne-de-res",
    name: { es: "Carne de Res", zh: "精选牛肉", en: "Beef" },
    priceUSD: 18.0,
    category: "carnes",
    badge: "BESTSELLER",
    renderIllustration: (className = "w-36 h-36") => (
      <svg
        viewBox="0 0 200 180"
        className={`${className} stroke-neutral-900 dark:stroke-neutral-100`}
        fill="none"
      >
        {/* Framed landscape line art (matches video card 8) */}
        <rect x="20" y="28" width="160" height="124" rx="6" strokeWidth="5.5" />
        <rect x="34" y="42" width="132" height="96" rx="2" strokeWidth="5" />
        <circle cx="132" cy="68" r="12" strokeWidth="5" />
        <path
          d="M36 134 L82 82 L122 126 L142 104 L164 134"
          strokeWidth="5.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "tomates-frescos",
    name: { es: "Tomates Frescos", zh: "新鲜番茄", en: "Fresh Tomatoes" },
    priceUSD: 2.8,
    category: "verduras",
    renderIllustration: (className = "w-36 h-36") => (
      <svg
        viewBox="0 0 200 180"
        className={`${className} stroke-neutral-900 dark:stroke-neutral-100`}
        fill="none"
      >
        {/* Line art citrus/tomato (matches video card 9 bottom left) */}
        <circle cx="88" cy="108" r="52" strokeWidth="5.5" />
        <path
          d="M88 56 C105 32, 148 28, 164 46 C146 66, 112 68, 88 56 Z"
          strokeWidth="5.5"
          strokeLinejoin="round"
        />
        <path d="M88 56 L82 34" strokeWidth="5.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "cerveza-pack",
    name: { es: "Pack Refrescos", zh: "冰镇特饮装", en: "Refreshment Pack" },
    priceUSD: 6.5,
    category: "bebidas",
    badge: "NEW",
    renderIllustration: (className = "w-36 h-36") => (
      <svg viewBox="0 0 200 180" className={className} fill="none">
        {/* Two clinking mugs (matches video card 10 bottom right) */}
        <g transform="rotate(-8 68 105)">
          <rect
            x="36"
            y="62"
            width="56"
            height="82"
            rx="8"
            fill="#FFB300"
            stroke="#111"
            strokeWidth="4.5"
          />
          <path
            d="M32 62 C32 46, 52 44, 62 50 C72 42, 96 46, 94 62 Z"
            fill="#FFF"
            stroke="#111"
            strokeWidth="4.5"
          />
        </g>
        <g transform="rotate(8 134 105)">
          <rect
            x="104"
            y="68"
            width="56"
            height="82"
            rx="8"
            fill="#FFA000"
            stroke="#111"
            strokeWidth="4.5"
          />
          <path
            d="M100 68 C100 52, 120 50, 130 56 C140 48, 164 52, 162 68 Z"
            fill="#FFF"
            stroke="#111"
            strokeWidth="4.5"
          />
        </g>
      </svg>
    ),
  },
  {
    id: "aguacate-hass",
    name: { es: "Aguacate Hass", zh: "哈斯牛油果", en: "Hass Avocado" },
    priceUSD: 4.5,
    category: "verduras",
    badge: "BESTSELLER",
    renderIllustration: (className = "w-36 h-36") => (
      <svg viewBox="0 0 200 180" className={className} fill="none">
        <path
          d="M100 24 C72 24, 52 74, 52 114 C52 148, 74 166, 100 166 C126 166, 148 148, 148 114 C148 74, 128 24, 100 24 Z"
          fill="#2E7D32"
          stroke="#111"
          strokeWidth="4.5"
        />
        <path
          d="M100 36 C78 36, 64 78, 64 112 C64 140, 80 154, 100 154 C120 154, 136 140, 136 112 C136 78, 122 36, 100 36 Z"
          fill="#C5E1A5"
        />
        <circle cx="100" cy="114" r="24" fill="#6D4C41" stroke="#111" strokeWidth="4" />
        <circle cx="93" cy="108" r="6" fill="#A1887F" />
      </svg>
    ),
  },
  {
    id: "pollo-entero",
    name: { es: "Pollo Fresco", zh: "农家鲜鸡肉", en: "Fresh Chicken" },
    priceUSD: 9.5,
    category: "carnes",
    renderIllustration: (className = "w-36 h-36") => (
      <svg viewBox="0 0 200 180" className={className} fill="none">
        <path
          d="M54 118 C38 92, 56 52, 92 52 C118 52, 132 72, 146 92 L166 108 L154 124 L134 110 C114 134, 74 142, 54 118 Z"
          fill="#FFCC80"
          stroke="#111"
          strokeWidth="4.5"
        />
        <circle cx="168" cy="104" r="9" fill="#FFF" stroke="#111" strokeWidth="4" />
        <circle cx="158" cy="124" r="9" fill="#FFF" stroke="#111" strokeWidth="4" />
      </svg>
    ),
  },
  {
    id: "detergente-hogar",
    name: { es: "Limpiador Multiuso", zh: "多效清洁剂", en: "Multi-purpose Cleaner" },
    priceUSD: 4.2,
    category: "hogar",
    renderIllustration: (className = "w-36 h-36") => (
      <svg viewBox="0 0 200 180" className={className} fill="none">
        <rect
          x="64"
          y="58"
          width="72"
          height="102"
          rx="14"
          fill="#4FC3F7"
          stroke="#111"
          strokeWidth="4.5"
        />
        <rect
          x="84"
          y="32"
          width="32"
          height="26"
          rx="4"
          fill="#FFD54F"
          stroke="#111"
          strokeWidth="4.5"
        />
        <rect
          x="76"
          y="88"
          width="48"
          height="44"
          rx="6"
          fill="#FFF"
          stroke="#111"
          strokeWidth="4"
        />
      </svg>
    ),
  },
  {
    id: "chocolate-dulce",
    name: { es: "Barra de Chocolate", zh: "醇香黑巧", en: "Chocolate Bar" },
    priceUSD: 3.2,
    category: "dulces",
    badge: "OFERTA",
    renderIllustration: (className = "w-36 h-36") => (
      <svg viewBox="0 0 200 180" className={className} fill="none">
        <rect
          x="52"
          y="28"
          width="96"
          height="128"
          rx="8"
          fill="#5D4037"
          stroke="#111"
          strokeWidth="4.5"
        />
        <rect
          x="48"
          y="86"
          width="104"
          height="72"
          rx="6"
          fill="#E53935"
          stroke="#111"
          strokeWidth="4.5"
        />
        <line x1="84" y1="28" x2="84" y2="86" stroke="#111" strokeWidth="4" />
        <line x1="116" y1="28" x2="116" y2="86" stroke="#111" strokeWidth="4" />
        <line x1="52" y1="58" x2="148" y2="58" stroke="#111" strokeWidth="4" />
      </svg>
    ),
  },
  {
    id: "pan-artesanal",
    name: { es: "Pan Campesino", zh: "手工乡村欧包", en: "Artisan Bread" },
    priceUSD: 2.2,
    category: "panaderia",
    badge: "NEW",
    renderIllustration: (className = "w-36 h-36") => (
      <svg viewBox="0 0 200 180" className={className} fill="none">
        <path
          d="M32 118 C32 68, 68 48, 100 48 C132 48, 168 68, 168 118 C168 134, 154 142, 100 142 C46 142, 32 134, 32 118 Z"
          fill="#FFB74D"
          stroke="#111"
          strokeWidth="4.5"
        />
        <path d="M72 68 L86 96" stroke="#111" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M98 64 L112 92" stroke="#111" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M124 68 L138 96" stroke="#111" strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "helado-cremoso",
    name: { es: "Helado Artesanal", zh: "手工冰淇淋桶", en: "Artisan Ice Cream" },
    priceUSD: 6.0,
    category: "congelados",
    renderIllustration: (className = "w-36 h-36") => (
      <svg viewBox="0 0 200 180" className={className} fill="none">
        <circle
          cx="82"
          cy="68"
          r="28"
          fill="#F48FB1"
          stroke="#111"
          strokeWidth="4.5"
        />
        <circle
          cx="118"
          cy="68"
          r="28"
          fill="#FFF59D"
          stroke="#111"
          strokeWidth="4.5"
        />
        <path
          d="M54 84 L146 84 L132 154 L68 154 Z"
          fill="#80DEEA"
          stroke="#111"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export function renderProductVisual(
  item: { id?: string; imageUrl?: string; illustrationKey?: string },
  className = "w-36 h-36"
): React.ReactNode {
  if (item.imageUrl && item.imageUrl.trim() !== "") {
    return (
      <img
        src={item.imageUrl}
        alt="Product"
        className={`${className} object-contain rounded-xl`}
      />
    );
  }
  const key = item.illustrationKey || item.id || "mango-fresco";
  const matched =
    PRODUCTS.find((p) => p.id === key) || PRODUCTS[0];
  return matched.renderIllustration(className);
}


