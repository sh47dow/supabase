import { FC, useEffect, useState } from 'react'
import { IconLoader, Modal } from '@supabase/ui'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

import { useStore } from 'hooks'
import { post } from 'lib/common/fetch'
import { API_URL, STRIPE_PUBLIC_KEY } from 'lib/constants'
import AddPaymentMethodForm from './AddPaymentMethodForm'

interface Props {
  visible: boolean
  onCancel: () => void
}

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY)

const AddNewPaymentMethodModal: FC<Props> = ({ visible, onCancel }) => {
  const { ui } = useStore()
  const [intent, setIntent] = useState<any>()

  useEffect(() => {
    if (visible) {
      setupIntent()
    }
  }, [visible])

  const setupIntent = async () => {
    setIntent(undefined)
    const orgSlug = ui.selectedOrganization?.slug ?? ''
    const customerId = ui.selectedOrganization?.stripe_customer_id ?? ''
    const intent = await post(`${API_URL}/organizations/${orgSlug}/payment/setup-intent`, {
      customer_id: customerId,
    })
    setIntent(intent)
  }

  const options = {
    clientSecret: intent ? intent.client_secret : '',
    appearance: { theme: 'night', labels: 'floating' },
  } as any

  return (
    <Modal
      hideFooter
      size="medium"
      visible={visible}
      header="Add new payment method"
      onCancel={onCancel}
      className="PAYMENT"
    >
      <div className="py-4 space-y-4">
        {intent !== undefined ? (
          <Elements stripe={stripePromise} options={options}>
            <AddPaymentMethodForm onCancel={onCancel} />
          </Elements>
        ) : (
          <div className="w-full flex items-center justify-center py-20">
            <IconLoader size={16} className="animate-spin" />
          </div>
        )}
      </div>
    </Modal>
  )
}

export default AddNewPaymentMethodModal
