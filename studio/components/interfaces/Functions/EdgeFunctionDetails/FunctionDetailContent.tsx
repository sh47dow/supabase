// @flow
import * as React from 'react'
import { FormSection, FormSectionContent, FormSectionLabel } from '../../../ui/Forms'
import {
  Button,
  Checkbox,
  IconDownload,
  IconHelpCircle,
  IconPlus,
  IconUpload,
  Input, InputNumber,
  Listbox,
  Radio,
  Toggle,
} from 'ui'
import { EnvConfig } from './EnvConfig'
import {ChangeEvent, useRef} from 'react'
import JSZip from 'jszip'
import { useFormContext } from 'ui/src/components/Form/FormContext'
import { useStore } from '../../../../hooks'
import {
  API_URL,
  COMPRESSED_FILE_SIZE_LIMIT,
  DEMO_FUNCTIONS,
  SOURCE_FILE_SIZE_LIMIT,
} from '../../../../lib/constants'
import { post } from '../../../../lib/common/fetch'
import Link from 'next/link'
import * as Tooltip from '@radix-ui/react-tooltip'
import Table from '../../../to-be-cleaned/Table'
import { isUndefined } from 'lodash'

const LabelHelper = ({
  label,
  tip,
  htmlFor,
  className,
  side
}: {
  label: string
  tip: string
  htmlFor?: string
  className?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
}) => {
  return (
    <>
      <label
        className={['text-scale-1100 col-span-4 text-sm lg:col-span-4', className].join(' ')}
        htmlFor={htmlFor}
      >
        {label}
      </label>
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger>
          <h5 className="text-xs text-scale-900">
            <IconHelpCircle size={15} strokeWidth={1.5} />
          </h5>
        </Tooltip.Trigger>
        <Tooltip.Content side={side || 'right'}>
          <Tooltip.Arrow className="radix-tooltip-arrow" />
          <div
            className={[
              'rounded bg-scale-100 py-1 px-2 leading-none shadow', // background
              'border border-scale-200 ', //border
            ].join(' ')}
          >
            <span className="text-xs text-scale-1200 block max-w-md">{tip}</span>
          </div>
        </Tooltip.Content>
      </Tooltip.Root>
    </>
  )
}

const FunctionDemo = ({ className }: { className?: string }) => {
  return (
    <Table
      className={className}
      head={
        <>
          <Table.th className="text-scale-1100 text-xs text-center py-2">示例代码描述</Table.th>
          <Table.th className="text-scale-1100 text-xs text-center py-2">源代码</Table.th>
          <Table.th className="text-scale-1100 text-xs text-center py-2">使用必读</Table.th>
          <Table.th>操作</Table.th>
        </>
      }
      body={
        <>
          {DEMO_FUNCTIONS.map((item, index) => {
            return (
              <Table.tr key={index}>
                <Table.td className="text-scale-1100 text-xs text-center py-2">
                  {item.name}
                </Table.td>
                <Table.td className="text-xs text-center py-2">
                  <Link href={item.repo}>
                    <a
                      className="text-blue-900 hover:text-blue-1100 hover:underline"
                      target="_blank"
                    >
                      代码仓库
                    </a>
                  </Link>
                </Table.td>
                <Table.td className="text-xs text-center py-2">
                  <Link href={item.doc}>
                    <a
                      className="text-blue-900 hover:text-blue-1100 hover:underline"
                      target="_blank"
                    >
                      文档说明
                    </a>
                  </Link>
                </Table.td>
                <Table.td className="text-scale-1100 text-xs text-center py-2">
                  <Link href={`${item.url}`}>
                    <a
                      className="text-blue-900 hover:text-blue-1100 hover:underline"
                      target="_blank"
                    >
                      下载
                    </a>
                  </Link>
                </Table.td>
              </Table.tr>
            )
          })}
        </>
      }
    />
  )
}

