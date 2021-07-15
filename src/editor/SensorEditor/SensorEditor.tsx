import React, { useState, Fragment } from 'react'
import { GrafanaTheme, StandardEditorContext } from '@grafana/data'
import { RadioButtonGroup, InlineField, useStyles, Button } from '@grafana/ui'
import { css } from 'emotion'
import { DefaultOptionsService } from 'data/DefaultOptionsService'
import { DataFrameOptions } from 'editor/DataFrameEditor/DataFrameOptions'
import { Orientation, SensorOptions, SensorType, Side } from './SensorOptions'
import { CollapseEditor } from 'components/CollapseEditor/CollapseEditor'
import { DataFrameEditor } from 'editor/DataFrameEditor/DataFrameEditor'
import { InlineFieldInputGenerator } from 'components/utils/InlineFieldInputGenerator'

interface Props {
  context: StandardEditorContext<any>
  onChange: (value?: SensorOptions) => void
  value: SensorOptions
}

const sensorTypesWithOneDataFrame = [SensorType.WaterLevel, SensorType.Door]
const inputVisibilityMap: { [key: string]: Array<SensorType> } = {
  height: [SensorType.WaterLevel, SensorType.Door],
  width: [SensorType.WaterLevel, SensorType.Door],
  fontSize: [SensorType.WaterLevel, SensorType.AirQuality],
  radius: [SensorType.AirQuality],
  orientation: [SensorType.Door, SensorType.AirQuality],
  side: [SensorType.Door]
}

const sensorTypeSelectOptions: Array<{ label: string, value: SensorType }> = [
  {
    label: 'Air quality',
    value: SensorType.AirQuality
  },
  {
    label: 'Water level',
    value: SensorType.WaterLevel
  },
  {
    label: 'Door',
    value: SensorType.Door
  }
]

const orientationOptions: Array<{ label: string, value: Orientation }> = [
  {
    label: 'Top',
    value: Orientation.Top
  },
  {
    label: 'Bottom',
    value: Orientation.Bottom
  },
  {
    label: 'Left',
    value: Orientation.Left
  },
  {
    label: 'Right',
    value: Orientation.Right
  }
]

const sideOptions: Array<{ label: string, value: Side }> = [
  {
    label: 'Start',
    value: Side.Start
  },
  {
    label: 'End',
    value: Side.End
  }
]

