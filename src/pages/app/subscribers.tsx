import { useState } from 'react'
import useSWR from 'swr'
import { Table, ThemeIcon, Tooltip, Flex, Pagination } from '@mantine/core';
import { IconCheck, IconX, IconDots } from '@tabler/icons-react';
import NumberCard from '@/components/NumberCard';
import Layout from './Layout'
import fetcher from '../../utils/fetcher'
import { Subscriber } from '../../../lib/models/subscriber';


export default function Subscribers() {
  const [page, setPage] = useState(1)
  const { data = {}, error, isLoading } = useSWR(`/api/subscribers?page=${page}`, fetcher)
  const { total = 0, subscribers = [] } = data

  return (
    <Layout title="Subscribers" isLoading={isLoading}>
      <Flex mb="lg">
        <NumberCard title="Subscriber Count" count={total} />
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
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>

      { total > 50 && <Pagination value={page} onChange={setPage} total={total / 50} mt="md" /> }
    </Layout>
  )
}
