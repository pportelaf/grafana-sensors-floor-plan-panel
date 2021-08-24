import React from 'react'
import { DataFrame, GrafanaTheme2 } from '@grafana/data'
import { useStyles2 } from '@grafana/ui'
import { css } from 'emotion'
import { DataFrameOptions } from 'editor/DataFrameEditor/DataFrameOptions'
import { DataFrameWithSettings } from 'data/types/DataFrameWithSettings'
import { FloorPlanOptions } from 'editor/FloorPlanEditor/FloorPlanOptions'
import { SensorView } from 'components/sensors/SensorView'

interface Props {
  dataFrames: DataFrame[]
  value: FloorPlanOptions
}

export const FloorPlan: React.FC<Props> = ({ dataFrames, value }) => {
  const styles = useStyles2(getStyles)
  const strokeWidth = value.strokeWidth || 0
  let x = value.x || 0
  let y = value.y || 0

  x = x + strokeWidth / 2
  y = y + strokeWidth / 2

  const getDataFramesWithSettings = (dataFrameOptionsList: DataFrameOptions[]): DataFrameWithSettings[] => {
    const dataFrameWithSettings: DataFrameWithSettings[] = []

    dataFrameOptionsList.forEach((dataFrameOptions) => {
      dataFrames.forEach((dataFrame) => {
        if (isDataFrameRequiredForSensor(dataFrame, dataFrameOptions)) {
          dataFrameWithSettings.push({
            dataFrame,
            settings: dataFrameOptions,
          })
        }
      })
    })

    return dataFrameWithSettings
  }

  const isDataFrameRequiredForSensor = (dataFrame: DataFrame, dataFrameOptions: DataFrameOptions) => {
    return dataFrame.fields.some((field) => {
      return (
        dataFrameOptions.fieldName === field.name &&
        dataFrameOptions.facility === field.labels?.facility &&
        dataFrameOptions.location === field.labels?.location
      )
    })
  }

  const getSensorList = () => {
    return (
      <React.Fragment>
        {value.sensorOptionsList?.map((sensorOptions, index) => (
          <SensorView
            key={index}
            sensorOptions={sensorOptions}
            fill={value.fill}
            floorPlanOptions={value}
            dataFramesWithSettings={getDataFramesWithSettings(sensorOptions.dataFramesOptionsList || [])}
          />
        ))}
      </React.Fragment>
    )
  }

  const getLabel = () => {
    const width = value.width || 0
    const color = value.labelOptions?.color || ''
    const labelX = width / 2 + x
    const fontSize = value.labelOptions?.fontSize || 0

    return (
      <text className={styles.label(fontSize, color)} y={value.labelOptions?.y} x={labelX} textAnchor="middle">
        {value.name}
      </text>
    )
  }

  return (
    <React.Fragment>
      <rect
        x={x}
        y={y}
        width={value.width}
        height={value.height}
        strokeWidth={value.strokeWidth}
        stroke={value.stroke}
        fill={value.fill}
      />

      {getSensorList()}
      {value.labelOptions && getLabel()}
    </React.Fragment>
  )
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    label: (fontSize: number, color: string) => css`
      font-size: ${fontSize}px;
      fill: ${color};
    `,
  }
}
