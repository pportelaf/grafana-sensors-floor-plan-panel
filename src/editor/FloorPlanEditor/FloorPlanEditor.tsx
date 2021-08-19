import React, { useState } from 'react'
import { GrafanaTheme2, StandardEditorContext } from '@grafana/data'
import { useStyles2, useTheme2, Button, InlineField, InlineSwitch } from '@grafana/ui'
import { css } from 'emotion'
import { DefaultOptionsService } from 'data/DefaultOptionsService'
import { FloorPlanOptions } from './FloorPlanOptions'
import { LabelOptions } from 'editor/LabelEditor/LabelOptions'
import { SensorOptions } from 'editor/SensorEditor/SensorOptions'
import { CollapseEditor } from 'components/CollapseEditor/CollapseEditor'
import { CustomColorPicker } from 'components/CustomColorPicker/CustomColorPicker'
import { LabelEditor } from 'editor/LabelEditor/LabelEditor'
import { SensorEditor } from 'editor/SensorEditor/SensorEditor'
import { InlineFieldInputGenerator } from 'components/utils/InlineFieldInputGenerator'

interface Props {
  context: StandardEditorContext<any>
  onChange: (value?: FloorPlanOptions) => void
  value: FloorPlanOptions
}

export const FloorPlanEditor: React.FC<Props> = ({ context, onChange, value = {} }) => {
  const styles = useStyles2(getStyles)
  const theme = useTheme2()

  const [sensorEditorCollapseStates, setSensorEditorCollapseStates] = useState<boolean[]>([])

  let floorPlanOptions: FloorPlanOptions = {
    name: '',
    sensorOptionsList: [],
    ...value,
  }
  let sensorOptionsList: SensorOptions[] = floorPlanOptions.sensorOptionsList || []

  const fill = floorPlanOptions.fill || ''
  const stroke = floorPlanOptions.stroke || ''

  const defaultOptionsService: DefaultOptionsService = DefaultOptionsService.getInstance(theme)
  const inlineFieldInputGenerator: InlineFieldInputGenerator<FloorPlanOptions> = new InlineFieldInputGenerator(
    floorPlanOptions,
    onChange
  )

  const isSensorEditorCollapseOpen = (index: number) => {
    return sensorEditorCollapseStates[index]
  }

  const toggleSensorEditorCollapse = (index: number) => {
    sensorEditorCollapseStates[index] = !sensorEditorCollapseStates[index]
    setSensorEditorCollapseStates([...sensorEditorCollapseStates])
  }

  const removeSensorEditorCollapse = (index: number) => {
    sensorEditorCollapseStates.splice(index, 1)
    setSensorEditorCollapseStates([...sensorEditorCollapseStates])
  }

  const onChangeFill = (color: string) => {
    floorPlanOptions.fill = color
    onChange(floorPlanOptions)
  }

  const onChangeStroke = (color: string) => {
    floorPlanOptions.stroke = color
    onChange(floorPlanOptions)
  }

  const onChangeDisplayName = (event: any) => {
    if (event.currentTarget?.checked) {
      floorPlanOptions.labelOptions = {
        ...defaultOptionsService.getLabelDefaultOptions(),
        y: floorPlanOptions.y,
      }
    } else {
      floorPlanOptions.labelOptions = undefined
    }

    onChange(floorPlanOptions)
  }

  const onChangeLabelOptions = (labelOptions?: LabelOptions) => {
    floorPlanOptions.labelOptions = labelOptions

    onChange(floorPlanOptions)
  }

  const addSensor = () => {
    let sensorOptions: SensorOptions = {
      x: floorPlanOptions.x,
      y: floorPlanOptions.y,
      ...defaultOptionsService.getSensorDefaultOptions(),
    }

    sensorOptionsList.push(sensorOptions)

    toggleSensorEditorCollapse(sensorOptionsList.length - 1)
    onChange(floorPlanOptions)
  }

  const onChangeSensor = (value: any, index: number) => {
    sensorOptionsList[index] = value

    floorPlanOptions.sensorOptionsList = [...sensorOptionsList]
    onChange(floorPlanOptions)
  }

  const onCopySensor = (index: number) => {
    let sensor = { ...sensorOptionsList[index] }
    sensor.name = `${sensor.name} (copy)`

    sensorOptionsList.push(sensor)
    floorPlanOptions.sensorOptionsList = [...sensorOptionsList]

    onChange(floorPlanOptions)
  }

  const onMoveUpSensor = (index: number) => {
    if (index === 0) {
      return
    }

    let sensor = sensorOptionsList[index]
    let newIndex = (index - 1) % sensorOptionsList.length

    sensorOptionsList.splice(index, 1)
    sensorOptionsList.splice(newIndex, 0, sensor)
    floorPlanOptions.sensorOptionsList = [...sensorOptionsList]

    onChange(floorPlanOptions)
  }

  const onRemoveSensor = (index: number) => {
    sensorOptionsList.splice(index, 1)

    floorPlanOptions.sensorOptionsList = [...sensorOptionsList]
    removeSensorEditorCollapse(index)
    onChange(floorPlanOptions)
  }

  const getLabelEditor = () => {
    const labelOptions = floorPlanOptions.labelOptions || defaultOptionsService.getLabelDefaultOptions()

    return <LabelEditor value={labelOptions} onChange={onChangeLabelOptions} />
  }

  const getSensorEditorListComonent = () => {
    return sensorOptionsList.map((sensorOptions, index) => {
      return (
        <CollapseEditor
          key={index}
          collapsible
          isOpen={isSensorEditorCollapseOpen(index)}
          label={sensorOptions.name}
          onCopy={() => onCopySensor(index)}
          onMoveUp={() => onMoveUpSensor(index)}
          onRemove={() => onRemoveSensor(index)}
          onToggle={() => toggleSensorEditorCollapse(index)}
          showCopy
          showMoveUp
          showRemove
        >
          <SensorEditor context={context} onChange={(value) => onChangeSensor(value, index)} value={sensorOptions} />
        </CollapseEditor>
      )
    })
  }

  return (
    <div className={styles.wrapper}>
      {inlineFieldInputGenerator.getInlineFieldInput('Name', 'text', 'name')}
      <InlineField label="Display name">
        <InlineSwitch css="" value={!!value.labelOptions} onChange={onChangeDisplayName} />
      </InlineField>
      {value.labelOptions && getLabelEditor()}

      {inlineFieldInputGenerator.getInlineFieldInput('X', 'number', 'x')}
      {inlineFieldInputGenerator.getInlineFieldInput('Y', 'number', 'y')}
      {inlineFieldInputGenerator.getInlineFieldInput('Width', 'number', 'width')}
      {inlineFieldInputGenerator.getInlineFieldInput('Height', 'number', 'height')}
      {inlineFieldInputGenerator.getInlineFieldInput('Wall width', 'number', 'strokeWidth')}
      <InlineField className={styles.inlineFieldColorPicker} label="Wall color">
        <CustomColorPicker color={stroke} onChange={onChangeStroke} />
      </InlineField>
      <InlineField className={styles.inlineFieldColorPicker} label="Background color">
        <CustomColorPicker color={fill} onChange={onChangeFill} />
      </InlineField>

      <h5 className={styles.sensorsTitle}>Sensors</h5>
      <Button className={styles.buttonAddSensor} icon="plus" onClick={addSensor} size="sm" variant="secondary">
        Add sensor
      </Button>

      {getSensorEditorListComonent()}
    </div>
  )
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    wrapper: css`
      padding-top: ${theme.spacing(0.5)};
    `,
    inlineFieldColorPicker: css`
      align-items: center;
    `,
    sensorsTitle: css`
      margin-top: ${theme.spacing(2)};
    `,
    buttonAddSensor: css`
      margin-bottom: ${theme.spacing(1)};
      width: 100%;
      justify-content: center;
    `,
  }
}
