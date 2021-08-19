import React from 'react'
import { GrafanaTheme2, Threshold } from '@grafana/data'
import { useStyles2, useTheme2 } from '@grafana/ui'
import { css, cx, keyframes } from 'emotion'
import { SensorData, SensorDataFramesConverter } from 'data/sensorDataFramesConverter/SensorDataFramesConverter'
import { DataFrameWithSettings } from 'data/types/DataFrameWithSettings'
import { FloorPlanOptions } from '../../../editor/FloorPlanEditor/FloorPlanOptions'
import { SensorOptions, Orientation, Side } from '../../../editor/SensorEditor/SensorOptions'
import { SensorDoorQuarterCircle } from './SensorDoorQuarterCircle'
import { SensorDoorView } from './SensorDoorView'
import { SensorDoorWallOverlay } from './SensorDoorWallOverlay'

interface Props {
  dataFramesWithSettings: DataFrameWithSettings[]
  fill: string | undefined
  floorPlanOptions: FloorPlanOptions
  sensorOptions: SensorOptions
}

export const SensorDoor: React.FC<Props> = ({ dataFramesWithSettings, fill, floorPlanOptions, sensorOptions }) => {
  const { height = 0, orientation = Orientation.Top, side = Side.Start, x = 0, y = 0, width = 0 } = sensorOptions
  const styles = useStyles2(getStyles)
  const theme: GrafanaTheme2 = useTheme2()
  const { strokeWidth: wallStrokeWidth = 0, stroke: wallStroke, fill: wallFill } = floorPlanOptions
  const doorWidth = wallStrokeWidth / 2
  const strokeWidth = 1
  const wallOverlayStrokeWidth = 0.5
  const offsetY = strokeWidth / 2
  const offsetX = strokeWidth / 2

  const sensorDataFramesConverter: SensorDataFramesConverter = new SensorDataFramesConverter(dataFramesWithSettings)

  let activeThreshold: Threshold = {
    color: theme.colors.text.disabled,
    value: 0,
  }
  let isDoorOpen = true
  let lastData: SensorData | undefined

  const setLastData = () => {
    const lastDataList = sensorDataFramesConverter.getLastDataList()

    if (lastDataList.length > 0) {
      lastData = lastDataList[0]
    }
  }

  const setIsDoorOpen = () => {
    isDoorOpen = lastData ? lastData.value === 1 : true
  }

  const setActiveThreshold = () => {
    if (lastData) {
      activeThreshold = lastData.threshold
    }
  }

  setLastData()
  setIsDoorOpen()
  setActiveThreshold()

  const getLinkHoverArea = () => {
    return <rect x={x} y={y} width={width} height={height} fill="transparent" stroke="none" />
  }

  const getContent = () => {
    return (
      <g fill={fill} stroke={wallStroke} strokeWidth={strokeWidth} transform={`translate(${x}, ${y})`}>
        <SensorDoorWallOverlay
          doorWidth={doorWidth}
          fill={wallFill}
          height={height}
          offsetX={offsetX}
          orientation={orientation}
          side={side}
          strokeWidth={wallOverlayStrokeWidth}
          wallStrokeWidth={wallStrokeWidth}
          width={width}
        />
        <g className={cx(styles.groupDoor(activeThreshold.color))}>
          <SensorDoorView
            doorWidth={doorWidth}
            height={height}
            isOpen={isDoorOpen}
            offsetX={offsetX}
            offsetY={offsetY}
            orientation={orientation}
            side={side}
            wallStrokeWidth={wallStrokeWidth}
            width={width}
          />
          <SensorDoorQuarterCircle
            doorWidth={doorWidth}
            height={height}
            isOpen={isDoorOpen}
            offsetX={offsetX}
            offsetY={offsetY}
            orientation={orientation}
            side={side}
            wallStrokeWidth={wallStrokeWidth}
            width={width}
          />
        </g>
      </g>
    )
  }

  const getRender = () => {
    const content = getContent()

    if (sensorOptions.link) {
      return (
        <a className={styles.link} href={sensorOptions.link} target="_blank" rel="noreferrer">
          {getLinkHoverArea()}
          {content}
        </a>
      )
    }

    return content
  }

  return getRender()
}

const doorBreathing = keyframes`
  0% {
    drop-shadow(0px 0px 2px) drop-shadow(0px 0px 6px);
  }

  70% {
    filter: drop-shadow(0px 0px 2px) drop-shadow(0px 0px 6px) drop-shadow(0px 0px 7px);
  }

  100% {
    filter: drop-shadow(0px 0px 2px) drop-shadow(0px 0px 6px) drop-shadow(0px 0px 9px);
  }
`

const getStyles = (theme: GrafanaTheme2) => {
  return {
    groupDoor: (thresholdColor: string) => css`
      animation: ${doorBreathing} 1.5s ease-in infinite alternate;
      color: ${thresholdColor};
    `,
    doorQuarterCircle: css`
      stroke-dasharray: 1;
      transition: stroke-dashoffset 1s ease-in;
    `,
    doorOpenQuarterCircle: css`
      stroke-dashoffset: 0;
    `,
    doorClosedQuarterCircle: css`
      stroke-dashoffset: 1;
    `,
    link: css`
      transition: filter 0.1s ease-in 0s, transform 0.1s ease-in 0s;
      &:hover {
        filter: drop-shadow(8px 8px 4px);
        transform: translate(-8px, -8px);
      }
    `,
  }
}
