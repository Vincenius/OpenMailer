import Layout from "../Layout";
import { useState } from 'react';
import { TextInput, Textarea, Flex, Box, Card, Button } from '@mantine/core';

export default function NewCampaign() {
  const [subject, setSuject] = useState('');
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);

  const sendCampaign = () => {
    setLoading(true)
    fetch('/api/campaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subject,
        html
      })
    })
    .finally(() => setLoading(false))
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

          <Button loading={loading} onClick={sendCampaign}>
            Send now
          </Button>
        </Box>
        <Box w="100%">
          <Card shadow="md" mt="md" withBorder>
            <div dangerouslySetInnerHTML={{__html: html}} />
          </Card>
        </Box>
      </Flex>
    </Layout>
  )
}