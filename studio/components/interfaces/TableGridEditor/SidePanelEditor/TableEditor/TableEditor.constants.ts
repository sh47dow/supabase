import { uuidv4 } from 'lib/helpers'
import { ColumnField } from '../SidePanelEditor.types'

export const DEFAULT_COLUMNS: ColumnField[] = [
  {
    id: uuidv4(),
    name: 'id',
    format: 'int8',
    defaultValue: null,
    foreignKey: undefined,
    isNullable: false,
    isUnique: false,
    isArray: false,
    isPrimaryKey: true,
    isIdentity: true,
    isNewColumn: true,
  },
  {
    id: uuidv4(),
    name: 'created_at',
    format: 'timestamptz',
    defaultValue: 'now()',
    foreignKey: undefined,
    isNullable: true,
    isUnique: false,
    isArray: false,
    isPrimaryKey: false,
    isIdentity: false,
    isNewColumn: true,
  },
]
