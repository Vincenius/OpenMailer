import React from 'react'
import { Card, Text } from '@mantine/core';

type Props = {
    title: string,
    count: number,
    symbol?: string,
}

const NumberCard = (props: Props) => {
    return <Card shadow="sm" padding="lg" radius="md" withBorder mr="md">
        <Text>{props.title}</Text>
        <Text size="xl" fw={700}>{props.count}{props.symbol}</Text>
    </Card>
}

export default NumberCard
