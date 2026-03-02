export const revalidate = 0

// https://tailwindcomponents.com/component/hoverable-table

import { redirect } from 'next/navigation'

import { getPaginatedUsers } from '@/actions'
import { Pagination, Title } from '@/components'
import { UserTable } from './ui/UserTable'

export default async function () {
  const { ok, users = [] } = await getPaginatedUsers()

  if (!ok) {
    redirect('/auth/login')
  }

  return (
    <>
      <Title title="Mantenimiento de usuarios" />

      <div className="mb-10">
        <UserTable users={users} />
        <Pagination totalPages={1} />
      </div>
    </>
  )
}
