import { observer } from 'mobx-react-lite'

import { NextPageWithLayout } from 'types'
import { useParams, useStore } from 'hooks'
import FunctionsLayout from 'components/layouts/FunctionsLayout'

import Table from 'components/to-be-cleaned/Table'
import { FunctionsListItem } from 'components/interfaces/Functions'
import { Alert, Button, IconPlus, IconSearch, Input, Modal, SidePanel } from 'ui'
import { useEffect, useState } from 'react'
import * as React from 'react'
import { FunctionEditSidePanel } from '../../../../components/interfaces/Functions'
import { FunctionListItem, useFunctionsQuery } from '../../../../data/functions/functions-query'
import { useFunctionDeleteMutation } from '../../../../data/functions/functions-delete-mutation'
import { Pagination } from '../../../../components/ui/Pagination'

const FunctionsList = ({
  functions,
  isLoading,
  error,
  showNewFuncModal,
  setShowNewFuncModal,
}: {
  functions: FunctionListItem[]
  isLoading: boolean
  error: any
  showNewFuncModal: boolean
  setShowNewFuncModal: (value: boolean) => void
}) => {
  const [showEditFuncModal, setShowEditFuncModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedFunction, setSelectedFunction] = useState<FunctionListItem>()
  const { mutateAsync: deleteFunction, isLoading: isDeleting } = useFunctionDeleteMutation()
  const { ui } = useStore()
  const { ref: projectRef } = useParams()
  // const { refetch } = useFunctionsQuery({ projectRef})

  function onDeleteFunction(fc: FunctionListItem) {
    setSelectedFunction(fc)
    setShowDeleteModal(true)
  }

  function onEditFunction(fc: FunctionListItem) {
    setSelectedFunction(fc)
    setShowEditFuncModal(true)
  }

  function onConfirmDelete() {
    if (selectedFunction === undefined) return console.error('No edge function selected')
    // @ts-ignore
    deleteFunction({ projectRef, id: selectedFunction.id })
      .then(() => {
        ui.setNotification({ category: 'success', message: `删除云函数成功` })
        // refetch()
      })
      .catch((error: any) => {
        ui.setNotification({
          category: 'error',
          message: `删除云函数失败: ${error.message}`,
        })
      })
      .finally(() => {
        setShowDeleteModal(false)
      })
  }

  return (
    <>
      <div className="overflow-x-scroll">
          <Table
            head={
              <>
                <Table.th>函数名称</Table.th>
                <Table.th>访问地址</Table.th>
                <Table.th>访问方法</Table.th>
                <Table.th className="hidden lg:table-cell">创建时间</Table.th>
                <Table.th className="hidden 2xl:table-cell">更新时间</Table.th>
                <Table.th className="hidden lg:table-cell">备注信息</Table.th>
                <Table.th className="text-right"></Table.th>
              </>
            }
            loading={isLoading}
            body={
              <>
                {error ? (
                  <tr>
                    <td colSpan={99} className="space-y-1">
                      <p className="opacity-75">获取文件失败，请稍后再试</p>
                    </td>
                  </tr>
                ) : functions.length > 0 ? (
                  functions.map((item: any) => (
                    <FunctionsListItem
                      key={item.id}
                      fc={item}
                      onDeleteFunction={onDeleteFunction}
                      onEditFunction={onEditFunction}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={99} className="space-y-1">
                      <p className="opacity-75">暂无函数</p>
                    </td>
                  </tr>
                )}
              </>
            }
          />
        </div>

      <FunctionEditSidePanel
        visible={showNewFuncModal}
        setVisible={setShowNewFuncModal}
        canEdit={true}
        type="create"
      />
      <FunctionEditSidePanel
        visible={showEditFuncModal}
        setVisible={setShowEditFuncModal}
        canEdit={true}
        selectedFunction={selectedFunction}
        type="edit"
      />
      <Modal
        size="small"
        alignFooter="right"
        header={<h3>确认删除函数 {selectedFunction?.funcName}</h3>}
        visible={showDeleteModal}
        loading={isDeleting}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={onConfirmDelete}
      >
        <div className="py-6">
          <Modal.Content>
            <Alert withIcon variant="warning" title="此操作无法撤销">
              删除后不可恢复，请谨慎操作
            </Alert>
          </Modal.Content>
        </div>
      </Modal>
    </>
  )
}

const PageLayout: NextPageWithLayout = () => {
  // const { functions } = useStore()
  const { ref } = useParams()
  const { data: functions, isLoading, error } = useFunctionsQuery({ projectRef: ref })
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageData, setPageData] = useState<FunctionListItem[]>([])
  const [filterString, setFilterString] = useState<string>('')
  const [filteredData, setFilteredData] = useState<FunctionListItem[]>([])
  const [showNewFuncModal, setShowNewFuncModal] = useState(false)

  useEffect(() => {
    setCurrentPage(1)
  }, [pageSize, filterString])

  useEffect(() => {
    if (functions) {
      if (filterString === '') {
        setFilteredData(functions)
        return
      }
      const filteredFunctions = functions.filter((fc: FunctionListItem) => {
        return fc.funcName.toLowerCase().includes(filterString.toLowerCase())
      })
      setFilteredData(filteredFunctions)
    } else {
      setFilteredData([])
    }
  }, [filterString, functions])

  useEffect(() => {
    if (filteredData) {
      if (currentPage > 1 && filteredData.length <= (currentPage - 1) * pageSize) {
        setCurrentPage(currentPage - 1)
        return
      }
      setPageData(filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize))
    }
  }, [currentPage, filteredData])

  const onUpdatePage = (page: number) => {
    setCurrentPage(page)
    // setPageData(filteredData.slice((page - 1) * pageSize, page * pageSize))
  }

  const handleNewFunc = () => {
    setShowNewFuncModal(true)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        {/*<span className="text-sm text-scale-900">{`已部署 ${functions.length} 个函数`}</span>*/}
        <Input
          className="w-50"
          placeholder="搜索函数"
          size="small"
          icon={<IconSearch />}
          value={filterString}
          onChange={(e) => setFilterString(e.target.value)}
        />
        <Button type="primary" size="tiny" icon={<IconPlus />} onClick={handleNewFunc}>
          新建函数
        </Button>
      </div>
      <FunctionsList
        functions={pageData || []}
        isLoading={isLoading}
        error={error}
        showNewFuncModal={showNewFuncModal}
        setShowNewFuncModal={setShowNewFuncModal}
      />
      <Pagination
        loading={isLoading}
        total={filteredData?.length || 0}
        pageSize={pageSize}
        onUpdatePage={onUpdatePage}
        currentPage={currentPage}
      />
    </div>
  )
}

PageLayout.getLayout = (page) => <FunctionsLayout>{page}</FunctionsLayout>

export default observer(PageLayout)