export const SensorEditor: React.FC<Props> = ({
  context,
  onChange,
  value
}) => {
  const styles = useStyles(getStyles)

  const [dataFrameEditorCollapseStates, setaDtaFrameEditorCollapseStates] = useState<boolean[]>([])
  let sensorOptions: SensorOptions = {
    ...value,
  }
  const isSingleDataFrameSensor = sensorTypesWithOneDataFrame.includes(sensorOptions.type)

  let dataFramesOptionsList: Array<DataFrameOptions> = sensorOptions.dataFramesOptionsList || []

  const defaultOptionsService: DefaultOptionsService = DefaultOptionsService.getInstance()

  const inlineFieldInputGenerator: InlineFieldInputGenerator<SensorOptions> = new InlineFieldInputGenerator(sensorOptions, onChange)

  const isInputVisible = (input: string) => {
    const sensorTypesVisible: Array<SensorType> = inputVisibilityMap[input]

    if (!sensorTypesVisible) {
      return true
    }

    return sensorTypesVisible.includes(sensorOptions.type)
  }

  const onChangeDoorOrientation = (orientation: any) => {
    sensorOptions.orientation = orientation
    onChange(sensorOptions)
  }

  const onChangeDoorSide = (side: any) => {
    sensorOptions.side = side
    onChange(sensorOptions)
  }

  const onChangeSensorType = (value: any) => {
    const defaultSensorOptions = defaultOptionsService.getSensorDefaultOptions(value)

    sensorOptions.type = value
    sensorOptions.width = defaultSensorOptions.width
    sensorOptions.height = defaultSensorOptions.height

    sensorOptions.dataFramesOptionsList = []

    onChange(sensorOptions)
  }

  const onChangeDataFrame = (value: any, index: number) => {
    dataFramesOptionsList[index] = value
    sensorOptions.dataFramesOptionsList = [...dataFramesOptionsList]

    onChange(sensorOptions)
  }

  const onCopyDataFrame = (index: number) => {
    let dataFrame = { ...dataFramesOptionsList[index] }

    dataFramesOptionsList.push(dataFrame)
    sensorOptions.dataFramesOptionsList = [...dataFramesOptionsList]

    onChange(sensorOptions)
  }

  const onMoveUpDataFrame = (index: number) => {
    if (index === 0) {
      return
    }

    let dataFrame = dataFramesOptionsList[index]
    let newIndex = (index - 1) % dataFramesOptionsList.length

    dataFramesOptionsList.splice(index, 1)
    dataFramesOptionsList.splice(newIndex, 0, dataFrame)
    sensorOptions.dataFramesOptionsList = [...dataFramesOptionsList]

    onChange(sensorOptions)
  }

  const onRemoveDataFrame = (index: number) => {
    dataFramesOptionsList.splice(index, 1)
    sensorOptions.dataFramesOptionsList = [...dataFramesOptionsList]

    removeDataFrameCollapse(index)
    onChange(sensorOptions)
  }

  const addDataFrame = () => {
    dataFramesOptionsList.push({
      facility: '',
      plot: '',
      fieldName: '',
      thresholds: [],
      unit: '',
    })

    sensorOptions.dataFramesOptionsList = [...dataFramesOptionsList]

    if (!isSingleDataFrameSensor) {
      toggleDataFrameEditorCollapse(sensorOptions.dataFramesOptionsList.length - 1)
    }

    onChange(sensorOptions)
  }

  const toggleDataFrameEditorCollapse = (index: number) => {
    dataFrameEditorCollapseStates[index] = !dataFrameEditorCollapseStates[index]
    setaDtaFrameEditorCollapseStates([...dataFrameEditorCollapseStates])
  }

  const isDataFrameEditorCollapseOpen = (index: number) => {
    return dataFrameEditorCollapseStates[index]
  }

  const removeDataFrameCollapse = (index: number) => {
    dataFrameEditorCollapseStates.splice(index, 1)
    setaDtaFrameEditorCollapseStates([...dataFrameEditorCollapseStates])
  }

  const getDataFrameEditors = () => {
    return dataFramesOptionsList.map((dataFrameOptions, index) => {
      return (
        <DataFrameEditor
          context={context}
          onChange={value => onChangeDataFrame(value, index)}
          sensorType={sensorOptions.type}
          value={dataFrameOptions}
        />
      )
    })
  }

  const getCollapsibleDataFramEditors = () => {
    return dataFramesOptionsList.map((dataFrameOptions, index) => {
      return (
        <Fragment>
          <CollapseEditor
            collapsible
            isOpen={isDataFrameEditorCollapseOpen(index)}
            label={`Data frame ${dataFrameOptions.fieldName}`}
            onCopy={() => onCopyDataFrame(index)}
            onMoveUp={() => onMoveUpDataFrame(index)}
            onRemove={() => onRemoveDataFrame(index)}
            onToggle={() => toggleDataFrameEditorCollapse(index)}
            showCopy
            showMoveUp
            showRemove
          >
            <DataFrameEditor
              context={context}
              onChange={value => onChangeDataFrame(value, index)}
              sensorType={sensorOptions.type}
              value={dataFrameOptions}
            />
          </CollapseEditor>
        </Fragment>
      )
    })
  }

  const getDataFrameSection = () => {
    let buttonAdd
    let dataFrameEditors

    if (!isSingleDataFrameSensor) {
      buttonAdd = <Button className={styles.buttonAddDataFrames} icon="plus" onClick={addDataFrame} size="sm" variant="secondary">Add data frame</Button>
      dataFrameEditors = getCollapsibleDataFramEditors()
    } else {
      dataFrameEditors = getDataFrameEditors()
    }

    return (
      <Fragment>
        <h5 className={styles.sensorsTitle}>Data frame configuration</h5>
        {buttonAdd}
        {dataFrameEditors}
      </Fragment>
    )
  }

  if (isSingleDataFrameSensor && dataFramesOptionsList.length === 0) {
    addDataFrame()
  }

  return (
    <div className={styles.wrapper}>
      {inlineFieldInputGenerator.getInlineFieldInput('Name', 'text', 'name')}
      <InlineField label="Sensor tpye">
        <RadioButtonGroup
          onChange={onChangeSensorType}
          options={sensorTypeSelectOptions}
          value={sensorOptions.type}
        />
      </InlineField>

      {inlineFieldInputGenerator.getInlineFieldInput('X', 'number', 'x')}
      {inlineFieldInputGenerator.getInlineFieldInput('Y', 'number', 'y')}
      {isInputVisible('width') && inlineFieldInputGenerator.getInlineFieldInput('Width', 'number', 'width')}
      {isInputVisible('height') && inlineFieldInputGenerator.getInlineFieldInput('Height', 'number', 'height')}
      {isInputVisible('radius') && inlineFieldInputGenerator.getInlineFieldInput('Radius', 'number', 'radius')}
      {isInputVisible('fontSize') && inlineFieldInputGenerator.getInlineFieldInput('Font size', 'number', 'fontSize')}

      {
        isInputVisible('orientation') &&
        <InlineField label="Orientation">
          <RadioButtonGroup
            onChange={onChangeDoorOrientation}
            options={orientationOptions}
            value={value.orientation}
          />
        </InlineField>
      }

      {
        isInputVisible('side') &&
        <InlineField label="Side">
          <RadioButtonGroup
            onChange={onChangeDoorSide}
            options={sideOptions}
            value={value.side}
          />
        </InlineField>
      }

      {getDataFrameSection()}
    </div>
  )
}

const getStyles = (theme: GrafanaTheme) => {
  return {
    wrapper: css`
      padding-top: ${theme.spacing.xs};
    `,
    nameHorizontalGroupWrapper: css`
      justify-content: space-between;
      margin-bottom: ${theme.spacing.md};
    `,
    sensorsTitle: css`
      margin-top: ${theme.spacing.md};
    `,
    buttonAddDataFrames: css`
      margin-bottom: ${theme.spacing.sm};
      width: 100%;
      justify-content: center;
    `
  }
}
