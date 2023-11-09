import '@/styles/globals.css'
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import type { AppProps } from 'next/app'
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { SessionProvider } from "next-auth/react"

const theme = createTheme({
  /** Put your mantine theme override here */
});

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return <SessionProvider session={session}>
      <MantineProvider theme={theme}>
        <Notifications />
        <Component {...pageProps} />
      </MantineProvider>
  </SessionProvider>
}
