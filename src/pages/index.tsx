import { useEffect } from 'react'
import useSWR from 'swr'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { LoadingOverlay } from '@mantine/core'
import fetcher from '../utils/fetcher'

export default function Home() {
  const { data: { initialized } = {}, error, isLoading } = useSWR('/api/admin', fetcher)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session !== undefined && !isLoading) {
      const path = initialized
        ? session !== null
          ? '/api/auth/signin'
          : '/app'
        : '/setup'

      router.push(path)
    }
  }, [session, router, isLoading, initialized])

  return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
}
