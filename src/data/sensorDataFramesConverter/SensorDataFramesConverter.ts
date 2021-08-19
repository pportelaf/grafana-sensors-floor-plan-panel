import { getActiveThreshold, getValueFormat, ValueFormatter } from '@grafana/data'
import { DataFrameWithSettings } from 'data/types/DataFrameWithSettings'
import { DataFrameOptions } from 'editor/DataFrameEditor/DataFrameOptions'
import { ThresholdOptions } from 'editor/ThresholdsEditor/ThresholdOptions'

export interface SensorData {
  value: number
  formattedValue: string | number
  threshold: ThresholdOptions
}

export class SensorDataFramesConverter {
  private dataFramesWithSettings: DataFrameWithSettings[]

  constructor(dataFramesWithSettings: DataFrameWithSettings[]) {
    this.dataFramesWithSettings = dataFramesWithSettings
  }

  getLastDataList(): SensorData[] {
    let values: SensorData[] = []

    this.dataFramesWithSettings.forEach((dataFrameWithSettings) => {
      const sensorData = this.getLastDataFromDataFrame(dataFrameWithSettings)

      if (sensorData) {
        values.push(sensorData)
      }
    })

    return values
  }

  private getLastDataFromDataFrame(dataFrameWithSettings: DataFrameWithSettings): SensorData | undefined {
    const field = dataFrameWithSettings.dataFrame.fields.find((field) => field.type !== 'time')
    let value
    let formattedValue
    let threshold

    if (!field || field.values.length < 1) {
      return undefined
    }

    value = field.values.get(field.values.length - 1)
    formattedValue = this.formatValue(value, dataFrameWithSettings.settings)
    threshold = getActiveThreshold(value, dataFrameWithSettings.settings.thresholds)

    return {
      value,
      formattedValue,
      threshold,
    }
  }

  private formatValue(value: any, dataFrameSettings: DataFrameOptions): string | number {
    const unit = dataFrameSettings.unit || 'none'
    let valueFormatter: ValueFormatter
    let valueFormatted
    let label = dataFrameSettings.label || ''

    valueFormatter = getValueFormat(unit)
    valueFormatted = {
      prefix: '',
      suffix: '',
      ...valueFormatter(value, dataFrameSettings.decimals),
    }

    return `${label}${valueFormatted.prefix}${valueFormatted.text}${valueFormatted.suffix}`
  }
}
