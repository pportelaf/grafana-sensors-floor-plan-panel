import React from 'react'
import { GrafanaTheme, Threshold } from '@grafana/data'
import { useStyles, useTheme } from '@grafana/ui'
import { css, cx, keyframes } from 'emotion'
import { SensorData, SensorDataFramesConverter } from 'data/sensorDataFramesConverter/SensorDataFramesConverter'
import { DataFrameWithSettings } from 'data/types/DataFrameWithSettings'
import { FloorPlanOptions } from '../../../editor/FloorPlanEditor/FloorPlanOptions'
import { SensorOptions, Orientation, Side } from '../../../editor/SensorEditor/SensorOptions'
import { SensorDoorQuarterCircle } from './SensorDoorQuarterCircle'
import { SensorDoorView } from './SensorDoorView'
import { SensorDoorWallOverlay } from './SensorDoorWallOverlay'

interface Props {
    dataFramesWithSettings: Array<DataFrameWithSettings>
    fill: string | undefined
    floorPlanOptions: FloorPlanOptions
    sensorOptions: SensorOptions
}

export const SensorDoor: React.FC<Props> = ({
    dataFramesWithSettings,
    fill,
    floorPlanOptions,
    sensorOptions,
}) => {
    const {
        height = 0,
        orientation = Orientation.Top,
        side = Side.Start,
        x = 0,
        y = 0,
        width = 0
    } = sensorOptions
    const styles = useStyles(getStyles)
    const theme: GrafanaTheme = useTheme()
    const { strokeWidth: wallStrokeWidth = 0, stroke: wallStroke, fill: wallFill } = floorPlanOptions
    const doorWidth = wallStrokeWidth / 2
    const strokeWidth = 1
    const wallOverlayStrokeWidth = 0.5
    const offsetY = strokeWidth / 2
    const offsetX = strokeWidth / 2

    const sensorDataFramesConverter: SensorDataFramesConverter = new SensorDataFramesConverter(dataFramesWithSettings)
    
    let activeThreshold: Threshold = {
        color: theme.colors.linkDisabled,
        value: 0
    }
    let isDoorOpen: boolean = true
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

    return (
        <g
            fill={fill}
            stroke={wallStroke}
            stroke-width={strokeWidth}
            transform={`translate(${x}, ${y})`}
        >
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
            <g
                className={cx(
                    { [styles.groupDoorOpen(activeThreshold.color) ]: (isDoorOpen && !!lastData) },
                    { [styles.groupDoorClosed(activeThreshold.color)]: !isDoorOpen }
                )}
            >
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

const doorOpenBreathing = (thresholdColor: string) => keyframes`
    0% {
        drop-shadow(0px 0px 2px ${thresholdColor}) drop-shadow(0px 0px 6px ${thresholdColor});
    }

    70% {
        
        filter: drop-shadow(0px 0px 2px ${thresholdColor}) drop-shadow(0px 0px 6px ${thresholdColor}) drop-shadow(0px 0px 7px ${thresholdColor});
    }

    100% {
        
        filter: drop-shadow(0px 0px 2px ${thresholdColor}) drop-shadow(0px 0px 6px ${thresholdColor}) drop-shadow(0px 0px 9px ${thresholdColor});
    }
`

const doorClosedBreathing = (thresholdColor: string) => keyframes`
    from {
        drop-shadow(0px 0px 2px ${thresholdColor}) drop-shadow(0px 0px 6px ${thresholdColor});
    }

    to {
        
        filter: drop-shadow(0px 0px 2px ${thresholdColor}) drop-shadow(0px 0px 6px ${thresholdColor}) drop-shadow(0px 0px 9px ${thresholdColor});
    }
`

const getStyles = (theme: GrafanaTheme) => {
    return {
        groupDoorOpen: (thresholdColor: string) => css`
            animation: ${doorOpenBreathing(thresholdColor)} 1s ease-in infinite alternate;
        `,
        groupDoorClosed: (thresholdColor: string) => css`
            animation: ${doorClosedBreathing(thresholdColor)} 1.5s ease-in infinite alternate;
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
        `
      }
}
