import { Flex, Title } from '@mantine/core'
import useSWR from 'swr'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import styles from '@/styles/Home.module.css'
import NumberCard from '@/components/NumberCard';
import Layout from './Layout'
import fetcher from '../../utils/fetcher'
import { getOpens, getUniqueClicks, getRate } from '../../utils/campaign';

type SubChartResult = {
  date: string,
  subscribes: number,
  subscriberCount: number,
}

export default function Home() {
  const { data = {}, error, isLoading } = useSWR('/api/dashboard', fetcher)

  const subscribers: SubChartResult[] = data.subscribers || []

  const gradientOffset = () => {
    const dataMax = Math.max(...subscribers.map((i) => i.subscribes));
    const dataMin = Math.min(...subscribers.map((i) => i.subscribes));

    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }

    return dataMax / (dataMax - dataMin);
  };
  const off = gradientOffset();

  const lastReceived = data.campaign?.users.length || 0
  const lastOpened = getRate(getOpens(data.campaign) || 0, lastReceived)
  const lastClicked = getRate(getUniqueClicks(data.campaign) || 0, lastReceived)

  return (
    <Layout title="Dashboard" isLoading={isLoading}>
      <Flex mb="xl">
        <NumberCard title="Subscribers" count={data.subscriberCount} />
        <NumberCard title="Recent Open Rate" count={lastOpened} symbol="%" />
        <NumberCard title="Recent Click Rate" count={lastClicked} symbol="%" />
      </Flex>
      <Title size="h4" mb="md">Recent Subscriber Growth</Title>
      <Flex>
        <ResponsiveContainer  width="100%" height={300}>
          <AreaChart
            width={500}
            height={400}
            data={subscribers}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <defs>
              <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset={off} stopColor="#2b8a3e" stopOpacity={1} />
                <stop offset={off} stopColor="#fa5252" stopOpacity={1} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="subscribes" stroke="#2C2E33" fill="url(#splitColor)" />
          </AreaChart>
        </ResponsiveContainer>
      </Flex>
    </Layout>
  )
}
