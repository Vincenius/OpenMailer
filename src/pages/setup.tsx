import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { useSession } from "next-auth/react"
import { signIn } from "next-auth/react"
import { useRouter } from 'next/navigation'
import Head from 'next/head'
import { Card, Title, Flex, Button, TextInput, Stepper, Text, LoadingOverlay } from '@mantine/core';
import NewsetterSettings from '../components/NewsletterSettings';
import fetcher from '../utils/fetcher'

export default function Setup() {
  const router = useRouter()
  const { data: { initialized } = {}, isLoading: adminLoading } = useSWR('/api/admin', fetcher)
  const { data: { count } = {}, isLoading: accountsLoading } = useSWR('/api/accounts', fetcher)
  const { data: session } = useSession()
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<any>({})
  const isLoading = adminLoading || accountsLoading

  useEffect(() => {
    if (!isLoading) {
      if (initialized) {
        router.push('/app')
      } else if (!session && count > 0) {
        router.push('/api/auth/signin')
      } else if (session) {
        setActive(1)
      }
    }
  }, [session, isLoading, initialized, router, count])

  const handleChange = (target: EventTarget): void => {
    const inputElement = target as HTMLInputElement;
    setFormValues({
      ...formValues,
      [inputElement.name]: inputElement.value,
    })
  }

  const nextStep = () => setActive((current: number) => (current < 3 ? current + 1 : current));
  // const prevStep = () => setActive((current: number) => (current > 0 ? current - 1 : current));

  const handleSubmit = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    setLoading(true)
    const uri = active === 0 ? '/api/accounts' : '/api/admin';
    fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formValues),
    }).then(() => {
      if (active === 0) {
        signIn('credentials', { redirect: false, ...formValues })
        setFormValues({
          base_url: window.location.origin,
        })
      }
      nextStep()
    }).finally(() => {
      setLoading(false)
    })
  }

  const onSuccess = () => {
    router.push('/app?setup=done')
  }

  return <>
    <Head>
      <title>OpenMailer</title>
      <meta name="description" content="A minimalist Next.js alternative to Mailchimp, Beehiiv, Convertkit etc..." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
      <Flex justify="center">
        <Card shadow="sm" padding="lg" radius="md" withBorder m="xl" w={760}>
          { isLoading && <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} /> }

          <Stepper active={active}>
            <Stepper.Step label="Account" description="Create an admin account" loading={loading && active === 0}>
              <form onSubmit={handleSubmit}>
                <Title size="h3" mb="md" order={2}>Create an admin account</Title>

                <TextInput
                  label="Username"
                  placeholder="Username"
                  mb="md"
                  name="username"
                  onChange={(event) => handleChange(event.currentTarget)}
                  required
                />
                <TextInput
                  label="Password"
                  placeholder="Password"
                  mb="xl"
                  type="password"
                  name="password"
                  onChange={(event) => handleChange(event.currentTarget)}
                  required
                />
                <Flex justify="flex-end">
                  <Button type="submit" loading={loading}>Continue</Button>
                </Flex>
              </form>
            </Stepper.Step>
            <Stepper.Step label="Email" description="Create your mailing list" loading={loading && active === 1}>
              <Title size="h3" mb="md" order={1}>Create your mailing list</Title>

              <NewsetterSettings loading={loading} setLoading={setLoading} onSuccess={onSuccess} />
            </Stepper.Step>
          </Stepper>
        </Card>
      </Flex>
  </>
}
