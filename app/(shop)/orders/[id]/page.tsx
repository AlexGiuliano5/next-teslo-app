import clsx from 'clsx'
import Image from 'next/image'
import { redirect } from 'next/navigation'

import { IoCardOutline } from 'react-icons/io5'

import { getOrderById } from '@/actions/order/get-order-by-id'
import { OrderStatus, PayPalButton, Title } from '@/components'
import { currencyFormat } from '@/utils'

interface Props {
  params: {
    id: string
  }
}

export default async function ({ params }: Props) {
  const { id } = await params

  // Todo: Llamar al server action
  const { ok, order } = await getOrderById(id)
  if (!ok) {
    redirect('/')
  }

  const address = order!.orderAddresses

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Orden #${id.split('-').at(-1)}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <OrderStatus isPaid={order!.isPaid} />

            {/* Items */}
            {order!.orderItems!.map(item => (
              <div key={item.prodcut.slug + '-' + item.size} className="flex mb-5">
                <Image
                  src={`/products/${item.prodcut.productImages[0].url}`}
                  alt={item.prodcut.title}
                  width={100}
                  height={100}
                  className="mr-5 rounded"
                  style={{ width: '100px', height: '100px' }}
                />

                <div>
                  <p>{item.prodcut.title}</p>
                  <p>
                    ${item.price} x {item.quantity}
                  </p>
                  <p className="font-bold">
                    Subtotal: {currencyFormat(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout - Resumen de orden */}
          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2">Dirección de entrega</h2>
            <div className="mb-10">
              <p className="text-xl">
                {address!.firstName} {address!.lastName}
              </p>
              <p>{address!.address}</p>
              <p>{address!.address2}</p>
              <p>{address!.postalCode}</p>
              <p>
                {address!.city} , {address!.countryId}
              </p>
              <p>{address!.phone}</p>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>

            <h2 className="text-2xl mb-2">Resumen de orden</h2>

            <div className="grid grid-cols-2">
              <span>No. Productos</span>
              <span className="text-right">
                {order?.itemsInOrder === 1 ? '1 artículo' : `${order?.itemsInOrder} artículos`}
              </span>

              <span>Subtotal</span>
              <span className="text-right">{currencyFormat(order!.subTotal)}</span>

              <span>Impuestos (15%)</span>
              <span className="text-right">{currencyFormat(order!.tax)}</span>

              <span className="mt-5 text-2xl">Total:</span>
              <span className="mt-5 text-2xl text-right">{currencyFormat(order!.total)}</span>
            </div>

            <div className="mt-5 mb-2 w-full">
              {!order!.isPaid ? (
                <PayPalButton orderId={id} amount={order!.total} />
              ) : (
                <OrderStatus isPaid={order!.isPaid} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
