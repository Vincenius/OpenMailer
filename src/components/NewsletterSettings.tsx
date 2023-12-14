import React, { useState } from 'react'
import { Text, TextInput, Flex, Button, SegmentedControl, Popover } from '@mantine/core'
import { useUpdate } from '../utils/apiMiddleware'
import { Settings } from '../../lib/models/settings'

type Props = {
  loading: boolean,
  setLoading: (loading: boolean) => void,
  onSuccess?: () => void,
  isUpdate?: boolean,
  defaultValues: Settings,
  buttonCaption?: string,
}

const NewsetterSettings = (props: Props) => {
  const { loading, setLoading } = props
  const [formValues, setFormValues] = useState<any>(!props.isUpdate
    ? { sending_type: 'ses' }
    : props.defaultValues)
  const { triggerUpdate } = useUpdate()


  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true)

    if (props.isUpdate) {
      await triggerUpdate({ url: '/api/settings', method: 'PUT', body: formValues })
    } else {
      const { message: database } = await triggerUpdate({ url: '/api/admin', method: 'PUT', body: { name: formValues.name }})

      await triggerUpdate({ url: '/api/settings', method: 'POST', body: { ...formValues, database } })
    }

    if (props.onSuccess) {
      props.onSuccess()
    }
    setLoading(false)
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
      defaultValue={props.defaultValues?.name}
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
      defaultValue={props.defaultValues?.email}
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
      value={formValues.sending_type}
      onChange={val => setFormValues({...formValues, sending_type: val })}
      mb="md"
    />

    { formValues.sending_type === 'ses' && <>
      <TextInput
        label="SES Access Key ID"
        placeholder="SES Access Key ID"
        mb="md"
        name="ses_key"
        onChange={(event) => handleChange(event.currentTarget)}
        required
        defaultValue={props.defaultValues?.ses_key}
      />
      <TextInput
        label="SES Secret Access Key"
        placeholder="SES Secret Access Key"
        mb="md"
        name="ses_secret"
        type="password"
        onChange={(event) => handleChange(event.currentTarget)}
        required
        defaultValue={props.defaultValues?.ses_secret}
      />
      <TextInput
        label="SES Region"
        placeholder="SES Region"
        mb="md"
        name="ses_region"
        onChange={(event) => handleChange(event.currentTarget)}
        required
        defaultValue={props.defaultValues?.ses_region}
      />
    </> }

    { formValues.sending_type === 'email' && <>
      <TextInput
        label="Email Password"
        placeholder="Password of the email used above"
        mb="md"
        name="email_pass"
        type="password"
        onChange={(event) => handleChange(event.currentTarget)}
        required
        defaultValue={props.defaultValues?.email_pass}
      />
      <TextInput
        label="Email Host"
        placeholder="smtp.example.com"
        mb="md"
        name="email_host"
        onChange={(event) => handleChange(event.currentTarget)}
        required
        defaultValue={props.defaultValues?.email_host}
      />
    </> }

    {/* todo test connection */}

    <Flex justify="flex-end">
      {/* TODO caption */}
      <Button type="submit" loading={loading}>{props.buttonCaption || 'Continue'}</Button>
    </Flex>
  </form>
}

export default NewsetterSettings
