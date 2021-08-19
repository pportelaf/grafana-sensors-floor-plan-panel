import React from 'react'
import { GrafanaTheme2 } from '@grafana/data'
import { useStyles2 } from '@grafana/ui'
import { css, cx } from 'emotion'
import { Orientation, Side } from 'editor/SensorEditor/SensorOptions'

interface Props {
  doorWidth: number | undefined
  height: number | undefined
  isOpen: boolean
  offsetX: number | undefined
  offsetY: number | undefined
  orientation: Orientation
  side: Side
  wallStrokeWidth: number | undefined
  width: number | undefined
}

export const SensorDoorQuarterCircle: React.FC<Props> = ({
  doorWidth = 0,
  height = 0,
  isOpen,
  offsetX = 0,
  offsetY = 0,
  orientation,
  side,
  wallStrokeWidth = 0,
  width = 0,
}) => {
  const styles = useStyles2(getStyles)

  const getQuarterCircle = () => {
    switch (orientation) {
      case Orientation.Bottom:
        return getBottomHalfCirlcle()
      case Orientation.Left:
        return getLeftHalfCirlcle()
      case Orientation.Right:
        return getRightHalfCirlcle()
      default:
        return getTopHalfCirlcle()
    }
  }

  const getTopHalfCirlcle = () => {
    let moveToX = 2 * offsetX + doorWidth
    let moveToY = offsetY
    let x = width
    let y = height

    if (side === Side.End) {
      moveToX = offsetX
      moveToY = height + offsetY
      y = height * -1
    }

    return getQuarterCircleView(moveToX, moveToY, width, height, x, y)
  }

  const getBottomHalfCirlcle = () => {
    let moveToX = 2 * offsetY + doorWidth + width
    let moveToY = wallStrokeWidth
    let x = width * -1
    let y = height

    if (side === Side.End) {
      moveToX = offsetY + width
      moveToY = wallStrokeWidth + height
      y = height * -1
    }

    return getQuarterCircleView(moveToX, moveToY, width, height, x, y)
  }

  const getLeftHalfCirlcle = () => {
    let moveToX = offsetY + height
    let moveToY = 2 * offsetX + doorWidth + width
    let x = height * -1
    let y = width * -1

    if (side === Side.End) {
      moveToX = offsetY
      moveToY = offsetX + width
      x = height
      y = width * -1
    }

    return getQuarterCircleView(moveToX, moveToY, width, height, x, y)
  }

  const getRightHalfCirlcle = () => {
    let moveToX = wallStrokeWidth + height
    let moveToY = 2 * offsetX + doorWidth
    let x = height * -1
    let y = width

    if (side === Side.End) {
      moveToX = wallStrokeWidth
      moveToY = offsetX
      x = height
    }

    return getQuarterCircleView(moveToX, moveToY, width, height, x, y)
  }

  const getStrokeDashArray = () => {
    let strokeDashArray = -1

    if (orientation === Orientation.Bottom || orientation === Orientation.Left) {
      strokeDashArray = 1
    }

    if (side === Side.End) {
      strokeDashArray = strokeDashArray * -1
    }

    return strokeDashArray
  }

  const getQuarterCircleView = (
    moveToX: number,
    moveToY: number,
    radiiX: number,
    radiiY: number,
    x: number,
    y: number
  ) => {
    const strokeDashArray = getStrokeDashArray()

    return (
      <path
        className={cx(
          styles.doorQuarterCircle,
          { [styles.doorOpenQuarterCircle]: isOpen },
          { [styles.doorClosedQuarterCircle(strokeDashArray)]: !isOpen }
        )}
        d={`M${moveToX}, ${moveToY} a${radiiX}, ${radiiY} 0 0, 1 ${x}, ${y}`}
        fill="none"
        pathLength="1"
      />
    )
  }

  return getQuarterCircle()
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    doorQuarterCircle: css`
      stroke-dasharray: 1;
      transition: stroke-dashoffset 1s ease-in;
    `,
    doorOpenQuarterCircle: css`
      stroke-dashoffset: 0;
    `,
    doorClosedQuarterCircle: (strokeDashArray: number) => css`
      stroke-dashoffset: ${strokeDashArray};
    `,
  }
}
