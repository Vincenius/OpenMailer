import { useRouter } from 'next/navigation'
import { useState } from 'react';
import { TextInput, Textarea, Flex, Box, Button, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import Layout from "../Layout";
import { useUpdate, useFetch } from '@/utils/apiMiddleware'
import BrowserMockup from '@/components/BrowserMockup'

export default function NewCampaign() {
  const router = useRouter()
  const [subject, setSubject] = useState('');
  const [html, setHtml] = useState('<html><body>Preview</body></html>');
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [opened, { open, close }] = useDisclosure(false);
  const [confirmOpened, { open: confirmOpen, close: confirmClose }] = useDisclosure(false);
  const { triggerUpdate } = useUpdate()
  const { data = {}, error, isLoading } = useFetch('/api/dashboard')

  const sendCampaign = ({ test = false }) => {
    setLoading(true)
    const url = test ? '/api/testEmail' : '/api/campaigns';
    triggerUpdate({ url, method: 'POST', body: {
      subject,
      html,
      testEmail,
    }}).then(() => {
      if (test) {
        close()
        notifications.show({
          color: 'green',
          title: 'Success',
          message: `Successfully sent test email to ${testEmail}!`,
        });
      } else {
        confirmClose()
        router.push('/app/campaigns')
        notifications.show({
          color: 'green',
          title: 'Success',
          message: `Successfully started campaign!`,
        });
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  return (
    <Layout title="Campaigns" isLoading={false}>
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
          {/* GROUPS */}

          <Flex>
            <Button loading={loading} onClick={confirmOpen} mr="md">
              Send now
            </Button>
            <Button loading={loading} onClick={open} variant="outline">
              Send test email
            </Button>
          </Flex>

        </Box>
        <BrowserMockup>
          <div dangerouslySetInnerHTML={{__html: html}} />
        </BrowserMockup>
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

      <Modal opened={confirmOpened} title="Are you sure?" size="sm" onClose={confirmClose}>
        <Text mb="md">
          Your campaign “<b>{subject}</b>” will be send out to <b>{data.subscriberCount}</b> subscribers.
        </Text>

        <Button loading={loading} onClick={() => sendCampaign({ test: false })}>
          Send now
        </Button>
      </Modal>
    </Layout>
  )
}