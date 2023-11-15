import Layout from "../Layout";
import { useState } from 'react';
import { TextInput, Textarea, Flex, Box, Card, Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useUpdate } from '@/utils/apiMiddleware'

export default function NewCampaign() {
  const [subject, setSuject] = useState('');
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [opened, { open, close }] = useDisclosure(false);
  const { triggerUpdate } = useUpdate()

  const sendCampaign = ({ test = false }) => {
    setLoading(true)
    const url = test ? '/api/testEmail' : '/api/campaigns';
    triggerUpdate({ url, method: 'POST', body: {
      subject,
      html,
      testEmail,
    }}).finally(() => {
      setLoading(false)
      close()
    })
  }

  return (
    <Layout title="Campaigns" isLoading={false}>
      <Flex>
        <Box w="100%" mr="md">
          <TextInput
            value={subject}
            onChange={(event) => setSuject(event.currentTarget.value)}
            label="Subject"
            mb="md"
          />
          <Textarea
            value={html}
            onChange={(event) => setHtml(event.currentTarget.value)}
            label="HTML"
            mb="md"
          />
          {/* GROUPS */}

          <Flex>
            <Button loading={loading} onClick={() => sendCampaign({ test: false })} mr="md">
              Send now
            </Button>
            <Button loading={loading} onClick={open} variant="outline">
              Send test email
            </Button>
          </Flex>

        </Box>
        <Box w="100%">
          <Card shadow="md" mt="md" withBorder>
            <div dangerouslySetInnerHTML={{__html: html}} />
          </Card>
        </Box>
      </Flex>

      <Modal opened={opened} onClose={close} title="Send test email">
        <TextInput
          label="Test email address"
          value={testEmail}
          onChange={(event) => setTestEmail(event.currentTarget.value)}
          type="email"
          mb="md"
        />

        <Button loading={loading} onClick={() => sendCampaign({ test: true })}>
          Send now
        </Button>
      </Modal>
    </Layout>
  )
}