'use client'

import type {
  CreateOrderActions,
  CreateOrderData,
  OnApproveActions,
  OnApproveData
} from '@paypal/paypal-js'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'

import { paypalCheckPayment, setTransactionId } from '@/actions'

interface Props {
  orderId: string
  amount: number
}

export const PayPalButton = ({ orderId, amount }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer()

  const roundedAmount = Math.round(amount * 100) / 100

  if (isPending) {
    return (
      <div className="animate-pulse mb-16">
        <div className="h-11 bg-gray-300 rounded"></div>
        <div className="h-11 bg-gray-300 rounded mt-2"></div>
      </div>
    )
  }

  const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ): Promise<string> => {
    const transactionId = await actions.order.create({
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            value: roundedAmount.toString(),
            currency_code: 'USD'
          }
        }
      ],
      intent: 'CAPTURE'
    })

    const { ok } = await setTransactionId(orderId, transactionId)

    if (!ok) throw new Error('No se pudo actualizar la orden')

    return transactionId
  }

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    const details = await actions?.order?.capture()
    if (!details) return

    const paypalTransactionId = data.orderID ?? details.id
    if (!paypalTransactionId) return

    await paypalCheckPayment(paypalTransactionId)
  }

  return (
    <div className="relative z-0">
      <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
    </div>
  )
}
