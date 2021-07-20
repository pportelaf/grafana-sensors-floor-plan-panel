import React from 'react'
import { GrafanaTheme2 } from '@grafana/data'
import { useStyles2 } from '@grafana/ui'
import { css, cx } from 'emotion'
import { Orientation, Side } from 'editor/SensorEditor/SensorOptions'

interface Props {
  orientation: Orientation
  side: Side
  wallStrokeWidth: number | undefined
  doorWidth: number | undefined
  offsetY: number | undefined
  offsetX: number | undefined
  width: number | undefined
  height: number | undefined
  isOpen: boolean
}

export const SensorDoorView: React.FC<Props> = ({
  isOpen,
  width = 0,
  height = 0,
  orientation,
  doorWidth = 0,
  side,
  wallStrokeWidth = 0,
  offsetX = 0,
  offsetY = 0
}) => {
  const styles = useStyles2(getStyles)
  const isVerticalOrientation = orientation === Orientation.Top || orientation === Orientation.Bottom

  const getDoor = () => {
    if (!isVerticalOrientation) {
      return getHorizontalDoor()
    }

    return getVerticalDoor()
  }

  const getVerticalDoor = () => {
    let x = offsetX
    let y = offsetY
    let currentWidth = doorWidth
    let currentHeight = height

    if (orientation === Orientation.Bottom) {
      y = wallStrokeWidth
    }

    if (side === Side.End) {
      x += width + offsetX
    }

    return getDoorView(x, y, currentWidth, currentHeight)
  }

  const getHorizontalDoor = () => {
    let x = offsetX
    let y = offsetY
    let currentWidth = height
    let currentHeight = doorWidth

    if (orientation === Orientation.Right) {
      x = wallStrokeWidth
    }

    if (side === Side.End) {
      y += height + offsetX
    }

    return getDoorView(x, y, currentWidth, currentHeight)
  }

  const getTransformOrigin = () => {
    if (isVerticalOrientation) {
      return getVerticalTransformOrigin()
    }

    return getHorizontalTransformOrigin()

  }

  const getVerticalTransformOrigin = () => {
    let xOrigin = '100%'
    let yOrigin = '100%'

    if (orientation === Orientation.Bottom) {
      yOrigin = '0'
    }

    if (side === Side.End) {
      xOrigin = '0'
    }

    return `${xOrigin} ${yOrigin}`
  }

  const getHorizontalTransformOrigin = () => {
    let xOrigin = '100%'
    let yOrigin = '100%'

    if (orientation === Orientation.Right) {
      xOrigin = '0'
    }

    if (side === Side.End) {
      yOrigin = '0'
    }

    return `${xOrigin} ${yOrigin}`
  }

  const getDoorClosedRotateDegrees = () => {
    let rotateDegrees = isVerticalOrientation ? 90 : -90

    if (side === Side.End) {
      rotateDegrees = rotateDegrees * -1
    }

    if (orientation === Orientation.Bottom || orientation === Orientation.Right) {
      rotateDegrees = rotateDegrees * -1
    }

    return rotateDegrees
  }

  const getDoorView = (x: number, y: number, width: number, height: number) => {
    const transformOrigin = getTransformOrigin()
    const doorClosedRotateDegrees = getDoorClosedRotateDegrees()

    return (
      <rect
        className={cx(
          styles.door(transformOrigin),
          { [styles.doorOpen]: isOpen },
          { [styles.doorClosed(doorClosedRotateDegrees)]: !isOpen },
        )}
        x={x}
        y={y}
        width={width}
        height={height}
        fill="none"
      />
    )
  }

  return (
    getDoor()
  )
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    door: (transformOrigin: string) => css`
      transform-origin: ${transformOrigin};
      transform-box: fill-box;
      transition: transform 1s ease-in;
      transform: rotate(0);
    `,
    doorOpen: css`
      transform: rotate(0);
    `,
    doorClosed: (rotateDegrees: number) => css`
      transform: rotate(${rotateDegrees}deg);
    `,
  }
}
