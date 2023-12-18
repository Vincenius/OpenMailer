import { useState } from 'react'
import { Table, ThemeIcon, Tooltip, Flex, Pagination, Button, Modal, ActionIcon } from '@mantine/core';
import { IconCheck, IconX, IconDots, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import NumberCard from '@/components/NumberCard';
import NewSubscribers from '@/components/NewSubscribers';
import ImportForm from '@/components/ImportForm';
import { useFetch, useUpdate } from '@/utils/apiMiddleware'
import Layout from './Layout'
import { Subscriber } from '../../../lib/models/subscriber';

export default function Subscribers() {
  const [opened, { open, close }] = useDisclosure(false);
  const [page, setPage] = useState(1)
  const { data = {}, error, isLoading, mutate } = useFetch(`/api/subscribers?page=${page}`)
  const { total = 0, subscribers = [] } = data
  const { triggerUpdate } = useUpdate()

  const deleteSub = async (email: string) => {+
    // todo loading state
    triggerUpdate({ url: '/api/subscribers', method: 'DELETE', body: { email } }).then(() => {
      mutate() // todo optimistic update https://swr.vercel.app/docs/mutation#bound-mutate
    })
  }

  return (
    <Layout title="Subscribers" isLoading={isLoading}>
      <Flex mb="lg" justify="space-between" align="center">
        <NumberCard title="Subscriber Count" count={total} />
        <Flex direction="column">
          <Button onClick={open} mb="md">Show subscribe form</Button>
          <ImportForm onSuccess={() => mutate()}/>
        </Flex>
      </Flex>
      <Table striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Email</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Created At</Table.Th>
            <Table.Th>Recieved</Table.Th>
            <Table.Th>Opened</Table.Th>
            <Table.Th>Clicked</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{subscribers
          .sort((a: Subscriber, b: Subscriber) => new Date(b.createdAt).getTime() > new Date(a.createdAt).getTime())
          .map((elem: Subscriber) =>
            <Table.Tr key={elem.email}>
              <Table.Td>{elem.email}</Table.Td>
              <Table.Td>
                <ThemeIcon color={elem.unsubscribedAt ? 'red' : elem.confirmed ? 'green' : 'grey'}>
                  {elem.unsubscribedAt
                    ? <IconX />
                    : elem.confirmed
                      ? <IconCheck style={{ width: '70%', height: '70%' }} />
                      : <IconDots style={{ width: '70%', height: '70%' }} />
                  }
                </ThemeIcon>
              </Table.Td>
              <Table.Td>{new Date(elem.createdAt).toLocaleDateString()}</Table.Td>
              <Table.Td>{elem.received}</Table.Td>
              <Table.Td>
                <Tooltip label={elem.opened}>
                  <span>{elem.opened === 0 ? 0 : (elem.opened/elem.received * 100).toFixed(1)}</span>
                </Tooltip>
              </Table.Td>
              <Table.Td>
                <Tooltip label={elem.clicked}>
                  <span>{elem.clicked === 0 ? 0 : (elem.clicked/elem.received * 100).toFixed(1)}</span>
                </Tooltip>
              </Table.Td>
              <Table.Td>
                <ActionIcon variant="light" color="red" aria-label="delete" onClick={() => deleteSub(elem.email)}>
                  <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>

      { total > 50 && <Pagination value={page} onChange={setPage} total={total / 50} mt="md" mb="xl" /> }

      <Modal opened={opened} onClose={close} title="Subscribe form" size="xl">
        <NewSubscribers />
      </Modal>
    </Layout>
  )
}
