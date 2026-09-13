import { useState } from 'react'
import { SectionCard } from './fields'

export default function SkillsSection({ data, onChange }) {
  const [draft, setDraft] = useState('')
  const skills = data.skills

  const addSkill = () => {
    const value = draft.trim()
    if (!value || skills.includes(value)) return
    onChange({ ...data, skills: [...skills, value] })
    setDraft('')
  }

  const removeSkill = (skill) =>
    onChange({ ...data, skills: skills.filter((s) => s !== skill) })

  return (
    <SectionCard title="Habilidades">
      <div className="tag-input">
        <input
          value={draft}
          placeholder="Ex.: JavaScript"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addSkill()
            }
          }}
        />
        <button type="button" className="add-btn" onClick={addSkill}>
          + Adicionar
        </button>
      </div>
      <div className="tags">
        {skills.map((skill) => (
          <span className="tag" key={skill}>
            {skill}
            <button type="button" onClick={() => removeSkill(skill)}>
              &times;
            </button>
          </span>
        ))}
      </div>
    </SectionCard>
  )
}