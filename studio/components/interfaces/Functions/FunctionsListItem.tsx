import { FC } from 'react'
import { useRouter } from 'next/router'

import {useParams, useStore} from 'hooks'
import Table from 'components/to-be-cleaned/Table'
import {FunctionListItem} from "../../../data/functions/functions-query";
import {Button, Dropdown, IconEdit, IconMoreVertical, IconTrash} from "ui";
import CopyButton from "../../ui/CopyButton";

interface Props {
  fc: FunctionListItem,
  onEditFunction: (func: FunctionListItem) => void,
  onDeleteFunction: (func: FunctionListItem) => void,
}

const FunctionsListItem: FC<Props> = ({ fc: item , onDeleteFunction, onEditFunction}) => {
  const router = useRouter()
  const { ref } = useParams()
  return (
    <Table.tr
      key={item.id}
      onClick={() => {
        router.push(`/project/${ref}/functions/${item.id}/details`)
      }}
    >
      <Table.td className="">
        <div className="flex items-center gap-2">
          <span className="text-sm text-scale-1200">{item.funcName}</span>
        </div>
      </Table.td>
      <Table.td className="">
        <div className="text-xs text-scale-900 flex gap-2 items-center truncate">
          <span className="font-mono truncate">{item.endpoint}</span>
          <CopyButton onClick={e => e.stopPropagation()} type="text" size="tiny" text={item.endpoint} />
        </div>
      </Table.td>
      <Table.td className="">
        <div className="flex gap-2 items-center">
          <span className="text-sm text-scale-900">{item.methods}</span>
        </div>
      </Table.td>
      <Table.td className="hidden lg:table-cell">
        <span className="text-scale-1100">
          {item.createdAt}
        </span>
      </Table.td>
      <Table.td className="hidden 2xl:table-cell">
        <span className="text-scale-1100">
          {item.updatedAt}
        </span>
      </Table.td>
      <Table.td className="hidden lg:table-cell">
        <span className="block max-w-[10vw] text-scale-1100">{item.desc}</span>
      </Table.td>
      <Table.td className="2xl:table-cell text-right" onClick={(e) => e.preventDefault()}>
        <Dropdown
          side="bottom"
          align="end"
          size="small"
          overlay={
            <>
              <Dropdown.Item
                icon={<IconEdit size={14} />}
                // onClick={(e) => e.stopPropagation()}
                onClick={() => onEditFunction(item)}
              >
                编辑
              </Dropdown.Item>
              <Dropdown.Separator />
              <Dropdown.Item
                icon={<IconTrash size={14} />}
                // onClick={(e) => e.stopPropagation()}
                onClick={() => onDeleteFunction(item)}
              >
                删除
              </Dropdown.Item>
            </>
          }
        >
          <Button
            type="default"
            style={{ paddingLeft: 4, paddingRight: 4 }}
            icon={<IconMoreVertical />}
          />
        </Dropdown>
      </Table.td>
    </Table.tr>
  )
}

export default FunctionsListItem
