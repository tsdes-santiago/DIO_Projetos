let idCounter = 1
export const uid = () => `item-${idCounter++}`

export const emptyResume = {
  personal: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
  },
  summary: '',
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
}

export const sampleResume = {
  personal: {
    fullName: 'Maria Oliveira',
    jobTitle: 'Engenheira de Software',
    email: 'maria.oliveira@email.com',
    phone: '(11) 98765-4321',
    location: 'São Paulo, SP',
    linkedin: 'linkedin.com/in/mariaoliveira',
    website: 'mariaoliveira.dev',
  },
  summary:
    'Engenheira de software com 6 anos de experiência em desenvolvimento de aplicações web. Especialista em JavaScript, React e Node.js, com forte atuação em arquitetura de sistemas escaláveis e melhorias de performance. Busco contribuir em projetos de alto impacto com foco em qualidade de código e boas práticas de engenharia.',
  experiences: [
    {
      id: uid(),
      jobTitle: 'Engenheira de Software Sênior',
      company: 'TechCorp',
      location: 'São Paulo, SP',
      startDate: '2022',
      endDate: 'Atual',
      description:
        'Liderei o desenvolvimento de uma plataforma de pagamentos utilizada por mais de 2 milhões de usuários, reduzindo o tempo de resposta das APIs em 40%.\nCoordenar equipes de 5 desenvolvedores na implementação de CI/CD, aumentando a frequência de deploys em 3x.\nImplementei testes automatizados que reduziram bugs em produção em 60%.',
    },
    {
      id: uid(),
      jobTitle: 'Desenvolvedora Front-end',
      company: 'StartupX',
      location: 'Remoto',
      startDate: '2019',
      endDate: '2022',
      description:
        'Desenvolvi interfaces responsivas com React e TypeScript para produtos de fintech.\nColaborei com design e produto para implementar um design system reutilizável.\nMelhorei a performance da aplicação principal, atingindo nota 95+ no Lighthouse.',
    },
  ],
  education: [
    {
      id: uid(),
      degree: 'Bacharelado em Ciência da Computação',
      institution: 'Universidade de São Paulo (USP)',
      startDate: '2015',
      endDate: '2019',
    },
  ],
  skills: [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'PostgreSQL',
    'AWS',
    'Docker',
    'Git',
  ],
  languages: [
    { id: uid(), name: 'Português', level: 'Nativo' },
    { id: uid(), name: 'Inglês', level: 'Avançado' },
  ],
  certifications: [
    { id: uid(), name: 'AWS Certified Developer', issuer: 'Amazon Web Services', year: '2023' },
    { id: uid(), name: 'Professional Scrum Master', issuer: 'Scrum.org', year: '2022' },
  ],
}

export const sampleJobDescription = `Empresa: CloudScale Technologies
Cargo: Engenheira de Software Sênior (Front-end)

Sobre a vaga:
Estamos buscando uma Engenheira de Software Sênior para liderar o desenvolvimento de nossa plataforma SaaS de análise de dados. O time é distribuído e trabalha com metodologia ágil.

Requisitos obrigatórios:
- Experiência sólida com JavaScript e TypeScript
- Experiência avançada com React ou Vue.js
- Conhecimento em Node.js e APIs REST
- Experiência com AWS (EC2, S3, Lambda)
- Docker e Kubernetes
- CI/CD com GitHub Actions ou Jenkins
- PostgreSQL ou MongoDB
- Git e code review
- Inglês intermediário/avançado

Diferenciais:
- Experiência com Next.js
- Conhecimento em GraphQL
- Experiência com Testes automatizados (Jest, Cypress)
- Scrum / Kanban
- Microserviços
- Cloud computing (GCP ou Azure)
- Machine learning ou data science
- Kafka ou RabbitMQ
- Terraform

Responsabilidades:
- Desenvolver e manter componentes React escaláveis
- Colaborar com design e produto para definição de requisitos
- Participar de code review e mentoria de desenvolvedores júnior
- Implementar boas práticas de performance e acessibilidade
- Trabalhar com CI/CD e infraestrutura como código
- Documentar decisões técnicas e processos

Benefícios:
- Salário competitivo
- Trabalho remoto
- Plano de saúde e odontológico
- VR/VA
- Auxílio home office`