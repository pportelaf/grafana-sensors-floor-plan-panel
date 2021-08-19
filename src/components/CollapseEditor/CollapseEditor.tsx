import React, { FunctionComponent } from 'react'
import { GrafanaTheme2 } from '@grafana/data'
import { useStyles2, HorizontalGroup, IconButton } from '@grafana/ui'
import { css, cx } from 'emotion'
import { CustomCollapse } from '../CustomCollapse/CustomCollapse'

const getStyles = (theme: GrafanaTheme2) => ({
  label: css`
    margin-bottom: 0;
  `,
  headerLabel: css`
    label: collapse__header-label;
    font-weight: ${theme.typography.fontWeightMedium};
    font-size: ${theme.typography.fontSize}px;
    width: 100%;
  `,
})

export interface Props {
  /** Expand or collapse te content */
  isOpen?: boolean
  /** Text for the Collapse header */
  label: string
  /** Indicates loading state of the content */
  loading?: boolean
  /** Toggle collapsed header icon */
  collapsible?: boolean
  /** Callback for the toggle functionality */
  onToggle?: (isOpen: boolean) => void
  /** Additional class name for the root element */
  className?: string
  /** Callback for remove action */
  onRemove?: () => void
  /** Callback for move up action */
  onMoveUp?: () => void
  /** Callback for copy action */
  onCopy?: () => void
  /** Show remove button */
  showRemove?: boolean
  /** Show move up button */
  showMoveUp?: boolean
  /** Show copy button */
  showCopy?: boolean
}

export const CollapseEditor: FunctionComponent<Props> = ({
  isOpen,
  label,
  loading,
  collapsible,
  onToggle,
  className,
  children,
  showRemove,
  showCopy,
  showMoveUp,
  onCopy,
  onMoveUp,
  onRemove,
}) => {
  const style = useStyles2(getStyles)

  const handleButtonClick = (ev: React.MouseEvent, callback: (() => void) | undefined) => {
    ev.stopPropagation()

    if (callback) {
      callback()
    }
  }

  const labelElement = (
    <HorizontalGroup justify="space-between">
      <div className={cx([style.headerLabel])}>{label}</div>
      <HorizontalGroup>
        {showMoveUp && <IconButton name="arrow-up" onClick={(ev) => handleButtonClick(ev, onMoveUp)} size="sm" />}
        {showCopy && <IconButton name="copy" onClick={(ev) => handleButtonClick(ev, onCopy)} size="sm" />}
        {showRemove && <IconButton name="trash-alt" onClick={(ev) => handleButtonClick(ev, onRemove)} size="sm" />}
      </HorizontalGroup>
    </HorizontalGroup>
  )

  return (
    <CustomCollapse
      className={className}
      collapsible={collapsible}
      isOpen={isOpen}
      label={labelElement}
      loading={loading}
      onToggle={onToggle}
    >
      {children}
    </CustomCollapse>
  )
}
