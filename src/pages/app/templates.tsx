import { useState } from 'react'
import { useFetch, useUpdate } from '@/utils/apiMiddleware'
import { notifications } from '@mantine/notifications';
import { SimpleGrid, Card, Text, Button, Modal, Flex, Box, Textarea, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Templates } from '../../../lib/models/templates'
import Layout from './Layout'
import BrowserMockup from '@/components/BrowserMockup';
import classes from '@/styles/Templates.module.css'

type TemplateProps = {
  name: string,
  title: string,
  data: Templates,
  mutate: () => Promise<any>,
}

const TemplateCard = (props: TemplateProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [html, setHtml] = useState(props?.data?.html);
  const [subject, setSubject] = useState(props?.data?.subject);
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const { triggerUpdate } = useUpdate();

  const sendTestEmail = () => {
    setLoading(true)
    triggerUpdate({ url: '/api/testEmail', method: 'POST', body: {
      subject,
      html,
      testEmail,
    }}).then(() => {
      notifications.show({
        color: 'green',
        title: 'Success',
        message: `Successfully sent test email to ${testEmail}!`,
      });
    }).finally(() => {
      setLoading(false)
    })
  }

  const saveTemplate = () => {
    setLoading(true)
    triggerUpdate({ url: '/api/templates/', method: 'PUT', body: {
      name: props.name,
      subject,
      html,
    }}).then(() => {
      close()
      props.mutate()
      notifications.show({
        color: 'green',
        title: 'Success',
        message: `Successfully saved template!`,
      });
    }).finally(() => {
      setLoading(false)
    })
  }

  return <Card shadow="sm" radius="md" withBorder>
    <Card.Section mb="md" withBorder>
      <div className={classes.cardHeaderContainer}>
        <BrowserMockup>
          { props.data && props.data.html && <div dangerouslySetInnerHTML={{__html: props.data.html}} /> }
          { (!props.data ||!props.data.html) && <span className={classes.placeholder}>Inactive...</span> }
        </BrowserMockup>
        <div className={classes.cardHeaderOverlay}></div>
      </div>
    </Card.Section>
    <Text fw={500} mb="md">{props.title}</Text>
    { props.data && props.data.subject && <Text mb="md" fs="italic">{props.data.subject}</Text> }

    <Button onClick={open}>Edit</Button>

    <Modal opened={opened} onClose={close} title="Edit template" size="xl">
      <Flex>
        <Box w="100%" mr="md">
          <TextInput
            value={subject}
            onChange={(event) => setSubject(event.currentTarget.value)}
            label="Subject"
            mb="md"
          />
          <Textarea
            value={html}
            onChange={(event) => setHtml(event.currentTarget.value)}
            label="HTML"
            mb="md"
            autosize
            minRows={4}
            maxRows={12}
          />

          <TextInput
            value={testEmail}
            onChange={(event) => setTestEmail(event.currentTarget.value)}
            label="Test Email"
            mb="md"
          />

          <Flex>
            <Button loading={loading} onClick={sendTestEmail} variant="outline" mr="md" disabled={!testEmail}>
              Send test email
            </Button>
            <Button loading={loading} onClick={saveTemplate}>
              Save
            </Button>
          </Flex>

        </Box>
        <BrowserMockup>
          <div dangerouslySetInnerHTML={{__html: html}} />
        </BrowserMockup>
      </Flex>
    </Modal>
  </Card>
}

export default function Templates() {
  const { data = [], error, isLoading, mutate } = useFetch('/api/templates')

  return (
    <Layout title="Templates" isLoading={isLoading}>
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, lg: 3, xl: 4 }} spacing={20}>
        <TemplateCard name="confirmation" title="Confirmation Email" data={...data.find((d: Templates) => d.name === 'confirmation')} mutate={mutate} />
        <TemplateCard name="welcome" title="Welcome Email" data={...data.find((d: Templates) => d.name === 'welcome')} mutate={mutate} />
      </SimpleGrid>
    </Layout>
  )
}
