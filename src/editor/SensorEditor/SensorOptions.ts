import { DataFrameOptions } from '../DataFrameEditor/DataFrameOptions'

export enum Orientation {
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right'
}

export enum Side {
  Start = 'start',
  End = 'end'
}

export enum SensorType {
  AirQuality = 'air-quality',
  WaterLevel = 'water-level',
  Door = 'door'
}

export interface VectorGraphicOptions {
  x?: number
  y?: number
  width?: number
  height?: number
  radius?: number
  strokeWidth?: number
  stroke?: string
  fill?: string
}


export interface SensorOptions extends VectorGraphicOptions {
  name: string
  type: SensorType
  dataFramesOptionsList?: Array<DataFrameOptions>
  color?: string
  fontSize?: number
  orientation?: Orientation
  side?: Side
}
