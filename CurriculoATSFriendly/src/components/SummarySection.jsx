import { TextArea, SectionCard } from './fields'

export default function SummarySection({ data, onChange }) {
  return (
    <SectionCard title="Resumo profissional">
      <TextArea
        value={data.summary}
        rows={4}
        placeholder="Breve parágrafo com suas principais competências e objetivos profissionais."
        onChange={(v) => onChange({ ...data, summary: v })}
      />
    </SectionCard>
  )
}