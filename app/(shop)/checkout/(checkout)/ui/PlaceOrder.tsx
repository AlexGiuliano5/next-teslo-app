'use client'

import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { placeOrder } from '@/actions'
import { useAddressStore, useCartStore } from '@/store'
import { currencyFormat, sleep } from '@/utils'
import { useRouter } from 'next/navigation'

export const PlaceOrder = () => {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const address = useAddressStore(state => state.address)

  useCartStore(state => state.cart)
  const getSummaryInformation = useCartStore(state => state.getSummaryInformation)
  const { itemsInCart, subTotal, tax, total } = getSummaryInformation()

  const cart = useCartStore(state => state.cart)
  const clearCart = useCartStore(state => state.clearCart)

  useEffect(() => {
    setLoaded(true)
  }, [])

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true)
    // await sleep(2)
    const productsToOrder = cart.map(product => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size
    }))

    //! Server Action
    const res = await placeOrder(productsToOrder, address)
    if (!res.ok) {
      setIsPlacingOrder(false)
      setErrorMessage(res.message)
      return
    }

    //* Todo salió bien!
    clearCart()
    router.replace(`/orders/${res.order?.id}`)
  }

  if (!loaded) return <p>Cargando...</p>

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">
      <h2 className="text-2xl mb-2">Dirección de entrega</h2>
      <div className="mb-10">
        <p className="text-xl">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.postalCode}</p>
        <p>
          {address.city} , {address.country}
        </p>
        <p>{address.phone}</p>
      </div>

      {/* Divider */}
      <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>

      <h2 className="text-2xl mb-2">Resumen de orden</h2>

      <div className="grid grid-cols-2">
        <span>No. Productos</span>
        <span className="text-right">
          {itemsInCart === 1 ? '1 artículo' : `${itemsInCart} artículos`}
        </span>

        <span>Subtotal</span>
        <span className="text-right">{currencyFormat(subTotal)}</span>

        <span>Impuestos (15%)</span>
        <span className="text-right">{currencyFormat(tax)}</span>

        <span className="mt-5 text-2xl">Total:</span>
        <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
      </div>

      <div className="mt-5 mb-2 w-full">
        <p className="mb-5">
          {/* Disclaimer */}
          <span className="text-xs">
            Al hacer clic en "Colocar orden", aceptas nuestros{' '}
            <a href="/terms" className="underline">
              Términos y condiciones
            </a>{' '}
            y{' '}
            <a href="/privacy-policy" className="underline">
              política de privacidad
            </a>
          </span>
        </p>

        {/* <p className="text-red-500">Error de creación.</p> */}

        <button
          type="button"
          onClick={onPlaceOrder}
          className={clsx(
            'flex btn-primary justify-center',
            isPlacingOrder ? 'btn-disabled' : 'btn-primary'
          )}
        >
          Colocar orden
        </button>
      </div>
    </div>
  )
}
