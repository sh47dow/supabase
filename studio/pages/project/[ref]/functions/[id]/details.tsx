import { observer } from 'mobx-react-lite'
import { NextPageWithLayout } from 'types'
import FunctionsLayout from 'components/layouts/FunctionsLayout'
import { useParams } from 'hooks'
import { useFunctionQuery } from '../../../../../data/functions/function-query'
import * as React from 'react'
import { Form } from "ui";
import { FunctionDetailContent } from 'components/interfaces/Functions'

const PageLayout: NextPageWithLayout = () => {
  const { ref: projectRef, id } = useParams()
  const { data: selectedFunction } = useFunctionQuery({ projectRef, id })

  return (
    <>
      <div className="space-y-4 pb-16">
        <Form initialValues={selectedFunction} onSubmit={() => {}} enableReinitialize>
          {({ values }: any) => (
            <FunctionDetailContent
              type="view"
              // values={values}
              // selectedFunction={type === 'edit' ? functionDetail : undefined}
            />
          )}
        </Form>
      </div>
    </>
  )
}
PageLayout.getLayout = (page) => <FunctionsLayout>{page}</FunctionsLayout>

export default observer(PageLayout)
