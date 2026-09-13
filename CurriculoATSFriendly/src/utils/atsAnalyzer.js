const STOP_WORDS = new Set([
  'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas',
  'para', 'por', 'com', 'um', 'uma', 'os', 'as', 'que', 'e', 'ou',
  'a', 'o', 'e', 'se', 'ao', 'aos', 'à', 'às', 'pelo', 'pela',
  'este', 'esta', 'estes', 'estas', 'esse', 'essa', 'esses', 'essas',
  'aquele', 'aquela', 'aqueles', 'aquelas', 'isso', 'isto', 'aquilo',
  'foi', 'ser', 'sao', 'são', 'está', 'esta', 'estão', 'estas',
  'ter', 'tem', 'tinha', 'tiveram', 'havia', 'haviam',
  'como', 'mais', 'mas', 'muito', 'bem', 'tambem', 'também',
  'sobre', 'entre', 'ate', 'até', 'desde', 'por', 'sem',
  'nosso', 'nossa', 'nossos', 'nossas', 'meu', 'minha', 'meus', 'minhas',
  'seu', 'sua', 'seus', 'suas', 'dele', 'dela', 'deles', 'delas',
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to',
  'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are',
  'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did',
  'will', 'would', 'could', 'should', 'may', 'might', 'shall', 'can',
  'this', 'that', 'these', 'those', 'it', 'its', 'they', 'them',
  'their', 'we', 'us', 'our', 'you', 'your', 'he', 'she', 'him',
  'her', 'his', 'my', 'me', 'not', 'no', 'if', 'then', 'than',
  'too', 'very', 'just', 'about', 'also', 'into', 'each', 'all',
  'any', 'both', 'few', 'more', 'most', 'other', 'some', 'such',
  'only', 'own', 'same', 'so', 'than', 'what', 'which', 'who',
  'whom', 'when', 'where', 'why', 'how', 'while', 'during',
])

function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s#+.]/g, ' ')
}

function extractWords(text) {
  const normalized = normalize(text)
  const tokens = normalized.split(/\s+/).filter(Boolean)
  return tokens.filter((t) => t.length > 2 && !STOP_WORDS.has(t))
}

function extractBigrams(words) {
  const bigrams = []
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(`${words[i]} ${words[i + 1]}`)
  }
  return bigrams
}

export function extractKeywords(jobText) {
  const words = extractWords(jobText)
  const bigrams = extractBigrams(words)
  const freq = {}

  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1
  }
  for (const b of bigrams) {
    freq[b] = (freq[b] || 0) + 1.5
  }

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word)
}

export function extractTechnicalSkills(jobText) {
  const techPatterns = [
    'javascript', 'typescript', 'python', 'java', 'c#', 'c\\+\\+', 'ruby',
    'php', 'swift', 'kotlin', 'go', 'rust', 'scala', 'r', 'sql',
    'react', 'angular', 'vue', 'vue\\.js', 'next\\.?js', 'nuxt', 'svelte',
    'node\\.?js', 'express', 'nestjs', 'django', 'flask', 'fastapi', 'spring',
    'ruby on rails', 'rails', 'laravel', 'symfony', 'asp\\.net',
    'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap',
    'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'k8s',
    'terraform', 'ansible', 'jenkins', 'ci/cd', 'github actions',
    'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb',
    'oracle', 'sql server', 'sqlite', 'cassandra', 'neo4j',
    'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence',
    'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator',
    'machine learning', 'ml', 'deep learning', 'tensorflow', 'pytorch',
    'nlp', 'computer vision', 'data science', 'big data', 'hadoop', 'spark',
    'kafka', 'rabbitmq', 'graphql', 'rest', 'restful', 'api', 'soap',
    'agile', 'scrum', 'kanban', 'jira', 'trello',
    'linux', 'unix', 'windows', 'macos', 'bash', 'powershell',
    'cybersecurity', 'segurança', 'firewall', 'penetration testing',
    'iot', 'internet das coisas', 'blockchain', 'cloud',
    'microservices', 'microserviços', 'serverless', 'lambda',
    'mlops', 'devops', 'sre', 'platform engineering',
    'data engineering', 'etl', 'airflow', 'dbt',
    'power bi', 'tableau', 'looker', 'grafana',
  ]

  const lower = jobText.toLowerCase()
  const found = []

  for (const pattern of techPatterns) {
    const regex = new RegExp(`\\b${pattern}\\b`, 'i')
    if (regex.test(lower)) {
      found.push(pattern.replace(/\\\+/g, '+').replace(/\\\./g, '.'))
    }
  }

  return [...new Set(found)]
}

