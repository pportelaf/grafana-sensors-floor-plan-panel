import React from 'react'
import { DataFrame } from '@grafana/data'
import { DataFrameOptions } from 'editor/DataFrameEditor/DataFrameOptions'
import { DataFrameWithSettings } from 'data/types/DataFrameWithSettings'
import { FloorPlanOptions } from 'editor/FloorPlanEditor/FloorPlanOptions'
import { SensorView } from 'components/sensors/SensorView'

interface Props {
    dataFrames: DataFrame[]
    value: FloorPlanOptions
}

export const FloorPlan: React.FC<Props> = ({
    dataFrames,
    value
}) => {
    const strokeWidth = value.strokeWidth || 0
    let x = value.x || 0
    let y = value.y || 0

    x = x + (strokeWidth / 2)
    y = y + (strokeWidth / 2)

    const isDataFrameRequiredForSensor = (dataFrame: DataFrame, dataFrameOptions: DataFrameOptions) => {
        return dataFrame.fields.some(field => {
            return (dataFrameOptions.fieldName === field.name) && 
            (dataFrameOptions.facility === field.labels?.facility) &&
            (dataFrameOptions.plot === field.labels?.plot)
        })
    }

    const getDataFramesWithSettings = (dataFrameOptionsList: Array<DataFrameOptions>): Array<DataFrameWithSettings> => {
        const dataFrameWithSettings: Array<DataFrameWithSettings> = []

        dataFrameOptionsList.forEach(dataFrameOptions => {
            dataFrames.forEach(dataFrame => {
                if (isDataFrameRequiredForSensor(dataFrame, dataFrameOptions)) {
                    dataFrameWithSettings.push({
                        dataFrame,
                        settings: dataFrameOptions
                    })
                }
            })
        })

        return dataFrameWithSettings
    }

    const getSensorList = () => {
        return (
            <React.Fragment>
                {value.sensorOptionsList?.map(sensorOptions => (
                    <SensorView
                        sensorOptions={sensorOptions}
                        fill={value.fill}
                        floorPlanOptions={value}
                        dataFramesWithSettings={getDataFramesWithSettings(sensorOptions.dataFramesOptionsList || [])}
                    />
                ))}
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <rect
                x={x}
                y={y}
                width={value.width}
                height={value.height}
                stroke-width={value.strokeWidth}
                stroke={value.stroke}
                fill={value.fill}
            />

            { getSensorList() }
        </React.Fragment>
    )
}
