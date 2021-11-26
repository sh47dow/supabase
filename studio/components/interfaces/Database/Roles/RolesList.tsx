import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { Typography, IconChevronRight } from '@supabase/ui'

import { useStore } from 'hooks'
import SparkBar from 'components/ui/SparkBar'
import Table from 'components/to-be-cleaned/Table'

interface Props {
  onSelectRole: (role: any) => void
}

const RolesList: FC<Props> = ({ onSelectRole = () => {} }) => {
  const { meta } = useStore()
  const roles = meta.roles.list()

  return (
    <>
      <Table
        head={[
          <Table.th key="name">Name</Table.th>,
          <Table.th key="system-id">System ID</Table.th>,
          <Table.th key="connections">Connections</Table.th>,
          <Table.th key="blank"></Table.th>,
        ]}
        body={roles.map((x, i) => (
          <Table.tr key={x.id} onClick={() => onSelectRole(x)}>
            <Table.td style={{ width: '25%' }}>
              <Typography.Text>{x.name}</Typography.Text>
            </Table.td>
            <Table.td style={{ width: '25%' }}>
              <Typography.Text>{x.id}</Typography.Text>
            </Table.td>
            <Table.td className="w-full">
              <div className="flex items-center space-x-3">
                <Typography.Text>
                  {x.active_connections}/{x.connection_limit} connections
                </Typography.Text>
                <SparkBar
                  max={x.connection_limit}
                  value={x.active_connections}
                  barClass={'bg-green-500'}
                />
              </div>
            </Table.td>
            <Table.td style={{ maxWidth: '64px' }} className="w-min">
              <Typography.Text type="secondary">
                <IconChevronRight size="tiny" />
              </Typography.Text>
            </Table.td>
          </Table.tr>
        ))}
      />
    </>
  )
}

export default observer(RolesList)
