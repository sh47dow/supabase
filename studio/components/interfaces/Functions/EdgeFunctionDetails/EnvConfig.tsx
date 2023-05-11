// @flow 
import * as React from 'react';
import * as Tooltip from "@radix-ui/react-tooltip";
import {Button, IconHelpCircle, IconPlus, IconX, Input} from "ui";
import {useEffect, useState} from "react";
import {FormikErrors} from "formik/dist/types";
import {DEFAULT_PROJECT_API_SERVICE_ID} from "../../../../lib/constants";
import {useStore} from "../../../../hooks";
import {throttle} from "lodash";

type Props = {
  values: {key: string, value: string}[],
  canEdit: boolean,
  onRemoveItem: (index: number) => void,
  onChangeItem: (index: number, data: {key?: string, value?: string}) => void,
  errors: string | string[] | FormikErrors<{key: string, value: string}[]> | undefined
};
export const EnvConfig = ({values, canEdit, onRemoveItem, onChangeItem, errors}: Props) => {
  // const {ui} = useStore()
  // const {
  //   services,
  //   isError: isProjectSettingsError,
  //   isLoading: isProjectSettingsLoading,
  // } = useProjectSettings(ui.selectedProjectRef as string | undefined)
  // const [defaultEnvs, setDefaultEnvs] = useState<{key: string, value: string}[]>([])

  // useEffect(() => {
  //   // if (isProjectSettingsError || isProjectSettingsLoading) return
  //   const apiService = (services ?? []).find((x: any) => x.app.id == DEFAULT_PROJECT_API_SERVICE_ID)
  //   const apiConfig = apiService?.app_config ?? {}
  //   const apiUrl = `https://${apiConfig.endpoint}`
  //   const apiKeys = apiService?.service_api_keys ?? []
  //   const anonKey = apiKeys.find((key: any) => key.tags === 'anon')
  //   const serviceKey = apiKeys.find((key: any) => key.tags === 'service_role')
  //   const defaultEnvs = [
  //     {
  //       key: 'API_URL',
  //       value: apiUrl
  //     },
  //     {
  //       key: 'ANON_KEY',
  //       value: anonKey.api_key
  //     },
  //     {
  //       key: 'SERVICE_KEY',
  //       value: serviceKey.api_key
  //     }
  //   ]
  //   setDefaultEnvs(defaultEnvs)
  // }, [services, isProjectSettingsError, isProjectSettingsLoading])



  return (
    <div>
      <div className="flex w-full border-b border-scale-500">
        <div className='w-[30%] flex  space-x-2 pl-2 bg-table-header-light dark:bg-table-header-dark py-2'>
          <h5 className="text-xs text-scale-1000">变量名</h5>
        </div>
        <div className='w-[70%] flex  space-x-2 pl-6 bg-table-header-light dark:bg-table-header-dark py-2'>
          <h5 className="text-xs text-scale-1000">值</h5>
        </div>
      </div>
      {/*{defaultEnvs.map(({key, value}, index) => (*/}
      {/*  <div className="flex w-full my-3" key={`${key}-${index}`}>*/}
      {/*    <div className={`w-[30%] space-x-2 pr-3`}>*/}
      {/*      <Input disabled className="w-full" value={key}/>*/}
      {/*    </div>*/}
      {/*    <div className={`w-[70%] flex ml-4 space-x-2`}>*/}
      {/*      <Input disabled copy reveal={key === 'SERVICE_KEY' } className="w-full flex" value={value}/>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*))}*/}
      {values.map(({key, value}, index) => (
        <div className="flex w-full my-3" key={index}>
          <div className={`w-[30%] space-x-2 pr-3`}>
            <Input
                   disabled={!canEdit}
                   className="w-full "
                   error={
                    Array.isArray(errors)
                     ? (errors[index]
                       ? (typeof errors[index] === 'string'
                         ? errors[index] as string
                         : (errors[index]! as {key: string, value: string}).key)
                       : undefined)
                     : undefined}
                   value={key}
                   key={`key`}
                   onChange={(e) => onChangeItem(index, {key: e.target.value})}
            />
          </div>
          <div className={`w-[70%] flex ml-4 space-x-2`}>
            <Input disabled={!canEdit}
                   className="w-full flex"
                   copy={!canEdit}
                   error={Array.isArray(errors)
                     ? (errors[index]
                       ? (typeof errors[index] === 'string'
                         ? errors[index] as string
                         :  (errors[index]! as {key: string, value: string}).value)
                       : undefined)
                     : undefined}
                   value={value}
                    key={`value`}
                   onChange={(e) => onChangeItem(index, {value: e.target.value})}
            />
            { canEdit && (
              <Button
                className="h-10"
                icon={<IconX strokeWidth={1.5} size={14} />}
                size="tiny"
                type="text"
                onClick={() => onRemoveItem(index)}
              />
            ) }
          </div>
        </div>
      ))}
      {typeof errors === 'string' && (
        <div className="text-sm text-red-900">{errors}</div>
      )}
    </div>
  );
};
