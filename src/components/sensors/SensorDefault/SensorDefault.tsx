import React from 'react'
import { GrafanaTheme2, Threshold } from '@grafana/data'
import { useStyles2, useTheme2 } from '@grafana/ui'
import { css, cx, keyframes } from 'emotion'
import { SensorData, SensorDataFramesConverter } from 'data/sensorDataFramesConverter/SensorDataFramesConverter'
import { DataFrameWithSettings } from 'data/types/DataFrameWithSettings'
import { FloorPlanOptions } from '../../../editor/FloorPlanEditor/FloorPlanOptions'
import { Orientation, SensorOptions } from '../../../editor/SensorEditor/SensorOptions'

interface Props {
  dataFramesWithSettings: DataFrameWithSettings[]
  fill: string | undefined
  floorPlanOptions: FloorPlanOptions
  sensorOptions: SensorOptions
}

export const SensorDefault: React.FC<Props> = ({ fill, floorPlanOptions, dataFramesWithSettings, sensorOptions }) => {
  const lineHeight = 1.2
  const pulseScale = 2.3
  const pulseSpeed = '3s'

  const styles = useStyles2(getStyles)
  const { radius = 0, fontSize = 14, x = 0, y = 0 } = sensorOptions
  const theme = useTheme2()

  const pulseRadius: number = radius * pulseScale
  const pulseDiameter: number = pulseRadius * 2

  const isVerticallyCentered: boolean =
    sensorOptions.orientation === Orientation.Left || sensorOptions.orientation === Orientation.Right

  const isHorizontallyCentered: boolean =
    sensorOptions.orientation === Orientation.Top || sensorOptions.orientation === Orientation.Bottom

  const sensorDataFramesConverter: SensorDataFramesConverter = new SensorDataFramesConverter(dataFramesWithSettings)
  let lastDataList: SensorData[] = []
  let hasData = false
  let activeThreshold: Threshold = {
    color: theme.colors.text.disabled,
    value: 0,
  }

  const setLastDataList = () => {
    lastDataList = sensorDataFramesConverter.getLastDataList() || []
    hasData = lastDataList.length > 0
  }

  const setActiveThreshold = () => {
    let priority
    let higherPriority = -Infinity

    lastDataList.forEach((lastData) => {
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

  const getCircles = () => {
    return (
      <g className={styles.circleWrapperWithLink}>
        <circle className={cx(styles.circle(activeThreshold.color))} cx="0" cy={pulseRadius} r={radius} />

        <circle
          className={cx(styles.disk1(activeThreshold.color, radius, pulseScale, pulseSpeed), {
            [styles.diskNoData]: !hasData,
          })}
          cx="0"
          cy={pulseRadius}
          fill="none"
          r={pulseRadius}
          strokeWidth="2"
        />

        <circle
          className={cx(styles.disk2(activeThreshold.color, radius, pulseScale, pulseSpeed), {
            [styles.diskNoData]: !hasData,
          })}
          cx="0"
          cy={pulseRadius}
          fill="none"
          r={pulseRadius}
          strokeWidth="2"
        />
      </g>
    )
  }

  const getDataValuesText = () => {
    let textY = 0
    let textX = 0

    const textClassName = cx(styles.text, {
      [styles.textCenterHorizontal]: isHorizontallyCentered,
      [styles.textCenterVertical(pulseDiameter)]: isVerticallyCentered,
      [styles.textLeft(pulseRadius)]: sensorOptions.orientation === Orientation.Left,
      [styles.textTop(textLines, pulseRadius)]: sensorOptions.orientation === Orientation.Top,
    })

    if (sensorOptions.orientation === Orientation.Bottom) {
      textY = pulseDiameter + fontSize * lineHeight
    } else if (sensorOptions.orientation === Orientation.Right) {
      textX = pulseRadius + pulseRadius / 2
    }

    return (
      <text y={textY} className={textClassName}>
        {lastDataList.map((lastData, index) => {
          let dy = index > 0 ? `${lineHeight}em` : 0

          return (
            <tspan key={index} fill={lastData.threshold.color} x={textX} dy={dy}>
              {lastData.formattedValue}
            </tspan>
          )
        })}
      </text>
    )
  }

  const getLinkHoverArea = () => {
    const areaWidth = pulseDiameter + 20

    return (
      <rect
        x={x - areaWidth / 2}
        y={y - areaWidth / 2}
        width={areaWidth}
        height={areaWidth}
        fill="transparent"
        stroke="none"
      />
    )
  }

  const getContent = () => {
    return (
      <g className={styles.wrapper(fontSize)} fill={fill} stroke="none" transform={`translate(${x}, ${y})`}>
        {getCircles()}

        {getDataValuesText()}
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
    link: css`
      transition: transform 0.1s ease-in 0s;
      &:hover {
        transform: translate(-8px, -8px);
      }
    `,
    wrapper: (fontSize: number) => css`
      font-size: ${fontSize}px;
    `,
    circleWrapperWithLink: css`
      transition: filter 0.1s ease-in 0s;
      a:hover & {
        filter: drop-shadow(8px 8px 4px);
      }
    `,
    circle: (color: string) => css`
      fill: ${color};
    `,
    disk1: (color: string, radius: number, pulseScale: number, pulseSpeed: string) => css`
      r: ${radius};
      stroke: ${color};
      animation: ${disk1Animation(radius, pulseScale)} ${pulseSpeed} cubic-bezier(0.39, 0.54, 0.41, 1.5) infinite;
    `,
    disk2: (color: string, radius: number, pulseScale: number, pulseSpeed: string) => css`
      r: ${radius * pulseScale};
      stroke: ${color};
      animation: ${disk2Animation(radius, pulseScale)} ${pulseSpeed} cubic-bezier(0.39, 0.54, 0.41, 1.5) infinite;
    `,
    diskNoData: css`
      animation: none;
    `,
    text: css`
      transform-box: fill-box;
    `,
    textTop: (textLines: number, circleRadius: number) => css`
      transform: translate(-50%, calc(-${textLines}em - ${circleRadius + circleRadius / 2}px));
    `,
    textLeft: (circleRadius: number) => css`
      transform: translate(calc(-100% - ${circleRadius + circleRadius / 2}px), calc(-50% + ${circleRadius}px));
    `,
    textCenterHorizontal: css`
      transform: translate(-50%, 0);
    `,
    textCenterVertical: (circleDiameter: number) => css`
      transform: translate(0, calc(-50% + ${circleDiameter}px));
    `,
  }
}
