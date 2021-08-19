import React, { FunctionComponent } from 'react'
import { GrafanaTheme2 } from '@grafana/data'
import { useStyles2, Icon } from '@grafana/ui'
import { css, cx } from 'emotion'

const getStyles = (theme: GrafanaTheme2) => ({
  collapse: css`
    label: collapse;
    margin-bottom: ${theme.spacing(1)};
  `,
  collapseBody: css`
    label: collapse__body;
    padding: ${theme.spacing(0, 1, 1, 1)};
    padding-top: 0;
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  `,
  bodyContentWrapper: css`
    label: bodyContentWrapper;
    flex: 1;
    overflow: hidden;
  `,
  loader: css`
    label: collapse__loader;
    height: 2px;
    position: relative;
    overflow: hidden;
    background: none;
    margin: ${theme.spacing(0.5)};
  `,
  loaderActive: css`
    label: collapse__loader_active;
    &:after {
      content: ' ';
      display: block;
      width: 25%;
      top: 0;
      top: -50%;
      height: 250%;
      position: absolute;
      animation: loader 2s cubic-bezier(0.17, 0.67, 0.83, 0.67) 500ms;
      animation-iteration-count: 100;
      left: -25%;
      background: ${theme.colors.background.primary};
    }
    @keyframes loader {
      from {
        left: -25%;
        opacity: 0.1;
      }
      to {
        left: 100%;
        opacity: 1;
      }
    }
  `,
  header: css`
    label: collapse__header;
    padding: ${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(1)} ${theme.spacing(2)};
    display: flex;
    cursor: inherit;
    transition: all 0.1s linear;
    cursor: pointer;
  `,
  headerCollapsed: css`
    label: collapse__header--collapsed;
    padding: ${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(1)} ${theme.spacing(2)};
  `,
  headerLabel: css`
    label: collapse__header-label;
    font-weight: ${theme.typography.fontWeightMedium};
    font-size: ${theme.typography.fontSize}px;
    width: 100%;
  `,
  icon: css`
    label: collapse__icon;
    margin-right: ${theme.spacing(1)};
  `,
})

export interface Props {
  /** Expand or collapse te content */
  isOpen?: boolean
  /** Element or text for the Collapse header */
  label: React.ReactNode
  /** Indicates loading state of the content */
  loading?: boolean
  /** Toggle collapsed header icon */
  collapsible?: boolean
  /** Callback for the toggle functionality */
  onToggle?: (isOpen: boolean) => void
  /** Additional class name for the root element */
  className?: string
}

export const CustomCollapse: FunctionComponent<Props> = ({
  isOpen,
  label,
  loading,
  collapsible,
  onToggle,
  className,
  children,
}) => {
  const style = useStyles2(getStyles)
  const onClickToggle = () => {
    if (onToggle) {
      onToggle(!isOpen)
    }
  }

  const panelClass = cx([style.collapse, 'panel-container', className])
  const loaderClass = loading ? cx([style.loader, style.loaderActive]) : cx([style.loader])
  const headerClass = collapsible ? cx([style.header]) : cx([style.headerCollapsed])

  return (
    <div className={panelClass}>
      <div className={headerClass} onClick={onClickToggle}>
        {collapsible && <Icon className={style.icon} name={isOpen ? 'angle-up' : 'angle-down'} />}
        <div className={cx([style.headerLabel])}>{label}</div>
      </div>
      {isOpen && (
        <div className={cx([style.collapseBody])}>
          <div className={loaderClass} />
          <div className={style.bodyContentWrapper}>{children}</div>
        </div>
      )}
    </div>
  )
}

CustomCollapse.displayName = 'CustomCollapse'
