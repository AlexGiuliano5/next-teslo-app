export const revalidate = 60 // 1 minuto

import { getPaginatedProductsWithImages } from '@/actions'
import { Pagination } from '@/components'
import { ProductGrid } from '@/components/products/product-grid/ProductGrid'
import { Title } from '@/components/ui/title/Title'
import { Gender } from '@prisma/client'
import { redirect } from 'next/navigation'

interface Props {
  params: {
    gender: string
  }
  searchParams: Promise<{ page?: number; take?: number }>
}

export default async function ({ params, searchParams }: Props) {
  const { gender } = await params

  const { page } = await searchParams

  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({
    page,
    gender: gender as Gender
  })

  if (products.length === 0) {
    redirect(`/gender/${gender}`)
  }

  const labels: Record<string, string> = {
    men: 'para Hombres',
    women: 'para Mujeres',
    kid: 'para Niños',
    unisex: 'para Todos'
  }

  return (
    <>
      <Title
        title={`Artículos ${labels[gender]}`}
        subtitle="Todos los productos"
        className="mb-2"
      />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </>
  )
}
