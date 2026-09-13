import { Field, ItemActions, SectionCard } from './fields'
import { moveItem, blank } from '../utils'

export default function EducationSection({ data, onChange }) {
  const section = 'education'
  const list = data[section]

  const setList = (next) => onChange({ ...data, [section]: next })
  const updateItem = (id, field) => (value) =>
    setList(list.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
  const removeItem = (id) => setList(list.filter((i) => i.id !== id))
  const addItem = () =>
    setList([
      ...list,
      blank({ degree: '', institution: '', startDate: '', endDate: '' }),
    ])
  const move = (id, delta) => {
    const index = list.findIndex((i) => i.id === id)
    setList(moveItem(list, index, delta))
  }

  return (
    <SectionCard title="Educação">
      {list.map((item) => (
        <div className="repeater-item" key={item.id}>
          <div className="field-row">
            <Field
              label="Curso / Grau"
              value={item.degree}
              placeholder="Bacharelado em Ciência da Computação"
              onChange={updateItem(item.id, 'degree')}
            />
            <Field
              label="Instituição"
              value={item.institution}
              placeholder="Universidade de São Paulo"
              onChange={updateItem(item.id, 'institution')}
            />
          </div>
          <div className="field-row compact">
            <Field
              label="Início"
              value={item.startDate}
              placeholder="2015"
              onChange={updateItem(item.id, 'startDate')}
            />
            <Field
              label="Fim"
              value={item.endDate}
              placeholder="2019"
              onChange={updateItem(item.id, 'endDate')}
            />
          </div>
          <ItemActions
            onUp={() => move(item.id, -1)}
            onDown={() => move(item.id, 1)}
            onRemove={() => removeItem(item.id)}
          />
        </div>
      ))}
      <button type="button" className="add-btn" onClick={addItem}>
        + Adicionar formação
      </button>
    </SectionCard>
  )
}