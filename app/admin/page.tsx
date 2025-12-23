'use client'
import ListUsers from '@/components/users/ListUsers'
import useAuthUser from '@/hooks/use-auth-user'
import { UserType } from '@/types/user.types'
import { useCallback, useEffect, useState } from 'react'

export default function page() {
  const { allUsers, isLoading } = useAuthUser()
  const [users, setUsers] = useState<UserType[]>([])

  const getUsers = useCallback(async () => {
    const data = await allUsers()
    setUsers(Array.isArray(data) ? data : [])
  }, [allUsers])

  useEffect(() => {
    getUsers()
  }, [getUsers])
  return (
    <div>
      <ListUsers users={users} loading={isLoading}/>
    </div>
  )
}
