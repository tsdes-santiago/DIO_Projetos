const STORAGE_KEY = 'curriculo_ats_data'
const VERSIONS_KEY = 'curriculo_ats_versions'

export function saveResume(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('Erro ao salvar currículo:', e)
  }
}

export function loadResume() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveVersions(versions) {
  try {
    localStorage.setItem(VERSIONS_KEY, JSON.stringify(versions))
  } catch (e) {
    console.warn('Erro ao salvar versões:', e)
  }
}

export function loadVersions() {
  try {
    const raw = localStorage.getItem(VERSIONS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
