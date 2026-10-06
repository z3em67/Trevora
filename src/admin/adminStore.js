// localStorage data layer for the admin dashboard.
// Keys already used by the app: users, currentUser, orders, sellerProducts, deletedProducts
// New keys: productOverrides, categoriesConfig, banners

// بتقرا قيمة من الـ localStorage وتحوّلها من JSON، ولو مفيش حاجة أو حصل خطأ بترجّع القيمة الافتراضية (fallback)
const read = (key, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;
  } catch {
    return fallback;
  }
};
// بتحفظ قيمة في الـ localStorage بعد ما تحوّلها JSON
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const DEFAULT_FEATURED = [
  "smartphones",
  "mobile-accessories",
  "laptops",
  "tablets",
  "sunglasses",
];

/* ---------- Admin seed ---------- */
export const ADMIN_EMAIL = "admin@shop.com";
export const ADMIN_PASSWORD = "admin123";

// لو مفيش أي أدمن في المستخدمين بتضيف حساب أدمن افتراضي (admin@shop.com) عشان تقدر تدخل لوحة التحكم
export function ensureAdmin() {
  const users = read("users", []);
  if (!users.some((u) => u.role === "admin")) {
    users.push({
      id: 1,
      name: "Admin",
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      phone: "00000000000",
      role: "admin",
    });
    write("users", users);
  }
}

// بترجّع المستخدم اللي عامل لوجين دلوقتي (أو null)
export const getCurrentUser = () => read("currentUser", null);
// بتشوف لو المستخدم الحالي أدمن ولا لأ
export const isAdmin = () => getCurrentUser()?.role === "admin";

/* ---------- Users ---------- */
// بترجّع كل المستخدمين المتسجلين
export const getUsers = () => read("users", []);
// بتحفظ قايمة المستخدمين
export const saveUsers = (users) => write("users", users);

// بتعدّل بيانات مستخدم بالـ id، ولو هو نفسه المستخدم الحالي بتحدّث currentUser كمان، وبترجّع القايمة الجديدة
export function updateUser(id, patch) {
  const users = getUsers().map((u) => (u.id === id ? { ...u, ...patch } : u));
  saveUsers(users);
  const me = getCurrentUser();
  if (me && me.id === id) write("currentUser", { ...me, ...patch });
  return users;
}
// بتمسح مستخدم بالـ id وبترجّع القايمة بعد المسح
export function deleteUser(id) {
  const users = getUsers().filter((u) => u.id !== id);
  saveUsers(users);
  return users;
}

/* ---------- Orders ---------- */
export const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];
// بترجّع كل الأوردرات
export const getOrders = () => read("orders", []);
// بتعدّل أوردر بالـ id (زي الحالة أو بيانات الشحن) وبترجّع قايمة الأوردرات الجديدة
export function updateOrder(id, patch) {
  const orders = getOrders().map((o) => (o.id === id ? { ...o, ...patch } : o));
  write("orders", orders);
  return orders;
}
// بتمسح أوردر بالـ id وبترجّع القايمة بعد المسح
export function deleteOrder(id) {
  const orders = getOrders().filter((o) => o.id !== id);
  write("orders", orders);
  return orders;
}

/* ---------- Products ---------- */
// بترجّع المنتجات اللي اتضافت من عندنا (مش من الـ API)
export const getCustomProducts = () => read("sellerProducts", []);
// بترجّع الـ ids بتاعة منتجات الـ API اللي اتمسحت (مخفية)
export const getDeletedIds = () => read("deletedProducts", []);
// بترجّع التعديلات اللي اتعملت على منتجات الـ API
export const getOverrides = () => read("productOverrides", {});

