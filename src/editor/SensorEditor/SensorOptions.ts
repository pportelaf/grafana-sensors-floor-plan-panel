import { DataFrameOptions } from '../DataFrameEditor/DataFrameOptions'

export enum Orientation {
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
}

export enum Side {
  Start = 'start',
  End = 'end',
}

export enum SensorType {
  AirQuality = 'air-quality',
  Door = 'door',
  WaterLevel = 'water-level',
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
  color?: string
  dataFramesOptionsList?: DataFrameOptions[]
  fontSize?: number
  link?: string
  name: string
  orientation?: Orientation
  side?: Side
  type: SensorType
}
