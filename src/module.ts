import { PanelPlugin } from '@grafana/data'
import { Panel } from './panel/Panel'
import { FloorPlanListEditor } from './editor/FloorPlanListEditor/FloorPlanListEditor'
import { PanelOptions } from './panel/PanelOptions'
import { CanvasEditor } from './editor/CanvasEditor/CanvasEditor'

export const plugin = new PanelPlugin<PanelOptions>(Panel).setPanelOptions(builder => {
  return builder
    .addBooleanSwitch({
      path: 'debugMode',
      name: 'Debug mode',
      defaultValue: false
    })
    .addCustomEditor({
      id: 'canvasOptions',
      path: 'canvasOptions',
      name: 'Canvas settings',
      editor: CanvasEditor
    })
    .addCustomEditor({
      id: 'floorPlanOptionsList',
      path: 'floorPlanOptionsList',
      name: 'Floor plans',
      editor: FloorPlanListEditor
    })
})
