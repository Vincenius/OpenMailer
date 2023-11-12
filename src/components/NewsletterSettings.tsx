import React, { useState } from 'react'
import { Text, TextInput, Flex, Button, SegmentedControl, Popover } from '@mantine/core'
import { useUpdate } from '../utils/apiMiddleware'

type Props = {
  loading: boolean,
  setLoading: (loading: boolean) => void,
  onSuccess?: () => void,
  database?: string,
}

const NewsetterSettings = (props: Props) => {
  const { loading, setLoading } = props
  const [formValues, setFormValues] = useState<any>({})
  const [type, setType] = useState('ses')
  const { triggerUpdate } = useUpdate()

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true)

    let database = props.database
    if (!database) {
      const { message } = await triggerUpdate({ url: '/api/admin', method: 'PUT', body: { name: formValues.name }})
      database = message
    }

    triggerUpdate({ url: '/api/settings', method: 'POST', body: { ...formValues, database } })
      .then(() => {
        if (props.onSuccess) {
          props.onSuccess()
        }
      }).finally(() => {
        setLoading(false)
      })
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
      placeholder="My Awesome Newsetter"
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
    <Text size="xs" mb="xs" c="dimmed">
      How do you want to send your emails?&nbsp;

      <Popover width={200} position="bottom" withArrow shadow="md">
        <Popover.Target>
          <u style={{ cursor: 'pointer' }}>What should I choose?</u>
        </Popover.Target>
        <Popover.Dropdown>
          <Text size="xs">
            Sending via your email accont is only recommended for small lists (up to ~100-200 subscribers).
            Usually email providers limit or block bulk sending. Check your provider for more info.<br/>
            It is recommended to set up <a href="https://aws.amazon.com/ses/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>AWS SES</a> instead.
            This ensures that your emails are delivered to your subscribers.
          </Text>
        </Popover.Dropdown>
      </Popover>
    </Text>
    <SegmentedControl
      data={[
        { label: 'SES', value: 'ses' },
        { label: 'E-Mail', value: 'email' }
      ]}
      value={type}
      onChange={setType}
      mb="md"
    />

    { type === 'ses' && <>
      <TextInput
        label="SES Access Key ID"
        placeholder="SES Access Key ID"
        mb="md"
        name="ses_key"
        onChange={(event) => handleChange(event.currentTarget)}
        required
      />
      <TextInput
        label="SES Secret Access Key"
        placeholder="SES Secret Access Key"
        mb="md"
        name="ses_secret"
        type="password"
        onChange={(event) => handleChange(event.currentTarget)}
        required
      />
      <TextInput
        label="SES Region"
        placeholder="SES Region"
        mb="md"
        name="ses_region"
        onChange={(event) => handleChange(event.currentTarget)}
        required
      />
    </> }

    { type === 'email' && <>
      <TextInput
        label="Email Password"
        placeholder="Password of the email used above"
        mb="md"
        name="email_pass"
        type="password"
        onChange={(event) => handleChange(event.currentTarget)}
        required
      />
      <TextInput
        label="Email Host"
        placeholder="smtp.example.com"
        mb="md"
        name="email_host"
        onChange={(event) => handleChange(event.currentTarget)}
        required
      />
    </> }

    {/* todo test connection */}

    <Flex justify="flex-end">
      <Button type="submit" loading={loading}>Continue</Button>
    </Flex>
  </form>
}

export default NewsetterSettings
