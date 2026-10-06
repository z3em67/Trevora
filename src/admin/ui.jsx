// نافذة منبثقة (Modal) عامة: فيها عنوان ومحتوى وزرار Cancel وفوتر نحط فيه أي أزرار تانية، وبتتقفل لو داس على الخلفية
export function Modal({ title, onClose, children, footer }) {
  return (
    <div className="adm_modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="adm_modal_box">
        <h3>{title}</h3>
        {children}
        <div className="adm_modal_foot">
          <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
          {footer}
        </div>
      </div>
    </div>
  );
}

// بادج صغير بيعرض الحالة (زي Active / Banned) وبياخد الكلاس حسب قيمة الحالة عشان اللون
export const Badge = ({ value }) => (
  <span className={`adm_status ${String(value || "").toLowerCase()}`}>{value}</span>
);

// هيدر الصفحة في الأدمن: عنوان وعنوان فرعي (اختياري) وعلى اليمين أي أزرار بتتبعت كـ children
export const PageHead = ({ title, subtitle, children }) => (
  <div className="adm_head">
    <div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
    <div>{children}</div>
  </div>
);
