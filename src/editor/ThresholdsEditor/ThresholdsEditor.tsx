import React, { useState, useEffect } from 'react'
import { Input, useStyles2, Button, Icon, colors } from '@grafana/ui'
import { CustomColorPicker } from 'components/CustomColorPicker/CustomColorPicker'
import { css, cx } from 'emotion'
import { GrafanaTheme2 } from '@grafana/data'
import { ThresholdOptions } from 'editor/ThresholdsEditor/ThresholdOptions'

interface Props {
  className: string
  hasPriority?: boolean
  onChange: (value?: Array<ThresholdOptions>) => void
  value: Array<ThresholdOptions>
}

interface ThresholdOptionsWithKey extends ThresholdOptions {
  key: number
}

export const ThresholdsEditor: React.FC<Props> = ({
  className,
  hasPriority,
  onChange,
  value
}) => {
  const [thresholdsWithKey, setThresholdsWithKey] = useState<Array<ThresholdOptionsWithKey>>(toThresholdsWithKey(value))
  const styles = useStyles2(getStyles)
  const wrapperClass = cx([styles.wrapper, 'threshold-wrapper', className])

  const onAddThreshold = () => {
    let key = 0
    let newValue = 0
    const color = colors.filter(foundColor => !thresholdsWithKey.some(({ color }) => color === foundColor))[1]
    let newThresholdsWithKey

    if (thresholdsWithKey.length > 1) {
      newValue = thresholdsWithKey[thresholdsWithKey.length - 1].value + 10
    }

    key = thresholdsWithKey.reduce((maxKey, { key: currentKey }) => currentKey > maxKey ? currentKey : maxKey, key) + 1

    newThresholdsWithKey = [
      ...thresholdsWithKey,
      {
        value: newValue,
        color,
        key
      }
    ]

    sortThresholds(newThresholdsWithKey)

    setThresholdsWithKey(newThresholdsWithKey)
  }

  const onChangeThresholdValue = ({ target }: any, thresholdWithKey: ThresholdOptionsWithKey) => {
    const cleanValue = target.value.replace(/,/g, '.')
    const parsedValue = parseFloat(cleanValue)
    const value = isNaN(parsedValue) ? '' : parsedValue
    let newThresholdsWithKey

    newThresholdsWithKey = thresholdsWithKey.map(thresholdWithKeyFound => {
      if (thresholdWithKeyFound.key === thresholdWithKey.key) {
        thresholdWithKeyFound = { ...thresholdWithKeyFound, value: value as number }
      }

      return thresholdWithKeyFound
    })

    sortThresholds(newThresholdsWithKey)
    setThresholdsWithKey(newThresholdsWithKey)
  }

  const onChangeThresholdColor = (color: string, thresholdWithKey: ThresholdOptionsWithKey) => {
    let newThresholdsWithKey = thresholdsWithKey.map(thresholdWithKeyFound => {
      if (thresholdWithKeyFound.key === thresholdWithKey.key) {
        thresholdWithKeyFound = { ...thresholdWithKeyFound, color }
      }

      return thresholdWithKeyFound
    })

    setThresholdsWithKey(newThresholdsWithKey)
  }

  const onChangeThresholdPriority = (priority: number, thresholdWithKey: ThresholdOptionsWithKey) => {
    if (priority !== undefined) {
      priority = Number(priority)
    }

    let newThresholdsWithKey = thresholdsWithKey.map(thresholdWithKeyFound => {
      if (thresholdWithKeyFound.key === thresholdWithKey.key) {
        thresholdWithKeyFound = { ...thresholdWithKeyFound, priority }
      }

      return thresholdWithKeyFound
    })

    setThresholdsWithKey(newThresholdsWithKey)
  }

  const onRemoveThreshold = (thresholdWithKey: ThresholdOptionsWithKey) => {
    setThresholdsWithKey(thresholdsWithKey.filter(({ key }) => key !== thresholdWithKey.key))
  }

  const onChangeThresholdsWithKey = () => {
    onChange(thresholdsWithKey.map(({ key, ...threshold }) => ({ ...threshold })))
  }

  const sortThresholds = (thresholdsWithKey: Array<ThresholdOptionsWithKey>): Array<ThresholdOptionsWithKey> => {
    return thresholdsWithKey.sort((a: ThresholdOptionsWithKey, b: ThresholdOptionsWithKey) => {
      return a.value - b.value
    })
  }

  const getColorPicker = (thresholdsWithKey: ThresholdOptionsWithKey) => {
    return (
      <CustomColorPicker
        enableNamedColors={false}
        color={thresholdsWithKey.color}
        onChange={(color: string) => onChangeThresholdColor(color, thresholdsWithKey)}
      />
    )
  }

  const getRemoveIcon = (thresholdsWithKey: ThresholdOptionsWithKey) => {
    return (
      <Icon
        className={styles.trashIcon}
        name="trash-alt"
        onClick={() => onRemoveThreshold(thresholdsWithKey)}
      />
    )
  }

  const getInput = (thresholdWithKey: ThresholdOptionsWithKey) => {
    const prefix = getColorPicker(thresholdWithKey)

    if (!isFinite(thresholdWithKey.value)) {
      return (
        <Input
          css=""
          disabled
          prefix={prefix}
          type="text"
          value="Base"
        >
        </Input>
      )
    }

    const input = (
      <div className={styles.inputWrapper}>
        <Input
          className={cx({ [styles.inputThreshold]: hasPriority })}
          css=""
          onBlur={() => { }}
          onChange={(event) => onChangeThresholdValue(event, thresholdWithKey)}
          placeholder="value"
          prefix={prefix}
          step="1"
          suffix={getRemoveIcon(thresholdWithKey)}
          type="number"
          value={thresholdWithKey.value}
        />
        {hasPriority && <Input
          className={styles.inputPriority}
          css=""
          onChange={({ target }: any) => onChangeThresholdPriority(target.value, thresholdWithKey)}
          placeholder="Priority"
          type="number"
          value={thresholdWithKey.priority}
        />
        }
      </div>
    )
    return input
  }

  useEffect(() => {
    onChangeThresholdsWithKey()
  }, [thresholdsWithKey])

  return (
    <div className={wrapperClass}>
      <Button
        className={styles.addButton}
        fullWidth
        icon="plus"
        onClick={onAddThreshold}
        variant="secondary"
        size="sm"
      >
        Add threshold
      </Button>

      {thresholdsWithKey
        .slice(0)
        .reverse()
        .map(thresholdWithKey => (
          <div
            className={styles.item}
            key={thresholdWithKey.key}
          >
            {getInput(thresholdWithKey)}
          </div>
        ))}
    </div>
  )
}

const toThresholdsWithKey = (thresholds: Array<ThresholdOptions>) => {
  if (!thresholds || thresholds.length === 0) {
    thresholds = [{ color: 'green', value: -Infinity }]
  } else {
    thresholds[0].value = -Infinity
  }

  return thresholds.map((threshold, index) => ({
    ...threshold,
    key: index
  }))
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    wrapper: css`
      display: flex;
      flex-direction: column;
    `,
    item: css`
      margin-bottom: ${theme.spacing(1)};
      &:last-child {
        margin-bottom: 0;
      }
    `,
    addButton: css`
      justify-content: center;
      margin-bottom: ${theme.spacing(1)};
    `,
    trashIcon: css`
      cursor: pointer;
    `,
    inputWrapper: css`
      width: 100%;
      display: flex;
      flex-wrap: nowrap;
    `,
    inputThreshold: css`
      margin-right: ${theme.spacing(0.5)};
    `,
    inputPriority: css`
      margin-left: ${theme.spacing(0.5)};
    `
  }
}
