// @flow
import * as React from 'react'
import { Button, Form, SidePanel } from 'ui'
import { FunctionDetailContent } from './EdgeFunctionDetails/FunctionDetailContent'
import { useStore } from '../../../hooks'
import * as Yup from 'yup'
import { useFunctionCreateMutation } from '../../../data/functions/functions-create-mutation'
import { useFunctionQuery } from '../../../data/functions/function-query'

import { FunctionListItem, useFunctionsQuery } from '../../../data/functions/functions-query'
import { useFunctionUpdateMutation } from '../../../data/functions/functions-update-mutation'
import { DEFAULT_FUNCTION_ENVS } from '../../../lib/constants'
import { isEmpty, isUndefined } from 'lodash'

type Props = {
  canEdit: boolean
  visible: boolean
  setVisible: (value: boolean) => void
  type: 'create' | 'edit'
  selectedFunction?: FunctionListItem
}
export const FunctionEditSidePanel = ({
  canEdit,
  selectedFunction,
  visible,
  setVisible,
  type,
}: Props) => {
  const formId = 'create-function'
  const { ui } = useStore()
  const projectRef = ui.selectedProjectRef
  const functionsQueryMutation = useFunctionsQuery({ projectRef })

  const { data: functionDetail, isLoading } = useFunctionQuery(
    { projectRef, id: type === 'edit' ? selectedFunction?.id : undefined },
    {
      refetchOnWindowFocus: false,
      placeholderData: {
        funcName: '',
        runtime: 'nodejs14',
        handler: 'index.handler',
        createdAt: 0,
        id: '',
        updatedAt: 0,
        timeout: 60,
        zipFile: '',
        zipFileUrl: '',
        env: [],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
        endpoint: '',
        desc: '',
        hasInitializer: false,
        initializer: 'index.initializer',
        initializationTimeout: 60,
      },
    }
  )

  const functionCreateMutation = useFunctionCreateMutation({
    onSuccess: (data, variables, context) => {
      ui.setNotification({ category: 'success', message: '创建云函数成功' })
      // refetch().then()
      setVisible(false)
    },
    onError: (error, variables, context) => {
      ui.setNotification({ category: 'error', message: `创建云函数失败: ${error.message}` })
    },
  })

  const functionUpdateMutation = useFunctionUpdateMutation({
    onSuccess: (data, variables, context) => {
      functionsQueryMutation.refetch({}).then()
      ui.setNotification({ category: 'success', message: `更新云函数成功` })
      setVisible(false)
    },
    onError: (error, variables, context) => {
      ui.setNotification({ category: 'error', message: `更新云函数失败: ${error.message}` })
    },
  })

  const validationSchema = Yup.object().shape({
    funcName: Yup.string()
      .required('函数名是必填项')
      .matches(
        /^[a-zA-Z_][\w]{0,63}$/,
        '函数名只能包含字母、数字、下划线，不能以数字开头, 且长度不能超过64个字符'
      ),
    zipFile: Yup.string().required('Zip文件是必填项'),
    timeout: Yup.number()
      .min(1, '超时时间必须在1-86400之间')
      .max(86400, '超时时间必须在1-86400之间')
      .required('超时时间是必填项'),
    methods: Yup.array().test('required', '访问方法是必填项', (value) => {
      return !isEmpty(value)
    }),
    desc: Yup.string().max(256, '描述不能超过256个字符'),
    env: Yup.array()
      .of(
        Yup.object().shape({
          key: Yup.string()
            .required('变量名是必填项')
            .matches(/^[a-zA-Z][a-zA-Z0-9_]*$/, '只能包含字母、数字、下划线，且只能以字母开头')
            .test('default-env', '不能修改默认环境变量', (key) => {
              return !isUndefined(key) && !DEFAULT_FUNCTION_ENVS.includes(key)
            }),
          value: Yup.string()
            .required('值是必填项')
            .matches(/^[\x00-\x7F]+$/, '只能包含ASCII字符'),
        })
      )
      .test('unique-key', '变量名不能重复', (env) => {
        const envKeys = env?.map((item) => item.key) || []
        const envKeySet = new Set(envKeys)
        return envKeys.length === envKeySet.size
      }),
    initializer: Yup.string().test('required', '程序入口是必填项', (value, context) => {
      if (context.parent.hasInitializer) {
        return !isEmpty(value)
      } else {
        return true
      }
    }),
    initializationTimeout: Yup.number()
      .min(1, '初始化超时时间必须在1-300之间')
      .max(300, '初始化超时时间必须在1-300之间')
      .test('required', '超时时间是必填项', (value, context) => {
        if (context.parent.hasInitializer) {
          return !isUndefined(value)
        } else {
          return true
        }
      }),
  })

  const onSubmitForm = async (values: any, { setSubmitting }: any) => {
    if (!projectRef) return console.error('Project ref is required')
    setSubmitting(true)
    type === 'create'
      ? functionCreateMutation.mutate(
          {
            projectRef,
            payload: values,
          },
          {
            onSettled: () => {
              setSubmitting(false)
            },
          }
        )
      : functionUpdateMutation.mutate(
          {
            projectRef,
            id: selectedFunction?.id || '',
            payload: values,
          },
          {
            onSettled: () => {
              setSubmitting(false)
            },
          }
        )
  }

  return (
    <SidePanel
      size="large"
      visible={visible}
      loading={type === 'edit' && !selectedFunction}
      className="hooks-sidepanel mr-0 transform transition-all duration-300 ease-in-out"
      header={type === 'edit' ? '编辑函数' : '创建函数'}
      hideFooter={true}
      onInteractOutside={(event) => {
        event.preventDefault()
      }}
    >
      <Form
        id={formId}
        initialValues={functionDetail}
        onSubmit={onSubmitForm}
        validationSchema={validationSchema}
        validateOnBlur
        // validate={validate}
        enableReinitialize
      >
        {({
          isSubmitting,
          handleReset,
          resetForm,
          setFieldValue,
          dirty,
          values,
          errors,
          setFieldTouched,
          setFieldError,
        }: any) => {
          return (
            <>
              <FunctionDetailContent
                resetForm={resetForm}
                setFieldValue={setFieldValue}
                type={type}
                // values={values}
                // errors={errors}
                setFieldTouched={setFieldTouched}
                setFieldError={setFieldError}
                // selectedFunction={type === 'edit' ? functionDetail : undefined}
              />

              <div className="flex py-4 px-8 sticky right-0 bottom-0 w-full border-t bg-scale-100">
                <div className={"'flex w-full items-center gap-2'"}>
                  <div className="flex items-center gap-2">
                    <Button
                      type="default"
                      htmlType="reset"
                      onClick={() => {
                        handleReset(), setVisible(false)
                      }}
                    >
                      取消
                    </Button>
                    <Button
                      form={formId}
                      type="primary"
                      htmlType="submit"
                      disabled={!dirty || !isEmpty(errors)}
                      loading={isSubmitting}
                    >
                      保存
                    </Button>
                  </div>
                </div>
              </div>
            </>
            // </FormPanel>
          )
        }}
      </Form>
    </SidePanel>
  )
}
