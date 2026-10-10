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

export const Badge = ({ value }) => (
  <span className={`adm_status ${String(value || "").toLowerCase()}`}>{value}</span>
);

export const PageHead = ({ title, subtitle, children }) => (
  <div className="adm_head">
    <div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
    <div>{children}</div>
  </div>
);