function normalizeForMatch(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function findKeywordsInText(keywords, text) {
  const normalized = normalizeForMatch(text)
  return keywords.filter((kw) => {
    const kwNorm = normalizeForMatch(kw)
    return normalized.includes(kwNorm)
  })
}

function analyzeSection(sectionName, sectionText, technicalSkills, jobKeywords) {
  const allKeywords = [...new Set([...technicalSkills, ...jobKeywords.slice(0, 50)])]
  const found = findKeywordsInText(allKeywords, sectionText)
  const missing = allKeywords.filter((kw) => !found.includes(kw))
  const total = allKeywords.length || 1
  const coverage = Math.round((found.length / total) * 100)

  return {
    name: sectionName,
    found,
    missing,
    coverage,
    hasContent: sectionText.trim().length > 0,
  }
}

export function analyzeATS(resumeData, jobText) {
  if (!jobText || !jobText.trim()) {
    return {
      score: 0,
      found: [],
      missing: [],
      suggestions: [],
      technicalSkills: [],
      sections: [],
      summary: '',
    }
  }

  const jobKeywords = extractKeywords(jobText)
  const technicalSkills = extractTechnicalSkills(jobText)

  const fullResumeText = [
    resumeData.personal?.fullName || '',
    resumeData.personal?.jobTitle || '',
    resumeData.summary || '',
    ...resumeData.experiences.map(
      (e) => `${e.jobTitle} ${e.company} ${e.description}`
    ),
    ...resumeData.education.map((e) => `${e.degree} ${e.institution}`),
    ...resumeData.skills,
    ...resumeData.certifications.map((c) => `${c.name} ${c.issuer}`),
  ]
    .join(' ')

  const allKeywords = [...new Set([...technicalSkills, ...jobKeywords.slice(0, 50)])]
  const found = findKeywordsInText(allKeywords, fullResumeText)
  const missing = allKeywords.filter((kw) => !found.includes(kw))
  const total = allKeywords.length || 1
  const score = Math.round((found.length / total) * 100)

  const titleText = [
    resumeData.personal?.jobTitle || '',
    resumeData.summary || '',
  ].join(' ')

  const expText = resumeData.experiences
    .map((e) => `${e.jobTitle} ${e.company} ${e.description}`)
    .join(' ')

  const skillsText = resumeData.skills.join(' ')

  const eduText = resumeData.education
    .map((e) => `${e.degree} ${e.institution}`)
    .join(' ')

  const certText = resumeData.certifications
    .map((c) => `${c.name} ${c.issuer}`)
    .join(' ')

  const sections = [
    analyzeSection('Título e Resumo', titleText, technicalSkills, jobKeywords),
    analyzeSection('Experiência Profissional', expText, technicalSkills, jobKeywords),
    analyzeSection('Habilidades', skillsText, technicalSkills, jobKeywords),
    analyzeSection('Educação', eduText, technicalSkills, jobKeywords),
    analyzeSection('Certificações', certText, technicalSkills, jobKeywords),
  ]

  const suggestions = []

  const missingTechSkills = missing.filter((kw) =>
    technicalSkills.some((ts) => normalizeForMatch(ts) === normalizeForMatch(kw))
  )
  if (missingTechSkills.length > 0) {
    suggestions.push({
      type: 'critical',
      title: 'Habilidades técnicas faltantes',
      description: `Adicione estas tecnologias solicitadas pela vaga: ${missingTechSkills.join(', ')}`,
      action: 'Inclua na seção de Habilidades e mencione nos projetos de experiência',
    })
  }

  const missingSoftSkills = missing.filter(
    (kw) =>
      !technicalSkills.some((ts) => normalizeForMatch(ts) === normalizeForMatch(kw)) &&
      kw.length > 3
  )
  if (missingSoftSkills.length > 0) {
    suggestions.push({
      type: 'important',
      title: 'Palavras-chave ausentes',
      description: `Termos importantes da vaga não encontrados: ${missingSoftSkills.slice(0, 8).join(', ')}`,
      action: 'Incorpore esses termos no resumo profissional ou nas descrições de experiência',
    })
  }

  const summaryWords = (resumeData.summary || '').split(/\s+/).filter(Boolean).length
  if (summaryWords < 30) {
    suggestions.push({
      type: 'important',
      title: 'Resumo profissional muito curto',
      description: `Seu resumo tem apenas ${summaryWords} palavras. Um resumo robusto ajuda o ATS a identificar seu perfil.`,
      action: 'Escreva um resumo de 3-5 frases destacando suas principais competências e experiência',
    })
  }

  const expCount = resumeData.experiences.length
  if (expCount === 0) {
    suggestions.push({
      type: 'critical',
      title: 'Nenhuma experiência profissional',
      description: 'O currículo não possui experiências cadastradas. Isso reduz drasticamente a pontuação ATS.',
      action: 'Adicione suas experiências com descrições detalhadas usando palavras-chave da vaga',
    })
  }

  const hasLinkedIn = resumeData.personal?.linkedin?.trim()
  if (!hasLinkedIn) {
    suggestions.push({
      type: 'tip',
      title: 'LinkedIn não informado',
      description: 'Muitos recrutadores verificam o LinkedIn. Um perfil completo aumenta sua credibilidade.',
      action: 'Adicione o link do seu LinkedIn na seção de dados pessoais',
    })
  }

  const skillsCount = resumeData.skills.length
  if (skillsCount < 5) {
    suggestions.push({
      type: 'important',
      title: 'Poucas habilidades listadas',
      description: `Apenas ${skillsCount} habilidades cadastradas. ATSs buscam correspondência de palavras-chave nas skills.`,
      action: 'Adicione entre 8-15 habilidades relevantes para a vaga',
    })
  }

  if (score >= 70) {
    suggestions.push({
      type: 'success',
      title: 'Bom nível de compatibilidade',
      description: `Seu currículo atende ${score}% dos requisitos. Continue otimizando para vagas específicas.`,
      action: 'Revise as keywords faltantes e ajuste para cada nova vaga',
    })
  }

  const summaryText = generateSummary(score, found, missing, sections)

  return {
    score,
    found,
    missing,
    suggestions,
    technicalSkills,
    sections,
    summary: summaryText,
  }
}

export function generateImprovedSummary(resumeData, jobText) {
  if (!jobText || !jobText.trim()) return null

  const technicalSkills = extractTechnicalSkills(jobText)

  const currentSummary = resumeData.summary || ''
  const currentSummaryWords = currentSummary.split(/\s+/).filter(Boolean).length

  const jobTitle = resumeData.personal?.jobTitle || ''
  const experiences = resumeData.experiences || []
  const skills = resumeData.skills || []

  const missingTechFromSummary = technicalSkills.filter(
    (tech) => !normalizeForMatch(currentSummary).includes(normalizeForMatch(tech))
  )

  const missingTechFromSkills = technicalSkills.filter(
    (tech) => !skills.some((s) => normalizeForMatch(s).includes(normalizeForMatch(tech)))
  )

  const years = experiences.length > 0
    ? (() => {
      const years = new Set()
      experiences.forEach((e) => {
        const start = parseInt(e.startDate)
        const end = e.endDate === 'Atual' ? new Date().getFullYear() : parseInt(e.endDate)
        if (!isNaN(start) && !isNaN(end)) {
          for (let y = start; y <= end; y++) years.add(y)
        }
      })
      return years.size
    })()
    : 0

  const experienceCount = experiences.length

  const relevantTech = missingTechFromSummary.slice(0, 5)
  const relevantSkills = missingTechFromSkills.slice(0, 3)

  const mainRole = jobTitle || 'profissional'

  let improved = ''

  if (currentSummaryWords < 10) {
    improved = `Profissional com ${years > 0 ? `${years} anos de experiência` : 'experiência comprovada'} em ${mainRole}. `
    if (relevantTech.length > 0) {
      improved += `Domínio em ${relevantTech.join(', ')} `
      if (relevantSkills.length > 0) {
        improved += `e habilidades em ${relevantSkills.join(', ')}. `
      }
    }
    improved += `Experiência em ${experienceCount > 0 ? `${experienceCount} posições profissionais` : 'projetos desafiadores'}. `
    improved += 'Busco contribuir com soluções inovadoras e de alto impacto em equipes de tecnologia.'
  } else {
    improved = currentSummary.replace(/\.$/, '')

    if (relevantTech.length > 0) {
      const hasAnyTech = relevantTech.some((tech) =>
        normalizeForMatch(improved).includes(normalizeForMatch(tech))
      )
      if (!hasAnyTech) {
        improved += ` Experiência com ${relevantTech.join(', ')}`
      }
    }

    if (relevantSkills.length > 0) {
      const hasAnySkill = relevantSkills.some((skill) =>
        normalizeForMatch(improved).includes(normalizeForMatch(skill))
      )
      if (!hasAnySkill) {
        improved += `, com foco em ${relevantSkills.join(', ')}`
      }
    }

    improved += '.'
  }

  return {
    original: currentSummary,
    improved,
    keywordsAdded: [...new Set([...relevantTech, ...relevantSkills])],
    wordCount: {
      before: currentSummaryWords,
      after: improved.split(/\s+/).filter(Boolean).length,
    },
  }
}

export function analyzeATSWithImprovedSummary(resumeData, jobText) {
  const baseAnalysis = analyzeATS(resumeData, jobText)

  if (!jobText || !jobText.trim()) {
    return { ...baseAnalysis, improvedSummary: null, potentialScore: 0 }
  }

  const improvedData = generateImprovedSummary(resumeData, jobText)
  if (!improvedData) {
    return { ...baseAnalysis, improvedSummary: null, potentialScore: 0 }
  }

  const resumeWithImproved = {
    ...resumeData,
    summary: improvedData.improved,
  }

  const potentialAnalysis = analyzeATS(resumeWithImproved, jobText)

  return {
    ...baseAnalysis,
    improvedSummary: improvedData,
    potentialScore: potentialAnalysis.score,
  }
}

function generateSummary(score, found, missing, _sections) {
  const missingTech = missing.filter((kw) =>
    ['react', 'angular', 'vue', 'node', 'python', 'java', 'aws', 'docker',
     'kubernetes', 'typescript', 'javascript', 'sql', 'git', 'ci/cd',
     'agile', 'scrum', 'api', 'rest', 'graphql', 'mongodb', 'postgresql',
     'redis', 'linux', 'html', 'css', 'tailwind', 'bootstrap', 'next',
     'fastapi', 'django', 'spring', 'azure', 'gcp', 'terraform'].some(
      (t) => kw.toLowerCase().includes(t)
    )
  )

  if (score >= 80) {
    return `Excelente compatibilidade! Seu currículo atende ${score}% dos requisitos da vaga. `
      + `Encontradas ${found.length} palavras-chave relevantes. `
      + (missing.length > 0
        ? `Ajustes menores nas keywords "${missing.slice(0, 3).join('", "')}" podem elevar ainda mais.`
        : 'Seu currículo está muito bem otimizado para esta vaga!')
  }

  if (score >= 60) {
    return `Boa compatibilidade com ${score}% de correspondência. `
      + `${found.length} de ${found.length + missing.length} palavras-chave encontradas. `
      + `Foco: adicionar habilidades técnicas como "${missingTech.slice(0, 3).join('", "') || missing.slice(0, 3).join('", "')}" `
      + `e enriquecer o resumo com termos da vaga.`
  }

  if (score >= 40) {
    return `Compatibilidade moderada (${score}%). `
      + `${missing.length} palavras-chave importantes estão ausentes. `
      + `Priorize adicionar as tecnologias solicitadas e use os mesmos termos da vaga nas descrições. `
      + `A seção de Habilidades precisa de mais conteúdo técnico.`
  }

  return `Compatibilidade baixa (${score}%). `
    + `Seu currículo precisa de ajustes significativos para esta vaga. `
    + `${missing.length} palavras-chave faltando. `
    + `Revise a descrição da vaga e incorpore os termos-chave principais em todas as seções do currículo. `
    + `Comece pelas habilidades técnicas e depois expanda o resumo e as experiências.`
}
