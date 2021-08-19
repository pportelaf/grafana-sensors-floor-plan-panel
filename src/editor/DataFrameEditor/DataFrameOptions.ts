import { ThresholdOptions } from '../ThresholdsEditor/ThresholdOptions'

export interface DataFrameOptions {
  decimals?: number
  facility: string
  fieldName: string
  label?: string
  plot: string
  thresholds: ThresholdOptions[]
  unit: string
}
