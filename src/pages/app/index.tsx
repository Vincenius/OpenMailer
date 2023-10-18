import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Layout from './Layout'

export default function Home() {
  return (
    <Layout title="Dashboard" isLoading={false}>
      Dashboard
      {/* subscriber count overview */}
      {/* latest campaign overview */}
      {/* new campaign link */}
    </Layout>
  )
}
