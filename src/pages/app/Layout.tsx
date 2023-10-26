import { ReactNode, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut, useSession } from "next-auth/react"
import { useDisclosure } from '@mantine/hooks'
import { AppShell, Burger, NavLink, Title, Flex, LoadingOverlay } from '@mantine/core'

type LayoutProps = {
  title: String,
  isLoading: Boolean,
  children: ReactNode
}

export default function Layout(props: LayoutProps) {
  const [opened, { toggle }] = useDisclosure();
  const { asPath: path } = useRouter();
  const { data: session } = useSession();
  const router = useRouter()

  useEffect(() => {
    if (session !== undefined && session === null) {
      router.push("/api/auth/signin")
    }
  }, [session, router])

  return (
    <>
      <Head>
        <title>Simple Mailer</title>
        <meta name="description" content="todo yoyo" />
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
              <Title size="h3">Simple Mailer | {props.title}</Title>
            </Flex>
          </AppShell.Header>

          <AppShell.Navbar p="md">
            <NavLink label="Dashboard" href="/app" active={path === '/app'} component={Link}/>
            <NavLink label="Campaigns" href="/app/campaigns" active={path === '/app/campaigns'} component={Link}/>
            <NavLink label="Subscribers" href="/app/subscribers" active={path === '/app/subscribers'} component={Link}/>
            <NavLink label="Logout" onClick={() => signOut()} />
          </AppShell.Navbar>

          <AppShell.Main>{props.children}</AppShell.Main>
        </AppShell>
      </main>
    </>
  )
}
