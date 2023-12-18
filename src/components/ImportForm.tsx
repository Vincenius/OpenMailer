import { useState } from 'react'
import { Button, Modal, Group, Text, rem, Stepper, Table, Flex, NumberInput, Select, Box } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import Papa from 'papaparse';
import { useUpdate } from '../utils/apiMiddleware'

type Props = {
  onSuccess?: () => void,
}

type ImportProps = {
  start: number,
  emailCol: number,
  createdAtCol?: number | null,
  receivedCol?: number | null,
  openedCol?: number | null,
  clickedCol?: number | null,
  locationCol?: number | null,
}

function indexToExcelHeader(index: number): string {
  let dividend = index + 1;
  let columnName = '';

  while (dividend > 0) {
    let modulo = (dividend - 1) % 26;
    columnName = String.fromCharCode(65 + modulo) + columnName;
    dividend = parseInt(((dividend - modulo) / 26).toString(), 10);
  }

  return columnName;
}

export default function ImportForm(props: Props) {
  const { onSuccess } = props
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(0);
  const [data, setData] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [importOptions, setImportOptions] = useState<ImportProps>({
    start: 1,
    emailCol: 0,
  });
  const { triggerUpdate } = useUpdate()

  const openModal = () => {
    setLoading(false)
    setTotal(0)
    setActive(0)
    setProgress(0)
    open()
  }

  const parseCsv = (files: any) => {
    setLoading(true);
    Papa.parse(files[0], { complete: (results: any) => {
      setActive(1)
      setLoading(false)
      setData(results.data)
    } })
  }

  const monitorProgress = async (count: number) => {
    const { progress: tmpProgress } = await fetch('/api/import', { method: 'GET' }).then(res => res.json())
    setProgress(tmpProgress)

    if (tmpProgress === count) {
      setLoading(false)
      close()
      notifications.show({
        color: 'green',
        title: 'Success',
        message: `Successfully imported ${count} subscribers...`,
      });
      if (onSuccess) {
        onSuccess()
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000))
      monitorProgress(count)
    }
  }

  const startImport = () => {
    const copyData = Array.from(data);
    copyData.splice(0, (importOptions.start - 1));
    const subscribers = copyData.map(row => ({
      email: row[importOptions.emailCol],
      createdAt: importOptions.createdAtCol && row[importOptions.createdAtCol],
      received: importOptions.receivedCol && row[importOptions.receivedCol],
      opened: importOptions.openedCol && row[importOptions.openedCol],
      clicked: importOptions.clickedCol && row[importOptions.clickedCol],
      location: importOptions.locationCol && row[importOptions.locationCol],
    })).filter(e => !!e.email)
    setTotal(subscribers.length)
    setLoading(true)
    triggerUpdate({ url: '/api/import', method: 'POST', body: subscribers })
    monitorProgress(subscribers.length)
  }

  const columns = ((data[0] || []) as String[]).map((elem: any, index: number) => indexToExcelHeader(index));

  return <>
    <Button
      mb="lg"
      onClick={openModal}
    >
      Import Subscribers
    </Button>

    <Modal opened={opened} onClose={close} title="Import Subscribers" size="xl">
      <Stepper active={active}>
        <Stepper.Step label="Upload CSV file">
          <Dropzone
            onDrop={parseCsv}
            onReject={(files) => console.log('rejected files', files)}
            maxSize={3 * 1024 ** 2}
            accept={[MIME_TYPES.csv]}
            multiple={false}
            loading={loading}
          >
            <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
              <Dropzone.Accept>
                <IconUpload
                  style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                  stroke={1.5}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconPhoto
                  style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                  stroke={1.5}
                />
              </Dropzone.Idle>

              <div>
                <Text size="xl" inline>
                  Drag your CSV file here or click to select files
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  Your file should not exceed 5mb.
                </Text>
              </div>
            </Group>
          </Dropzone>
        </Stepper.Step>
        <Stepper.Step label="Select import fields">
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Td></Table.Td>
                { columns.map(c => <Table.Td key={`table-head-${c}`}>
                  {c}
                </Table.Td> )}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{
              data.slice(0,5).map((row: Array<any>, i) => (
                <Table.Tr key={`table-${i}`}>
                  <Table.Td>{i+1}</Table.Td>
                  {row.map((column, j) => <Table.Td key={`table-${i}-${j}`}>{column}</Table.Td> )}
                </Table.Tr>
              ))
            }</Table.Tbody>
          </Table>
          {data.length > 5 && <Text mb="md" ta="center">
            ...{data.length - 5} more rows
          </Text>}

          <form onSubmit={(e) => {
            e.preventDefault()
            setActive(2)
          }}>
            <Flex mb="md">
              <NumberInput
                label="First row"
                description="Choose row from where import starts"
                required
                allowDecimal={false}
                mr="md"
                onChange={(val) => setImportOptions({ ...importOptions, start: parseInt(String(val), 10) })}
                defaultValue={1}
              />
              <Select
                label="Email address"
                description="The column including the email address"
                data={columns.map((column, i) => ({ value: i.toString(), label: column }))}
                onChange={(val) => setImportOptions({ ...importOptions, emailCol: val ? parseInt(val) : 1 })}
                defaultValue={importOptions.emailCol?.toString()}
                required
              />
            </Flex>

            <Flex mb="md">
              <Select
                label="Created at (optional)"
                clearable
                data={columns.map((column, i) => ({ value: i.toString(), label: column }))}
                onChange={(val) => setImportOptions({ ...importOptions, createdAtCol: val ? parseInt(val) : null })}
                defaultValue={importOptions.createdAtCol?.toString()}
                mr="md"
              />

              <Select
                label="Emails received (optional)"
                clearable
                data={columns.map((column, i) => ({ value: i.toString(), label: column }))}
                onChange={(val) => setImportOptions({ ...importOptions, receivedCol: val ? parseInt(val) : null })}
                defaultValue={importOptions.receivedCol?.toString()}
                mr="md"
              />
              <Select
                label="Emails opened (optional)"
                clearable
                data={columns.map((column, i) => ({ value: i.toString(), label: column }))}
                onChange={(val) => setImportOptions({ ...importOptions, openedCol: val ? parseInt(val) : null })}
                defaultValue={importOptions.openedCol?.toString()}
              />
            </Flex>
            <Flex>
              <Select
                label="Emails clicked (optional)"
                clearable
                data={columns.map((column, i) => ({ value: i.toString(), label: column }))}
                onChange={(val) => setImportOptions({ ...importOptions, clickedCol: val ? parseInt(val) : null })}
                defaultValue={importOptions.clickedCol?.toString()}
                mr="md"
              />

              <Select
                label="Location (optional)"
                clearable
                data={columns.map((column, i) => ({ value: i.toString(), label: column }))}
                onChange={(val) => setImportOptions({ ...importOptions, locationCol: val ? parseInt(val) : null })}
                defaultValue={importOptions.locationCol?.toString()}
              />
            </Flex>

            <Flex mt="md">
              <Button onClick={() => setActive(0)} variant="outline" mr="md" loading={loading}>Back</Button>
              <Button type="submit" loading={loading}>Continue</Button>
            </Flex>
          </form>
        </Stepper.Step>
        <Stepper.Step label="Confirm">
          <Text mb="sm">An example import subscriber will look like this:</Text>
          {active === 2 && <Box p="sm" bg="blue.1">
            <Text>Email: <i>{data[importOptions.start - 1][importOptions.emailCol]}</i></Text>
            { importOptions.createdAtCol && <Text>Created at: <i>{data[importOptions.start - 1][importOptions.createdAtCol]}</i></Text> }
            { importOptions.receivedCol && <Text>Emails received: <i>{data[importOptions.start - 1][importOptions.receivedCol]}</i></Text> }
            { importOptions.openedCol && <Text>Emails opened: <i>{data[importOptions.start - 1][importOptions.openedCol]}</i></Text> }
            { importOptions.clickedCol && <Text>Emails clicked: <i>{data[importOptions.start - 1][importOptions.clickedCol]}</i></Text> }
            { importOptions.locationCol && <Text>Location: <i>{data[importOptions.start - 1][importOptions.locationCol]}</i></Text> }
          </Box> }

          { loading && <Text mt="md" ta="center">Importing... ({progress} / {total})</Text> }

          <Flex mt="md">
            <Button onClick={() => setActive(1)} variant="outline" mr="md">Back</Button>
            <Button onClick={startImport}>Start import</Button>
          </Flex>
        </Stepper.Step>
      </Stepper>
    </Modal>
  </>
}
