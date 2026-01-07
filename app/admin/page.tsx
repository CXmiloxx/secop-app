'use client'
import ListUsers from '@/components/users/ListUsers'
import useAuthUser from '@/hooks/useAuth'
import { useCallback, useEffect } from 'react'

export default function AdminPage() {
  const { allUsers, loading, error, users, deleteUser } = useAuthUser()

  const getUsers = useCallback(async () => {
    await allUsers()
  }, [allUsers])

  useEffect(() => {
    getUsers()
  }, [getUsers])

  return (
    <div className="container mx-auto px-4 py-8">
      <ListUsers
        users={users}
        loading={loading}
        error={error}
        onUserDeleted={getUsers}
        onDeleteUser={deleteUser}
      />
    </div>
  )
}
