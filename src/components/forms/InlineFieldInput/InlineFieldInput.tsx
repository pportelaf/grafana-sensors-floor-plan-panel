import React from 'react'
import { Input, InlineField } from '@grafana/ui'

interface Props {
  label: string
  type: string
  value: string | number | readonly string[] | undefined
  onChange: React.FormEventHandler<HTMLInputElement>
}

export const InlineFieldInput: React.FC<Props> = ({ label, type, value, onChange }) => {
  return (
    <InlineField label={label}>
      <Input
        css=""
        placeholder={label}
        type={type}
        value={value}
        onChange={onChange}
      />
    </InlineField>
  )
}
