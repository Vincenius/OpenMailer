import useSWR from 'swr'
import Layout from './Layout'
import fetcher from '../../utils/fetcher'

export default function Subscribers() {
  const { data, error, isLoading } = useSWR('/api/subscribers', fetcher)

  return (
    <Layout title="Subscribers" isLoading={isLoading}>
      Subscribers
    </Layout>
  )
}
