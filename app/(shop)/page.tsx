export const revalidate = 60 // 1 minuto

import { getPaginatedProductsWithImages } from '@/actions'
import { Pagination, ProductGrid, Title } from '@/components'
import { redirect } from 'next/navigation'

interface Props {
  searchParams: Promise<{ page?: number; take?: number }>
}

export default async function Home({ searchParams }: Props) {
  const { page } = await searchParams

  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({ page })

  if (products.length === 0) {
    redirect('/')
  }

  return (
    <>
      <Title title="Tienda" subtitle="Todos los productos" className="mb-2" />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </>
  )
}
