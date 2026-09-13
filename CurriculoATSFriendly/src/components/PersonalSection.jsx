import { Field, SectionCard } from './fields'

export default function PersonalSection({ data, onChange }) {
  const p = data.personal
  const set = (field) => (value) =>
    onChange({ ...data, personal: { ...p, [field]: value } })

  return (
    <SectionCard title="Informações pessoais">
      <div className="field-row">
        <Field
          label="Nome completo"
          value={p.fullName}
          placeholder="Maria Oliveira"
          onChange={set('fullName')}
        />
        <Field
          label="Cargo pretendido"
          value={p.jobTitle}
          placeholder="Engenheira de Software"
          onChange={set('jobTitle')}
        />
      </div>
      <div className="field-row">
        <Field
          label="E-mail"
          type="email"
          value={p.email}
          placeholder="nome@email.com"
          onChange={set('email')}
        />
        <Field
          label="Telefone"
          value={p.phone}
          placeholder="(11) 98765-4321"
          onChange={set('phone')}
        />
      </div>
      <div className="field-row">
        <Field
          label="Cidade / Estado"
          value={p.location}
          placeholder="São Paulo, SP"
          onChange={set('location')}
        />
        <Field
          label="LinkedIn"
          value={p.linkedin}
          placeholder="linkedin.com/in/usuario"
          onChange={set('linkedin')}
        />
      </div>
      <Field
        label="Site / Portfólio"
        value={p.website}
        placeholder="meusite.com"
        onChange={set('website')}
      />
    </SectionCard>
  )
}