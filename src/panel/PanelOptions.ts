import { FloorPlanOptions } from 'editor/FloorPlanEditor/FloorPlanOptions'
import { CanvasOptions } from 'editor/CanvasEditor/CanvasOptions'

export interface PanelOptions {
  canvasOptions?: CanvasOptions
  debugMode: boolean
  floorPlanOptionsList: FloorPlanOptions[]
}