// بتحفظ قايمة المنتجات المضافة
export function saveCustomProducts(list) {
  write("sellerProducts", list);
}
// بتضيف منتج جديد: بتعمله id من الوقت وتظبط الأرقام والقيم الافتراضية وتحطه أول القايمة
export function addCustomProduct(p) {
  const product = {
    id: Date.now(),
    title: p.title,
    description: p.description || "",
    price: Number(p.price),
    stock: Number(p.stock) || 0,
    category: p.category,
    brand: p.brand || "",
    thumbnail: p.image || "",
    images: p.image ? [p.image] : [],
    rating: 0,
    discountPercentage: 0,
    custom: true,
  };
  saveCustomProducts([product, ...getCustomProducts()]);
  return product;
}
// Edit works for both custom products (edited in place) and API products (overrides)
// بتعدّل منتج: لو منتج مضاف بتعدّله مكانه، ولو منتج من الـ API بتحفظ التعديل في الـ overrides
export function editProduct(product, patch) {
  const clean = { ...patch };
  if (clean.price !== undefined) clean.price = Number(clean.price);
  if (clean.stock !== undefined) clean.stock = Number(clean.stock);
  if (clean.image !== undefined) {
    clean.thumbnail = clean.image;
    clean.images = clean.image ? [clean.image] : [];
    delete clean.image;
  }
  if (product.custom) {
    saveCustomProducts(
      getCustomProducts().map((p) => (p.id === product.id ? { ...p, ...clean } : p))
    );
  } else {
    const o = getOverrides();
    o[product.id] = { ...(o[product.id] || {}), ...clean };
    write("productOverrides", o);
  }
}
// بتمسح منتج: لو مضاف بتشيله من القايمة، ولو من الـ API بتحط الـ id بتاعه في قايمة المحذوفات
export function removeProduct(product) {
  if (product.custom) {
    saveCustomProducts(getCustomProducts().filter((p) => p.id !== product.id));
  } else {
    const ids = getDeletedIds();
    if (!ids.includes(product.id)) write("deletedProducts", [...ids, product.id]);
  }
}

// Apply admin changes (deleted / overrides) to products fetched from dummyjson
// بتطبّق تعديلات الأدمن على منتجات الـ API: بتشيل المحذوف وبتدمج التعديلات فوق المنتج الأصلي
export function applyCatalog(apiProducts = []) {
  const deleted = getDeletedIds();
  const overrides = getOverrides();
  return apiProducts
    .filter((p) => !deleted.includes(p.id))
    .map((p) => (overrides[p.id] ? { ...p, ...overrides[p.id] } : p));
}
// Admin-added products for one category (storefront)
// بترجّع المنتجات المضافة بس اللي تبع قسم معين وليها صور
export const customProductsFor = (slug) =>
  getCustomProducts().filter((p) => p.category === slug && p.images?.length);

/* ---------- Categories ---------- */
// entry: { slug, name, hidden, featured, custom }
// بترجّع إعدادات الأقسام اللي الأدمن حفظها (أو null)
export const getCategoriesConfig = () => read("categoriesConfig", null);
// بتحفظ إعدادات الأقسام
export const saveCategoriesConfig = (list) => write("categoriesConfig", list);

// بتحوّل اسم القسم لـ slug صالح للينك (حروف صغيرة وشرطات)
export const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Merge the dummyjson category list with the admin config
// بتدمج أقسام الـ API مع إعدادات الأدمن (إعادة تسمية / إخفاء / مميز) وبتضيف الأقسام المضافة يدوي
export function mergeCategories(apiCategories = []) {
  const cfg = getCategoriesConfig() || [];
  const bySlug = Object.fromEntries(cfg.map((c) => [c.slug, c]));
  const merged = apiCategories.map((c) => ({
    slug: c.slug,
    name: bySlug[c.slug]?.name || c.name,
    hidden: !!bySlug[c.slug]?.hidden,
    featured: bySlug[c.slug]
      ? !!bySlug[c.slug].featured
      : DEFAULT_FEATURED.includes(c.slug),
    custom: false,
  }));
  const custom = cfg
    .filter((c) => c.custom)
    .map((c) => ({ ...c, custom: true }));
  return [...merged, ...custom];
}
// Only what the storefront should show
// بترجّع الأقسام الظاهرة بس اللي المفروض تتعرض في المتجر (غير المخفية)
export const visibleCategories = (apiCategories) =>
  mergeCategories(apiCategories).filter((c) => !c.hidden);
// Persist merged list back (admin page)
// بتحفظ قايمة الأقسام بعد الدمج (بتستخدمها صفحة الأدمن)
export const persistCategories = (list) => saveCategoriesConfig(list);

/* ---------- Banners ---------- */
// banner: { id, eyebrow, title, text, img, to, active }
// بترجّع البانرات المحفوظة، ولو null يبقى هنستخدم البانرات الافتراضية
export const getBanners = () => read("banners", null); // null => use built-in defaults
// بتحفظ قايمة البانرات
export const saveBanners = (list) => write("banners", list);
// بترجّع البانرات للوضع الافتراضي بمسح المحفوظ
export const resetBanners = () => localStorage.removeItem("banners");

// Resize an uploaded image so it fits comfortably in localStorage
// بتقرا صورة مرفوعة وتصغّرها (لحد عرض معين) وتحوّلها لـ base64 JPEG عشان تتحفظ في الـ localStorage من غير ما تملاه
export function fileToDataUrl(file, maxW = 1000) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    // لما الملف يتقرا بنحمّله كصورة وبنرسمها على canvas بالحجم الجديد
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      // لما الصورة تحمّل بنحسب نسبة التصغير ونرسمها ونطلّع الـ data URL
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
