import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Card, Title, Divider, Flex, Button, TextInput, Stepper } from '@mantine/core';

// https://mantine.dev/core/stepper/
// TODO <head>

export default function Setup() {
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({})

  const handleChange = (target: EventTarget): void => {
    const inputElement = target as HTMLInputElement;
    setFormValues({
      ...formValues,
      [inputElement.name]: inputElement.value,
    })
  }

  const goNext = () => {
    // todo submit stuff
    nextStep()
  }
  const nextStep = () => setActive((current: number) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current: number) => (current > 0 ? current - 1 : current));

  // todo redirect if setup already done

  return <>
    <Head>
      <title>OpenMailer</title>
      <meta name="description" content="A minimalist Next.js alternative to Mailchimp, Beehiiv, Convertkit etc..." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Flex justify="center">
      <Card shadow="sm" padding="lg" radius="md" withBorder m="xl" w={760}>

        <Stepper active={active} onStepClick={setActive}>
          <Stepper.Step label="Account" description="Create an admin account" loading={loading && active === 0}>
            <Title size="h3" mb="md" order={2}>Create an admin account</Title>

            <TextInput
              label="Username"
              placeholder="Username"
              mb="md"
              name="username"
              onChange={(event) => handleChange(event.currentTarget)}
            />
            <TextInput
              label="Password"
              placeholder="Password"
              mb="xl"
              type="password"
              name="password"
              onChange={(event) => handleChange(event.currentTarget)}
            />
          </Stepper.Step>
          <Stepper.Step label="Settings" description="Set up OpenMailer" loading={loading && active === 1}>
            <Title size="h3" mb="md" order={2}>Set-up OpenMailer</Title>

            {/*
              base_url: string, -> ???
              cors_origin: string, */}
          </Stepper.Step>
          <Stepper.Step label="Email" description="Create your newsletter" loading={loading && active === 2}>
            <Title size="h3" mb="md" order={2}>Create your newsletter</Title>

            {/* newsletter:
              email: string,
              confirm_redirect: string,
              sending_type: string, // 'email' or 'ses'
              ses_user?: string,
              ses_password?: string,
              ses_region?: string,
              email_user?: string,
              email_pass?: string,
              email_host?: string, */}
          </Stepper.Step>
        </Stepper>

        <Flex justify="space-between">
          { active > 0 && <Button onClick={prevStep} variant="outline">Go Back</Button> }
          { active === 0 && <div></div> }
          {/* todo disabled */}
          <Button onClick={goNext}>Continue</Button>
        </Flex>
      </Card>
    </Flex>
  </>
}
