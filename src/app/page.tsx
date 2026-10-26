"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  ArrowUp,
  X,
  Check,
  MapPin,
  Plus,
  Minus,
  Send,
  Table2,
  Copy,
  Settings,
  MessageCircle,
  Download,
  Share2,
  Image as ImageIcon,
  SlidersHorizontal,
  ScanLine,
  Camera,
  Barcode,
} from "lucide-react";
import {
  CATEGORIES as DEFAULT_CATEGORIES,
  HERO_BANNERS,
  renderProductVisual,
} from "@/data/products";
import {
  ProductItem,
  ProductSku,
  CategoryId,
  CategoryItem,
  BannerItem,
} from "@/types/catalog";

type Lang = "es" | "zh" | "en";
type Currency = "USD" | "VES" | "CNY";
type QuickJumpTarget = "drawer" | "whatsapp" | "wechat";

const CURRENCY_CONFIG: Record<
  Currency,
  { label: string; symbol: string; rate: number }
> = {
  USD: { label: "$ USD", symbol: "$", rate: 1 },
  VES: { label: "Bs. VES", symbol: "Bs.", rate: 45.5 },
  CNY: { label: "¥ CNY", symbol: "¥", rate: 7.2 },
};

const I18N = {
  es: {
    showing: "Mostrando",
    products: "productos",
    add: "Agregar",
    addedToast: "Agregado al carrito",
    viewCart: "Ver Carrito",
    myCart: "Mi Carrito",
    deliveryInfo: "Información de Entrega",
    fullName: "Nombre completo *",
    phone: "Teléfono/WhatsApp/WeChat",
    address: "Dirección completa *",
    total: "Total:",
    sendWhatsApp: "Enviar por WhatsApp",
    sendWeChat: "Enviar a WeChat (微信)",
    shareWeChatImg: "Compartir Imagen a WeChat",
    saveTableImg: "Guardar Imagen",
    searchPlaceholder: "Buscar por nombre de producto o código SKU...",
    scanBtn: "Escanear",
    scanModalTitle: "Escanear Código / SKU (扫一扫)",
    scanModalHint:
      "Apunta la cámara al código de barras / QR del producto o selecciona un SKU:",
    scanPhotoBtn: "Subir / Tomar foto del código",
    scanQuickSelect: "Prueba rápida de escaneo por SKU:",
    scanSuccessToast: "Código escaneado:",
    scanCameraError:
      "No se pudo abrir la cámara en vivo. Puedes subir una foto del código o elegir un SKU abajo.",
    noProductsFound: "No se encontraron productos para",
    clearSearch: "Limpiar búsqueda",
    emptyCart: "Tu carrito está vacío",
    tablePreviewTitle: "Tabla de Pedido (WhatsApp / WeChat 微信)",
    copyTable: "Copiar Tabla",
    copied: "¡Copiado!",
    wechatCopiedToast:
      "¡Tabla copiada! Abriendo WeChat, pega el pedido en el chat.",
    whatsappPhoneLabel: "WhatsApp de la tienda:",
    wechatIdLabel: "WeChat ID de la tienda:",
    clickCartActionLabel: "Al tocar 'Ver Carrito' abajo:",
    modeDrawer: "Abrir carrito y tabla",
    modeWhatsApp: "Saltar directo a WhatsApp",
    modeWeChat: "Copiar tabla y abrir WeChat",
    colItem: "Producto / SKU",
    colQty: "Cant",
    colPrice: "Precio",
    colSub: "Subtotal",
    orderTitle: "NUEVO PEDIDO - LOS MANGOS",
    clientLabel: "Cliente",
    phoneLabel: "Tel",
    addressLabel: "Dirección",
    wechatModalTitle: "Tabla Lista para Enviar por WeChat (微信)",
    wechatModalDesc:
      "La tabla de texto ya fue copiada al portapapeles. Puedes pegarla directo en WeChat o compartir/guardar la imagen de la tabla:",
    openWeChatApp: "Abrir WeChat Ahora (打开微信粘贴发送)",
    adminBtn: "Admin",
  },
  zh: {
    showing: "正在显示",
    products: "件商品",
    add: "加入购物车",
    addedToast: "已加入购物车",
    viewCart: "查看购物车",
    myCart: "我的购物车",
    deliveryInfo: "收货配送信息",
    fullName: "收货人姓名 *",
    phone: "电话 / 微信 / WhatsApp",
    address: "详细收货地址 *",
    total: "合计:",
    sendWhatsApp: "发送至 WhatsApp",
    sendWeChat: "生成表格发微信",
    shareWeChatImg: "转发图片到微信",
    saveTableImg: "保存表格图片",
    searchPlaceholder: "输入产品名称、SKU编码或扫一扫查找...",
    scanBtn: "扫一扫",
    scanModalTitle: "扫一扫查找商品 / SKU",
    scanModalHint: "将摄像头对准商品条形码 / 二维码，或拍照识别：",
    scanPhotoBtn: "拍照 / 上传条码图片识别",
    scanQuickSelect: "点击下方商品 SKU 条码模拟扫码查找：",
    scanSuccessToast: "扫码识别成功：",
    scanCameraError:
      "当前浏览器环境暂未开启实时摄像头权限，您可以使用「拍照/上传条码图片」或直接点击下方 SKU 模拟扫码。",
    noProductsFound: "未找到匹配商品：",
    clearSearch: "清除搜索条件",
    emptyCart: "购物车还是空的哦",
    tablePreviewTitle: "已自动生成的订单表格 (支持微信 / WhatsApp)",
    copyTable: "复制文字表格",
    copied: "已复制！",
    wechatCopiedToast: "订单表格已自动复制！正在唤起微信，直接粘贴即可发送",
    whatsappPhoneLabel: "商家 WhatsApp 号码:",
    wechatIdLabel: "商家微信号 (选填):",
    clickCartActionLabel: "点击底部购物车默认动作:",
    modeDrawer: "打开购物车与订单表格",
    modeWhatsApp: "直接跳出 WhatsApp 发表格",
    modeWeChat: "直接复制表格并唤起微信",
    colItem: "商品 / SKU规格",
    colQty: "数量",
    colPrice: "单价",
    colSub: "小计",
    orderTitle: "新订单 - LOS MANGOS",
    clientLabel: "客户姓名",
    phoneLabel: "联系电话",
    addressLabel: "配送地址",
    wechatModalTitle: "微信订单表格已生成",
    wechatModalDesc:
      "文字版表格已自动复制到剪贴板！你可以直接跳出微信粘贴发送，或将下方高清表格图片直接转发给微信好友：",
    openWeChatApp: "立即打开微信粘贴发送",
    adminBtn: "后台管理",
  },
  en: {
    showing: "Showing",
    products: "products",
    add: "Add to Cart",
    addedToast: "Added to cart",
    viewCart: "View Cart",
    myCart: "My Cart",
    deliveryInfo: "Delivery Information",
    fullName: "Full name *",
    phone: "Phone/WhatsApp/WeChat",
    address: "Complete address *",
    total: "Total:",
    sendWhatsApp: "Send via WhatsApp",
    sendWeChat: "Send to WeChat (微信)",
    shareWeChatImg: "Share Image to WeChat",
    saveTableImg: "Save Table Image",
    searchPlaceholder: "Search by product name, SKU or scan...",
    scanBtn: "Scan",
    scanModalTitle: "Scan Barcode / QR / SKU",
    scanModalHint:
      "Point your camera at a product barcode/QR code or pick a SKU below:",
    scanPhotoBtn: "Take Photo / Upload Barcode Image",
    scanQuickSelect: "Quick test scan with existing SKUs:",
    scanSuccessToast: "Scanned code:",
    scanCameraError:
      "Live camera stream unavailable. Use photo upload or tap a SKU barcode below.",
    noProductsFound: "No products found for",
    clearSearch: "Clear search",
    emptyCart: "Your cart is empty",
    tablePreviewTitle: "Generated Order Table (WhatsApp / WeChat)",
    copyTable: "Copy Table",
    copied: "Copied!",
    wechatCopiedToast:
      "Order table copied! Opening WeChat — just paste and send.",
    whatsappPhoneLabel: "Store WhatsApp Number:",
    wechatIdLabel: "Store WeChat ID:",
    clickCartActionLabel: "When clicking bottom Cart bar:",
    modeDrawer: "Open Cart & Order Table",
    modeWhatsApp: "Jump straight to WhatsApp",
    modeWeChat: "Copy Table & Jump to WeChat",
    colItem: "Product / SKU",
    colQty: "Qty",
    colPrice: "Price",
    colSub: "Subtotal",
    orderTitle: "NEW ORDER - LOS MANGOS",
    clientLabel: "Customer",
    phoneLabel: "Phone",
    addressLabel: "Address",
    wechatModalTitle: "WeChat Order Table Ready",
    wechatModalDesc:
      "The formatted text table is copied to your clipboard. Open WeChat to paste it, or share/save the table image below:",
    openWeChatApp: "Open WeChat App Now",
    adminBtn: "Admin",
  },
};

