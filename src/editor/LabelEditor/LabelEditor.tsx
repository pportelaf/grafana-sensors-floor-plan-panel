import React from 'react'
import { GrafanaTheme2 } from '@grafana/data'
import { InlineField, useStyles2 } from '@grafana/ui'
import { css } from 'emotion'
import { LabelOptions } from './LabelOptions'
import { CustomColorPicker } from 'components/CustomColorPicker/CustomColorPicker'
import { InlineFieldInputGenerator } from 'components/utils/InlineFieldInputGenerator'

interface Props {
  onChange: (value?: LabelOptions) => void
  value: LabelOptions
}

export const LabelEditor: React.FC<Props> = ({ onChange, value }) => {
  const styles = useStyles2(getStyles)
  const inlineFieldInputGenerator: InlineFieldInputGenerator<LabelOptions> = new InlineFieldInputGenerator(
    value,
    onChange
  )

  const onChangeColor = (color: string) => {
    value.color = color
    onChange(value)
  }

  return (
    <div className={styles.wrapper}>
      {inlineFieldInputGenerator.getInlineFieldInput('Label y', 'number', 'y')}
      {inlineFieldInputGenerator.getInlineFieldInput('Font size', 'number', 'fontSize')}
      <InlineField className={styles.inlineFieldColorPicker} label="Color">
        <CustomColorPicker color={value.color} onChange={onChangeColor} />
      </InlineField>
    </div>
  )
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    wrapper: css`
      padding-top: ${theme.spacing(0.5)};
    `,
    inlineFieldColorPicker: css`
      align-items: center;
    `,
  }
}
