import { DataFrame } from '@grafana/data'
import { DataFrameOptions } from 'editor/DataFrameEditor/DataFrameOptions'

export interface DataFrameWithSettings {
    dataFrame: DataFrame
    settings: DataFrameOptions
}
