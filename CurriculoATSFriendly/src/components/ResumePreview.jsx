function ContactLine({ label, value, separator }) {
  if (!value) return null
  return (
    <span className="contact-item">
      {separator ? ` ${separator} ` : ''}
      <a href={label === 'email' ? `mailto:${value}` : `https://${value}`}>
        {value}
      </a>
    </span>
  )
}

function ExperienceItem({ item }) {
  return (
    <div className="resume-item">
      <div className="item-header">
        <span className="item-title">{item.jobTitle}</span>
        <span className="item-date">
          {item.startDate} – {item.endDate}
        </span>
      </div>
      <div className="item-sub">
        {[item.company, item.location].filter(Boolean).join(' | ')}
      </div>
      {item.description && (
        <ul className="item-bullets">
          {item.description
            .split('\n')
            .filter((line) => line.trim())
            .map((line, i) => (
              <li key={i}>{line}</li>
            ))}
        </ul>
      )}
    </div>
  )
}

function EducationItem({ item }) {
  return (
    <div className="resume-item">
      <div className="item-header">
        <span className="item-title">{item.degree}</span>
        <span className="item-date">
          {item.startDate} – {item.endDate}
        </span>
      </div>
      <div className="item-sub">{item.institution}</div>
    </div>
  )
}

import { forwardRef } from 'react'

const ResumePreview = forwardRef(function ResumePreview({ data }, ref) {
  const { personal, summary, experiences, education, skills, languages, certifications } =
    data
  const hasContent = personal.fullName || summary || experiences.length

  if (!hasContent) {
    return (
      <div className="preview-empty">
        <p>Preencha seus dados no formulário para ver o currículo aqui.</p>
      </div>
    )
  }

  return (
    <article ref={ref} className="resume" aria-label="Currículo">
      <header className="resume-header">
        <h1 className="resume-name">{personal.fullName || 'Seu Nome'}</h1>
        <div className="resume-role">{personal.jobTitle}</div>
        <div className="resume-contact">
          <ContactLine label="email" value={personal.email} />
          <ContactLine label="phone" value={personal.phone} separator="•" />
          <ContactLine label="location" value={personal.location} separator="•" />
          <ContactLine label="linkedin" value={personal.linkedin} separator="•" />
          <ContactLine label="website" value={personal.website} separator="•" />
        </div>
      </header>

      {summary && (
        <section className="resume-section">
          <h2 className="section-title">Resumo</h2>
          <p className="summary-text">{summary}</p>
        </section>
      )}

      {experiences.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">Experiência Profissional</h2>
          {experiences.map((item) => (
            <ExperienceItem key={item.id} item={item} />
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">Educação</h2>
          {education.map((item) => (
            <EducationItem key={item.id} item={item} />
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">Habilidades</h2>
          <p className="skills-list">{skills.join(' • ')}</p>
        </section>
      )}

      {languages.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">Idiomas</h2>
          {languages.map((lang) => (
            <div className="resume-item" key={lang.id}>
              <div className="item-header">
                <span className="item-title">{lang.name}</span>
                <span className="item-date">{lang.level}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {certifications.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">Certificações</h2>
          {certifications.map((cert) => (
            <div className="resume-item" key={cert.id}>
              <div className="item-header">
                <span className="item-title">{cert.name}</span>
                <span className="item-date">{cert.year}</span>
              </div>
              {cert.issuer && <div className="item-sub">{cert.issuer}</div>}
            </div>
          ))}
        </section>
      )}
    </article>
  )
})

export default ResumePreview