import Head from 'next/head'
import { Flex, Card, Title, Text } from '@mantine/core';

export default function ConfirmSuccess() {
  return (<Flex align="center" justify="center">
    <Head>
      <title>Successfully subscribed!</title>
    </Head>
    <Card shadow="md" m="xl" withBorder maw={500}>
      <Title order={1} mb="md">Successfully subscribed!</Title>
      <Text mb="md">You have successfully subscribed to our newsletter. Be on the lookout for our emails, which will be arriving shortly.</Text>
      <Text>Thank you for joining!</Text>
    </Card>
  </Flex>)
}
