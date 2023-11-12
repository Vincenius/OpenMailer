import { ReactNode, useEffect, useState } from 'react'
import useSWR from 'swr'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut, useSession } from "next-auth/react"
import { useDisclosure, useLocalStorage } from '@mantine/hooks'
import { AppShell, Burger, NavLink, Title, Flex, LoadingOverlay } from '@mantine/core'
import fetcher from '../../utils/fetcher'


type LayoutProps = {
  title: String,
  isLoading: Boolean,
  children: ReactNode
}

export default function Layout(props: LayoutProps) {
  const [opened, { toggle }] = useDisclosure();
  const { asPath: path } = useRouter();
  const { data: session } = useSession();
  const [mailingList, setMailingList] = useLocalStorage({ key: 'selected-mailing-list' });
  const { data: { initialized, newsletters } = {}, isLoading } = useSWR('/api/admin', fetcher)
  const router = useRouter()

  useEffect(() => {
    if (session !== undefined && !isLoading) {
      if (!initialized || session === null) {
        const path = initialized
          ? '/api/auth/signin'
          : '/setup'

        router.push(path)
      } else {
        if (!mailingList) {
          setMailingList(newsletters[0].database)
        }
      }
    }
  }, [session, router, isLoading, initialized, newsletters, setMailingList, mailingList])

  return (
    <>
      <Head>
        <title>OpenMailer</title>
        <meta name="description" content="A minimalist Next.js alternative to Mailchimp, Beehiiv, Convertkit etc..." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <LoadingOverlay visible={!!props.isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        <AppShell
          header={{ height: 60 }}
          navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
          padding="md"
        >
          <AppShell.Header>
            <Flex align="center" style={{ height: '100%' }} ml="lg">
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
              <Title size="h3">OpenMailer | {props.title}</Title>
            </Flex>
            {/* Select account */}
          </AppShell.Header>

          <AppShell.Navbar p="md">
            <NavLink label="Dashboard" href="/app" active={path === '/app'} component={Link}/>
            <NavLink label="Campaigns" href="/app/campaigns" active={path === '/app/campaigns'} component={Link}/>
            <NavLink label="Subscribers" href="/app/subscribers" active={path === '/app/subscribers'} component={Link}/>
            <NavLink label="Logout" onClick={() => signOut()} />
          </AppShell.Navbar>

          { mailingList && <AppShell.Main>{props.children}</AppShell.Main> }
        </AppShell>
      </main>
    </>
  )
}
