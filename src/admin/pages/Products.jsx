import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  getCustomProducts, applyCatalog, addCustomProduct, editProduct,
  removeProduct, mergeCategories, fileToDataUrl,
} from "../adminStore";
import { Modal, PageHead } from "../ui";

const empty = { title: "", price: "", stock: "", category: "", brand: "", image: "", description: "" };
const PAGE = 20;

// صفحة إدارة المنتجات: بتجمع منتجات الـ API مع المنتجات المضافة وبتسمح بالبحث والفلتر والإضافة والتعديل والمسح
export default function Products() {
  const [api, setApi] = useState([]);
  const [apiCats, setApiCats] = useState([]);
  const [custom, setCustom] = useState(getCustomProducts);
  const [tick, setTick] = useState(0); // re-apply overrides/deletions
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [shown, setShown] = useState(PAGE);
  const [form, setForm] = useState(null); // null | {product?, values}

  // بنجيب المنتجات والأقسام من الـ API أول ما الصفحة تفتح
  useEffect(() => {
    Promise.all([
      fetch("https://dummyjson.com/products?limit=0&select=id,title,price,stock,category,thumbnail,brand,description").then((r) => r.json()),
      fetch("https://dummyjson.com/products/categories").then((r) => r.json()),
    ])
      .then(([p, c]) => { setApi(p.products || []); setApiCats(c); })
      .catch(() => toast.error("Could not load products from the API"))
      .finally(() => setLoading(false));
  }, []);

  // قايمة الأقسام بعد الدمج مع إعدادات الأدمن
  const categories = useMemo(() => mergeCategories(apiCats), [apiCats, tick]);
  // كل المنتجات: المضافة + منتجات الـ API بعد تطبيق المسح والتعديلات
  const all = useMemo(
    () => [...custom.map((p) => ({ ...p, custom: true })), ...applyCatalog(api)],
    [api, custom, tick]
  );
  // المنتجات بعد الفلتر بالقسم والبحث
  const list = all.filter(
    (p) =>
      (cat === "all" || p.category === cat) &&
      `${p.title} ${p.brand || ""}`.toLowerCase().includes(q.toLowerCase())
  );

  // بتعيد تحميل المنتجات المضافة وتجبر الحسابات تتحدّث بعد أي تعديل
  const refresh = () => { setCustom(getCustomProducts()); setTick((t) => t + 1); };

  // بتفتح فورم إضافة منتج جديد بقيم فاضية
  const openAdd = () => setForm({ values: { ...empty, category: categories[0]?.slug || "" } });
  // بتفتح فورم التعديل ومعبّي بيانات المنتج الحالية
  const openEdit = (p) =>
    setForm({
      product: p,
      values: {
        title: p.title, price: p.price, stock: p.stock ?? 0, category: p.category,
        brand: p.brand || "", image: p.thumbnail || p.images?.[0] || "", description: p.description || "",
      },
    });
  // بتحدّث حقل واحد في قيم الفورم
  const set = (k, v) => setForm((f) => ({ ...f, values: { ...f.values, [k]: v } }));

  // بترفع صورة وتصغّرها وتحطها في الفورم
  const upload = async (file) => {
    if (!file) return;
    try { set("image", await fileToDataUrl(file, 600)); }
    catch { toast.error("Could not read that image"); }
  };

  // بتتأكد من البيانات ثم بتضيف المنتج أو تعدّله وتحدّث القايمة
  const save = () => {
    const v = form.values;
    if (!v.title.trim() || v.price === "" || !v.category) return toast.error("Title, price and category are required");
    if (Number(v.price) < 0 || Number(v.stock) < 0) return toast.error("Price and stock can't be negative");
    try {
      if (form.product) editProduct(form.product, v);
      else addCustomProduct(v);
      toast.success(form.product ? "Product updated" : "Product added");
      setForm(null);
      refresh();
    } catch {
      toast.error("Storage is full. Try a smaller image or an image URL.");
    }
  };

  // بتمسح منتج بعد تأكيد وتحدّث القايمة
  const del = (p) => {
    if (!window.confirm(`Delete "${p.title}"?`)) return;
    removeProduct(p);
    toast.success("Product deleted");
    refresh();
  };

  return (
    <>
      <PageHead title="Product Management" subtitle={`${all.length} products`}>
        <button type="button" className="btn" onClick={openAdd}>+ Add product</button>
      </PageHead>
      <div className="adm_tools">
        <input type="search" placeholder="Search products" value={q} onChange={(e) => { setQ(e.target.value); setShown(PAGE); }} />
        <select value={cat} onChange={(e) => { setCat(e.target.value); setShown(PAGE); }}>
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </div>

      <div className="adm_table_wrap">
        <table className="adm_table">
          <thead><tr><th></th><th>Title</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan="6" className="adm_empty">Loading…</td></tr>}
            {!loading && list.length === 0 && <tr><td colSpan="6" className="adm_empty">No products found.</td></tr>}
            {list.slice(0, shown).map((p) => (
              <tr key={p.id}>
                <td>{(p.thumbnail || p.images?.[0]) && <img src={p.thumbnail || p.images[0]} alt="" />}</td>
                <td>{p.title}{p.custom && <> <small>(added)</small></>}</td>
                <td>{p.category}</td>
                <td>${Number(p.price).toFixed(2)}</td>
                <td>{p.stock ?? 0}</td>
                <td>
                  <div className="adm_actions">
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>Edit</button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => del(p)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {list.length > shown && (
        <p style={{ textAlign: "center", marginTop: 14 }}>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => setShown((s) => s + PAGE)}>Show more</button>
        </p>
      )}

      {form && (
        <Modal
          title={form.product ? "Edit product" : "Add product"}
          onClose={() => setForm(null)}
          footer={<button type="button" className="btn btn-sm" onClick={save}>Save</button>}
        >
          <div className="adm_form">
            <label className="full">Title<input type="text" value={form.values.title} onChange={(e) => set("title", e.target.value)} /></label>
            <label>Price ($)<input type="number" min="0" step="0.01" value={form.values.price} onChange={(e) => set("price", e.target.value)} /></label>
            <label>Stock<input type="number" min="0" value={form.values.stock} onChange={(e) => set("stock", e.target.value)} /></label>
            <label>Category
              <select value={form.values.category} onChange={(e) => set("category", e.target.value)}>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </label>
            <label>Brand<input type="text" value={form.values.brand} onChange={(e) => set("brand", e.target.value)} /></label>
            <label className="full">Image URL<input type="text" placeholder="https://…" value={form.values.image.startsWith("data:") ? "" : form.values.image} onChange={(e) => set("image", e.target.value)} /></label>
            <label className="full">…or upload an image<input type="file" accept="image/*" onChange={(e) => upload(e.target.files[0])} /></label>
            {form.values.image && <img src={form.values.image} alt="" style={{ width: 90, height: 90, objectFit: "cover" }} />}
            <label className="full">Description<textarea rows="3" value={form.values.description} onChange={(e) => set("description", e.target.value)} /></label>
          </div>
        </Modal>
      )}
    </>
  );
}
