import React, { Fragment } from 'react'
import { RadioButtonGroup, InlineField } from '@grafana/ui'
import { Orientation, Side } from './SensorOptions'

type SensorDoorEditor = {
    orientation: Orientation | undefined
    side: Side | undefined
}

interface Props {
    onChange: (value?: SensorDoorEditor) => void
    value: SensorDoorEditor
}

export const SensorDoorEditor: React.FC<Props> = ({ value, onChange }) => {
    const orientationOptions: Array<{label: string, value: Orientation}> = [
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

    const sideOptions: Array<{label: string, value: Side}> = [
        {
            label: 'Start',
            value: Side.Start
        },
        {
            label: 'End',
            value: Side.End
        }
    ]

    const onChangeDoorOrientation = (orientation: any) => {
        onChange({
            ...value,
            orientation
        })
    }

    const onChangeDoorSide = (side: any) => {
        onChange({
            ...value,
            side
        })
    }

    return (
        <Fragment>
            <InlineField label="Door orientation">
                <RadioButtonGroup
                    onChange={onChangeDoorOrientation}
                    options={orientationOptions} 
                    value={value.orientation} 
                />
            </InlineField>
            <InlineField label="Door side">
                <RadioButtonGroup
                    onChange={onChangeDoorSide}
                    options={sideOptions} 
                    value={value.side} 
                />
            </InlineField>
        </Fragment>
    )
}
