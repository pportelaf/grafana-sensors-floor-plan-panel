import React from 'react'
import { GrafanaTheme, Threshold } from '@grafana/data'
import { useStyles, useTheme } from '@grafana/ui'
import { css } from 'emotion'
import { SensorData, SensorDataFramesConverter } from 'data/sensorDataFramesConverter/SensorDataFramesConverter'
import { DataFrameWithSettings } from 'data/types/DataFrameWithSettings'
import { FloorPlanOptions } from '../../../editor/FloorPlanEditor/FloorPlanOptions'
import { SensorOptions } from '../../../editor/SensorEditor/SensorOptions'

interface Props {
    dataFramesWithSettings: Array<DataFrameWithSettings>
    fill: string | undefined
    floorPlanOptions: FloorPlanOptions
    sensorOptions: SensorOptions
}

export const SensorWaterLevel: React.FC<Props> = ({
    dataFramesWithSettings,
    fill,
    floorPlanOptions,
    sensorOptions
}) => {
    const styles = useStyles(getStyles)
    const theme = useTheme()

    const strokeWidth = 1.5
    const {
        fontSize = 14,
        height = 0,
        x = 0,
        y = 0,
        width = 0
    } = sensorOptions
    const { stroke: wallStroke } = floorPlanOptions
    const textX = width / 2
    const textY = 0
    const rectY = fontSize / 2

    let lastData: SensorData | undefined
    let lastDataFormatted: string | number = '-'
    let activeThreshold: Threshold = {
        color: theme.colors.linkDisabled,
        value: 0
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

    return (
        <g
            fill={fill}
            stroke={wallStroke}
            stroke-width={strokeWidth}
            transform={`translate(${x}, ${y})`}
        >
            <rect
                x="0"
                y={rectY}
                width={width}
                height={height}
                strokeWidth={strokeWidth}
                stroke={wallStroke}
                fill={theme.colors.bgBlue1}
            />
            <text
                className={styles.text(fontSize, activeThreshold.color)}
                x={textX}
                y={textY}
                stroke="none"
                textAnchor="middle"
                dominantBaseline="middle"
            >
                { lastDataFormatted }
            </text>
        </g>
    )
}

const getStyles = (theme: GrafanaTheme) => {
    return {
        text: (fontSize: number, thresholdColor: string) => css`
            fill: ${thresholdColor};
            font-size: ${fontSize}px;
        `,
      }
}