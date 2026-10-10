// localStorage data layer for the admin dashboard.
// Keys already used by the app: users, currentUser, orders, sellerProducts, deletedProducts
// New keys: productOverrides, categoriesConfig, banners

const read = (key, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;
  } catch {
    return fallback;
  }
};
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

export const getCurrentUser = () => read("currentUser", null);
export const isAdmin = () => getCurrentUser()?.role === "admin";

/* ---------- Users ---------- */
export const getUsers = () => read("users", []);
export const saveUsers = (users) => write("users", users);

export function updateUser(id, patch) {
  const users = getUsers().map((u) => (u.id === id ? { ...u, ...patch } : u));
  saveUsers(users);
  const me = getCurrentUser();
  if (me && me.id === id) write("currentUser", { ...me, ...patch });
  return users;
}
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
export const getOrders = () => read("orders", []);
export function updateOrder(id, patch) {
  const orders = getOrders().map((o) => (o.id === id ? { ...o, ...patch } : o));
  write("orders", orders);
  return orders;
}
export function deleteOrder(id) {
  const orders = getOrders().filter((o) => o.id !== id);
  write("orders", orders);
  return orders;
}

/* ---------- Products ---------- */
export const getCustomProducts = () => read("sellerProducts", []);
export const getDeletedIds = () => read("deletedProducts", []);
export const getOverrides = () => read("productOverrides", {});

export function saveCustomProducts(list) {
  write("sellerProducts", list);
}
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
export function removeProduct(product) {
  if (product.custom) {
    saveCustomProducts(getCustomProducts().filter((p) => p.id !== product.id));
  } else {
    const ids = getDeletedIds();
    if (!ids.includes(product.id)) write("deletedProducts", [...ids, product.id]);
  }
}

// Apply admin changes (deleted / overrides) to products fetched from dummyjson
export function applyCatalog(apiProducts = []) {
  const deleted = getDeletedIds();
  const overrides = getOverrides();
  return apiProducts
    .filter((p) => !deleted.includes(p.id))
    .map((p) => (overrides[p.id] ? { ...p, ...overrides[p.id] } : p));
}
// Admin-added products for one category (storefront)
export const customProductsFor = (slug) =>
  getCustomProducts().filter((p) => p.category === slug && p.images?.length);

/* ---------- Categories ---------- */
// entry: { slug, name, hidden, featured, custom }
export const getCategoriesConfig = () => read("categoriesConfig", null);
export const saveCategoriesConfig = (list) => write("categoriesConfig", list);

export const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Merge the dummyjson category list with the admin config
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
export const visibleCategories = (apiCategories) =>
  mergeCategories(apiCategories).filter((c) => !c.hidden);
// Persist merged list back (admin page)
export const persistCategories = (list) => saveCategoriesConfig(list);

/* ---------- Banners ---------- */
// banner: { id, eyebrow, title, text, img, to, active }
export const getBanners = () => read("banners", null); // null => use built-in defaults
export const saveBanners = (list) => write("banners", list);
export const resetBanners = () => localStorage.removeItem("banners");

// Resize an uploaded image so it fits comfortably in localStorage
export function fileToDataUrl(file, maxW = 1000) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
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
