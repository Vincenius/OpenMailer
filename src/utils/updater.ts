import { notifications } from '@mantine/notifications';

type Props = {
  url: string;
  method: string;
  body: Object;
}

export const updateFetch = ({ url, method, body }: Props) => fetch(url, {
  method,
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
}).then((response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json(); // Assuming you expect a JSON response
}).catch((err) => {
  notifications.show({
    color: 'red',
    title: 'Error',
    message: 'Something went wrong...',
  })
})