import React from 'react'
import { GrafanaTheme2 } from '@grafana/data'
import { useStyles2, ColorPicker } from '@grafana/ui'
import { css } from 'emotion'

interface Props {
  color: string
  enableNamedColors?: boolean | undefined
  onChange: any
}


export const CustomColorPicker: React.FC<Props> = ({
  color,
  enableNamedColors,
  onChange
}) => {
  const styles = useStyles2(getStyles)

  return (
    <div className={styles.colorPickerWrapper}>
      <ColorPicker
        color={color}
        enableNamedColors={enableNamedColors}
        onChange={onChange}
      />
    </div>
  )
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    colorPickerWrapper: css`
      border: 1px solid ${theme.colors.border.strong};
      box-sizing: border-box;
      border-radius: 50%;
    `,
  }
}
