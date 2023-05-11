import { useRouter } from 'next/router'
import { FC, ReactNode } from 'react'
import { observer } from 'mobx-react-lite'

import {checkPermissions, useParams, useStore, withAuth} from 'hooks'
import BaseLayout from 'components/layouts'
import NoPermission from 'components/ui/NoPermission'
import { PermissionAction } from '@supabase/shared-types/out/constants'
import * as React from "react";

interface Props {
  title?: string
  children?: ReactNode
}

const FunctionsLayout: FC<Props> = ({ title, children }) => {
  const { ui } = useStore()
  const router = useRouter()

  const { id, ref } = useParams()

  const canReadFunctions = checkPermissions(PermissionAction.FUNCTIONS_READ, '*')
  if (!canReadFunctions) {
    return (
      <BaseLayout title={title || '云函数'} product="云函数">
        <main style={{ maxHeight: '100vh' }} className="flex-1 overflow-y-auto">
          <NoPermission isFullPage resourceText="access your project's edge functions" />
        </main>
      </BaseLayout>
    )
  }

  return (
    <BaseLayout
      title={title || '云函数'}
      product="云函数"
    >
      <div className="flex h-full flex-grow flex-col">
        <div>
          <div  className="dark:border-dark flex max-h-12 items-center border-b px-6"
                style={{ minHeight: '3rem' }}>
            {/*<Link href={`/project/${ref}/functions`}>*/}
            <h4 className="text-lg cursor-pointer" onClick={() => router.push(`/project/${ref}/functions`)}>
              云函数
            </h4>
          </div>
        </div>
        <div
          className={[
            'flex h-full w-full flex-grow flex-col transition-all',
            'px-6 py-4',
          ].join(' ')}
        >
          {children}
        </div>
      </div>
    </BaseLayout>
  )
}

export default withAuth(observer(FunctionsLayout))
