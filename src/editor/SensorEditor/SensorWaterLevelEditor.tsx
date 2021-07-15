import React, { Fragment } from 'react'
import { InlineField } from '@grafana/ui'
import { CustomColorPicker } from 'components/CustomColorPicker/CustomColorPicker'
import { InlineFieldInputGenerator } from 'components/utils/InlineFieldInputGenerator'

type SensorWaterLevelEditorOptions = {
    color: string | undefined
    fontSize: number | undefined
}

interface Props {
    onChange: (value?: SensorWaterLevelEditorOptions) => void
    value: SensorWaterLevelEditorOptions
}

export const SensorWaterLevelEditor: React.FC<Props> = ({
    onChange,
    value
}) => {
    const inlineFieldInputGenerator: InlineFieldInputGenerator<SensorWaterLevelEditorOptions> = new InlineFieldInputGenerator(value, onChange)

    const onChangeColor = (color: string) => {
        onChange({
            ...value,
            color
        })
    }

    return (
        <Fragment>
            <InlineField label="Color">
                <CustomColorPicker
                    color={value.color || 'white'}
                    onChange={onChangeColor}
                />
            </InlineField>
            { inlineFieldInputGenerator.getInlineFieldInput('Font size', 'number', 'fontSize') }
        </Fragment>
    )
}
