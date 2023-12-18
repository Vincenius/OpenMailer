import { CodeHighlight } from '@mantine/code-highlight';
import { Card, LoadingOverlay, Tabs } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'

import { useFetch } from '@/utils/apiMiddleware'

const curlCode = (url: string, list: string) => `curl -X POST -H "Content-Type: application/json" \\
-d '{"list": "${list}", "email": "subscriber@example.com"}' \\
${url}/api/subscribe`

const jsCode = (url: string, list: string) => `fetch("${url}/api/subscribe", {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    list: '${list}',
    email: 'subscriber@example.com', // replace with user email
  }),
})`

const htmlCode = (url: string, list: string) => `<form action="${url}/api/subscribe" method="POST">
  <label for="email">Email:</label><br>
  <input type="email" id="email" name="email" required><br>
  <input type="text" id="list" name="list" value="${list}" style="display: none;" required>
  <button type="submit">Submit</button>
</form>`


export default function NewSubscribers() {
  const { data = {}, error, isLoading } = useFetch('/api/admin')
  const [mailingList] = useLocalStorage({ key: 'selected-mailing-list' });
  const { base_url } = data;

  return (<>
    <Card shadow="sm" padding="lg" radius="md" withBorder mr="md">
      <LoadingOverlay visible={!!isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      <Tabs defaultValue="javascript">
        <Tabs.List mb="md">
          <Tabs.Tab value="javascript">
            JavaScript
          </Tabs.Tab>
          <Tabs.Tab value="form">
            HTML Form
          </Tabs.Tab>
          <Tabs.Tab value="curl">
            cURL
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="javascript">
          <CodeHighlight code={jsCode(base_url, mailingList)} language="javascript" />
        </Tabs.Panel>

        <Tabs.Panel value="form">
          <CodeHighlight code={htmlCode(base_url, mailingList)} language="html" />
        </Tabs.Panel>

        <Tabs.Panel value="curl">
          <CodeHighlight code={curlCode(base_url, mailingList)} language="bash" />
        </Tabs.Panel>
      </Tabs>
    </Card>
    </>)
}