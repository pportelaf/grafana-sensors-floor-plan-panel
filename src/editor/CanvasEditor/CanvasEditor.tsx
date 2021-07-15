import React, { useEffect } from 'react'
import { InlineField, Slider } from '@grafana/ui'
import { CanvasOptions } from './CanvasOptions'
import { InlineFieldInputGenerator } from 'components/utils/InlineFieldInputGenerator'

interface Props {
  onChange: (value?: CanvasOptions) => void
  value?: CanvasOptions
}

export const CanvasEditor: React.FC<Props> = ({
  onChange,
  value
}) => {
  const canvasOptions: CanvasOptions = value || {
    height: 1000,
    width: 1000,
    zoom: 100
  }
  const zoomSliderValue = [canvasOptions.zoom || 0]
  const inlineFieldInputGenerator: InlineFieldInputGenerator<CanvasOptions> = new InlineFieldInputGenerator(canvasOptions, onChange)

  const onChangeZoom = ([value]: any) => {
    canvasOptions.zoom = value
  }

  const onAfterChangeZoom = ([value]: any) => {
    canvasOptions.zoom = value
    onChange(canvasOptions)
  }

  useEffect(() => {
    if (!value) {
      // Set default values
      onChange(canvasOptions)
    }
  })

  return (
    <React.Fragment>
      {inlineFieldInputGenerator.getInlineFieldInput('Width', 'number', 'wdith')}
      {inlineFieldInputGenerator.getInlineFieldInput('Height', 'number', 'height')}

      <InlineField label="Zoom">
        <Slider
          max={200}
          min={0}
          onAfterChange={onAfterChangeZoom}
          onChange={onChangeZoom}
          value={zoomSliderValue}
        />
      </InlineField>
    </React.Fragment>
  )
}