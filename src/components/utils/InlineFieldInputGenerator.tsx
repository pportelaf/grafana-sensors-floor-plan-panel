import React from 'react'
import { InlineFieldInput } from 'components/forms/InlineFieldInput/InlineFieldInput'

export class InlineFieldInputGenerator<T> {
  private objectBase: T
  private objectBaseIndexable: { [key: string]: any }
  private onChange: (value?: any | undefined) => void

  constructor(objectBase: T, onChange: (value?: T | undefined) => void) {
    this.objectBase = objectBase
    this.objectBaseIndexable = objectBase as { [key: string]: any }
    this.onChange = onChange
  }

  public getInlineFieldInput(label: string, type: string, valuePath: string) {
    return (
      <InlineFieldInput
        label={label}
        onChange={({ target }: any) => {
          let newValue = target.value

          if (type === 'number') {
            newValue = this.getNumberFromTargetValue(newValue)
          }

          this.objectBaseIndexable[valuePath] = newValue
          this.onChange(this.objectBase)
        }}
        type={type}
        value={this.objectBaseIndexable[valuePath]}
      />
    )
  }

  private getNumberFromTargetValue(value: any) {
    return (value === undefined || value === '') ? undefined : Number(value)
  }
}
