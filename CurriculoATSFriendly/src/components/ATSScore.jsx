import { useState } from 'react'

function ScoreBar({ label, value, color }) {
  return (
    <div className="score-bar-row">
      <div className="score-bar-header">
        <span className="score-bar-label">{label}</span>
        <span className="score-bar-value" style={{ color }}>{value}%</span>
      </div>
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  )
}

function SectionCard({ section }) {
  const getBarColor = (coverage) => {
    if (coverage >= 70) return '#16a34a'
    if (coverage >= 40) return '#ca8a04'
    return '#dc2626'
  }

  if (!section.hasContent) {
    return (
      <div className="ats-section-card empty">
        <div className="ats-section-header">
          <span className="ats-section-name">{section.name}</span>
          <span className="ats-section-badge badge-empty">Vazia</span>
        </div>
        <p className="ats-section-empty-msg">
          Esta seção está vazia. Preencha-a com informações relevantes para a vaga.
        </p>
      </div>
    )
  }

  return (
    <div className="ats-section-card">
      <div className="ats-section-header">
        <span className="ats-section-name">{section.name}</span>
        <span
          className="ats-section-badge"
          style={{
            background: getBarColor(section.coverage) + '20',
            color: getBarColor(section.coverage),
          }}
        >
          {section.found.length}/{section.found.length + section.missing.length} keywords
        </span>
      </div>
      <ScoreBar label="Cobertura" value={section.coverage} color={getBarColor(section.coverage)} />
      {section.found.length > 0 && (
        <div className="ats-section-keywords">
          <span className="ats-kw-label">Encontradas:</span>
          <div className="ats-kw-tags">
            {section.found.slice(0, 8).map((kw) => (
              <span key={kw} className="ats-tag found">{kw}</span>
            ))}
            {section.found.length > 8 && (
              <span className="ats-tag more">+{section.found.length - 8}</span>
            )}
          </div>
        </div>
      )}
      {section.missing.length > 0 && (
        <div className="ats-section-keywords">
          <span className="ats-kw-label">Faltantes:</span>
          <div className="ats-kw-tags">
            {section.missing.slice(0, 6).map((kw) => (
              <span key={kw} className="ats-tag missing">{kw}</span>
            ))}
            {section.missing.length > 6 && (
              <span className="ats-tag more">+{section.missing.length - 6}</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function SuggestionCard({ suggestion }) {
  const iconMap = {
    critical: '🔴',
    important: '🟡',
    tip: '🔵',
    success: '🟢',
  }

  const borderMap = {
    critical: '#fecaca',
    important: '#fef3c7',
    tip: '#dbeafe',
    success: '#dcfce7',
  }

  return (
    <div
      className="ats-suggestion-card"
      style={{ borderLeftColor: borderMap[suggestion.type] }}
    >
      <div className="ats-suggestion-header">
        <span className="ats-suggestion-icon">{iconMap[suggestion.type]}</span>
        <span className="ats-suggestion-title">{suggestion.title}</span>
      </div>
      <p className="ats-suggestion-desc">{suggestion.description}</p>
      <p className="ats-suggestion-action">💡 {suggestion.action}</p>
    </div>
  )
}

function ImprovedSummaryCard({ improvedSummary, potentialScore, currentScore, onApply }) {
  const [copied, setCopied] = useState(false)

  if (!improvedSummary) return null

  const scoreDiff = potentialScore - currentScore

  const handleCopy = () => {
    navigator.clipboard.writeText(improvedSummary.improved)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="ats-improved-summary">
      <div className="ats-improved-header">
        <span className="ats-improved-icon">✨</span>
        <span className="ats-improved-title">Resumo Melhorado</span>
        {scoreDiff > 0 && (
          <span className="ats-potential-badge">
            +{scoreDiff}% score potencial
          </span>
        )}
      </div>

      <div className="ats-improved-comparison">
        <div className="ats-improved-box original">
          <span className="ats-box-label">Atual ({improvedSummary.wordCount.before} palavras)</span>
          <p>{improvedSummary.original || '(vazio)'}</p>
        </div>
        <div className="ats-improved-arrow">→</div>
        <div className="ats-improved-box improved">
          <span className="ats-box-label">Melhorado ({improvedSummary.wordCount.after} palavras)</span>
          <p>{improvedSummary.improved}</p>
        </div>
      </div>

      {improvedSummary.keywordsAdded.length > 0 && (
        <div className="ats-improved-keywords">
          <span className="ats-kw-label">Palavras-chave adicionadas:</span>
          <div className="ats-kw-tags">
            {improvedSummary.keywordsAdded.map((kw) => (
              <span key={kw} className="ats-tag found">{kw}</span>
            ))}
          </div>
        </div>
      )}

      <div className="ats-improved-actions">
        <button type="button" className="btn primary btn-sm" onClick={onApply}>
          Aplicar resumo melhorado
        </button>
        <button type="button" className="btn btn-sm" onClick={handleCopy}>
          {copied ? '✓ Copiado!' : 'Copiar texto'}
        </button>
      </div>
    </div>
  )
}

export default function ATSScore({ analysis, onApplyImprovedSummary }) {
  const [activeTab, setActiveTab] = useState('overview')

  if (!analysis || analysis.score === 0) return null

  const getScoreColor = (score) => {
    if (score >= 70) return '#16a34a'
    if (score >= 40) return '#ca8a04'
    return '#dc2626'
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excelente'
    if (score >= 60) return 'Bom'
    if (score >= 40) return 'Regular'
    return 'Precisa melhorar'
  }

  const totalKeywords = analysis.found.length + analysis.missing.length
  const techInResume = analysis.technicalSkills.filter((ts) =>
    analysis.found.some(
      (f) => f.toLowerCase().includes(ts.toLowerCase()) || ts.toLowerCase().includes(f.toLowerCase())
    )
  )
  const techMissing = analysis.technicalSkills.filter((ts) =>
    analysis.missing.some(
      (m) => m.toLowerCase().includes(ts.toLowerCase()) || ts.toLowerCase().includes(m.toLowerCase())
    )
  )

  return (
    <div className="ats-score-panel">
      <div className="ats-score-header">
        <div className="ats-score-main">
          <div
            className="ats-score-circle"
            style={{ borderColor: getScoreColor(analysis.score) }}
          >
            <span className="ats-score-number" style={{ color: getScoreColor(analysis.score) }}>
              {analysis.score}
            </span>
            <span className="ats-score-unit">%</span>
          </div>
          <div className="ats-score-info">
            <span className="ats-score-label" style={{ color: getScoreColor(analysis.score) }}>
              {getScoreLabel(analysis.score)}
            </span>
            <span className="ats-score-sub">
              {analysis.found.length} de {totalKeywords} palavras-chave
            </span>
          </div>
        </div>

        {analysis.potentialScore > analysis.score && (
          <div className="ats-potential-score">
            <div className="ats-potential-label">Score potencial</div>
            <div className="ats-potential-value" style={{ color: getScoreColor(analysis.potentialScore) }}>
              {analysis.potentialScore}%
            </div>
            <div className="ats-potential-diff">
              +{analysis.potentialScore - analysis.score}%
            </div>
          </div>
        )}
      </div>

      <div className="ats-summary-text">
        {analysis.summary}
      </div>

      {analysis.improvedSummary && (
        <ImprovedSummaryCard
          improvedSummary={analysis.improvedSummary}
          potentialScore={analysis.potentialScore}
          currentScore={analysis.score}
          onApply={() => onApplyImprovedSummary(analysis.improvedSummary.improved)}
        />
      )}

      <div className="ats-tabs">
        <button
          type="button"
          className={`ats-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Visão Geral
        </button>
        <button
          type="button"
          className={`ats-tab ${activeTab === 'sections' ? 'active' : ''}`}
          onClick={() => setActiveTab('sections')}
        >
          Por Seção
        </button>
        <button
          type="button"
          className={`ats-tab ${activeTab === 'keywords' ? 'active' : ''}`}
          onClick={() => setActiveTab('keywords')}
        >
          Keywords
        </button>
        <button
          type="button"
          className={`ats-tab ${activeTab === 'suggestions' ? 'active' : ''}`}
          onClick={() => setActiveTab('suggestions')}
        >
          Sugestões ({analysis.suggestions.length})
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="ats-tab-content">
          <div className="ats-overview-grid">
            <div className="ats-overview-card">
              <div className="ats-overview-icon">🎯</div>
              <div className="ats-overview-value">{analysis.found.length}</div>
              <div className="ats-overview-label">Keywords encontradas</div>
            </div>
            <div className="ats-overview-card">
              <div className="ats-overview-icon">⚠️</div>
              <div className="ats-overview-value">{analysis.missing.length}</div>
              <div className="ats-overview-label">Keywords faltantes</div>
            </div>
            <div className="ats-overview-card">
              <div className="ats-overview-icon">⚙️</div>
              <div className="ats-overview-value">{techInResume.length}/{analysis.technicalSkills.length}</div>
              <div className="ats-overview-label">Skills técnicas</div>
            </div>
            <div className="ats-overview-card">
              <div className="ats-overview-icon">📋</div>
              <div className="ats-overview-value">{analysis.sections.filter((s) => s.hasContent).length}/{analysis.sections.length}</div>
              <div className="ats-overview-label">Seções preenchidas</div>
            </div>
          </div>

          {techMissing.length > 0 && (
            <div className="ats-tech-missing">
              <h4>⚙️ Tecnologias da vaga que não estão no currículo</h4>
              <div className="ats-kw-tags">
                {techMissing.map((kw) => (
                  <span key={kw} className="ats-tag missing">{kw}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'sections' && (
        <div className="ats-tab-content">
          {analysis.sections.map((section) => (
            <SectionCard key={section.name} section={section} />
          ))}
        </div>
      )}

      {activeTab === 'keywords' && (
        <div className="ats-tab-content">
          <div className="ats-keywords-section">
            <div className="ats-keyword-group">
              <h4>✅ Encontradas ({analysis.found.length})</h4>
              <div className="ats-keyword-tags">
                {analysis.found.map((kw) => (
                  <span key={kw} className="ats-tag found">{kw}</span>
                ))}
              </div>
            </div>
            <div className="ats-keyword-group">
              <h4>❌ Faltantes ({analysis.missing.length})</h4>
              <div className="ats-keyword-tags">
                {analysis.missing.map((kw) => (
                  <span key={kw} className="ats-tag missing">{kw}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'suggestions' && (
        <div className="ats-tab-content">
          {analysis.suggestions.length === 0 ? (
            <p className="ats-no-suggestions">
              Nenhuma sugestão adicional. Seu currículo está bem otimizado!
            </p>
          ) : (
            analysis.suggestions.map((s, i) => (
              <SuggestionCard key={i} suggestion={s} />
            ))
          )}
        </div>
      )}
    </div>
  )
}
