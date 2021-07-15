import React from 'react'
import { GrafanaTheme } from '@grafana/data'
import { useStyles, ColorPicker } from '@grafana/ui'
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
  const styles = useStyles(getStyles)

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

const getStyles = (theme: GrafanaTheme) => {
  const borderColor = theme.isDark ? theme.palette.white : theme.palette.black

  return {
    colorPickerWrapper: css`
      border: 1px solid ${borderColor};
      box-sizing: border-box;
      border-radius: 50%;
    `,
  }
}
