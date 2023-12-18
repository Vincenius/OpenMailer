import { useState } from 'react'
import { useFetch } from '@/utils/apiMiddleware'
import NewsetterSettings from '@/components/NewsletterSettings';
import { notifications } from '@mantine/notifications';
import Layout from './Layout'

export default function Subscribers() {
  const [loading, setLoading] = useState(false);
  const { data = {}, error, isLoading, mutate } = useFetch(`/api/settings`)

  const onSuccess = () => {
    notifications.show({
      color: 'green',
      title: 'Success',
      message: `Successfully updated the newsletter settings!`,
    });
  }

  return (
    <Layout title="Settings" isLoading={isLoading}>
      {!isLoading && <NewsetterSettings
        loading={loading}
        setLoading={setLoading}
        onSuccess={onSuccess}
        isUpdate={true}
        defaultValues={data}
        buttonCaption="Submit"
      />}
    </Layout>
  )
}
