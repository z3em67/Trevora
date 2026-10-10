import { useState } from "react";
import toast from "react-hot-toast";
import { getBanners, saveBanners, resetBanners, fileToDataUrl } from "../adminStore";
import { DEFAULT_BANNERS, resolveImg } from "../defaultBanners";
import { Modal, PageHead, Badge } from "../ui";

const blank = { eyebrow: "", title: "", text: "", img: "", to: "/", active: true };

export default function Banners() {
  const [banners, setBanners] = useState(() => getBanners() || DEFAULT_BANNERS);
  const [custom, setCustom] = useState(() => getBanners() !== null);
  const [form, setForm] = useState(null);

  const commit = (list) => {
    try { saveBanners(list); setBanners(list); setCustom(true); return true; }
    catch { toast.error("Storage is full. Use a smaller image or an image URL."); return false; }
  };
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const upload = async (file) => {
    if (!file) return;
    try { set("img", await fileToDataUrl(file, 1000)); }
    catch { toast.error("Could not read that image"); }
  };

  const save = () => {
    if (!form.title.trim() || !form.img) return toast.error("Title and image are required");
    const list = form.id
      ? banners.map((b) => (b.id === form.id ? form : b))
      : [...banners, { ...form, id: Date.now() }];
    if (commit(list)) { toast.success("Banner saved"); setForm(null); }
  };
  const move = (i, d) => {
    const list = banners.slice();
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    commit(list);
  };
  const remove = (b) => {
    if (!window.confirm(`Delete "${b.title}"?`)) return;
    commit(banners.filter((x) => x.id !== b.id));
  };
  const reset = () => {
    if (!window.confirm("Restore the original banners?")) return;
    resetBanners(); setBanners(DEFAULT_BANNERS); setCustom(false);
  };

  return (
    <>
      <PageHead title="Homepage Banners" subtitle={custom ? "Custom banners are live" : "Showing the built-in banners"}>
        <div className="adm_actions">
          {custom && <button type="button" className="btn btn-outline" onClick={reset}>Restore defaults</button>}
          <button type="button" className="btn" onClick={() => setForm({ ...blank })}>+ Add banner</button>
        </div>
      </PageHead>
      <div className="adm_table_wrap">
        <table className="adm_table">
          <thead><tr><th>Image</th><th>Title</th><th>Link</th><th>Status</th><th>Order</th><th>Actions</th></tr></thead>
          <tbody>
            {banners.length === 0 && <tr><td colSpan="6" className="adm_empty">No banners. The homepage slider will be hidden.</td></tr>}
            {banners.map((b, i) => (
              <tr key={b.id}>
                <td><img className="adm_banner_thumb" src={resolveImg(b.img)} alt="" /></td>
                <td><b>{b.title}</b><br /><small>{b.eyebrow}</small></td>
                <td><code>{b.to}</code></td>
                <td><Badge value={b.active ? "Active" : "Hidden"} /></td>
                <td>
                  <div className="adm_actions">
                    <button type="button" className="btn-icon" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">↑</button>
                    <button type="button" className="btn-icon" disabled={i === banners.length - 1} onClick={() => move(i, 1)} aria-label="Move down">↓</button>
                  </div>
                </td>
                <td>
                  <div className="adm_actions">
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => setForm(b)}>Edit</button>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => commit(banners.map((x) => x.id === b.id ? { ...x, active: !x.active } : x))}>
                      {b.active ? "Hide" : "Show"}
                    </button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(b)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {form && (
        <Modal title={form.id ? "Edit banner" : "Add banner"} onClose={() => setForm(null)}
          footer={<button type="button" className="btn btn-sm" onClick={save}>Save</button>}>
          <div className="adm_form">
            <label>Small label<input type="text" placeholder="New arrival" value={form.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} /></label>
            <label>Title<input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} /></label>
            <label className="full">Text<input type="text" value={form.text} onChange={(e) => set("text", e.target.value)} /></label>
            <label className="full">Button link<input type="text" placeholder="/category/laptops" value={form.to} onChange={(e) => set("to", e.target.value)} /></label>
            <label className="full">Image URL<input type="text" placeholder="https://…" value={form.img.startsWith("data:") || form.img.startsWith("builtin:") ? "" : form.img} onChange={(e) => set("img", e.target.value)} /></label>
            <label className="full">…or upload an image<input type="file" accept="image/*" onChange={(e) => upload(e.target.files[0])} /></label>
            {form.img && <img className="adm_banner_thumb" src={resolveImg(form.img)} alt="" />}
            <label><span>Active</span><input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} /></label>
          </div>
        </Modal>
      )}
    </>
  );
}
