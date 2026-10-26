"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Upload,
  Package,
  Layers,
  Store,
  Check,
  X,
  Save,
  Boxes,
  FolderTree,
  Image as ImageIcon,
} from "lucide-react";
import {
  CATEGORIES as DEFAULT_CATEGORIES,
  PRODUCTS,
  renderProductVisual,
} from "@/data/products";
import {
  ProductItem,
  ProductSku,
  CategoryItem,
  BannerItem,
  BadgeType,
} from "@/types/catalog";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>(
    DEFAULT_CATEGORIES.filter((c) => c.id !== "todos")
  );
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("todos");
  const [toast, setToast] = useState<string | null>(null);

  // Product Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [saving, setSaving] = useState(false);

  // Category Management Modal State
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [newCatZh, setNewCatZh] = useState("");
  const [newCatEs, setNewCatEs] = useState("");
  const [newCatEn, setNewCatEn] = useState("");
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatZh, setEditCatZh] = useState("");
  const [editCatEs, setEditCatEs] = useState("");
  const [editCatEn, setEditCatEn] = useState("");
  const [catSaving, setCatSaving] = useState(false);

  // Banner Management Modal State
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [newBannerUrl, setNewBannerUrl] = useState("");
  const [newBannerAlt, setNewBannerAlt] = useState("");
  const [bannerUploading, setBannerUploading] = useState(false);
  const [replacingBannerId, setReplacingBannerId] = useState<string | null>(
    null
  );

  // Product Form Fields
  const [nameZh, setNameZh] = useState("");
  const [nameEs, setNameEs] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [category, setCategory] = useState<string>("frutas");
  const [badge, setBadge] = useState<BadgeType>("");
  const [imageUrl, setImageUrl] = useState("");
  const [illustrationKey, setIllustrationKey] = useState("mango-fresco");
  const [active, setActive] = useState(true);
  const [skus, setSkus] = useState<ProductSku[]>([]);

  const showNotice = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const fetchAllData = async () => {
    setLoading(true);
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
        setProducts(prodData.products);
      }
      if (Array.isArray(catData.categories)) {
        setCategories(catData.categories);
      }
      if (Array.isArray(banData.banners)) {
        setBanners(banData.banners);
      }
    } catch {
      showNotice("加载后台数据失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        filterCategory === "todos" || p.category === filterCategory;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchCat;
      const matchName =
        p.name.zh.toLowerCase().includes(q) ||
        p.name.es.toLowerCase().includes(q) ||
        p.name.en.toLowerCase().includes(q);
      const matchSku = p.skus?.some(
        (s) =>
          s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
      );
      return matchCat && (matchName || matchSku);
    });
  }, [products, filterCategory, searchQuery]);

  // Summary metrics
  const totalSkuCount = useMemo(
    () => products.reduce((sum, p) => sum + (p.skus?.length || 0), 0),
    [products]
  );
  const totalStockCount = useMemo(
    () =>
      products.reduce(
        (sum, p) =>
          sum +
          (p.skus?.reduce((sSum, s) => sSum + (Number(s.stock) || 0), 0) || 0),
        0
      ),
    [products]
  );

  // Banner CRUD & Upload Handlers
  const handleUploadNewBannerFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const upRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const upData = await upRes.json();
      if (upData.url) {
        const res = await fetch("/api/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: upData.url,
            alt: newBannerAlt.trim() || file.name,
          }),
        });
        const data = await res.json();
        if (Array.isArray(data.banners)) {
          setBanners(data.banners);
          setNewBannerAlt("");
          showNotice("✅ 新横幅图片已上传并添加到首页！");
        }
      }
    } catch {
      showNotice("上传横幅失败");
    } finally {
      setBannerUploading(false);
      e.target.value = "";
    }
  };

  const handleReplaceBannerFile = async (
    bannerId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReplacingBannerId(bannerId);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const upRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const upData = await upRes.json();
      if (upData.url) {
        const res = await fetch(`/api/banners/${bannerId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: upData.url }),
        });
        const data = await res.json();
        if (Array.isArray(data.banners)) {
          setBanners(data.banners);
          showNotice("✅ 首页横幅图片已成功更换！");
        }
      }
    } catch {
      showNotice("更换横幅图片失败");
    } finally {
      setReplacingBannerId(null);
      e.target.value = "";
    }
  };

  const handleAddBannerByUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerUrl.trim()) {
      showNotice("请填写横幅图片链接或直接上传本地图片");
      return;
    }
    setBannerUploading(true);
    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: newBannerUrl.trim(),
          alt: newBannerAlt.trim() || "首页轮播横幅",
        }),
      });
      const data = await res.json();
      if (Array.isArray(data.banners)) {
        setBanners(data.banners);
        setNewBannerUrl("");
        setNewBannerAlt("");
        showNotice("✅ 新横幅已添加！");
      }
    } catch {
      showNotice("添加横幅失败");
    } finally {
      setBannerUploading(false);
    }
  };

  const handleUpdateBannerField = async (
    bannerId: string,
    url: string,
    alt: string
  ) => {
    try {
      const res = await fetch(`/api/banners/${bannerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, alt }),
      });
      const data = await res.json();
      if (Array.isArray(data.banners)) {
        setBanners(data.banners);
        showNotice("✅ 横幅修改已保存！");
      }
    } catch {
      showNotice("保存横幅失败");
    }
  };

  const handleDeleteBanner = async (banner: BannerItem) => {
    if (banners.length <= 1) {
      showNotice("请至少保留 1 张首页横幅图片");
      return;
    }
    if (!window.confirm("确定要删除这张首页横幅吗？")) return;
    try {
      const res = await fetch(`/api/banners/${banner.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (Array.isArray(data.banners)) {
        setBanners(data.banners);
        showNotice("🗑️ 横幅已删除");
      }
    } catch {
      showNotice("删除横幅失败");
    }
  };

  // Category CRUD Handlers
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const fallback = newCatZh.trim() || newCatEs.trim() || newCatEn.trim();
    if (!fallback) {
      showNotice("请至少填写一个类目名称");
      return;
    }
    setCatSaving(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: {
            zh: newCatZh.trim() || fallback,
            es: newCatEs.trim() || fallback,
            en: newCatEn.trim() || fallback,
          },
        }),
      });
      const data = await res.json();
      if (Array.isArray(data.categories)) {
        setCategories(data.categories);
        setNewCatZh("");
        setNewCatEs("");
        setNewCatEn("");
        showNotice("✅ 新类目创建成功！");
      }
    } catch {
      showNotice("创建类目失败");
    } finally {
      setCatSaving(false);
    }
  };

  const handleStartEditCat = (cat: CategoryItem) => {
    setEditingCatId(cat.id);
    setEditCatZh(cat.label.zh);
    setEditCatEs(cat.label.es);
    setEditCatEn(cat.label.en);
  };

  const handleSaveEditCat = async (id: string) => {
    const fallback = editCatZh.trim() || editCatEs.trim() || editCatEn.trim();
    if (!fallback) {
      showNotice("类目名称不能为空");
      return;
    }
    setCatSaving(true);
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: {
            zh: editCatZh.trim() || fallback,
            es: editCatEs.trim() || fallback,
            en: editCatEn.trim() || fallback,
          },
        }),
      });
      const data = await res.json();
      if (Array.isArray(data.categories)) {
        setCategories(data.categories);
        setEditingCatId(null);
        showNotice("✅ 类目修改已保存！");
      }
    } catch {
      showNotice("修改类目失败");
    } finally {
      setCatSaving(false);
    }
  };

  const handleDeleteCategory = async (cat: CategoryItem) => {
    const count = products.filter((p) => p.category === cat.id).length;
    const msg =
      count > 0
        ? `类目「${cat.label.zh} (${cat.label.es})」下当前有 ${count} 个商品，确定要删除该类目吗？`
        : `确定要删除类目「${cat.label.zh} (${cat.label.es})」吗？`;
    if (!window.confirm(msg)) return;

    try {
      const res = await fetch(`/api/categories/${cat.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (Array.isArray(data.categories)) {
        setCategories(data.categories);
        if (filterCategory === cat.id) setFilterCategory("todos");
        showNotice("🗑️ 类目已删除");
      }
    } catch {
      showNotice("删除类目失败");
    }
  };

  // Product CRUD Handlers
  const handleOpenCreate = () => {
    setEditingId(null);
    setNameZh("");
    setNameEs("");
    setNameEn("");
    setCategory(categories[0]?.id || "frutas");
    setBadge("");
    setImageUrl("");
    setIllustrationKey("mango-fresco");
    setActive(true);
    setSkus([
      {
        id: `sku-${Date.now()}-1`,
        code: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        name: "500g / 标准装",
        priceUSD: 3.5,
        stock: 50,
      },
    ]);
    setModalOpen(true);
  };

  const handleOpenEdit = (product: ProductItem) => {
    setEditingId(product.id);
    setNameZh(product.name.zh);
    setNameEs(product.name.es);
    setNameEn(product.name.en);
    setCategory(product.category);
    setBadge(product.badge || "");
    setImageUrl(product.imageUrl || "");
    setIllustrationKey(product.illustrationKey || product.id || "mango-fresco");
    setActive(product.active !== false);
    setSkus(
      product.skus?.length
        ? product.skus.map((s) => ({ ...s }))
        : [
            {
              id: `sku-${Date.now()}`,
              code: "SKU-001",
              name: "默认规格",
              priceUSD: product.priceUSD,
              stock: 50,
            },
          ]
    );
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
        showNotice("✅ 商品图片上传成功！");
      } else {
        showNotice("上传失败，请重试");
      }
    } catch {
      showNotice("图片上传出错");
    } finally {
      setUploadingImg(false);
    }
  };

  const handleAddSkuRow = () => {
    setSkus((prev) => [
      ...prev,
      {
        id: `sku-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        code: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        name: "",
        priceUSD: prev[0]?.priceUSD || 3.0,
        stock: 50,
      },
    ]);
  };

  const handleUpdateSkuRow = (
    idx: number,
    field: keyof ProductSku,
    value: string | number
  ) => {
    setSkus((prev) => {
      const next = [...prev];
      next[idx] = {
        ...next[idx],
        [field]:
          field === "priceUSD" || field === "stock" ? Number(value) : value,
      };
      return next;
    });
  };

  const handleRemoveSkuRow = (idx: number) => {
    if (skus.length <= 1) {
      showNotice("每个商品至少保留 1 个 SKU 规格");
      return;
    }
    setSkus((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const fallbackName =
      nameZh.trim() || nameEs.trim() || nameEn.trim() || "未命名商品";

    const cleanedSkus = skus.map((s, idx) => ({
      id: s.id || `sku-${Date.now()}-${idx}`,
      code: s.code.trim() || `SKU-${idx + 1}`,
      name: s.name.trim() || "标准规格",
      priceUSD: Number(s.priceUSD) || 0,
      stock: Number(s.stock) || 0,
    }));

    const payload = {
      name: {
        zh: nameZh.trim() || fallbackName,
        es: nameEs.trim() || fallbackName,
        en: nameEn.trim() || fallbackName,
      },
      priceUSD: cleanedSkus[0]?.priceUSD || 0,
      category,
      badge,
      imageUrl: imageUrl.trim(),
      illustrationKey,
      active,
      skus: cleanedSkus,
    };

    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (Array.isArray(data.products)) {
          setProducts(data.products);
          showNotice("✅ 商品及 SKU 修改已保存！");
          setModalOpen(false);
        }
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (Array.isArray(data.products)) {
          setProducts(data.products);
          showNotice("✅ 新商品及 SKU 已成功添加！");
          setModalOpen(false);
        }
      }
    } catch {
      showNotice("保存失败，请检查网络");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (product: ProductItem) => {
    if (
      !window.confirm(
        `确定要删除商品「${product.name.zh} / ${product.name.es}」及其所有 SKU 吗？`
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (Array.isArray(data.products)) {
        setProducts(data.products);
        showNotice("🗑️ 商品已删除");
      }
    } catch {
      showNotice("删除失败");
    }
  };

  const handleToggleActive = async (product: ProductItem) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: product.active === false }),
      });
      const data = await res.json();
      if (Array.isArray(data.products)) {
        setProducts(data.products);
        showNotice(
          product.active === false ? "✅ 商品已上架" : "已下架隐藏该商品"
        );
      }
    } catch {
      showNotice("状态更新失败");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 pb-20">
      {/* Top Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-30 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-black text-sm">
              LM
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight">
                LOS MANGOS · 商城综合管理后台
              </h1>
              <p className="text-xs text-neutral-500">
                更换首页横幅 · 管理商品类目 · 上传商品与多规格 SKU · 实时同步前台
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className="px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Store className="w-4 h-4 text-emerald-600" />
              <span>返回前台商城</span>
            </Link>

            <button
              onClick={() => setBannerModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <ImageIcon className="w-4 h-4" />
              <span>更换首页横幅 ({banners.length})</span>
            </button>

            <button
              onClick={() => setCatModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <FolderTree className="w-4 h-4" />
              <span>管理类目 ({categories.length})</span>
            </button>

            <button
              onClick={handleOpenCreate}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>上传 / 新增商品</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200/70 dark:border-neutral-800 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-neutral-500">商品总数 (SPU)</div>
              <div className="text-xl font-extrabold">{products.length}</div>
            </div>
          </div>

          <div
            onClick={() => setBannerModalOpen(true)}
            className="cursor-pointer bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200/70 dark:border-neutral-800 hover:border-blue-500/50 flex items-center gap-3.5 transition"
          >
            <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-neutral-500">
                首页轮播横幅 (点击更换)
              </div>
              <div className="text-xl font-extrabold">{banners.length} 张</div>
            </div>
          </div>

          <div
            onClick={() => setCatModalOpen(true)}
            className="cursor-pointer bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200/70 dark:border-neutral-800 hover:border-emerald-500/50 flex items-center gap-3.5 transition"
          >
            <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-neutral-500">
                商品类目数 (点击管理)
              </div>
              <div className="text-xl font-extrabold">{categories.length}</div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200/70 dark:border-neutral-800 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-neutral-500">
                SKU 规格 / 总库存
              </div>
              <div className="text-xl font-extrabold">
                {totalSkuCount} / {totalStockCount}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Homepage Banner Preview Strip */}
        <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200/70 dark:border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-extrabold">
                当前首页轮播横幅预览 ({banners.length} 张)
              </span>
            </div>
            <button
              onClick={() => setBannerModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition"
            >
              管理 / 更换横幅图片
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {banners.map((b, i) => (
              <div
                key={b.id}
                className="relative group h-28 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100"
              >
                <img
                  src={b.url}
                  alt={b.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-white text-neutral-900 text-xs font-bold flex items-center gap-1 shadow">
                    <Upload className="w-3.5 h-3.5" />
                    <span>
                      {replacingBannerId === b.id ? "上传中..." : "直接换图"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleReplaceBannerFile(b.id, e)}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={() => handleDeleteBanner(b)}
                    className="p-1.5 rounded-lg bg-rose-600 text-white shadow"
                    title="删除此横幅"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold">
                  横幅 #{i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200/70 dark:border-neutral-800 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索商品名称（中文/西语/英语）或 SKU 编码..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs outline-none focus:ring-2 ring-neutral-900"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setFilterCategory("todos")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                filterCategory === "todos"
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
              }`}
            >
              全部 (Todos)
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                  filterCategory === cat.id
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
                }`}
              >
                {cat.label.zh} ({cat.label.es})
              </button>
            ))}

            <button
              onClick={() => setCatModalOpen(true)}
              className="px-3 py-1.5 rounded-full text-xs font-bold border border-dashed border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增 / 修改类目</span>
            </button>
          </div>
        </div>

        {/* Products & SKUs Table */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/70 dark:border-neutral-800 overflow-hidden shadow-xs">
          {loading ? (
            <div className="p-12 text-center text-sm text-neutral-400">
              正在加载商品与 SKU 数据...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <p className="text-sm text-neutral-400">没有找到匹配的商品</p>
              <button
                onClick={handleOpenCreate}
                className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold"
              >
                + 新增商品
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/50 text-[11px] font-bold text-neutral-500 uppercase">
                    <th className="py-3.5 px-4">商品信息</th>
                    <th className="py-3.5 px-3">所属类目 / 角标</th>
                    <th className="py-3.5 px-4">
                      SKU 规格列表 (编码 · 规格 · 价格 · 库存)
                    </th>
                    <th className="py-3.5 px-3 text-center">状态</th>
                    <th className="py-3.5 px-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                  {filteredProducts.map((product) => {
                    const catObj = categories.find(
                      (c) => c.id === product.category
                    );
                    return (
                      <tr
                        key={product.id}
                        className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30 transition"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {renderProductVisual(product, "w-12 h-12")}
                            </div>
                            <div>
                              <div className="font-extrabold text-sm text-neutral-900 dark:text-white">
                                {product.name.zh}
                              </div>
                              <div className="text-neutral-500 font-medium">
                                ES: {product.name.es} · EN: {product.name.en}
                              </div>
                              <div className="text-[11px] text-emerald-600 font-bold mt-0.5">
                                默认起售价: ${Number(product.priceUSD).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="space-y-1">
                            <span className="inline-block px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 font-semibold">
                              {catObj
                                ? `${catObj.label.zh} / ${catObj.label.es}`
                                : product.category}
                            </span>
                            {product.badge && (
                              <div>
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white ${
                                    product.badge === "BESTSELLER"
                                      ? "bg-neutral-900"
                                      : product.badge === "NEW"
                                      ? "bg-emerald-700"
                                      : "bg-red-600"
                                  }`}
                                >
                                  {product.badge}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1.5">
                            {(product.skus || []).map((sku) => (
                              <div
                                key={sku.id}
                                className="px-2.5 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 flex items-center gap-2"
                              >
                                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-200/70 dark:bg-neutral-700 font-bold">
                                  {sku.code}
                                </span>
                                <span className="font-bold text-neutral-800 dark:text-neutral-200">
                                  {sku.name}
                                </span>
                                <span className="font-extrabold text-emerald-600">
                                  ${Number(sku.priceUSD).toFixed(2)}
                                </span>
                                <span className="text-[11px] text-neutral-400">
                                  库存:{sku.stock}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <button
                            onClick={() => handleToggleActive(product)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
                              product.active !== false
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                : "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                            }`}
                          >
                            {product.active !== false ? "上架中" : "已下架"}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(product)}
                              className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 font-bold flex items-center gap-1 transition"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>修改 / SKU</span>
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product)}
                              className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                              title="删除商品"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Homepage Banner Management Modal (更换 / 上传 / 删除首页横幅) */}
      {bannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-extrabold">
                  首页轮播横幅管理（本地上传换图 · 新增 · 删除）
                </h2>
              </div>
              <button
                onClick={() => setBannerModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            <div className="p-6 max-h-[82vh] overflow-y-auto space-y-5 text-xs">
              {/* Upload or Add New Banner */}
              <div className="bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-800/50 rounded-2xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-extrabold text-blue-900 dark:text-blue-300">
                    新增首页横幅海报
                  </div>
                  <label className="cursor-pointer px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold inline-flex items-center gap-1.5 shadow-sm transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>
                      {bannerUploading
                        ? "正在上传..."
                        : "从电脑/手机上传新横幅图片"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadNewBannerFile}
                      className="hidden"
                    />
                  </label>
                </div>

                <form
                  onSubmit={handleAddBannerByUrl}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1"
                >
                  <input
                    type="text"
                    value={newBannerUrl}
                    onChange={(e) => setNewBannerUrl(e.target.value)}
                    placeholder="或者粘贴外部图片链接 https://..."
                    className="sm:col-span-6 px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 outline-none"
                  />
                  <input
                    type="text"
                    value={newBannerAlt}
                    onChange={(e) => setNewBannerAlt(e.target.value)}
                    placeholder="横幅备注/标题 (选填)"
                    className="sm:col-span-4 px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={bannerUploading}
                    className="sm:col-span-2 px-3 py-2 rounded-xl bg-neutral-900 text-white font-bold hover:bg-neutral-800 transition"
                  >
                    添加链接
                  </button>
                </form>
              </div>

              {/* Existing Banners List */}
              <div className="space-y-3">
                <div className="font-bold text-neutral-500 px-1">
                  当前轮播中的横幅 ({banners.length} 张)
                </div>

                {banners.map((banner, index) => (
                  <div
                    key={banner.id}
                    className="p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
                  >
                    <div className="relative w-full sm:w-48 h-28 rounded-xl overflow-hidden bg-neutral-200 flex-shrink-0 border border-neutral-200 dark:border-neutral-700">
                      <img
                        src={banner.url}
                        alt={banner.alt}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/65 text-white text-[10px] font-bold">
                        第 {index + 1} 张
                      </span>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold inline-flex items-center gap-1.5 transition">
                          <Upload className="w-3.5 h-3.5" />
                          <span>
                            {replacingBannerId === banner.id
                              ? "更换中..."
                              : "上传本地图片替换此横幅"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleReplaceBannerFile(banner.id, e)
                            }
                            className="hidden"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => handleDeleteBanner(banner)}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 font-bold inline-flex items-center gap-1 hover:bg-rose-100 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>删除</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-neutral-400 mb-0.5">
                            图片地址 (URL)
                          </label>
                          <input
                            type="text"
                            value={banner.url}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBanners((prev) =>
                                prev.map((item) =>
                                  item.id === banner.id
                                    ? { ...item, url: val }
                                    : item
                                )
                              );
                            }}
                            onBlur={() =>
                              handleUpdateBannerField(
                                banner.id,
                                banner.url,
                                banner.alt
                              )
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-neutral-400 mb-0.5">
                            标题 / 备注说明
                          </label>
                          <input
                            type="text"
                            value={banner.alt}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBanners((prev) =>
                                prev.map((item) =>
                                  item.id === banner.id
                                    ? { ...item, alt: val }
                                    : item
                                )
                              );
                            }}
                            onBlur={() =>
                              handleUpdateBannerField(
                                banner.id,
                                banner.url,
                                banner.alt
                              )
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Management Modal (创建 / 修改 / 删除类目) */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-extrabold">
                  商品类目管理（创建 · 修改 · 删除）
                </h2>
              </div>
              <button
                onClick={() => setCatModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            <div className="p-6 max-h-[80vh] overflow-y-auto space-y-5 text-xs">
              <form
                onSubmit={handleCreateCategory}
                className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/50 rounded-2xl p-4 space-y-3"
              >
                <div className="font-extrabold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  <span>创建新类目（任意填写其中一种语言即可，其余自动同步）</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    value={newCatZh}
                    onChange={(e) => setNewCatZh(e.target.value)}
                    placeholder="中文名称 (如: 海鲜水产)"
                    className="px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 outline-none"
                  />
                  <input
                    type="text"
                    value={newCatEs}
                    onChange={(e) => setNewCatEs(e.target.value)}
                    placeholder="西语 ES (如: Mariscos)"
                    className="px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 outline-none"
                  />
                  <input
                    type="text"
                    value={newCatEn}
                    onChange={(e) => setNewCatEn(e.target.value)}
                    placeholder="英语 EN (如: Seafood)"
                    className="px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 outline-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={catSaving}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>立即创建类目</span>
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                <div className="font-bold text-neutral-500 px-1">
                  现有类目列表 ({categories.length})
                </div>

                <div className="divide-y divide-neutral-100 dark:divide-neutral-800 border border-neutral-200/70 dark:border-neutral-800 rounded-2xl overflow-hidden">
                  {categories.map((cat) => {
                    const isEditing = editingCatId === cat.id;
                    const prodCount = products.filter(
                      (p) => p.category === cat.id
                    ).length;

                    return (
                      <div
                        key={cat.id}
                        className="p-3.5 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        {isEditing ? (
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={editCatZh}
                              onChange={(e) => setEditCatZh(e.target.value)}
                              placeholder="中文名称"
                              className="px-2.5 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700"
                            />
                            <input
                              type="text"
                              value={editCatEs}
                              onChange={(e) => setEditCatEs(e.target.value)}
                              placeholder="西语 ES"
                              className="px-2.5 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700"
                            />
                            <input
                              type="text"
                              value={editCatEn}
                              onChange={(e) => setEditCatEn(e.target.value)}
                              placeholder="英语 EN"
                              className="px-2.5 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className="font-extrabold text-sm text-neutral-900 dark:text-white">
                              {cat.label.zh}
                            </span>
                            <span className="text-neutral-500">
                              ES: <b>{cat.label.es}</b> · EN:{" "}
                              <b>{cat.label.en}</b>
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[11px] text-neutral-500 font-semibold">
                              {prodCount} 件商品
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleSaveEditCat(cat.id)}
                                disabled={catSaving}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>保存</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingCatId(null)}
                                className="px-2.5 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 font-semibold"
                              >
                                取消
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleStartEditCat(cat)}
                                className="px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 font-bold flex items-center gap-1 transition"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>修改</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCategory(cat)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                                title="删除类目"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Product & SKU Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <h2 className="text-base font-extrabold">
                {editingId ? "修改商品与 SKU 规格" : "上传 / 新增商品与 SKU"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            <form
              onSubmit={handleSaveProduct}
              className="p-6 max-h-[82vh] overflow-y-auto space-y-5 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-2xl border border-neutral-200/60 dark:border-neutral-800">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-28 h-28 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center overflow-hidden shadow-xs">
                    {renderProductVisual(
                      { imageUrl, illustrationKey },
                      "w-24 h-24"
                    )}
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-1.5">
                    当前商品预览图
                  </span>
                </div>

                <div className="sm:col-span-2 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold inline-flex items-center gap-1.5 transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>
                        {uploadingImg ? "正在上传..." : "上传本地商品图片"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    {imageUrl && (
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
                        className="px-3 py-2 rounded-xl bg-rose-50 text-rose-600 font-semibold"
                      >
                        清除图片(改用内置图标)
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                      或者直接粘贴图片 URL / 选择预设插画：
                    </label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://... 或 /uploads/xxx.png (留空则使用下方内置插画)"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 outline-none"
                    />
                  </div>

                  {!imageUrl && (
                    <div>
                      <label className="block font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                        内置矢量插画图标选择：
                      </label>
                      <select
                        value={illustrationKey}
                        onChange={(e) => setIllustrationKey(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700"
                      >
                        {PRODUCTS.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name.zh} ({p.name.es})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">商品中文名称 *</label>
                  <input
                    type="text"
                    value={nameZh}
                    onChange={(e) => setNameZh(e.target.value)}
                    placeholder="例如：新鲜芒果"
                    required={!nameEs && !nameEn}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">
                    西语名称 (Español)
                  </label>
                  <input
                    type="text"
                    value={nameEs}
                    onChange={(e) => setNameEs(e.target.value)}
                    placeholder="例如：Mango Fresco (不填自动同步)"
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">
                    英语名称 (English)
                  </label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="例如：Fresh Mango (不填自动同步)"
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold">所属商品类目</label>
                    <button
                      type="button"
                      onClick={() => setCatModalOpen(true)}
                      className="text-[11px] text-emerald-600 font-bold hover:underline"
                    >
                      + 管理类目
                    </button>
                  </div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label.zh} ({cat.label.es})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">左上角促销角标</label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value as BadgeType)}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                  >
                    <option value="">无角标</option>
                    <option value="BESTSELLER">BESTSELLER (热销黑标)</option>
                    <option value="NEW">NEW (新品绿标)</option>
                    <option value="OFERTA">OFERTA (特价红标)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">上架状态</label>
                  <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                      className="rounded accent-emerald-600"
                    />
                    <span className="font-semibold">
                      {active ? "✅ 在前台商城展示销售" : "暂不上架（隐藏）"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-emerald-600" />
                      <span>SKU 规格管理（支持多规格、独立价格与库存）</span>
                    </h3>
                    <p className="text-[11px] text-neutral-500">
                      第一个 SKU 的价格将作为商品默认展示价；多规格商品在前台卡片上可直接切换规格加购。
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddSkuRow}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>添加 SKU 规格</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {skus.map((sku, idx) => (
                    <div
                      key={sku.id}
                      className="grid grid-cols-12 gap-2 items-center bg-neutral-50 dark:bg-neutral-800/60 p-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-700"
                    >
                      <div className="col-span-3">
                        <label className="block text-[10px] text-neutral-400 mb-0.5">
                          SKU 编码
                        </label>
                        <input
                          type="text"
                          value={sku.code}
                          onChange={(e) =>
                            handleUpdateSkuRow(idx, "code", e.target.value)
                          }
                          placeholder="MNG-500G"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 font-mono text-xs"
                        />
                      </div>

                      <div className="col-span-4">
                        <label className="block text-[10px] text-neutral-400 mb-0.5">
                          规格名称 (如 500g / 1kg / 整箱)
                        </label>
                        <input
                          type="text"
                          value={sku.name}
                          onChange={(e) =>
                            handleUpdateSkuRow(idx, "name", e.target.value)
                          }
                          placeholder="例如：1kg 礼盒装"
                          required
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-[10px] text-neutral-400 mb-0.5">
                          售价 ($ USD)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={sku.priceUSD}
                          onChange={(e) =>
                            handleUpdateSkuRow(idx, "priceUSD", e.target.value)
                          }
                          required
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 font-bold text-emerald-600 text-xs"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-[10px] text-neutral-400 mb-0.5">
                          库存
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={sku.stock}
                          onChange={(e) =>
                            handleUpdateSkuRow(idx, "stock", e.target.value)
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs"
                        />
                      </div>

                      <div className="col-span-1 flex justify-end pt-4">
                        <button
                          type="button"
                          onClick={() => handleRemoveSkuRow(idx)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="删除此 SKU"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 font-bold text-neutral-600 dark:text-neutral-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold flex items-center gap-1.5 shadow-lg transition"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "保存中..." : "保存商品与 SKU"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
