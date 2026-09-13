import { useState } from 'react'

export default function VersionSidebar({
  versions,
  activeVersionId,
  onSelect,
  onSave,
  onDuplicate,
  onRename,
  onDelete,
  onNew,
}) {
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')

  const startRename = (v) => {
    setEditingId(v.id)
    setEditName(v.name)
  }

  const confirmRename = () => {
    if (editName.trim()) {
      onRename(editingId, editName.trim())
    }
    setEditingId(null)
    setEditName('')
  }

  return (
    <div className="version-sidebar">
      <div className="version-sidebar-header">
        <h3>Versões</h3>
        <button type="button" className="btn btn-sm primary" onClick={onNew}>
          + Nova
        </button>
      </div>

      <div className="version-list">
        {versions.length === 0 && (
          <p className="version-empty">
            Nenhuma versão salva. Clique em "Salvar versão" para começar.
          </p>
        )}
        {versions.map((v) => (
          <div
            key={v.id}
            className={`version-item ${v.id === activeVersionId ? 'active' : ''}`}
            onClick={() => onSelect(v.id)}
          >
            <div className="version-item-info">
              {editingId === v.id ? (
                <input
                  className="version-rename-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={confirmRename}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') confirmRename()
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <>
                  <span className="version-name">{v.name}</span>
                  {v.score > 0 && (
                    <span
                      className="version-score"
                      style={{
                        color:
                          v.score >= 70
                            ? '#16a34a'
                            : v.score >= 40
                              ? '#ca8a04'
                              : '#dc2626',
                      }}
                    >
                      {v.score}%
                    </span>
                  )}
                </>
              )}
            </div>
            <div className="version-actions">
              <button
                type="button"
                className="version-action-btn"
                title="Duplicar"
                onClick={(e) => {
                  e.stopPropagation()
                  onDuplicate(v.id)
                }}
              >
                ⧉
              </button>
              <button
                type="button"
                className="version-action-btn"
                title="Renomear"
                onClick={(e) => {
                  e.stopPropagation()
                  startRename(v)
                }}
              >
                ✎
              </button>
              <button
                type="button"
                className="version-action-btn danger"
                title="Excluir"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(v.id)
                }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="version-sidebar-footer">
        <button type="button" className="btn primary save-version-btn" onClick={onSave}>
          Salvar versão atual
        </button>
      </div>
    </div>
  )
}
