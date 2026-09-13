import { Field, TextArea, ItemActions, SectionCard } from './fields'
import { moveItem, blank } from '../utils'

export default function ExperienceSection({ data, onChange }) {
  const section = 'experiences'
  const list = data[section]

  const setList = (next) => onChange({ ...data, [section]: next })
  const updateItem = (id, field) => (value) =>
    setList(list.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
  const removeItem = (id) => setList(list.filter((i) => i.id !== id))
  const addItem = () =>
    setList([
      ...list,
      blank({
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
      }),
    ])
  const move = (id, delta) => {
    const index = list.findIndex((i) => i.id === id)
    setList(moveItem(list, index, delta))
  }

  return (
    <SectionCard title="Experiência profissional">
      {list.map((item, index) => (
        <div className="repeater-item" key={item.id}>
          <div className="field-row">
            <Field
              label="Cargo"
              value={item.jobTitle}
              placeholder="Engenheira de Software Sênior"
              onChange={updateItem(item.id, 'jobTitle')}
            />
            <Field
              label="Empresa"
              value={item.company}
              placeholder="TechCorp"
              onChange={updateItem(item.id, 'company')}
            />
          </div>
          <div className="field-row">
            <Field
              label="Local"
              value={item.location}
              placeholder="São Paulo, SP"
              onChange={updateItem(item.id, 'location')}
            />
            <div className="field-row compact">
              <Field
                label="Início"
                value={item.startDate}
                placeholder="2022"
                onChange={updateItem(item.id, 'startDate')}
              />
              <Field
                label="Fim"
                value={item.endDate}
                placeholder="Atual"
                onChange={updateItem(item.id, 'endDate')}
              />
            </div>
          </div>
          <TextArea
            label="Realizações (uma por linha)"
            value={item.description}
            rows={4}
            placeholder={'Implementei...\nReduzi...\nLiderei...'}
            onChange={updateItem(item.id, 'description')}
          />
          <ItemActions
            onUp={() => move(item.id, -1)}
            onDown={() => move(item.id, 1)}
            onRemove={() => removeItem(item.id)}
          />
          {index < list.length - 1 && <hr />}
        </div>
      ))}
      <button type="button" className="add-btn" onClick={addItem}>
        + Adicionar experiência
      </button>
    </SectionCard>
  )
}