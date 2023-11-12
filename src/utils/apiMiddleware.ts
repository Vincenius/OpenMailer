import { useLocalStorage } from '@mantine/hooks';
import useSWR from 'swr'
import { notifications } from '@mantine/notifications';

export const useFetch = (url: string) => {
  const [mailingList] = useLocalStorage({ key: 'selected-mailing-list' });

  const fetcher = async ([url, mailingList]: [string, string?]): Promise<any> => {
    const data = mailingList
      ? await fetch(url, {
        headers: { 'x-mailing-list': mailingList },
      }).then(res => res.json())
      : undefined

    return data;
  };

  return useSWR([url, mailingList], fetcher)
}

type Props = {
  url: string;
  method: string;
  body: Object;
}

export const useUpdate = () => {
  const [mailingList] = useLocalStorage({ key: 'selected-mailing-list' });

  const triggerUpdate = async ({ url, method, body }: Props) => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-mailing-list': mailingList,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json(); // Assuming you expect a JSON response
    } catch (err) {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Something went wrong...',
      });
    }
  };

  return { triggerUpdate };
};
