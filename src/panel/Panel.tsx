import React from 'react'
import { GrafanaTheme2, PanelProps } from '@grafana/data'
import { useStyles2 } from '@grafana/ui'
import { css, cx } from 'emotion'
import { PanelOptions } from 'panel/PanelOptions'
import { FloorPlanList } from '../components/FloorPlanList/FloorPlanList'

interface Props extends PanelProps<PanelOptions> {}

export const Panel: React.FC<Props> = ({ data, height, options, width }) => {
  const styles = useStyles2(getStyles)
  const floorPlanOptionsList = options.floorPlanOptionsList || []

  return (
    <div className={cx(styles.wrapper(width, height), { [styles.wrapperOverflow]: options.debugMode })}>
      <FloorPlanList
        dataFrames={data.series}
        debugMode={options.debugMode}
        height={options.canvasOptions?.height}
        value={floorPlanOptionsList}
        width={options.canvasOptions?.width}
        zoom={options.canvasOptions?.zoom}
      />
    </div>
  )
}

const getStyles = (theme: GrafanaTheme2) => ({
  wrapper: (width: number, height: number) => css`
    position: relative;
    width: ${width}px;
    height: ${height}px;
  `,
  wrapperOverflow: css`
    overflow: auto;
  `,
})
