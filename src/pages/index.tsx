import { useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()

  // todo check init endpoint if accounts exist
  // if not go to init page (create it) to create first account and newsletter

  useEffect(() => {
    if (session !== undefined) {
      if (session === null) {
        router.push("/api/auth/signin")
      } else {
        router.push("/app")
      }
    }
  }, [session, router])

  return <></>
}
