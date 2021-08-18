import { LabelOptions } from 'editor/LabelEditor/LabelOptions';
import { SensorOptions, VectorGraphicOptions } from 'editor/SensorEditor/SensorOptions'

export interface FloorPlanOptions extends VectorGraphicOptions {
  name: string
  sensorOptionsList?: Array<SensorOptions>
  labelOptions?: LabelOptions
}
