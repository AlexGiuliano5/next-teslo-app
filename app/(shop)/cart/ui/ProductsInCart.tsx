'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { ProductImage, QuantitySelector } from '@/components'
import { useCartStore } from '@/store'

export const ProductsInCart = () => {
  const updateProductQuantity = useCartStore(state => state.updateProductQuantity)
  const removeProduct = useCartStore(state => state.removeProduct)
  const [loaded, setLoaded] = useState(false)
  const productsInCart = useCartStore(state => state.cart)

  useEffect(() => {
    setLoaded(true)
  }, [])

  if (!loaded) return <p>Loading...</p>

  return (
    <>
      {productsInCart.map(product => (
        <div key={`${product.slug}-${product.size}`} className="flex mb-5">
          <ProductImage
            src={product.image}
            alt={product.title}
            width={100}
            height={100}
            className="mr-5 rounded"
            style={{ width: '100px', height: '100px' }}
          />

          <div>
            <Link className="hover:underline cursor-pointer" href={`/product/${product.slug}`}>
              {product.size} - {product.title}
            </Link>
            <p>${product.price}</p>
            <QuantitySelector
              quantity={product.quantity}
              onQuantityChanged={quantity => updateProductQuantity(product, quantity)}
            />
            <button
              type="button"
              className="underline mb-3 cursor-pointer"
              onClick={() => removeProduct(product)}
            >
              Remover
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
