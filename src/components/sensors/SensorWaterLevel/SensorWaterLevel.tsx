import React from 'react'
import { GrafanaTheme2, Threshold } from '@grafana/data'
import { useStyles2, useTheme2 } from '@grafana/ui'
import { css } from 'emotion'
import { SensorData, SensorDataFramesConverter } from 'data/sensorDataFramesConverter/SensorDataFramesConverter'
import { DataFrameWithSettings } from 'data/types/DataFrameWithSettings'
import { FloorPlanOptions } from '../../../editor/FloorPlanEditor/FloorPlanOptions'
import { SensorOptions } from '../../../editor/SensorEditor/SensorOptions'

interface Props {
  dataFramesWithSettings: DataFrameWithSettings[]
  fill: string | undefined
  floorPlanOptions: FloorPlanOptions
  sensorOptions: SensorOptions
}

export const SensorWaterLevel: React.FC<Props> = ({
  dataFramesWithSettings,
  fill,
  floorPlanOptions,
  sensorOptions,
}) => {
  const styles = useStyles2(getStyles)
  const theme: GrafanaTheme2 = useTheme2()

  const strokeWidth = 1.5
  const { fontSize = 14, height = 0, x = 0, y = 0, width = 0 } = sensorOptions
  const { stroke: wallStroke } = floorPlanOptions
  const textX = width / 2
  const textY = 0
  const rectY = fontSize / 2

  let lastData: SensorData | undefined
  let lastDataFormatted: string | number = '-'
  let activeThreshold: Threshold = {
    color: theme.colors.text.disabled,
    value: 0,
  }

  const sensorDataFramesConverter: SensorDataFramesConverter = new SensorDataFramesConverter(dataFramesWithSettings)

  const setLastData = () => {
    const lastDataList = sensorDataFramesConverter.getLastDataList()

    if (lastDataList.length > 0) {
      lastData = lastDataList[0]
      lastDataFormatted = lastData.formattedValue
      activeThreshold = lastData.threshold
    }
  }

  setLastData()

  const getContent = () => {
    return (
      <g fill={fill} stroke={wallStroke} strokeWidth={strokeWidth} transform={`translate(${x}, ${y})`}>
        <rect
          className={styles.rect}
          x="0"
          y={rectY}
          width={width}
          height={height}
          strokeWidth={strokeWidth}
          stroke={wallStroke}
          fill={theme.v1.colors.bgBlue1}
        />
        <text
          className={styles.text(fontSize, activeThreshold.color)}
          x={textX}
          y={textY}
          stroke="none"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {lastDataFormatted}
        </text>
      </g>
    )
  }

  const getRender = () => {
    const content = getContent()

    if (sensorOptions.link) {
      return (
        <a className={styles.link} href={sensorOptions.link} target="_blank" rel="noreferrer">
          {content}
        </a>
      )
    }

    return content
  }

  return getRender()
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    text: (fontSize: number, thresholdColor: string) => css`
      fill: ${thresholdColor};
      font-size: ${fontSize}px;
    `,
    link: css`
      transition: transform 0.1s ease-in 0s;
      &:hover {
        transform: translate(-8px, -8px);
      }
    `,
    rect: css`
      transition: filter 0.1s ease-in 0s;
      a:hover & {
        filter: drop-shadow(8px 8px 4px);
      }
    `,
  }
}
