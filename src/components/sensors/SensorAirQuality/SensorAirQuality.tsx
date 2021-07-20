import React from 'react'
import { GrafanaTheme2, Threshold } from '@grafana/data'
import { useStyles2, useTheme2 } from '@grafana/ui'
import { css, cx, keyframes } from 'emotion'
import { SensorData, SensorDataFramesConverter } from 'data/sensorDataFramesConverter/SensorDataFramesConverter'
import { DataFrameWithSettings } from 'data/types/DataFrameWithSettings'
import { FloorPlanOptions } from '../../../editor/FloorPlanEditor/FloorPlanOptions'
import { Orientation, SensorOptions } from '../../../editor/SensorEditor/SensorOptions'

interface Props {
  dataFramesWithSettings: Array<DataFrameWithSettings>
  fill: string | undefined
  floorPlanOptions: FloorPlanOptions
  sensorOptions: SensorOptions
}

export const SensorAirQuality: React.FC<Props> = ({
  fill,
  floorPlanOptions,
  dataFramesWithSettings,
  sensorOptions,
}) => {
  const lineHeight = 1.2
  const pulseScale: number = 2.3
  const pulseSpeed: string = '3s'

  const styles = useStyles2(getStyles)
  const { radius = 0, fontSize = 14, x, y } = sensorOptions
  const theme = useTheme2()

  const pulseRadius: number = radius * pulseScale
  const pulseDiameter: number = pulseRadius * 2

  const isVerticallyCentered: boolean = sensorOptions.orientation === Orientation.Left || sensorOptions.orientation === Orientation.Right
  const isHorizontallyCentered: boolean = sensorOptions.orientation === Orientation.Top || sensorOptions.orientation === Orientation.Bottom

  const sensorDataFramesConverter: SensorDataFramesConverter = new SensorDataFramesConverter(dataFramesWithSettings)
  let lastDataList: Array<SensorData> = []
  let hasData: boolean = false
  let activeThreshold: Threshold = {
    color: theme.colors.text.disabled,
    value: 0
  }

  const setLastDataList = () => {
    lastDataList = sensorDataFramesConverter.getLastDataList() || []
    hasData = lastDataList.length > 0
  }

  const setActiveThreshold = () => {
    let priority
    let higherPriority = -Infinity

    lastDataList.forEach(lastData => {
      priority = lastData.threshold.priority || 0
      if (priority > higherPriority) {
        higherPriority = priority
        activeThreshold = lastData.threshold
      }
    })
  }

  setLastDataList()
  setActiveThreshold()
  const textLines = lastDataList.length

  const getDataValuesText = () => {
    let textY = 0
    let textX = 0

    const textClassName = cx(
      styles.text,
      {
        [styles.textCenterHorizontal]: isHorizontallyCentered,
        [styles.textCenterVertical(pulseRadius)]: isVerticallyCentered,
        [styles.textLeft(pulseRadius)]: sensorOptions.orientation === Orientation.Left,
        [styles.textTop(textLines, pulseRadius)]: sensorOptions.orientation === Orientation.Top
      })

    if (sensorOptions.orientation === Orientation.Bottom) {
      textY = pulseDiameter
    } else if (sensorOptions.orientation === Orientation.Right) {
      textX = pulseRadius + (pulseRadius / 2)
    }

    return (
      <text
        y={textY}
        className={textClassName}
      >
        {lastDataList.map((lastData, index) => {
          let dy = index > 0 ? `${lineHeight}em` : 0

          return (
            <tspan
              fill={lastData.threshold.color}
              x={textX}
              dy={dy}
            >
              {lastData.formattedValue}
            </tspan>
          )
        })}
      </text>
    )
  }

  return (
    <g
      className={styles.wrapper(fontSize)}
      fill={fill}
      stroke="none"
      transform={`translate(${x}, ${y})`}
    >
      <circle
        className={
          cx(styles.circle(activeThreshold.color),
          )}
        cx="0"
        cy="0"
        r={radius}
      />
      <circle
        className={
          cx(styles.disk1(activeThreshold.color, radius, pulseScale, pulseSpeed),
            {
              [styles.diskNoData]: !hasData
            }
          )}
        cx="0"
        cy="0"
        fill="none"
        r={pulseRadius}
        stroke-width="2"
      />
      <circle
        className={
          cx(styles.disk2(activeThreshold.color, radius, pulseScale, pulseSpeed),
            {
              [styles.diskNoData]: !hasData
            }
          )}
        cx="0"
        cy="0"
        fill="none"
        r={pulseRadius}
        stroke-width="2"
      />

      {getDataValuesText()}
    </g>
  )
}


const disk1Animation = (radius: number, pulseScale: number) => keyframes`
  0% {
    r: ${radius};
  }
  50% {
    r: ${radius * pulseScale};
    opacity: 1;
  }
  99% {
    opacity: 0;
  }
  100% {
    opacity: 0;
    r: ${radius * pulseScale};
  }
`

const disk2Animation = (radius: number, pulseScale: number) => keyframes`
  0% {
    opacity: 1;
  }
  40% {
    opacity: 0;
  }
  49.99% {
    r: ${radius * pulseScale};
    opacity: 0;
  }
  50% {
    r: ${radius};
    opacity: 1;
  }
  100% {
    r: ${radius * pulseScale};
    opacity: 1;
  }
`

const getStyles = (theme: GrafanaTheme2) => {
  return {
    wrapper: (fontSize: number) => css`
      font-size: ${fontSize}px;
    `,
    text: css`
      transform-box: fill-box;
    `,
    textTop: (textLines: number, circleRadius: number) => css`
      transform: translate(-50%, calc(-${textLines}em - ${circleRadius + (circleRadius / 2)}px));
    `,
    textLeft: (circleRadius: number) => css`
      transform: translate(calc(-100% - ${circleRadius + (circleRadius / 2)}px), calc(-50% + ${circleRadius}px));
    `,
    textCenterHorizontal: css`
      transform: translate(-50%, 0);
    `,
    textCenterVertical: (circleRadius: number) => css`
      transform: translate(0, calc(-50% + ${circleRadius}px));
    `,
    circle: (color: string) => css`
      fill: ${color};
    `,
    disk1: (color: string, radius: number, pulseScale: number, pulseSpeed: string) => css`
      r: ${radius};
      stroke: ${color};
      animation: ${disk1Animation(radius, pulseScale)} ${pulseSpeed} cubic-bezier(.39,.54,.41,1.5) infinite;
    `,
    disk2: (color: string, radius: number, pulseScale: number, pulseSpeed: string) => css`
      r: ${radius * pulseScale};
      stroke: ${color};
      animation: ${disk2Animation(radius, pulseScale)} ${pulseSpeed} cubic-bezier(.39,.54,.41,1.5) infinite;
    `,
    diskNoData: css`
      animation: none;
    `
  }
}
