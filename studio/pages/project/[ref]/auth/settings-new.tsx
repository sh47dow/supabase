import { Loading } from '@supabase/ui'
import { AuthProvidersForm } from 'components/interfaces'
import CommaSeperatedString from 'components/interfaces/Forms/CommaSeperatedString'
import { AuthLayout } from 'components/layouts'
import { AutoSchemaForm, FormHeader, FormsContainer } from 'components/ui/Forms'
import { useStore } from 'hooks'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { NextPageWithLayout } from 'types'

const PageLayout: NextPageWithLayout = () => {
  const { ui, authConfig } = useStore()

  useEffect(() => {
    // temporary store loader
    authConfig.load()
  }, [ui.selectedProjectRef])

  if (!authConfig.isLoaded) {
    return <Loading active={true}>{''}</Loading>
  }

  if (authConfig)
    return (
      <FormsContainer>
        <AutoSchemaForm />
        <CommaSeperatedString />
        <AuthProvidersForm />
      </FormsContainer>
    )
}

PageLayout.getLayout = (page) => {
  // console.log()
  return <AuthLayout>{page}</AuthLayout>
}

export default observer(PageLayout)
