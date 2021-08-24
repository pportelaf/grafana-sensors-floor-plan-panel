import { ThresholdOptions } from '../ThresholdsEditor/ThresholdOptions'

export interface DataFrameOptions {
  decimals?: number
  facility: string
  fieldName: string
  label?: string
  location: string
  name: string
  thresholds: ThresholdOptions[]
  unit: string
}
