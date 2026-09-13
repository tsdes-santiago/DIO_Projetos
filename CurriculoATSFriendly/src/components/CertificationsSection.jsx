import { Field, ItemActions, SectionCard } from './fields'
import { moveItem, blank } from '../utils'

export default function CertificationsSection({ data, onChange }) {
  const section = 'certifications'
  const list = data[section]

  const setList = (next) => onChange({ ...data, [section]: next })
  const updateItem = (id, field) => (value) =>
    setList(list.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
  const removeItem = (id) => setList(list.filter((i) => i.id !== id))
  const addItem = () => setList([...list, blank({ name: '', issuer: '', year: '' })])
  const move = (id, delta) => {
    const index = list.findIndex((i) => i.id === id)
    setList(moveItem(list, index, delta))
  }

  return (
    <SectionCard title="Certificações">
      {list.map((item) => (
        <div className="repeater-item" key={item.id}>
          <div className="field-row">
            <Field
              label="Certificação"
              value={item.name}
              placeholder="AWS Certified Developer"
              onChange={updateItem(item.id, 'name')}
            />
            <Field
              label="Emissor"
              value={item.issuer}
              placeholder="Amazon Web Services"
              onChange={updateItem(item.id, 'issuer')}
            />
            <Field
              label="Ano"
              value={item.year}
              placeholder="2023"
              onChange={updateItem(item.id, 'year')}
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
        + Adicionar certificação
      </button>
    </SectionCard>
  )
}