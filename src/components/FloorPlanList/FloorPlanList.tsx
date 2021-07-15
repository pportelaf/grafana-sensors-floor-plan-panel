import React from 'react'
import { DataFrame, GrafanaTheme } from '@grafana/data'
import { css, cx } from 'emotion'
import { useStyles, useTheme } from '@grafana/ui'
import { CanvasOptions } from 'editor/CanvasEditor/CanvasOptions'
import { FloorPlanOptions } from 'editor/FloorPlanEditor/FloorPlanOptions'
import { FloorPlan } from '../FloorPlan/FloorPlan'

interface Props extends CanvasOptions {
  dataFrames: DataFrame[]
  debugMode: boolean
  value: Array<FloorPlanOptions>
}

export const FloorPlanList: React.FC<Props> = ({
  dataFrames,
  debugMode,
  height = 0,
  value,
  width = 0,
  zoom = 0
}) => {
  const theme = useTheme()
  const styles = useStyles(getStyles)
  const floorPlanOptions: Array<FloorPlanOptions> = value || []
  let svgDimensions = {}

  if (debugMode) {
    svgDimensions = {
      width: width * zoom / 100,
      height: height * zoom / 100
    }
  }

  const getFloorPlans = () => {
    return (
      <React.Fragment>
        {floorPlanOptions.map(floorPlanOptions => (
          <FloorPlan
              value={floorPlanOptions}
              dataFrames={dataFrames}
          />
        ))}
      </React.Fragment>
    )
  }

  const getDebugRect = () => {
    const rect = 
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="none"
        stroke={theme.colors.text}
        stroke-width="1"
      />

    return debugMode? rect : undefined
  }

  return (
      <svg
        className={cx(styles.svg, 
            { [styles.svgResponsive]: !debugMode },
        )}
        viewBox={`0 0 ${width} ${height}`}
        {...svgDimensions}
      >
        { getFloorPlans() }
        { getDebugRect() }
      </svg>
  )
}

const getStyles = (theme: GrafanaTheme) => ({
  wrapper: css`
    position: relative;
  `,
  svg: css`
    position: relative;
  `,
  svgResponsive: css `
    margin: auto;
    width: 100%;
    height: auto;
    max-height: 100%;
  `,
  farmPlan: css`
    width: 100%;
    height: 100%;
  `
})
  