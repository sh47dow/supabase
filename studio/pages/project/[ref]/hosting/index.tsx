import { NextPageWithLayout } from '../../../../types'
import ProjectLayout, { ProjectLayoutWithAuth } from '../../../../components/layouts'
import { observer } from 'mobx-react-lite'
import { Button, IconEdit, IconTrash, IconUpload, Modal } from 'ui'
import { useStore, withAuth } from '../../../../hooks'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import ShimmeringLoader from '../../../../components/ui/ShimmeringLoader'
import dayjs from 'dayjs'
import { File, Folder } from 'react-feather'
import IconBase from 'ui/src/components/Icon/IconBase'
import HeaderBreadcrumbs from '../../../../components/ui/FileBreadcrumbs'
import {formatBytes, getDomain} from '../../../../lib/helpers'
import ConfirmationModal from '../../../../components/ui/ConfirmationModal'
import ConfigDomainSidePanel from '../../../../components/interfaces/Hosting/ConfigDomainSidePanel'
import { SOURCE_FILE_SIZE_LIMIT } from '../../../../lib/constants'
import HostingLayout from '../../../../components/layouts/HostingLayout'

const Home: NextPageWithLayout = () => {
  const { hosting, ui } = useStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const [path, setPath] = useState('/')
  const [showConfirmUpload, setShowConfirmUpload] = useState(false)
  const [showConfigDomain, setShowConfigDomain] = useState(false)
  const [showUnbindDomain, setShowUnbindDomain] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showConfirmClose, setShowConfirmClose] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const project = ui.selectedProject

  useEffect(() => {
    hosting.fetchByPath(path.substring(1))
  }, [path])

  function onUploadClick() {
    if (hosting.data.length > 0) {
      setShowConfirmUpload(true)
    } else {
      inputRef.current?.click()
    }
  }

  function openFolder(folder: string) {
    setPath(`${path}${folder}`)
  }

  function onPathClick(index: number) {
    const newPath = path.substring(0, path.indexOf('/', index) + 1)
    setPath(newPath)
  }

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (files) {
      const uploadFile = files[0]

      if (uploadFile) {
        if (uploadFile.size > SOURCE_FILE_SIZE_LIMIT) {
          ui.setNotification({ category: 'error', message: '压缩文件大小不能超过100Mb' })
          return false
        }
        setIsUploading(true)
        await hosting.upload(uploadFile)
        setIsUploading(false)
        setPath('/')
        await hosting.fetchByPath()
        await hosting.queryDomain()
        inputRef.current!.value = ''
      }
    }
  }

  async function handleUnbindDomain() {
    await hosting.unbindDomain()
    setShowUnbindDomain(false)
  }

  async function handleClear() {
    setShowClearConfirm(false)
    setIsClearing(true)
    await hosting.clear()
    setIsClearing(false)
    setPath('/')
    hosting.fetchByPath(path.substring(1))
  }

  function handleCloseSidePanel() {
    if (isEditing) {
      setShowConfirmClose(true)
    } else {
      setShowConfigDomain(false)
    }
  }

  return (
    <>
      <div
        className="dark:border-dark flex max-h-12 items-center border-b px-6"
        style={{ minHeight: '3rem' }}
      >
        <h4 className="text-lg">静态托管</h4>
        <div className="flex-grow">
          <div className="flex items-center justify-end">
            <div className="px-2 py-1 mr-2 inline-block border-yellow-600 border bg-yellow-200 rounded-sm text-sm">
              <label>根据国家相关法律法规要求，请完善当前账号实名认证，方便使用静态网站托管服务。</label>
              <a className="ml-3 text-blue-800" href={getDomain() +  '/setting/certification'} target="_blank">
                前往认证
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        {hosting.domain && (
          <div className="flex items-center">
            <div className="px-2 py-1 mr-2 inline-block border-blue-500 border bg-blue-300 rounded-sm text-sm">
              <label>访问地址：</label>
              <a className="text-blue-800" href={`http://${hosting.domain}`} target="_blank">
                {'http://' + hosting.domain}
              </a>
            </div>
            {hosting.customDomain ? (
              <Button type="text" onClick={() => setShowUnbindDomain(true)}>
                解绑域名
              </Button>
            ) : (
              <Button type="default" icon={<IconEdit />} onClick={() => setShowConfigDomain(true)}>
                配置域名
              </Button>
            )}
          </div>
        )}
        <div className="border dark:border-dark my-3">
          <div className="h-[37px] flex flex-row items-between justify-center bg-panel-footer-light dark:bg-panel-footer-dark">
            <HeaderBreadcrumbs
              className="flex-grow"
              breadcrumbs={['root', ...path.split('/').filter((item) => !!item)]}
              selectBreadcrumb={(index) => onPathClick(index)}
            />
            <div className="flex items-center">
              <input ref={inputRef} type="file" hidden onChange={handleUpload} accept="application/zip" />
              <Button
                icon={<IconUpload size={16} strokeWidth={2} />}
                type="text"
                onClick={onUploadClick}
                disabled={hosting.isLoading || hosting.isError || isClearing || isUploading}
              >
                上传文件
              </Button>
              <Button
                icon={<IconTrash size={16} strokeWidth={2} />}
                type="text"
                onClick={() => setShowClearConfirm(true)}
                disabled={hosting.data.length === 0 || hosting.isLoading || isClearing || isUploading}
              >
                清空文件
              </Button>
            </div>
          </div>

          <div className="border-t dark:border-dark flex flex-grow flex-col">
            <div
              className="
                              sticky top-0
                              flex min-w-min items-center border-b border-panel-border-light bg-panel-footer-light px-2.5
                              py-2 dark:border-panel-border-dark dark:bg-panel-footer-dark
                            "
            >
              <div className="flex w-[60%] min-w-[250px] items-center">
                <p className="text-sm">名称</p>
              </div>
              <p className="w-[15%] min-w-[100px] text-sm">大小</p>
              <p className="w-[25%] min-w-[160px] text-sm">创建时间</p>
            </div>
            {isUploading ?
              <div className="h-full w-full flex flex-col items-center justify-center py-3">
                <img
                  src="/img/unzipping.svg"
                  className="opacity-75 pointer-events-none"
                />
                <p className="text-sm text-scale-1100">正在上传，请稍后...</p>
              </div>
              : isClearing ?
                <div className="h-full w-full flex flex-col items-center justify-center py-3">
                  <img
                    src="/img/unzipping.svg"
                    className="opacity-75 pointer-events-none"
                  />
                  <p className="text-sm text-scale-1100">正在清空，请稍后...</p>
                </div>
              : (
                hosting.isLoading ?
                <div className={'w-full my-1 flex flex-shrink-0 flex-col space-y-1 overflow-auto'}>
                  <ShimmeringLoader />
                  <ShimmeringLoader />
                  <ShimmeringLoader />
                </div>
                : (
                  hosting.data.length === 0 ?
                  <div className="h-full w-full flex flex-col items-center justify-center py-3">
                    <img
                      src="/img/storage-placeholder.svg"
                      className="opacity-75 pointer-events-none"
                    />
                    {!hosting.isError ?
                      <>
                        <p className="my-3 opacity-75">请点击"上传文件"按钮</p>
                        <p className="w-70 text-center text-sm text-scale-1100">
                          zip文件大小不能超过100Mb，压缩包内单个源文件不能超过20Mb，index.html文件必须在zip文件根目录下
                        </p>
                      </>
                      :
                      <p className="my-3 opacity-75">获取文件失败，请稍后再试</p>
                    }
                  </div>
                  : hosting.data.map((column, index) => (
                        <div
                          className={[
                            'border-b dark:border-dark h-[37px]',
                            'hover:bg-panel-footer-light dark:hover:bg-panel-footer-dark',
                            hosting.isLoaded && column.type === 'folder'
                              ? 'cursor-pointer'
                              : 'pointer-events-none',
                          ].join(' ')}
                          onClick={(event) => openFolder(column.name + '/')}
                          key={index}
                        >
                          <div className="flex items-center justify-between px-2.5 h-full">
                            <div className="flex w-[60%] min-w-[250px] items-center">
                              {column.type === 'folder' ? (
                                <IconBase icon={Folder} size={16} strokeWidth={2} />
                              ) : (
                                <IconBase icon={File} size={16} strokeWidth={2} />
                              )}
                              <span className="flex-grow pl-1.5">{column.name}</span>
                            </div>
                            <div className="w-[15%] min-w-[100px] text-sm">
                              {formatBytes(column.size) || '-'}
                            </div>
                            <div className="w-[25%] min-w-[160px] text-sm">
                              {column.createdTime
                                ? dayjs(column.createdTime).format('DD/MM/YYYY HH:mm:ss')
                                : '-'}
                            </div>
                          </div>
                        </div>
                      ))
                )
              )
            }
          </div>
        </div>
      </div>
      {showConfigDomain && (
        <ConfigDomainSidePanel
          onCancel={() => {
            handleCloseSidePanel()
          }}
          onEdit={() => setIsEditing(true)}
          onFinish={() => setShowConfigDomain(false)}
        />
      )}
      <ConfirmationModal
        visible={showConfirmClose}
        header="确认关闭"
        buttonLabel="确认"
        onSelectCancel={() => setShowConfirmClose(false)}
        onSelectConfirm={() => {
          setShowConfirmClose(false)
          setIsEditing(false)
          setShowConfigDomain(false)
        }}
        children={
          <Modal.Content>
            <p className="py-4 text-sm text-scale-1100">
              有未保存的更改。您确定要关闭面板吗？您的更改将会丢失。
            </p>
          </Modal.Content>
        }
      />
      <ConfirmationModal
        visible={showUnbindDomain}
        header="解绑域名"
        buttonLabel="确认"
        onSelectCancel={() => setShowUnbindDomain(false)}
        onSelectConfirm={handleUnbindDomain}
        children={
          <Modal.Content>
            <p>确认要解除当前域名的绑定吗？</p>
          </Modal.Content>
        }
      />
      <ConfirmationModal
        visible={showClearConfirm}
        header="清空文件"
        buttonLabel="确认"
        onSelectCancel={() => setShowClearConfirm(false)}
        onSelectConfirm={handleClear}
        children={
          <Modal.Content>
            <p className="text-sm text-scale-1100">确认要清空当前已托管文件吗？</p>
          </Modal.Content>
        }
      />
      {/*<ConfirmationModal*/}
      {/*    visible={showConfirmUpload}*/}
      {/*    header="确认上传"*/}
      {/*    buttonLabel="确认"*/}
      {/*    onSelectCancel={() => setShowConfirmUpload(false)}*/}
      {/*    onSelectConfirm={() => {*/}
      {/*        setShowConfirmUpload(false)*/}
      {/*        inputRef.current?.click()*/}
      {/*    }}*/}
      {/*    children={*/}
      {/*        <Modal.Content>*/}
      {/*            <p className="py-4 text-sm text-scale-1100">*/}
      {/*                旧文件将被新文件覆盖，您确认要上传吗？*/}
      {/*            </p>*/}
      {/*        </Modal.Content>*/}
      {/*    }*/}
      {/*/>*/}
      <Modal
        layout="vertical"
        visible={showConfirmUpload}
        header={'上传文件'}
        onCancel={() => setShowConfirmUpload(false)}
        customFooter={
          <div className="flex w-full items-center justify-center space-x-3">
            <Button
              block
              className="w-20"
              type="secondary"
              onClick={() => setShowConfirmUpload(false)}
            >
              关闭
            </Button>
          </div>
        }
        children={
          <Modal.Content>
            <p className="py-4 text-sm text-scale-1100">存在已托管文件，请先清空旧文件再上传！</p>
          </Modal.Content>
        }
      />
    </>
  )
}

Home.getLayout = (page) => <HostingLayout>{page}</HostingLayout>

export default observer(Home)
