import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { mergeCategories, persistCategories, slugify, getCustomProducts } from "../adminStore";
import { Badge, Modal, PageHead } from "../ui";

// صفحة إدارة الأقسام: إعادة تسمية، إخفاء، تمييز في الصفحة الرئيسية، وإضافة/مسح أقسام جديدة
export default function Categories() {
  const [apiCats, setApiCats] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // {slug?, name}

  // بنجيب الأقسام من الـ API أول ما الصفحة تفتح وندمجها مع إعدادات الأدمن
  useEffect(() => {
    fetch("https://dummyjson.com/products/categories")
      .then((r) => r.json())
      .then((c) => { setApiCats(c); setCats(mergeCategories(c)); })
      .catch(() => toast.error("Could not load categories"))
      .finally(() => setLoading(false));
  }, []);

  // بتحفظ قايمة الأقسام وتحدّث الشاشة
  const commit = (list) => { persistCategories(list); setCats(list); };
  // بتعدّل قسم واحد (بالـ slug) بالقيم الجديدة
  const patch = (slug, p) => commit(cats.map((c) => (c.slug === slug ? { ...c, ...p } : c)));

  // بتحفظ من الـ Modal: إما إعادة تسمية قسم موجود أو إضافة قسم جديد (مع التأكد إنه مش متكرر)
  const save = () => {
    const name = modal.name.trim();
    if (!name) return toast.error("Name is required");
    if (modal.slug) {
      patch(modal.slug, { name });
      toast.success("Category renamed");
    } else {
      const slug = slugify(name);
      if (!slug) return toast.error("Use letters or numbers in the name");
      if (cats.some((c) => c.slug === slug)) return toast.error("That category already exists");
      commit([...cats, { slug, name, hidden: false, featured: false, custom: true }]);
      toast.success("Category added");
    }
    setModal(null);
  };

  // بتمسح قسم مضاف، بس لو مفيش منتجات مستخدماه، وبعد تأكيد
  const remove = (c) => {
    const used = getCustomProducts().some((p) => p.category === c.slug);
    if (used) return toast.error("Move or delete the products in this category first");
    if (!window.confirm(`Delete "${c.name}"?`)) return;
    commit(cats.filter((x) => x.slug !== c.slug));
  };

  return (
    <>
      <PageHead title="Category Management" subtitle="Rename, hide, feature on the homepage, or add new categories">
        <button type="button" className="btn" onClick={() => setModal({ name: "" })}>+ Add category</button>
      </PageHead>
      <div className="adm_table_wrap">
        <table className="adm_table">
          <thead><tr><th>Name</th><th>Slug</th><th>Visible</th><th>On homepage</th><th>Actions</th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan="5" className="adm_empty">Loading…</td></tr>}
            {cats.map((c) => (
              <tr key={c.slug}>
                <td>{c.name}{c.custom && <> <small>(added)</small></>}</td>
                <td><code>{c.slug}</code></td>
                <td><Badge value={c.hidden ? "Hidden" : "Active"} /></td>
                <td><input type="checkbox" checked={c.featured} disabled={c.hidden} onChange={(e) => patch(c.slug, { featured: e.target.checked })} /></td>
                <td>
                  <div className="adm_actions">
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => setModal({ slug: c.slug, name: c.name })}>Rename</button>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => patch(c.slug, { hidden: !c.hidden, featured: c.hidden ? c.featured : false })}>
                      {c.hidden ? "Show" : "Hide"}
                    </button>
                    {c.custom && <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(c)}>Delete</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <Modal title={modal.slug ? "Rename category" : "Add category"} onClose={() => setModal(null)}
          footer={<button type="button" className="btn btn-sm" onClick={save}>Save</button>}>
          <div className="adm_form">
            <label className="full">Name<input type="text" autoFocus value={modal.name} onChange={(e) => setModal({ ...modal, name: e.target.value })} /></label>
          </div>
        </Modal>
      )}
    </>
  );
}
