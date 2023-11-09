import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { signIn } from "next-auth/react"
import Head from 'next/head'
import { Card, Title, Flex, Button, TextInput, Stepper, Text } from '@mantine/core';
import NewsetterSettings from '../components/NewsletterSettings';

export default function Setup() {
  const { data: session } = useSession()
  const [active, setActive] = useState(2);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<any>({})

  useEffect(() => {
    // todo redirect if setup already done
    if (session !== undefined) {
      setActive(2) // todo -> 1
      setFormValues({
        base_url: window.location.origin,
        cors_origin: '*',
        newsletters: [],
      })
    }
    // todo redirect if not logged in but account exists?
  }, [session])

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
          cors_origin: '*',
        })
      }
      nextStep()
    }).finally(() => {
      setLoading(false)
    })
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
            <Stepper.Step label="Settings" description="Set up OpenMailer" loading={loading && active === 1}>
              <form onSubmit={handleSubmit}>
                <Title size="h3"  order={2}>Set-up OpenMailer</Title>
                <Text mb="md" fs="italic">Global settings that apply to all mailing lists created with OpenMailer.</Text>

                <TextInput
                  label="Base URL"
                  placeholder="Base URL"
                  description="The domain where OpenMailer is hosted. It is used to generate email links (eg. the unsubscribe link)."
                  mb="md"
                  name="base_url"
                  onChange={(event) => handleChange(event.currentTarget)}
                  value={formValues?.base_url || ''}
                  required
                />
                <TextInput
                  label="CORS Origin"
                  placeholder="CORS Origin"
                  description="Domains from where you want to allow users to sign up for your newsletters. Keep * for allowing sign ups from everywhere."
                  mb="md"
                  name="cors_origin"
                  onChange={(event) => handleChange(event.currentTarget)}
                  value={formValues?.cors_origin || ''}
                  required
                />

                <Flex justify="flex-end">
                  <Button type="submit" loading={loading}>Continue</Button>
                </Flex>
              </form>
            </Stepper.Step>
            <Stepper.Step label="Email" description="Create your mailing list" loading={loading && active === 2}>
              <Title size="h3" mb="md" order={2}>Create your mailing list</Title>

              <NewsetterSettings loading={loading} setLoading={setLoading} />
            </Stepper.Step>
          </Stepper>
        </Card>
      </Flex>
  </>
}
