import { SensorOptions, VectorGraphicOptions } from 'editor/SensorEditor/SensorOptions'

export interface FloorPlanOptions extends VectorGraphicOptions {
  name: string
  sensorOptionsList?: Array<SensorOptions>
}
