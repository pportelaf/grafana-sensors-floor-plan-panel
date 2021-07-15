import React, { useState } from 'react'
import { GrafanaTheme, StandardEditorProps } from '@grafana/data'
import { Button, useStyles } from '@grafana/ui'
import { css } from 'emotion'
import { DefaultOptionsService } from 'data/DefaultOptionsService'
import { FloorPlanOptions } from 'editor/FloorPlanEditor/FloorPlanOptions'
import { CollapseEditor } from 'components/CollapseEditor/CollapseEditor'
import { FloorPlanEditor } from 'editor/FloorPlanEditor/FloorPlanEditor'

interface Props extends StandardEditorProps<Array<FloorPlanOptions>> { }

export const FloorPlanListEditor: React.FC<Props> = ({
  context,
  item,
  onChange,
  value
}) => {
  const styles = useStyles(getStyles)
  const [collapseStateArray, setCollapseStateArray] = useState<boolean[]>([])

  let floorPlanOptions: Array<FloorPlanOptions> = value || []

  const defaultOptionsService: DefaultOptionsService = DefaultOptionsService.getInstance()

  const onChangeEditor = (index: number, value: FloorPlanOptions | undefined) => {
    if (value) {
      floorPlanOptions[index] = value
    }

    onChange(floorPlanOptions)
  }

  const addFloorPlan = () => {
    floorPlanOptions.push(defaultOptionsService.getFloorPlanDefaultOptions())

    toggleCollapseState(floorPlanOptions.length - 1)
    onChange(floorPlanOptions)
  }

  const onRemove = (index: number) => {
    floorPlanOptions.splice(index, 1)
    removeCollapse(index)
    onChange(floorPlanOptions)
  }

  const onMoveUp = (index: number) => {
    if (index === 0) {
      return
    }

    let floorPlan = floorPlanOptions[index]
    let newIndex = (index - 1) % floorPlanOptions.length

    floorPlanOptions.splice(index, 1)
    floorPlanOptions.splice(newIndex, 0, floorPlan)

    onChange(floorPlanOptions)
  }

  const onCopy = (index: number) => {
    let floorPlan = { ...floorPlanOptions[index] }
    floorPlan.name = `${floorPlan.name} (copy)`

    floorPlanOptions.push(floorPlan)

    onChange(floorPlanOptions)
  }

  const toggleCollapseState = (index: number) => {
    collapseStateArray[index] = !collapseStateArray[index]
    setCollapseStateArray([...collapseStateArray])
  }

  const isCollapseOpen = (index: number) => {
    return collapseStateArray[index]
  }

  const removeCollapse = (index: number) => {
    collapseStateArray.splice(index, 1)
    setCollapseStateArray([...collapseStateArray])
  }

  return (
    <React.Fragment>
      <Button className={styles.buttonAdd} icon="plus" onClick={addFloorPlan} size="sm" variant="secondary">Add floor plan</Button>
      {
        floorPlanOptions.map((floorPlanOptions, index) => {
          return (
            <CollapseEditor
              collapsible
              isOpen={isCollapseOpen(index)}
              label={floorPlanOptions.name}
              onCopy={() => onCopy(index)}
              onMoveUp={() => onMoveUp(index)}
              onRemove={() => onRemove(index)}
              onToggle={() => toggleCollapseState(index)}
              showCopy
              showMoveUp
              showRemove
            >
              <FloorPlanEditor
                context={context}
                onChange={value => onChangeEditor(index, value)}
                value={floorPlanOptions}
              />
            </CollapseEditor>
          )
        })
      }
    </React.Fragment>
  )
}

const getStyles = (theme: GrafanaTheme) => {
  return {
    buttonAdd: css`
      margin-bottom: ${theme.spacing.sm};
      width: 100%;
      justify-content: center;
    `
  }
}
