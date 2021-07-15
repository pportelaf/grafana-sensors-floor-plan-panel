import React from 'react'
import { Orientation, Side } from 'editor/SensorEditor/SensorOptions'

interface Props {
  orientation: Orientation
  side: Side
  wallStrokeWidth: number | undefined
  doorWidth: number | undefined
  offsetX: number | undefined
  width: number | undefined
  height: number | undefined
  strokeWidth: number
  fill: string | undefined
}

export const SensorDoorWallOverlay: React.FC<Props> = ({
  doorWidth = 0,
  fill,
  height = 0,
  offsetX = 0,
  orientation,
  side,
  strokeWidth,
  wallStrokeWidth = 0,
  width = 0
}) => {
  const isVerticalOrientation = orientation === Orientation.Top || orientation === Orientation.Bottom

  const getWallOverlay = () => {
    if (!isVerticalOrientation) {
      return getWallOverlayHorizontal()
    }

    return getWallOverlayVertical()
  }

  const getWallOverlayVertical = () => {
    const wallOverlayOffset = (2 * offsetX) + (strokeWidth / 2)
    const wallOverlayWidth = width - (2 * offsetX)
    let x = doorWidth + wallOverlayOffset
    let y = height

    if (orientation === Orientation.Bottom) {
      y = 0
    }

    if (side === Side.End) {
      x = wallOverlayOffset
    }

    return getWallOverlayView(x, y, wallOverlayWidth, wallStrokeWidth)
  }

  const getWallOverlayHorizontal = () => {
    const wallOverlayOffset = (2 * offsetX) + (strokeWidth / 2)
    const wallOverlayHeight = width - (2 * offsetX)
    let x = width
    let y = doorWidth + wallOverlayOffset

    if (orientation === Orientation.Right) {
      x = 0
    }

    if (side === Side.End) {
      y = wallOverlayOffset
    }

    return getWallOverlayView(x, y, wallStrokeWidth, wallOverlayHeight)
  }

  const getWallOverlayView = (x: number, y: number, width: number, height: number) => {
    return (
      <rect
        fill={fill}
        height={height}
        x={x}
        y={y}
        stroke={fill}
        stroke-width={strokeWidth}
        width={width}
      />
    )
  }

  return (
    getWallOverlay()
  )
}
