import { useRef, useState, useEffect } from 'react'
import ResumePreview from './components/ResumePreview'
import PersonalSection from './components/PersonalSection'
import SummarySection from './components/SummarySection'
import ExperienceSection from './components/ExperienceSection'
import EducationSection from './components/EducationSection'
import SkillsSection from './components/SkillsSection'
import LanguagesSection from './components/LanguagesSection'
import CertificationsSection from './components/CertificationsSection'
import JobMatcher from './components/JobMatcher'
import ATSScore from './components/ATSScore'
import VersionSidebar from './components/VersionSidebar'
import { sampleResume, emptyResume, sampleJobDescription } from './data'
import { analyzeATSWithImprovedSummary } from './utils/atsAnalyzer'
import { exportPDF } from './utils/pdfExport'
import {
  saveResume,
  loadResume,
  saveVersions,
  loadVersions,
} from './utils/storage'
import './App.css'

let versionIdCounter = Date.now()
const vid = () => `ver-${versionIdCounter++}`

function Toolbar({ onLoadSample, onClear, onExport, onImport, onDownloadPdf }) {
  const fileRef = useRef(null)
  return (
    <header className="toolbar">
      <h1>Gerador de Currículo ATS-Friendly</h1>
      <div className="toolbar-actions">
        <button type="button" className="btn" onClick={onLoadSample}>
          Carregar exemplo
        </button>
        <button type="button" className="btn" onClick={onClear}>
          Limpar
        </button>
        <button type="button" className="btn" onClick={onExport}>
          Exportar JSON
        </button>
        <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
          Importar JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={(e) => {
            onImport(e.target.files[0])
            e.target.value = ''
          }}
        />
        <button type="button" className="btn primary" onClick={onDownloadPdf}>
          Baixar PDF
        </button>
      </div>
    </header>
  )
}

function App() {
  const [data, setData] = useState(() => loadResume() || sampleResume)
  const [jobText, setJobText] = useState(() => loadResume() ? '' : sampleJobDescription)
  const [versions, setVersions] = useState(() => loadVersions())
  const [activeVersionId, setActiveVersionId] = useState(null)
  const [status, setStatus] = useState(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const previewRef = useRef(null)

  const analysis = analyzeATSWithImprovedSummary(data, jobText)

  useEffect(() => {
    const timer = setTimeout(() => saveResume(data), 1000)
    return () => clearTimeout(timer)
  }, [data])

  useEffect(() => {
    saveVersions(versions)
  }, [versions])

  const notify = (msg) => {
    setStatus(msg)
    window.setTimeout(() => setStatus(null), 3000)
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'curriculo.json'
    a.click()
    URL.revokeObjectURL(url)
    notify('JSON exportado.')
  }

  const handleImport = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        setData(parsed)
        notify('Currículo importado.')
      } catch {
        notify('Arquivo inválido.')
      }
    }
    reader.readAsText(file)
  }

  const handleDownloadPdf = async () => {
    if (!previewRef.current) return
    try {
      notify('Gerando PDF...')
      const name = data.personal?.fullName || 'curriculo'
      const filename = `${name.toLowerCase().replace(/\s+/g, '_')}_ats.pdf`
      await exportPDF(previewRef.current, filename)
      notify('PDF baixado com sucesso!')
    } catch (err) {
      console.error(err)
      notify('Erro ao gerar PDF. Tente novamente.')
    }
  }

  const handleApplyImprovedSummary = (improvedText) => {
    setData((prev) => ({ ...prev, summary: improvedText }))
    notify('Resumo melhorado aplicado!')
  }

  const handleSaveVersion = () => {
    const name = prompt('Nome da versão:', `Versão ${versions.length + 1}`)
    if (!name) return
    const version = {
      id: vid(),
      name,
      data: structuredClone(data),
      jobText,
      score: analysis.score,
      createdAt: new Date().toISOString(),
    }
    setVersions((prev) => [...prev, version])
    setActiveVersionId(version.id)
    notify(`Versão "${name}" salva!`)
  }

  const handleSelectVersion = (id) => {
    const v = versions.find((v) => v.id === id)
    if (!v) return
    setData(structuredClone(v.data))
    setJobText(v.jobText || '')
    setActiveVersionId(id)
    notify(`Versão "${v.name}" carregada.`)
  }

  const handleDuplicateVersion = (id) => {
    const v = versions.find((v) => v.id === id)
    if (!v) return
    const newVersion = {
      id: vid(),
      name: `${v.name} (cópia)`,
      data: structuredClone(v.data),
      jobText: v.jobText,
      score: v.score,
      createdAt: new Date().toISOString(),
    }
    setVersions((prev) => [...prev, newVersion])
    notify(`Versão duplicada.`)
  }

  const handleRenameVersion = (id, newName) => {
    setVersions((prev) =>
      prev.map((v) => (v.id === id ? { ...v, name: newName } : v))
    )
  }

  const handleDeleteVersion = (id) => {
    if (!confirm('Excluir esta versão?')) return
    setVersions((prev) => prev.filter((v) => v.id !== id))
    if (activeVersionId === id) setActiveVersionId(null)
    notify('Versão excluída.')
  }

  const handleNewVersion = () => {
    setData(structuredClone(emptyResume))
    setJobText('')
    setActiveVersionId(null)
    notify('Novo currículo iniciado.')
  }

  return (
    <div className="app">
      <Toolbar
        onLoadSample={() => {
          setData(structuredClone(sampleResume))
          setJobText(sampleJobDescription)
        }}
        onClear={() => {
          setData(structuredClone(emptyResume))
          setJobText('')
        }}
        onExport={handleExport}
        onImport={handleImport}
        onDownloadPdf={handleDownloadPdf}
      />
      {status && <div className="status">{status}</div>}
      <main className="layout with-sidebar">
        <div className="sidebar-area">
          <button
            type="button"
            className="sidebar-toggle"
            onClick={() => setShowSidebar(!showSidebar)}
            title={showSidebar ? 'Ocultar versões' : 'Mostrar versões'}
          >
            {showSidebar ? '◀' : '▶'}
          </button>
          {showSidebar && (
            <VersionSidebar
              versions={versions}
              activeVersionId={activeVersionId}
              onSelect={handleSelectVersion}
              onSave={handleSaveVersion}
              onDuplicate={handleDuplicateVersion}
              onRename={handleRenameVersion}
              onDelete={handleDeleteVersion}
              onNew={handleNewVersion}
            />
          )}
        </div>
        <aside className="panel form-panel">
          <JobMatcher
            jobText={jobText}
            onJobTextChange={setJobText}
            analysis={analysis}
          />
          <ATSScore analysis={analysis} onApplyImprovedSummary={handleApplyImprovedSummary} />
          <PersonalSection data={data} onChange={setData} />
          <SummarySection data={data} onChange={setData} />
          <ExperienceSection data={data} onChange={setData} />
          <EducationSection data={data} onChange={setData} />
          <SkillsSection data={data} onChange={setData} />
          <LanguagesSection data={data} onChange={setData} />
          <CertificationsSection data={data} onChange={setData} />
        </aside>
        <aside className="panel preview-panel">
          <ResumePreview data={data} ref={previewRef} />
        </aside>
      </main>
    </div>
  )
}

export default App
