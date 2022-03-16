import { FC, useState } from 'react'
import { Transition } from '@headlessui/react'
import { Button, Form, Input, IconArrowLeft } from '@supabase/ui'

import { post } from 'lib/common/fetch'
import { useStore } from 'hooks'
import { timeout } from 'lib/helpers'
import { API_URL } from 'lib/constants'

interface Props {
  onSelectBack: () => void
}

const EnterpriseRequest: FC<Props> = ({ onSelectBack }) => {
  const { ui } = useStore()
  const { profile, selectedProject } = ui
  const projectRef = selectedProject?.ref

  const [isSuccessful, setIsSuccessful] = useState(false)

  const initialValues = {
    name: `${profile?.first_name} ${profile?.last_name}`,
    email: profile?.primary_email,
    company: '',
    message: '',
  }

  const onValidate = (values: any) => {
    // Just make sure none of the fields are empty
    // Regex validation for email, super basic stuff, should be quick
    console.log('onValidate', values)
  }

  const onSubmit = async (values: any, { setSubmitting }: any) => {
    setSubmitting(true)
    await timeout(1000)
    const res = {} as any
    // const res = await post(`${API_URL}/projects/${projectRef}/subscription/enterprise`, {
    //   name: values.name,
    //   email: values.email,
    //   company: values.company,
    //   message: values.message,
    // })
    if (res.error) {
      ui.setNotification({
        category: 'error',
        message: `Unable to send request: ${res.error.message}`,
        error: res.error,
      })
    } else {
      console.log('Done')
      setIsSuccessful(true)
    }
    setSubmitting(false)
  }

  if (isSuccessful) {
    return <div>Hello</div>
  }

  return (
    <Transition
      show
      appear
      enter="transition ease-out duration-300"
      enterFrom="transform opacity-0 translate-x-10"
      enterTo="transform opacity-100 translate-x-0"
    >
      <div className="space-y-8 w-4/5">
        <div className="relative">
          <div className="absolute top-[2px] -left-24">
            <Button type="text" icon={<IconArrowLeft />} onClick={onSelectBack}>
              Back
            </Button>
          </div>
          <div className="space-y-1">
            <h4 className="text-lg">Customised plans tailored for your business needs</h4>
            <p className="text-scale-1100">
              Let us know a few details and we’ll be in contact with you!
            </p>
          </div>
          <Form
            validateOnBlur
            initialValues={initialValues}
            validate={onValidate}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }: { isSubmitting: boolean }) => (
              <div className="space-y-12 py-16">
                <div className="space-y-4 w-3/5">
                  <Input layout="horizontal" label="Name" id="name" name="name" />
                  <Input layout="horizontal" label="Email" id="email" name="email" />
                  <Input layout="horizontal" label="Company" id="company" name="company" />
                </div>
                <Input.TextArea
                  id="message"
                  name="message"
                  label="Let us know what you intend to use Supabase for"
                />
                <Button htmlType="submit" loading={isSubmitting}>
                  Submit request
                </Button>
              </div>
            )}
          </Form>
        </div>
      </div>
    </Transition>
  )
}

export default EnterpriseRequest
