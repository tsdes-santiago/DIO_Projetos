import { Field, ItemActions, SectionCard } from './fields'
import { moveItem, blank } from '../utils'

export default function LanguagesSection({ data, onChange }) {
  const section = 'languages'
  const list = data[section]

  const setList = (next) => onChange({ ...data, [section]: next })
  const updateItem = (id, field) => (value) =>
    setList(list.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
  const removeItem = (id) => setList(list.filter((i) => i.id !== id))
  const addItem = () => setList([...list, blank({ name: '', level: '' })])
  const move = (id, delta) => {
    const index = list.findIndex((i) => i.id === id)
    setList(moveItem(list, index, delta))
  }

  return (
    <SectionCard title="Idiomas">
      {list.map((item) => (
        <div className="field-row" key={item.id}>
          <Field
            label="Idioma"
            value={item.name}
            placeholder="Inglês"
            onChange={updateItem(item.id, 'name')}
          />
          <Field
            label="Nível"
            value={item.level}
            placeholder="Avançado"
            onChange={updateItem(item.id, 'level')}
          />
          <ItemActions
            onUp={() => move(item.id, -1)}
            onDown={() => move(item.id, 1)}
            onRemove={() => removeItem(item.id)}
          />
        </div>
      ))}
      <button type="button" className="add-btn" onClick={addItem}>
        + Adicionar idioma
      </button>
    </SectionCard>
  )
}