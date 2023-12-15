import React, { ReactNode } from 'react'
import { Box, Card } from '@mantine/core'
import classes from './BrowserMockup.module.css'

type Props = {
  children: ReactNode,
}

const BrowserMockup = (props: Props) => {
    return <Box w="100%">
      <Card shadow="md" mt="md" withBorder>
        <Card.Section>
          <div className={classes.browserHead}>
            <div className={classes.browserDots}></div>
          </div>
        </Card.Section>
        <Box mih={100}>
          {props.children}
        </Box>
      </Card>
    </Box>
}

export default BrowserMockup
