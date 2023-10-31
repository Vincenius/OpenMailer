import { useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { Table, Tooltip, ActionIcon, Modal, Text, Card, Flex, Button } from '@mantine/core';
import { IconEye } from '@tabler/icons-react'
import Layout from '../Layout'
import fetcher from '../../../utils/fetcher'
import { getOpens, getUniqueClicks } from '../../../utils/campaign'
import { Campaign } from '../../../../lib/models/campaigns';

// https://mantine.dev/core/pagination/

type CampaignModalProps = {
  campaign: Campaign | null,
  onClose: () => void,
};

const DetailsModal = ({ campaign, onClose }: CampaignModalProps) => {
  const regex = /href="([^"]+)"/g;
  const uniqueLinks: string[] = [];

  let match;
  while ((match = regex.exec(campaign?.html || '')) !== null) {
    const href = match[1];
    if (!uniqueLinks.includes(href)) {
      uniqueLinks.push(href);
    }
  }

  const linkTableData = uniqueLinks?.map((link: string) => ({
    link,
    totalClicks: campaign?.users?.reduce((acc, curr) => acc + curr.clicks.filter(c => c === link).length, 0),
    uniqueClicks: campaign?.users?.reduce((acc, curr) => acc + (curr.clicks.filter(c => c === link).length > 0 ? 1 : 0), 0)
  }))

  return <Modal opened={!!campaign} onClose={onClose} title="Campaign Details" size="auto">
    <Flex mb="xl">
      <Card shadow="sm" padding="lg" radius="md" withBorder mr="md">
        <Text>Received</Text>
        <Text size="xl" fw={700}>
          {campaign?.users.length === campaign?.users?.filter(u => u.status !== 'pending').length
            ? campaign?.users.length
            : `${campaign?.users?.filter(u => u.status !== 'pending').length}/${campaign?.users.length}`}
        </Text>
      </Card>
      <Card shadow="sm" padding="lg" radius="md" withBorder mr="md">
        <Text>Unique Opens</Text>
        <Text size="xl" fw={700}>
          {getOpens(campaign)}
        </Text>
      </Card>
      <Card shadow="sm" padding="lg" radius="md" withBorder mr="md">
        <Text>Unique Clicks</Text>
        <Text size="xl" fw={700}>
          {getUniqueClicks(campaign)}
        </Text>
      </Card>
    </Flex>

    <Table striped>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>URL</Table.Th>
          <Table.Th>Total Clicks</Table.Th>
          <Table.Th>Unique Clicks</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>

        {linkTableData?.sort((a, b) => (b.totalClicks || 0) - (a.totalClicks || 0)).map((data) =>
          <Table.Tr key={data.link}>
            <Table.Td>{data.link}</Table.Td>
            <Table.Td>{data.totalClicks}</Table.Td>
            <Table.Td>{data.uniqueClicks}</Table.Td>
          </Table.Tr>
        )}
      </Table.Tbody>
    </Table>
  </Modal>
}

export default function Campaigns() {
  const { data = [], error, isLoading } = useSWR('/api/campaigns', fetcher)
  const [campaignDetails, setCampaignDetails] = useState<Campaign | null>(null)

  const closeDetailsModal = () => {
    setCampaignDetails(null)
  }

  return (
    <Layout title="Campaigns" isLoading={isLoading}>
      <Button
        component={Link}
        href="/app/campaigns/new"
        size="md" mb="md"
      >
        New Campaign
      </Button>
      <Table striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Created At</Table.Th>
            <Table.Th>Subject</Table.Th>
            <Table.Th>Recieved</Table.Th>
            <Table.Th>Opened</Table.Th>
            <Table.Th>Clicked</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{data.map((elem: Campaign) =>
          {
            const received = elem.users.length
            const opened = elem.users.reduce((acc, user) => acc + (user.opens > 0 ? 1 : 0), 0)
            const clicked = elem.users.reduce((acc, user) => acc + (user.clicks.length > 0 ? 1 : 0), 0)

            return <Table.Tr key={elem.subject}>
              <Table.Td>{new Date(elem.createdAt).toLocaleDateString()}</Table.Td>
              <Table.Td>{elem.subject}</Table.Td>
              <Table.Td>{received}</Table.Td>
              <Table.Td>
                <Tooltip label={opened}>
                  <span>{opened === 0 ? 0 : (opened/received * 100).toFixed(1)}</span>
                </Tooltip>
              </Table.Td>
              <Table.Td>
                <Tooltip label={clicked}>
                  <span>{clicked === 0 ? 0 : (clicked/received * 100).toFixed(1)}</span>
                </Tooltip>
              </Table.Td>
              <Table.Td>
                <ActionIcon variant="filled" onClick={() => setCampaignDetails(elem)}>
                  <IconEye />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
          })}
        </Table.Tbody>
      </Table>
      <DetailsModal campaign={campaignDetails} onClose={closeDetailsModal} />
    </Layout>
  )
}
