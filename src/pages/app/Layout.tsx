import { ReactNode, useEffect, useState } from 'react'
import useSWR from 'swr'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut, useSession } from "next-auth/react"
import { useDisclosure, useLocalStorage } from '@mantine/hooks'
import { AppShell, Burger, NavLink, Title, Flex, LoadingOverlay, Select, Modal, Text } from '@mantine/core'
import { IconHome2, IconMail, IconUsersGroup, IconTemplate, IconSettings, IconLogout2 } from '@tabler/icons-react';
import NewsetterSettings from '@/components/NewsletterSettings'
import fetcher from '../../utils/fetcher'
import { Newsletter } from '../../../lib/models/admin'

type LayoutProps = {
  title: String,
  isLoading: Boolean,
  children: ReactNode
}

export default function Layout(props: LayoutProps) {
  const [loading, setLoading] = useState(false)
  const [opened, { toggle }] = useDisclosure();
  const [modalOpened, { open, close }] = useDisclosure(false);
  const { asPath: path } = useRouter();
  const { data: session } = useSession();
  const [mailingList, setMailingList] = useLocalStorage({ key: 'selected-mailing-list' });

  const { data: { initialized, newsletters = [] } = {}, isLoading, mutate } = useSWR('/api/admin', fetcher)
  const router = useRouter()
  const activeList = newsletters.find((n: Newsletter) => n.database === mailingList)

  const onCreateSuccess = (database: string | undefined) => {
    if (database) {
      mutate()
      setMailingList(database)
      router.push('/app')
      close()
    }
  }

  useEffect(() => {
    if (session !== undefined && !isLoading) {
      if (!initialized || session === null) {
        const path = initialized
          ? '/api/auth/signin'
          : '/setup'

        router.push(path)
      } else {
        // mantine local storage hook returns undefined initially on re-render
        // prevent resetting the value by checking if it exists via native localstorage
        const item = localStorage.getItem('selected-mailing-list')
        if (!item) {
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
            <Flex style={{ height: '100%' }} align="center" justify="space-between">
              <Flex ml="lg">
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                <Title size="h3">OpenMailer | {props.title}</Title>
              </Flex>

              <Select
                placeholder="Mailing List"
                data={[
                  ...newsletters.map((n: Newsletter) => ({ value: n.database, label: n.name})),
                  { value: '_new', label: 'Create new'}
                ]}
                size="xs"
                mr="lg"
                value={activeList?.database}
                onChange={val => {
                  if (val === '_new') {
                    open()
                  } else if (val) {
                    setMailingList(val)
                  }
                }}
                allowDeselect={false}
              />
            </Flex>
          </AppShell.Header>

          <AppShell.Footer>
            <Text ta="right" pr="sm">
              <a href="https://github.com/Vincenius/open-mailer">GitHub</a> | <a href="https://ko-fi.com/wweb_dev">Donate ❤️</a>
            </Text>
          </AppShell.Footer>

          <AppShell.Navbar p="md">
            <NavLink label="Dashboard" href="/app" active={path === '/app'} component={Link} leftSection={<IconHome2 size="1rem" stroke={1.5} />} />
            <NavLink label="Campaigns" href="/app/campaigns" active={path === '/app/campaigns'} component={Link} leftSection={<IconMail size="1rem" stroke={1.5} />} />
            <NavLink label="Subscribers" href="/app/subscribers" active={path === '/app/subscribers'} component={Link} leftSection={<IconUsersGroup size="1rem" stroke={1.5} />} />
            <NavLink label="Templates" href="/app/templates" active={path === '/app/templates'} component={Link} leftSection={<IconTemplate size="1rem" stroke={1.5} />} />
            <NavLink label="Settings" href="/app/settings" active={path === '/app/settings'} component={Link} leftSection={<IconSettings size="1rem" stroke={1.5} />} />
            <NavLink label="Logout" onClick={() => signOut()} leftSection={<IconLogout2 size="1rem" stroke={1.5} />} />
          </AppShell.Navbar>

          { mailingList && <AppShell.Main>{props.children}</AppShell.Main> }

          <Modal opened={modalOpened} onClose={close} title="Create new mailing list" size="xl">
            <NewsetterSettings
              loading={loading}
              setLoading={setLoading}
              onSuccess={onCreateSuccess}
              buttonCaption="Create"/>
          </Modal>
        </AppShell>
      </main>
    </>
  )
}
