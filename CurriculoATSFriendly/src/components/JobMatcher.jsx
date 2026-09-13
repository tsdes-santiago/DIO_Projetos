import { useState } from 'react'

export default function JobMatcher({ jobText, onJobTextChange, analysis }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="form-card">
      <div
        className="form-section-header"
        onClick={() => setExpanded(!expanded)}
        style={{ cursor: 'pointer' }}
      >
        <h2 className="form-section-title" style={{ margin: 0 }}>
          {expanded ? '▼' : '▶'} Vaga de Emprego (Matchmaking)
        </h2>
      </div>
      {expanded && (
        <>
          <p className="job-matcher-hint">
            Cole a descrição da vaga para analisar a compatibilidade do seu currículo.
          </p>
          <div className="field">
            <textarea
              rows={8}
              placeholder={`Cole aqui a descrição completa da vaga...\n\nExemplo:\nEmpresa: TechCorp\nCargo: Engenheira de Software Sênior\n\nRequisitos:\n- Experiência com React, TypeScript e Node.js\n- Conhecimento em AWS e Docker\n- Experiência com CI/CD\n- Inglês avançado`}
              value={jobText}
              onChange={(e) => onJobTextChange(e.target.value)}
            />
          </div>
          {jobText && (
            <button
              type="button"
              className="btn btn-danger-sm"
              onClick={() => onJobTextChange('')}
            >
              Limpar vaga
            </button>
          )}

          {analysis && analysis.score > 0 && (
            <div className="job-matcher-stats">
              <div className="stat-row">
                <span className="stat-label">Score ATS:</span>
                <span
                  className="stat-value"
                  style={{
                    color:
                      analysis.score >= 70
                        ? '#16a34a'
                        : analysis.score >= 40
                          ? '#ca8a04'
                          : '#dc2626',
                  }}
                >
                  {analysis.score}%
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Keywords encontradas:</span>
                <span className="stat-value stat-found">{analysis.found.length}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Keywords faltantes:</span>
                <span className="stat-value stat-missing">{analysis.missing.length}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
