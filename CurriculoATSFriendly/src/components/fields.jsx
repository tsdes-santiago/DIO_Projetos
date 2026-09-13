export function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

export function TextArea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

export function ItemActions({ onUp, onDown, onRemove }) {
  return (
    <div className="item-actions">
      <button type="button" onClick={onUp} aria-label="Mover para cima">
        &uarr;
      </button>
      <button type="button" onClick={onDown} aria-label="Mover para baixo">
        &darr;
      </button>
      <button
        type="button"
        className="danger"
        onClick={onRemove}
        aria-label="Remover item"
      >
        &times;
      </button>
    </div>
  )
}

export function SectionCard({ title, children }) {
  return (
    <section className="form-card">
      <h3 className="form-section-title">{title}</h3>
      {children}
    </section>
  )
}