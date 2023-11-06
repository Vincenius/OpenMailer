import React, { useState } from 'react'
import { Box, Text, TextInput, Flex, Button, SegmentedControl } from '@mantine/core'

type Props = {
  loading: boolean,
  setLoading: (loading: boolean) => void,
}

const NewsetterSettings = (props: Props) => {
  const { loading, setLoading } = props
  const [formValues, setFormValues] = useState<any>({})
  const [type, setType] = useState('ses')

  const handleSubmit = (e: React.SyntheticEvent): void => {
    e.preventDefault();
  }

  const handleChange = (target: EventTarget): void => {
    const inputElement = target as HTMLInputElement;
    setFormValues({
      ...formValues,
      [inputElement.name]: inputElement.value,
    })
  }

  return <form onSubmit={handleSubmit}>
    <TextInput
      label="Newsletter Name"
      placeholder="Newsletter Name"
      mb="md"
      name="name"
      onChange={(event) => handleChange(event.currentTarget)}
      required
    />

    <TextInput
      label="Email"
      placeholder="info@example.com"
      description="The email address you want to use to send the emails."
      mb="md"
      name="email"
      type="email"
      onChange={(event) => handleChange(event.currentTarget)}
      required
    />

    <Text size="sm" fw={500}>Sending Type</Text>
    <Text size="xs" mb="xs" c="dimmed">How do you want to send your emails?</Text>
    {/* todo info icon box */}
    <SegmentedControl
      data={[
        { label: 'SES', value: 'ses' },
        { label: 'E-Mail', value: 'email' }
      ]}
      value={type}
      onChange={setType}
    />

    { type === 'ses' && <>
      {/* ses_user?: string,
      ses_password?: string,
      ses_region?: string, */}
    </> }

    { type === 'email' && <>
      {/* email_user?: string,
      email_pass?: string,
      email_host?: string, */}
    </> }

    {/* welcome email?? */}

    <Flex justify="flex-end">
      <Button type="submit" loading={loading}>Continue</Button>
    </Flex>
  </form>
}

export default NewsetterSettings
