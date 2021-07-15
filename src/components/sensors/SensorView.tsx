import React from 'react'
import { DataFrameWithSettings } from 'data/types/DataFrameWithSettings'
import { FloorPlanOptions } from 'editor/FloorPlanEditor/FloorPlanOptions'
import { SensorOptions, SensorType } from 'editor/SensorEditor/SensorOptions'
import { SensorAirQuality } from 'components/sensors/SensorAirQuality/SensorAirQuality'
import { SensorDoor } from 'components/sensors/SensorDoor/SensorDoor'
import { SensorWaterLevel } from 'components/sensors/SensorWaterLevel/SensorWaterLevel'

interface Props {
    dataFramesWithSettings: DataFrameWithSettings[]
    fill: string | undefined
    floorPlanOptions: FloorPlanOptions
    sensorOptions: SensorOptions
}

export const SensorView: React.FC<Props> = ({
    dataFramesWithSettings,
    fill,
    floorPlanOptions,
    sensorOptions,
}) => {
    const getSensorComponent = () => {
        switch (sensorOptions.type) {
            case SensorType.AirQuality:
                return (
                    <SensorAirQuality
                        dataFramesWithSettings={dataFramesWithSettings}
                        fill={fill}
                        floorPlanOptions={floorPlanOptions}
                        sensorOptions={sensorOptions}
                    />
                )
            case SensorType.Door:
                return (
                    <SensorDoor
                        dataFramesWithSettings={dataFramesWithSettings}
                        fill={fill}
                        floorPlanOptions={floorPlanOptions}
                        sensorOptions={sensorOptions}
                    />
                )
            case SensorType.WaterLevel:
                return (
                    <SensorWaterLevel
                        dataFramesWithSettings={dataFramesWithSettings}
                        fill={fill}
                        floorPlanOptions={floorPlanOptions}
                        sensorOptions={sensorOptions}
                    />
                )
            default:
                return <span>Unknown sensor</span>
        }
    }

    return (
        getSensorComponent()
    )
}