type Props = {
  type: 'create' | 'edit' | 'view'
  // values?: FunctionResponse | undefined
  resetForm?: (data: any) => void
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void
  // errors?: FormikErrors<FunctionUpdatePayload>
  setFieldTouched?: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void
  setFieldError?: (field: string, message: string) => void
}
export const FunctionDetailContent = ({
  // values,
  // errors,
  type,
  setFieldValue,
  setFieldTouched,
  setFieldError,
}: // selectedFunction,
Props) => {
  const { ui } = useStore()
  const uploadButtonRef = useRef<HTMLInputElement>(null)
  const { touched, errors, values } = useFormContext()

  const onEnvChange = (index: number, data: { key?: string; value?: string }) => {
    if (type === 'view' || isUndefined(values)) return
    const env = [...values.env]
    env[index] = {
      ...env[index],
      ...data,
    }
    setFieldValue!('env', env)
  }

  const onNewEnvItem = () => {
    if (type === 'view' || isUndefined(values)) return
    setFieldValue!(
      'env',
      [
        ...values.env,
        {
          key: '',
          value: '',
        },
      ],
      false
    )
  }

  const onEnvItemDelete = (index: number) => {
    if (type === 'view' || isUndefined(values)) return
    const rest = values.env.filter((_: any, i: number) => i !== index)
    setFieldValue!('env', rest || [])
  }

  const onToggleMethod = (method: string) => {
    debugger
    if (type === 'view' || isUndefined(values)) return
    if (values.methods.includes(method)) {
      setFieldValue!(
        'methods',
        values.methods.filter((m: string) => m !== method)
      )
    } else {
      setFieldValue!('methods', [...values.methods, method])
    }
    setFieldTouched!('methods', true, false)
  }

  const onFilesUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (type === 'view') return
    const files = e.target.files

    if (files && files.length > 0) {
      const file = files[0]
      setFieldValue!('zipFile', file.name, false)
      setFieldValue!('zipFileUrl', undefined, false)
      // 检查文件大小
      if (file.size > COMPRESSED_FILE_SIZE_LIMIT) {
        setFieldError!('zipFile', '压缩文件大小超过20MB')
        setFieldTouched!('zipFile', true, false)
        return
      }
      JSZip.loadAsync(file)
        .then((zip) => {
          // 检查文件index.js是否存在
          if (!zip.files['index.js']) {
            setFieldError!('zipFile', 'index.js文件不存在')
            setFieldTouched!('zipFile', true, false)
          } else {
            // 检查解压后文件大小
            const totalSize = Object.values(zip.files).reduce((acc, file) => {
              if (!file.dir) {
                // @ts-ignore
                return acc + file._data.uncompressedSize
              } else {
                return acc
              }
            }, 0)
            if (totalSize > SOURCE_FILE_SIZE_LIMIT) {
              setFieldError!('zipFile', '解压后文件大小超过100MB')
              setFieldTouched!('zipFile', true, false)
            } else {
              // 上传文件到阿里云oss
              const headers = {
                'Content-Type': 'multiple/form-data',
                Accept: '*/*',
              }
              const formData = new FormData()
              formData.append('file', file)
              formData.append('name', file.name)
              return post(
                `${API_URL}/projects/${ui.selectedProjectRef}/functions/upload`,
                formData,
                {
                  headers,
                }
              )
                .then((response) => {
                  if (response.data) {
                    setFieldValue!('zipFileUrl', response.data.url, false)
                    setFieldValue!('zipFile', response.data.name)
                  } else {
                    ui.setNotification({ category: 'error', message: response.error.message })
                  }
                })
                .catch((error) => {
                  ui.setNotification({ category: 'error', message: error.message })
                })
            }
          }
        })
        .catch((e) => {
          ui.setNotification({ category: 'error', message: e.message })
        })
    }
  }

  return (
    <>
      <FormSection header={<FormSectionLabel>函数基本信息</FormSectionLabel>}>
        <FormSectionContent fullWidth={true} loading={type !== 'create' && values === undefined}>
          <Input
            layout="horizontal"
            disabled={type !== 'create'}
            id="funcName"
            name="funcName"
            label="函数名"
          />
          <Input
            layout="horizontal"
            disabled
            id="handler"
            name="handler"
            label={
              <LabelHelper
                htmlFor="handler"
                label="请求处理程序(函数入口)"
                tip={
                  '在“运行环境”为 Node.js 时，当前值的格式为 [文件名].[函数名]。如果当前值为 index.handler，那么在函数被触发时，将执行 index.js 文件中的 handler 函数。'
                }
              />
            }
          />
          {values?.id && (
            <>
              <Input
                layout="horizontal"
                disabled
                id="endpoint"
                name="endpoint"
                copy
                label="访问地址"
              />
              <Input
                layout="horizontal"
                disabled
                id="createdAt"
                name="createdAt"
                label="创建时间"
              />
              <Input
                layout="horizontal"
                disabled
                id="updatedAt"
                name="updatedAt"
                label="更新时间"
              />
            </>
          )}
        </FormSectionContent>
      </FormSection>
      <FormSection header={<FormSectionLabel>函数配置</FormSectionLabel>}>
        <FormSectionContent fullWidth={true} loading={type !== 'create' && values === undefined}>
          <div className="text-sm grid gap-2 md:grid md:grid-cols-12 md:gap-x-4">
            <div className="col-span-4">
              <LabelHelper
                label="上传代码包"
                tip="云函数目前仅支持JavaScript编程语言。"
                htmlFor="zipFile"
              />
              <p className="mt-1 text-xs text-scale-900">
                index.js文件必须在zip文件根目录下，采用handler函数为入口函数
              </p>
            </div>
            <div className="col-span-8 lg:col-span-8">
              {type !== 'view' && (
                <div
                  className={[
                    'border border-scale-800 opacity-50 transition hover:opacity-100',
                    'group inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded',
                  ].join(' ')}
                  onClick={() => {
                    if (uploadButtonRef.current) {
                      uploadButtonRef.current.click()
                      setFieldTouched!('zipFile', true, false)
                    }
                  }}
                >
                  <IconUpload strokeWidth={2} size={20} />
                </div>
              )}
              {values?.zipFile &&
                (type !== 'create' && values.zipFileUrl ? (
                  <Link href={`${values.zipFileUrl}&download`}>
                    <a className="text-scale-1100 text-sm ml-3 inline-flex hover:text-scale-1200">
                      {values.zipFile.split('/').pop()}
                      <IconDownload className="ml-1" size={16} strokeWidth={2} />
                    </a>
                  </Link>
                ) : (
                  <label className="text-scale-1100 col-span-12 text-sm">
                    {values.zipFile.split('/').pop()}
                  </label>
                ))}
              {errors && errors.zipFile && touched.zipFile && (
                <div className="w-full text-sm text-red-900">{errors.zipFile}</div>
              )}
              <span>{touched.zipFile}</span>
              {type === 'create' && <FunctionDemo className="mt-3" />}
            </div>

            <input
              type="file"
              ref={uploadButtonRef}
              className="hidden"
              name="zipFile"
              accept="application/zip,application/x-zip,application/x-zip-compressed"
              onChange={onFilesUpload}
            />
          </div>
          <Listbox
            layout="horizontal"
            id="runtime"
            name="runtime"
            label="运行环境"
            disabled={type === 'view'}
            value={values?.runtime}
          >
            <Listbox.Option value="nodejs12" key="nodejs12.x" label="Node js 12">
              Node js 12
            </Listbox.Option>
            <Listbox.Option value="nodejs14" key="nodejs14.x" label="Node js 14">
              Node js 14
            </Listbox.Option>
            <Listbox.Option value="nodejs16" key="nodejs16.x" label="Node js 16">
              Node js 16
            </Listbox.Option>
          </Listbox>
          <div className="text-sm grid gap-2 md:grid md:grid-cols-12 md:gap-x-4">
            <label className="text-scale-1100 col-span-4 text-sm lg:col-span-4" htmlFor="methods">
              访问方法
            </label>
            <div className="flex flex-wrap col-span-8 space-x-8 space-x-reverse">
              <>
                {['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'].map((method, index) => (
                  <Checkbox
                    key={index}
                    disabled={type === 'view'}
                    label={method}
                    onChange={() => {
                      setTimeout(() => {
                        onToggleMethod(method)
                      }, 0)
                    }}
                    checked={values?.methods?.includes(method)}
                  />
                  ))
                }
                {errors && errors.methods && touched.methods && (
                  <div className="w-full mt-2 text-sm text-red-900">访问方法是必选项</div>
                )}
              </>
            </div>
          </div>

          <InputNumber
            layout="horizontal"
            id="timeout"
            name="timeout"
            disabled={type === 'view'}
            label={
              <LabelHelper
                htmlFor={'timeout'}
                label={'执行超时时间(秒)'}
                tip={
                  '最大超时时间为 24 小时，即 86400 秒。建议您将此值设置为 600 秒。如果函数在这个时间内未能成功执行，函数计算会返回超时错误，请设置大小合适的超时时间，避免函数执行超时。'
                }
              />
            }
          />
          <Input.TextArea
            disabled={type === 'view'}
            layout="horizontal"
            id="desc"
            name="desc"
            label="函数描述"
          />
        </FormSectionContent>
      </FormSection>
      <FormSection
        header={
          <FormSectionLabel>
            <LabelHelper
              label="环境变量"
              className={'text-scale-1200'}
              tip="您可以使用环境变量，在不修改代码的前提下，灵活调整云函数的行为。环境变量采用字符串键值的方式，每个云函数默认有三个关于环境变量：应用的API_URL, ANON_KEY、SERVICE_ROLE_KEY。"
            />
          </FormSectionLabel>
        }
      >
        <FormSectionContent fullWidth={true} loading={type === 'edit' && values === undefined}>
          <EnvConfig
            values={values?.env || []}
            errors={errors?.env}
            canEdit={type !== 'view'}
            onRemoveItem={(index) => onEnvItemDelete(index)}
            onChangeItem={(index, data) => onEnvChange(index, data)}
          />
          {type !== 'view' && (
            <Button className="w-fit" type="default" size="tiny" onClick={onNewEnvItem}>
              添加变量
            </Button>
          )}
        </FormSectionContent>
      </FormSection>
      <FormSection header={<FormSectionLabel>函数生命周期回调</FormSectionLabel>}>
        <FormSectionContent fullWidth={true} loading={type === 'edit' && values === undefined}>
          <div className="text-sm grid gap-2 md:grid md:grid-cols-12 md:gap-x-4">
            <div className="col-span-4">
              <LabelHelper
                label="initializer回调"
                tip="初始化（Initializer）回调程序，在运行请求处理程序（Handler）之前执行。云函数会保证您配置的 Initializer 回调程序在同一实例中执行且成功执行一次。"
              />
            </div>
            <div className="col-span-8 lg:col-span-8 space-y-4">
              <Toggle
                label="启用"
                disabled={type === 'view'}
                id="hasInitializer"
                name="hasInitializer"
              />
              {values?.hasInitializer && (
                <>
                  <Input
                    disabled={true}
                    layout="horizontal"
                    id="initializer"
                    name="initializer"
                    label={
                      <LabelHelper
                        label="程序入口"
                        tip="指定调用函数时需要从哪个文件中的哪个函数开始执行。"
                        side="bottom"
                        htmlFor="initializer"
                      />
                    }
                  />
                  <InputNumber
                    layout={'horizontal'}
                    id="initializationTimeout"
                    name="initializationTimeout"
                    disabled={type === 'view'}
                    label={
                      <LabelHelper
                        label={'超时时间(秒)'}
                        side="bottom"
                        tip={
                          '执行 Initializer 回调程序的超时时间。最小1秒，最长5分钟（300 秒）。初始化函数超过这个时间后会被终止执行。'
                        }
                      />
                    }
                  />
                </>
              )}
            </div>
          </div>
        </FormSectionContent>
      </FormSection>
    </>
  )
}