interface FlyingItem {
  id: number;
  product: ProductItem;
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
}

export default function StorefrontPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] =
    useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [banners, setBanners] = useState<BannerItem[]>(
    HERO_BANNERS.map((b) => ({ ...b, id: String(b.id) }))
  );
  const [selectedSkuMap, setSelectedSkuMap] = useState<Record<string, string>>(
    {}
  );

  const [lang, setLang] = useState<Lang>("es");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("todos");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Scanner ("扫一扫") state
  const [scannerOpen, setScannerOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualScanCode, setManualScanCode] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Cart key format: `${productId}__${skuId}`
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showTablePreview, setShowTablePreview] = useState(true);
  const [tableFormatTab, setTableFormatTab] = useState<"wechat" | "whatsapp">(
    "wechat"
  );
  const [quickJumpTarget, setQuickJumpTarget] =
    useState<QuickJumpTarget>("drawer");
  const [storeWhatsApp, setStoreWhatsApp] = useState("584120000000");
  const [storeWeChatId, setStoreWeChatId] = useState("LosMangos_Shop");
  const [showSettings, setShowSettings] = useState(false);
  const [copiedTable, setCopiedTable] = useState(false);

  const [wechatModalOpen, setWechatModalOpen] = useState(false);
  const [tableImageDataUrl, setTableImageDataUrl] = useState<string | null>(
    null
  );

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const cartBarRef = useRef<HTMLButtonElement | null>(null);

  const t = I18N[lang];
  const curr = CURRENCY_CONFIG[currency];

  // Fetch live products, SKUs, categories & banners from backend API
  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const [prodRes, catRes, banRes] = await Promise.all([
          fetch("/api/products", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
          fetch("/api/banners", { cache: "no-store" }),
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        const banData = await banRes.json();
        if (Array.isArray(prodData.products)) {
          setProducts(
            prodData.products.filter((p: ProductItem) => p.active !== false)
          );
        }
        if (Array.isArray(catData.categories)) {
          setCategories([
            { id: "todos", label: { es: "Todos", zh: "全部", en: "All" } },
            ...catData.categories,
          ]);
        }
        if (Array.isArray(banData.banners) && banData.banners.length > 0) {
          setBanners(banData.banners);
        }
      } catch {
        // Ignore error
      }
    };
    loadCatalog();
  }, []);

  const showToast = (msg: string, duration = 2000) => {
    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, duration);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // Auto-select matching SKU on product cards when searching by SKU code or SKU name
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;
    setSelectedSkuMap((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const p of products) {
        const matchedSku = p.skus?.find(
          (s) =>
            s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
        );
        if (matchedSku && next[p.id] !== matchedSku.id) {
          next[p.id] = matchedSku.id;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [searchQuery, products]);

  // Stop camera helper
  const stopScannerCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Handle a detected/scanned barcode or SKU code
  const applyScannedCode = (rawCode: string) => {
    const code = rawCode.trim();
    if (!code) return;
    stopScannerCamera();
    setScannerOpen(false);
    setSelectedCategory("todos");
    setSearchQuery(code);

    const lower = code.toLowerCase();
    const matchedProduct = products.find(
      (p) =>
        p.id.toLowerCase() === lower ||
        p.name.es.toLowerCase().includes(lower) ||
        p.name.zh.toLowerCase().includes(lower) ||
        p.name.en.toLowerCase().includes(lower) ||
        p.skus?.some((s) => s.code.toLowerCase() === lower)
    );
    if (matchedProduct) {
      const matchedSku = matchedProduct.skus?.find(
        (s) => s.code.toLowerCase() === lower
      );
      if (matchedSku) {
        setSelectedSkuMap((prev) => ({
          ...prev,
          [matchedProduct.id]: matchedSku.id,
        }));
      }
      showToast(
        `${t.scanSuccessToast} ${matchedProduct.name[lang]} (${code})`,
        2500
      );
    } else {
      showToast(`${t.scanSuccessToast} ${code}`, 2500);
    }
  };

  // Start live camera & BarcodeDetector when scanner modal opens
  useEffect(() => {
    if (!scannerOpen) {
      stopScannerCamera();
      return;
    }

    let cancelled = false;
    setCameraError(null);

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setCameraError(t.scanCameraError);
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((tr) => tr.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }

        const BarcodeDetectorClass = (
          window as unknown as {
            BarcodeDetector?: new (opts?: { formats?: string[] }) => {
              detect: (
                source: ImageBitmapSource
              ) => Promise<Array<{ rawValue?: string }>>;
            };
          }
        ).BarcodeDetector;

        if (BarcodeDetectorClass) {
          const detector = new BarcodeDetectorClass({
            formats: [
              "qr_code",
              "code_128",
              "code_39",
              "ean_13",
              "ean_8",
              "upc_a",
              "upc_e",
            ],
          });
          scanIntervalRef.current = setInterval(async () => {
            if (!videoRef.current || videoRef.current.readyState < 2) return;
            try {
              const results = await detector.detect(videoRef.current);
              if (results && results.length > 0 && results[0].rawValue) {
                applyScannedCode(results[0].rawValue);
              }
            } catch {
              // Ignore frame error
            }
          }, 350);
        }
      } catch {
        setCameraError(t.scanCameraError);
      }
    };

    startCamera();

    return () => {
      cancelled = true;
      stopScannerCamera();
    };
  }, [scannerOpen]);

  // Handle photo/image upload for barcode detection
  const handleScanImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const BarcodeDetectorClass = (
        window as unknown as {
          BarcodeDetector?: new () => {
            detect: (
              source: ImageBitmapSource
            ) => Promise<Array<{ rawValue?: string }>>;
          };
        }
      ).BarcodeDetector;

      if (BarcodeDetectorClass) {
        const bitmap = await createImageBitmap(file);
        const detector = new BarcodeDetectorClass();
        const codes = await detector.detect(bitmap);
        if (codes && codes.length > 0 && codes[0].rawValue) {
          applyScannedCode(codes[0].rawValue);
          e.target.value = "";
          return;
        }
      }

      // Fallback: check if filename matches a SKU code or product name
      const baseName = file.name.replace(/\.[^/.]+$/, "").trim();
      const matchedSku = products
        .flatMap((p) => p.skus || [])
        .find((s) => baseName.toLowerCase().includes(s.code.toLowerCase()));
      if (matchedSku) {
        applyScannedCode(matchedSku.code);
      } else if (baseName) {
        applyScannedCode(baseName);
      }
    } catch {
      // Ignore error
    }
    e.target.value = "";
  };

  const formatPrice = (priceUSD: number) => {
    const converted = priceUSD * curr.rate;
    return `${curr.symbol}${converted.toFixed(2)}`;
  };

  const getActiveSku = (product: ProductItem): ProductSku => {
    const chosenId = selectedSkuMap[product.id];
    const found = product.skus?.find((s) => s.id === chosenId);
    if (found) return found;
    if (product.skus && product.skus.length > 0) return product.skus[0];
    return {
      id: "default",
      code: "STD",
      name: "",
      priceUSD: product.priceUSD,
      stock: 99,
    };
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === "todos" || p.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.id.toLowerCase().includes(q) ||
        p.name.es.toLowerCase().includes(q) ||
        p.name.zh.toLowerCase().includes(q) ||
        p.name.en.toLowerCase().includes(q) ||
        p.skus?.some(
          (s) =>
            s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
        );
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Cart items resolved with Product + SKU
  const cartEntries = useMemo(() => {
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([cartKey, qty]) => {
        const [productId, skuId] = cartKey.split("__");
        const product = products.find((p) => p.id === productId);
        if (!product) return null;
        const sku =
          product.skus?.find((s) => s.id === skuId) ||
          product.skus?.[0] || {
            id: "default",
            code: "STD",
            name: "",
            priceUSD: product.priceUSD,
            stock: 99,
          };
        return { cartKey, product, sku, qty };
      })
      .filter(Boolean) as {
      cartKey: string;
      product: ProductItem;
      sku: ProductSku;
      qty: number;
    }[];
  }, [cart, products]);

  const totalItems = useMemo(
    () => cartEntries.reduce((acc, item) => acc + item.qty, 0),
    [cartEntries]
  );

  const totalAmountUSD = useMemo(
    () =>
      cartEntries.reduce((acc, item) => acc + item.sku.priceUSD * item.qty, 0),
    [cartEntries]
  );

  const handleAddToCart = (
    product: ProductItem,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const activeSku = getActiveSku(product);
    const cartKey = `${product.id}__${activeSku.id}`;

    const cardEl = e.currentTarget.closest("[data-product-card]");
    const imgBox = cardEl?.querySelector("[data-product-img]");
    const rect =
      imgBox?.getBoundingClientRect() ||
      e.currentTarget.getBoundingClientRect();
    const cartRect = cartBarRef.current?.getBoundingClientRect();

    const startX = rect.left + rect.width / 2 - 40;
    const startY = rect.top + rect.height / 2 - 40;
    const targetX = cartRect
      ? cartRect.left + cartRect.width / 2 - 40
      : window.innerWidth / 2 - 40;
    const targetY = cartRect
      ? cartRect.top + cartRect.height / 2 - 40
      : window.innerHeight - 60;

    const flyId = Date.now() + Math.random();
    setFlyingItems((prev) => [
      ...prev,
      {
        id: flyId,
        product,
        startX,
        startY,
        deltaX: targetX - startX,
        deltaY: targetY - startY,
      },
    ]);

    setTimeout(() => {
      setFlyingItems((prev) => prev.filter((item) => item.id !== flyId));
    }, 650);

    setCart((prev) => ({
      ...prev,
      [cartKey]: (prev[cartKey] || 0) + 1,
    }));

    showToast(t.addedToast, 1800);
  };

  const updateCartQty = (cartKey: string, delta: number) => {
    setCart((prev) => {
      const nextQty = (prev[cartKey] || 0) + delta;
      if (nextQty <= 0) {
        const clone = { ...prev };
        delete clone[cartKey];
        return clone;
      }
      return { ...prev, [cartKey]: nextQty };
    });
  };

  const formatItemDisplayName = (product: ProductItem, sku: ProductSku) => {
    const base = product.name[lang];
    return sku.name ? `${base} (${sku.name})` : base;
  };

  const buildOrderTableText = (
    forPlatform: "whatsapp" | "wechat" = "whatsapp"
  ) => {
    const padRight = (str: string, len: number) => {
      if (str.length >= len) return str.slice(0, len - 1) + " ";
      return str + " ".repeat(len - str.length);
    };
    const padLeft = (str: string, len: number) => {
      if (str.length >= len) return str;
      return " ".repeat(len - str.length) + str;
    };

    if (forPlatform === "wechat") {
      const lines: string[] = [
        `📋 【${t.orderTitle}】`,
        `🕒 ${new Date().toLocaleString()}`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `${t.colItem} | ${t.colQty} | ${t.colPrice} | ${t.colSub}`,
        `────────────────────`,
      ];

      cartEntries.forEach(({ product, sku, qty }, idx) => {
        const name = formatItemDisplayName(product, sku);
        const unitStr = formatPrice(sku.priceUSD);
        const subStr = formatPrice(sku.priceUSD * qty);
        lines.push(
          `${idx + 1}. ${name} [${sku.code}]  ×${qty}  (${unitStr}) = ${subStr}`
        );
      });

      lines.push(`────────────────────`);
      lines.push(
        `💰 ${t.total} (${totalItems}): ${formatPrice(totalAmountUSD)}`
      );

      if (
        customerName.trim() ||
        customerPhone.trim() ||
        customerAddress.trim()
      ) {
        lines.push(`━━━━━━━━━━━━━━━━━━━━`);
        lines.push(`📍 【${t.deliveryInfo}】`);
        if (customerName.trim())
          lines.push(`👤 ${t.clientLabel}: ${customerName.trim()}`);
        if (customerPhone.trim())
          lines.push(`📞 ${t.phoneLabel}: ${customerPhone.trim()}`);
        if (customerAddress.trim())
          lines.push(`🏠 ${t.addressLabel}: ${customerAddress.trim()}`);
      }
      return lines.join("\n");
    }

    const headerLine = `${padRight(t.colItem, 17)}${padRight(
      t.colQty,
      4
    )}${padLeft(t.colPrice, 8)}${padLeft(t.colSub, 8)}`;
    const divider = "-".repeat(37);

    const rows = cartEntries.map(({ product, sku, qty }) => {
      const name = formatItemDisplayName(product, sku);
      const unitStr = formatPrice(sku.priceUSD);
      const subStr = formatPrice(sku.priceUSD * qty);
      return `${padRight(name, 17)}${padRight(`x${qty}`, 4)}${padLeft(
        unitStr,
        8
      )}${padLeft(subStr, 8)}`;
    });

    const totalLine = `${padRight(`TOTAL (${totalItems})`, 21)}${padLeft(
      formatPrice(totalAmountUSD),
      16
    )}`;

    const lines: string[] = [
      `🛒 *${t.orderTitle}*`,
      `📅 ${new Date().toLocaleString()}`,
      "",
      "```",
      headerLine,
      divider,
      ...rows,
      divider,
      totalLine,
      "```",
    ];

    if (customerName.trim() || customerPhone.trim() || customerAddress.trim()) {
      lines.push("");
      lines.push(`📍 *${t.deliveryInfo}:*`);
      if (customerName.trim())
        lines.push(`👤 ${t.clientLabel}: ${customerName.trim()}`);
      if (customerPhone.trim())
        lines.push(`📞 ${t.phoneLabel}: ${customerPhone.trim()}`);
      if (customerAddress.trim())
        lines.push(`🏠 ${t.addressLabel}: ${customerAddress.trim()}`);
    }

    return lines.join("\n");
  };

  const generateOrderTableImage = (): string => {
    const canvas = document.createElement("canvas");
    const scale = 2;
    const width = 460;
    const rowHeight = 38;
    const hasDelivery =
      customerName.trim() || customerPhone.trim() || customerAddress.trim();
    const deliveryHeight = hasDelivery ? 110 : 0;
    const height = 190 + cartEntries.length * rowHeight + deliveryHeight;

    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(scale, scale);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#07C160";
    ctx.fillRect(0, 0, width, 64);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText(t.orderTitle, 20, 32);
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fillText(new Date().toLocaleString(), 20, 52);

    const tableTop = 80;
    ctx.fillStyle = "#f4f4f5";
    ctx.fillRect(16, tableTop, width - 32, 34);

    ctx.fillStyle = "#18181b";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText(t.colItem, 26, tableTop + 22);
    ctx.fillText(t.colQty, 235, tableTop + 22);
    ctx.fillText(t.colPrice, 295, tableTop + 22);
    ctx.fillText(t.colSub, 375, tableTop + 22);

    let y = tableTop + 34;
    cartEntries.forEach(({ product, sku, qty }, idx) => {
      if (idx % 2 === 1) {
        ctx.fillStyle = "#fafafa";
        ctx.fillRect(16, y, width - 32, rowHeight);
      }

      ctx.strokeStyle = "#e4e4e7";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(16, y);
      ctx.lineTo(width - 16, y);
      ctx.stroke();

      ctx.fillStyle = "#18181b";
      ctx.font = "12px sans-serif";
      ctx.fillText(
        `${idx + 1}. ${formatItemDisplayName(product, sku).slice(0, 20)}`,
        26,
        y + 24
      );

      ctx.fillStyle = "#07C160";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText(`x${qty}`, 238, y + 24);

      ctx.fillStyle = "#71717a";
      ctx.font = "13px sans-serif";
      ctx.fillText(formatPrice(sku.priceUSD), 295, y + 24);

      ctx.fillStyle = "#18181b";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText(formatPrice(sku.priceUSD * qty), 375, y + 24);

      y += rowHeight;
    });

    ctx.fillStyle = "#ecfdf5";
    ctx.fillRect(16, y, width - 32, 42);
    ctx.strokeStyle = "#07C160";
    ctx.strokeRect(16, tableTop, width - 32, y - tableTop + 42);

    ctx.fillStyle = "#065f46";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText(`TOTAL (${totalItems})`, 26, y + 27);

    ctx.fillStyle = "#059669";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(formatPrice(totalAmountUSD), 365, y + 27);

    y += 56;

    if (hasDelivery) {
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(16, y, width - 32, 90);
      ctx.strokeStyle = "#e2e8f0";
      ctx.strokeRect(16, y, width - 32, 90);

      ctx.fillStyle = "#334155";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText(`📍 ${t.deliveryInfo}:`, 26, y + 22);

      ctx.font = "12px sans-serif";
      ctx.fillStyle = "#475569";
      if (customerName.trim()) {
        ctx.fillText(`${t.clientLabel}: ${customerName.trim()}`, 26, y + 42);
      }
      if (customerPhone.trim()) {
        ctx.fillText(`${t.phoneLabel}: ${customerPhone.trim()}`, 230, y + 42);
      }
      if (customerAddress.trim()) {
        ctx.fillText(
          `${t.addressLabel}: ${customerAddress.trim().slice(0, 42)}`,
          26,
          y + 66
        );
      }
    }

    return canvas.toDataURL("image/png");
  };

  const launchWhatsAppWithTable = () => {
    if (cartEntries.length === 0) return;
    const message = buildOrderTableText("whatsapp");
    const cleanPhone = storeWhatsApp.replace(/[^\d]/g, "");
    const encoded = encodeURIComponent(message);
    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const launchWeChatWithTable = async () => {
    if (cartEntries.length === 0) return;
    const wechatTableText = buildOrderTableText("wechat");
    try {
      await navigator.clipboard.writeText(wechatTableText);
    } catch {
      // Clipboard fallback
    }
    const imgUrl = generateOrderTableImage();
    setTableImageDataUrl(imgUrl);
    setWechatModalOpen(true);
    showToast(t.wechatCopiedToast, 3200);

    setTimeout(() => {
      window.location.href = "weixin://";
    }, 350);
  };

  const handleNativeShareToWeChat = async () => {
    const dataUrl = tableImageDataUrl || generateOrderTableImage();
    const wechatText = buildOrderTableText("wechat");
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `pedido-los-mangos-${Date.now()}.png`, {
        type: "image/png",
      });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: t.orderTitle,
          text: wechatText,
          files: [file],
        });
        return;
      }
    } catch {
      // Fallback
    }
    window.location.href = "weixin://";
  };

  const handleDownloadTableImage = () => {
    const dataUrl = tableImageDataUrl || generateOrderTableImage();
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `pedido-los-mangos-${Date.now()}.png`;
    link.click();
  };

  const handleBottomCartClick = () => {
    if (cartEntries.length > 0 && quickJumpTarget === "whatsapp") {
      launchWhatsAppWithTable();
    } else if (cartEntries.length > 0 && quickJumpTarget === "wechat") {
      launchWeChatWithTable();
    } else {
      setIsCartOpen(true);
    }
  };

  const handleCopyTable = async () => {
    await navigator.clipboard.writeText(buildOrderTableText(tableFormatTab));
    setCopiedTable(true);
    setTimeout(() => setCopiedTable(false), 1800);
  };

  const cycleLang = () => {
    const order: Lang[] = ["es", "zh", "en"];
    const next = order[(order.indexOf(lang) + 1) % order.length];
    setLang(next);
  };

  const cycleCurrency = () => {
    const order: Currency[] = ["USD", "VES", "CNY"];
    const next = order[(order.indexOf(currency) + 1) % order.length];
    setCurrency(next);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 pb-28">
      <div
        className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 pointer-events-none max-w-[92vw] ${
          toastMessage
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-3 scale-95"
        }`}
      >
        <div className="flex items-center gap-2.5 bg-neutral-900/95 dark:bg-neutral-800 text-white px-4 py-2.5 rounded-xl shadow-xl border border-white/10">
          <span className="w-5 h-5 flex-shrink-0 rounded-md bg-emerald-500 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
          </span>
          <span className="text-xs sm:text-sm font-semibold tracking-tight">
            {toastMessage}
          </span>
        </div>
      </div>

      {flyingItems.map((fly) => (
        <FlyItem key={fly.id} item={fly} />
      ))}

      <div className="max-w-md mx-auto bg-white dark:bg-neutral-950 min-h-screen shadow-sm relative">
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center justify-between gap-2">
            <div className="font-black text-xl leading-[1.05] tracking-tight select-none">
              <div>LOS</div>
              <div>MANGOS</div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Search Button */}
              <button
                onClick={() => {
                  setSearchOpen((prev) => !prev);
                  searchInputRef.current?.focus();
                }}
                aria-label="Search"
                className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Language Pill */}
              <button
                onClick={cycleLang}
                className="h-8 px-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center gap-1 text-xs font-bold tracking-tight hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
              >
                <span className="text-sm leading-none">
                  {lang === "es" ? "🇻🇪🇪🇸" : lang === "zh" ? "🇨🇳" : "🇺🇸"}
                </span>
                <span>{lang.toUpperCase()}</span>
              </button>

              {/* Currency Pill */}
              <button
                onClick={cycleCurrency}
                className="h-8 px-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center text-xs font-bold tracking-tight hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
              >
                {curr.label}
              </button>

              {/* Link to Product & SKU Admin Backend */}
              <Link
                href="/admin"
                className="h-8 px-2.5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center gap-1 text-[11px] font-bold hover:opacity-90 transition"
                title="商品与 SKU 管理后台"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>{t.adminBtn}</span>
              </Link>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode((prev) => !prev)}
                aria-label="Toggle Dark Mode"
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center ${
                  darkMode ? "bg-emerald-500" : "bg-neutral-200"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                    darkMode ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {searchOpen && (
            <div className="mt-2.5 flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 rounded-xl px-3 py-2">
              <Search className="w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                autoFocus
                className="bg-transparent text-sm w-full outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}>
                  <X className="w-4 h-4 text-neutral-400" />
                </button>
              )}
            </div>
          )}
        </header>

        <div className="relative w-full h-44 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
          <div
            className="flex h-full transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${
                (currentSlide % Math.max(banners.length, 1)) * 100
              }%)`,
            }}
          >
            {banners.map((banner) => (
              <img
                key={banner.id}
                src={banner.url}
                alt={banner.alt}
                className="w-full h-full object-cover flex-shrink-0"
              />
            ))}
          </div>

          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {banners.map((banner, idx) => (
              <button
                key={banner.id}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide % Math.max(banners.length, 1) === idx
                    ? "w-5 bg-white shadow"
                    : "w-2 bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <section className="px-3 pt-4 pb-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                    active
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300"
                  }`}
                >
                  {cat.label[lang]}
                </button>
              );
            })}
          </div>
        </section>

        {/* Search Bar Below Categories (Product Name + SKU + Scan "扫一扫") */}
        <section className="px-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl px-3.5 py-2.5 focus-within:border-neutral-900 dark:focus-within:border-white transition">
              <Search className="w-4 h-4 text-neutral-400 flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="bg-transparent text-xs sm:text-sm w-full outline-none placeholder:text-neutral-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="p-0.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setScannerOpen(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition flex-shrink-0"
              title={t.scanModalTitle}
            >
              <ScanLine className="w-4 h-4" />
              <span>{t.scanBtn}</span>
            </button>
          </div>
        </section>

        <div className="py-3 text-center text-xs text-neutral-500 dark:text-neutral-400">
          {t.showing}{" "}
          <span className="font-bold text-neutral-900 dark:text-white">
            {filteredProducts.length}
          </span>{" "}
          {t.products}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="px-4 py-10 text-center space-y-3">
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              {t.noProductsFound}{" "}
              <span className="font-bold text-neutral-900 dark:text-white">
                &ldquo;{searchQuery}&rdquo;
              </span>
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("todos");
                }}
                className="px-4 py-2 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold"
              >
                {t.clearSearch}
              </button>
            )}
          </div>
        ) : (
          <section className="px-3 grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => {
              const activeSku = getActiveSku(product);
              const qtyInCart = (product.skus || []).reduce(
                (sum, s) => sum + (cart[`${product.id}__${s.id}`] || 0),
                0
              );
              return (
                <div
                  key={product.id}
                  data-product-card
                  className="relative bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-3 flex flex-col items-center shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
                >
                  {product.badge && (
                    <span
                      className={`absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide text-white uppercase ${
                        product.badge === "BESTSELLER"
                          ? "bg-neutral-900 dark:bg-neutral-700"
                          : product.badge === "NEW"
                          ? "bg-emerald-800"
                          : "bg-red-700"
                      }`}
                    >
                      {product.badge}
                    </span>
                  )}

                  {qtyInCart > 0 && (
                    <span className="absolute top-2.5 right-2.5 z-10 w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center shadow">
                      {qtyInCart}
                    </span>
                  )}

                  <div
                    data-product-img
                    className="w-full h-36 flex items-center justify-center my-1"
                  >
                    {renderProductVisual(product, "w-36 h-36")}
                  </div>

                  <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 text-center line-clamp-1 mt-1">
                    {product.name[lang]}
                  </h3>

                  {/* Active SKU Code Pill */}
                  <div className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 mt-0.5">
                    SKU: {activeSku.code}
                  </div>

                  {/* Multi-SKU Selector Pills */}
                  {product.skus && product.skus.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-1 mt-1.5">
                      {product.skus.map((sku) => {
                        const isSelected = activeSku.id === sku.id;
                        return (
                          <button
                            key={sku.id}
                            type="button"
                            onClick={() =>
                              setSelectedSkuMap((prev) => ({
                                ...prev,
                                [product.id]: sku.id,
                              }))
                            }
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition ${
                              isSelected
                                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                                : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                            }`}
                          >
                            {sku.name}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="text-lg font-extrabold text-neutral-900 dark:text-white mt-1 mb-2.5">
                    {formatPrice(activeSku.priceUSD)}
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="w-full py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 active:scale-95 dark:bg-white dark:text-neutral-900 text-white text-xs font-bold transition-all mt-auto"
                  >
                    {t.add}
                  </button>
                </div>
              );
            })}
          </section>
        )}

        <div className="fixed right-3 bottom-24 z-30 flex flex-col items-center gap-2.5">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white shadow-lg flex items-center justify-center hover:scale-105 transition"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-none stroke-current"
              strokeWidth="2.2"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
          </a>

          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noreferrer"
            aria-label="TikTok"
            className="w-10 h-10 rounded-full bg-neutral-900 text-white border border-white/20 shadow-lg flex items-center justify-center hover:scale-105 transition"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
            </svg>
          </a>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll to top"
            className="w-10 h-10 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:scale-105 transition"
          >
            <ArrowUp className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2">
          <button
            ref={cartBarRef}
            onClick={handleBottomCartClick}
            className="relative flex items-center gap-3 bg-neutral-950 dark:bg-neutral-900 text-white pl-3.5 pr-5 py-3 rounded-full shadow-2xl border border-white/10 active:scale-95 transition"
          >
            <span className="absolute -top-2 -right-1 min-w-6 h-6 px-1.5 rounded-full bg-red-500 text-white text-xs font-extrabold flex items-center justify-center shadow">
              {totalItems}
            </span>

            <span className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 fill-blue-400" />
            </span>

            <span className="text-sm font-bold tracking-tight whitespace-nowrap">
              {t.viewCart}
            </span>

            <span className="text-sm font-extrabold whitespace-nowrap">
              {formatPrice(totalAmountUSD)}
            </span>
          </button>
        </div>
      </div>

      {/* "扫一扫" Barcode / QR / SKU Scanner Modal */}
      {scannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-100 dark:border-neutral-800">
            <div className="px-5 py-3.5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2 font-extrabold text-sm">
                <ScanLine className="w-4 h-4 text-emerald-600" />
                <span>{t.scanModalTitle}</span>
              </div>
              <button
                type="button"
                onClick={() => setScannerOpen(false)}
                className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            <div className="p-4 space-y-3.5">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {t.scanModalHint}
              </p>

              {/* Camera Viewfinder */}
              <div className="relative w-full h-48 rounded-2xl bg-neutral-950 overflow-hidden flex items-center justify-center border border-neutral-800">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Corner Frame & Animated Laser Line */}
                <div className="absolute inset-6 border-2 border-emerald-400/70 rounded-xl pointer-events-none">
                  <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse mt-20" />
                </div>
                {cameraError && (
                  <div className="absolute inset-0 bg-neutral-950/90 p-4 flex flex-col items-center justify-center text-center gap-2">
                    <Camera className="w-7 h-7 text-neutral-400" />
                    <p className="text-[11px] text-neutral-300 leading-relaxed">
                      {cameraError}
                    </p>
                  </div>
                )}
              </div>

              {/* Photo / Barcode Image Upload Button */}
              <label className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition">
                <Camera className="w-4 h-4" />
                <span>{t.scanPhotoBtn}</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleScanImageUpload}
                  className="hidden"
                />
              </label>

              {/* Manual Barcode / SKU Input inside Scanner */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (manualScanCode.trim()) {
                    applyScannedCode(manualScanCode);
                    setManualScanCode("");
                  }
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={manualScanCode}
                  onChange={(e) => setManualScanCode(e.target.value)}
                  placeholder="输入条形码或 SKU (如 MNG-500G)..."
                  className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs font-mono outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold"
                >
                  OK
                </button>
              </form>

              {/* Quick Simulated Barcode Scan Chips for Existing SKUs */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                  <Barcode className="w-3.5 h-3.5" />
                  <span>{t.scanQuickSelect}</span>
                </div>
                <div className="max-h-32 overflow-y-auto flex flex-wrap gap-1.5">
                  {products.flatMap((p) =>
                    (p.skus || []).map((sku) => (
                      <button
                        key={`${p.id}-${sku.id}`}
                        type="button"
                        onClick={() => applyScannedCode(sku.code)}
                        className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-emerald-50 hover:border-emerald-400 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[11px] font-mono flex items-center gap-1 transition"
                      >
                        <span className="font-bold text-neutral-900 dark:text-white">
                          {sku.code}
                        </span>
                        <span className="text-neutral-500 dark:text-neutral-400">
                          ({p.name[lang]})
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-[1px]">
          <div className="flex-1" onClick={() => setIsCartOpen(false)} />

          <div className="w-full max-w-md mx-auto bg-white dark:bg-neutral-900 rounded-t-3xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
            <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-extrabold">
                  {t.myCart} ({totalItems})
                </h2>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowTablePreview((prev) => !prev)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                    showTablePreview
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                      : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                  }`}
                >
                  <Table2 className="w-3.5 h-3.5" />
                  <span>Tabla</span>
                </button>

                <button
                  onClick={() => setShowSettings((prev) => !prev)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <Settings className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {showSettings && (
              <div className="px-5 py-3 bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-100 dark:border-neutral-800 text-xs space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <label className="font-semibold text-neutral-600 dark:text-neutral-300">
                    {t.whatsappPhoneLabel}
                  </label>
                  <input
                    type="text"
                    value={storeWhatsApp}
                    onChange={(e) => setStoreWhatsApp(e.target.value)}
                    placeholder="584120000000"
                    className="px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-mono text-xs w-40"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="font-semibold text-neutral-600 dark:text-neutral-300">
                    {t.wechatIdLabel}
                  </label>
                  <input
                    type="text"
                    value={storeWeChatId}
                    onChange={(e) => setStoreWeChatId(e.target.value)}
                    placeholder="LosMangos_Shop"
                    className="px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-mono text-xs w-40"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="font-semibold text-neutral-600 dark:text-neutral-300">
                    {t.clickCartActionLabel}
                  </label>
                  <select
                    value={quickJumpTarget}
                    onChange={(e) =>
                      setQuickJumpTarget(e.target.value as QuickJumpTarget)
                    }
                    className="px-2 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs"
                  >
                    <option value="drawer">{t.modeDrawer}</option>
                    <option value="whatsapp">{t.modeWhatsApp}</option>
                    <option value="wechat">{t.modeWeChat}</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-3.5 space-y-2.5 border border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  <MapPin className="w-4 h-4 text-rose-600 fill-rose-600/20" />
                  <span>{t.deliveryInfo}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={t.fullName}
                    className="px-3 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs outline-none focus:border-neutral-900"
                  />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder={t.phone}
                    className="px-3 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs outline-none focus:border-neutral-900"
                  />
                </div>

                <textarea
                  rows={2}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder={t.address}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs outline-none focus:border-neutral-900 resize-none"
                />
              </div>

              {cartEntries.length === 0 ? (
                <div className="py-12 text-center text-sm text-neutral-400">
                  {t.emptyCart}
                </div>
              ) : (
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {cartEntries.map(({ cartKey, product, sku, qty }) => (
                    <div
                      key={cartKey}
                      className="py-3 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center">
                          {renderProductVisual(product, "w-14 h-14")}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                            {formatItemDisplayName(product, sku)}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                              {sku.code}
                            </span>
                            <span className="text-sm font-extrabold text-rose-500">
                              {formatPrice(sku.priceUSD)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1 gap-1">
                        <button
                          onClick={() => updateCartQty(cartKey, -1)}
                          className="w-7 h-7 rounded-lg bg-white dark:bg-neutral-900 shadow-sm flex items-center justify-center text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 active:scale-95"
                        >
                          <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                        <span className="w-7 text-center text-xs font-extrabold">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateCartQty(cartKey, 1)}
                          className="w-7 h-7 rounded-lg bg-white dark:bg-neutral-900 shadow-sm flex items-center justify-center text-blue-600 hover:bg-neutral-50 active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cartEntries.length > 0 && showTablePreview && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      <Table2 className="w-4 h-4" />
                      <span>{t.tablePreviewTitle}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleDownloadTableImage}
                        className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md bg-white dark:bg-neutral-800 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50"
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span>{t.saveTableImg}</span>
                      </button>
                      <button
                        onClick={handleCopyTable}
                        className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md bg-white dark:bg-neutral-800 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedTable ? t.copied : t.copyTable}</span>
                      </button>
                    </div>
                  </div>

                  {/* Visual HTML Table */}
                  <div className="overflow-x-auto rounded-xl border border-emerald-200/70 dark:border-emerald-800/60 bg-white dark:bg-neutral-900">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-emerald-600 text-white">
                        <tr>
                          <th className="py-2 px-2.5 font-bold">{t.colItem}</th>
                          <th className="py-2 px-2 font-bold text-center">
                            {t.colQty}
                          </th>
                          <th className="py-2 px-2 font-bold text-right">
                            {t.colPrice}
                          </th>
                          <th className="py-2 px-2.5 font-bold text-right">
                            {t.colSub}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {cartEntries.map(({ cartKey, product, sku, qty }) => (
                          <tr key={cartKey}>
                            <td className="py-2 px-2.5 font-medium">
                              <div>{formatItemDisplayName(product, sku)}</div>
                              <div className="text-[10px] font-mono text-neutral-400">
                                {sku.code}
                              </div>
                            </td>
                            <td className="py-2 px-2 text-center font-bold text-emerald-600">
                              x{qty}
                            </td>
                            <td className="py-2 px-2 text-right text-neutral-500">
                              {formatPrice(sku.priceUSD)}
                            </td>
                            <td className="py-2 px-2.5 text-right font-bold">
                              {formatPrice(sku.priceUSD * qty)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-neutral-50 dark:bg-neutral-800/60 font-extrabold">
                        <tr>
                          <td colSpan={3} className="py-2 px-2.5">
                            TOTAL ({totalItems})
                          </td>
                          <td className="py-2 px-2.5 text-right text-emerald-600">
                            {formatPrice(totalAmountUSD)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Format Switch Tabs (WeChat vs WhatsApp Raw Text Preview) */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => setTableFormatTab("wechat")}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                        tableFormatTab === "wechat"
                          ? "bg-[#07C160] text-white"
                          : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                      }`}
                    >
                      微信表格格式 (WeChat)
                    </button>
                    <button
                      onClick={() => setTableFormatTab("whatsapp")}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                        tableFormatTab === "whatsapp"
                          ? "bg-emerald-700 text-white"
                          : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                      }`}
                    >
                      WhatsApp 格式
                    </button>
                  </div>

                  <pre className="text-[10px] leading-relaxed font-mono bg-neutral-900 text-emerald-300 p-2.5 rounded-xl overflow-x-auto">
                    {buildOrderTableText(tableFormatTab)}
                  </pre>
                </div>
              )}
            </div>

            {/* Bottom Checkout Action Bar: Total + WeChat Button + WhatsApp Button */}
            <div className="px-4 py-3.5 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between gap-2">
              <div className="pr-1">
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {t.total}
                </div>
                <div className="text-base sm:text-lg font-extrabold text-neutral-900 dark:text-white leading-tight">
                  {formatPrice(totalAmountUSD)}
                </div>
              </div>

              <div className="flex-1 flex items-center gap-2">
                <button
                  onClick={launchWeChatWithTable}
                  disabled={cartEntries.length === 0}
                  className="flex-1 py-3 px-3 rounded-2xl bg-[#07C160] hover:bg-[#06ad56] disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#07C160]/25 active:scale-95 transition"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 fill-current flex-shrink-0"
                  >
                    <path d="M8.69 14.3c-.41 0-.75-.3-.75-.68 0-.38.34-.68.75-.68.41 0 .75.3.75.68 0 .38-.34.68-.75.68zm4.22 0c-.41 0-.75-.3-.75-.68 0-.38.34-.68.75-.68.41 0 .75.3.75.68 0 .38-.34.68-.75.68zM15.8 9.2c.24 0 .48.02.71.05C15.9 5.95 12.48 3.5 8.4 3.5 3.76 3.5 0 6.66 0 10.55c0 2.28 1.28 4.3 3.3 5.6-.16.57-.58 2.05-.66 2.37-.11.4.15.39.31.28.13-.09 2.05-1.36 2.88-1.91.83.24 1.71.37 2.63.37.24 0 .47-.01.7-.03-.15-.55-.23-1.13-.23-1.73 0-3.48 3.08-6.3 6.87-6.3zm-9.97-.9c-.52 0-.94-.39-.94-.87 0-.48.42-.87.94-.87.52 0 .94.39.94.87 0 .48-.42.87-.94.87zm5.14 0c-.52 0-.94-.39-.94-.87 0-.48.42-.87.94-.87.52 0 .94.39.94.87 0 .48-.42.87-.94.87zm4.83 2.1c-3.42 0-6.2 2.4-6.2 5.35 0 2.96 2.78 5.35 6.2 5.35.72 0 1.42-.11 2.07-.3l2.24 1.48c.13.09.33.09.25-.22-.06-.25-.39-1.4-.51-1.85 1.35-1.01 2.15-2.61 2.15-4.46 0-2.95-2.78-5.35-6.2-5.35z" />
                  </svg>
                  <span className="truncate">{t.sendWeChat}</span>
                </button>

                <button
                  onClick={launchWhatsAppWithTable}
                  disabled={cartEntries.length === 0}
                  className="flex-1 py-3 px-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 dark:bg-emerald-700 dark:hover:bg-emerald-600 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition"
                >
                  <Send className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{t.sendWhatsApp}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {wechatModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-3xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#07C160] font-extrabold text-base">
                <MessageCircle className="w-5 h-5 fill-[#07C160]/20" />
                <span>{t.wechatModalTitle}</span>
              </div>
              <button
                onClick={() => setWechatModalOpen(false)}
                className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {t.wechatModalDesc}
            </p>

            {tableImageDataUrl && (
              <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 max-h-72 overflow-y-auto bg-neutral-50">
                <img
                  src={tableImageDataUrl}
                  alt="Order Table for WeChat"
                  className="w-full h-auto block"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleNativeShareToWeChat}
                className="py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#07C160] border border-[#07C160]/30 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-100/60 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t.shareWeChatImg}</span>
              </button>

              <button
                onClick={handleDownloadTableImage}
                className="py-2.5 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-neutral-200 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.saveTableImg}</span>
              </button>
            </div>

            <button
              onClick={() => {
                window.location.href = "weixin://";
              }}
              className="w-full py-3 rounded-2xl bg-[#07C160] hover:bg-[#06ad56] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#07C160]/30 active:scale-95 transition"
            >
              <span>{t.openWeChatApp}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FlyItem({ item }: { item: FlyingItem }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setActive(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="fixed z-50 pointer-events-none transition-all duration-500 ease-in-out"
      style={{
        left: item.startX,
        top: item.startY,
        transform: active
          ? `translate(${item.deltaX}px, ${item.deltaY}px) scale(0.2)`
          : "translate(0px, 0px) scale(0.95)",
        opacity: active ? 0.2 : 1,
      }}
    >
      <div className="w-20 h-20 flex items-center justify-center">
        {renderProductVisual(item.product, "w-20 h-20")}
      </div>
    </div>
  );
}
