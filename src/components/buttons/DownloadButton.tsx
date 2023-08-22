import * as React from 'react';
import {
  useNotify,
  useRecordContext,
  useDataProvider,
  useTranslate,
} from 'react-admin';
import {
  Button,
  Tooltip,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { download, decodeUTF8 } from '../utils'
import CircularProgress from '@mui/material/CircularProgress';

const DownloadButton = (props: any) => {
  const record = useRecordContext();
  const notify = useNotify();
  const translate = useTranslate()
  const dataProvider = useDataProvider();
  const [state, setState] = React.useState(false)
  const [progress, setProgress] = React.useState(-1)
  const [total, setTotal] = React.useState(-1)
  const handler = (response: Response) => {
    setState(true)
    const UTF8encodedArray = new Uint8Array(response.headers.get('Content-Filename').split(',').map((x: string) => Number(x)))
    const filename = decodeUTF8(UTF8encodedArray);
    const contentLength = response.headers.get('content-length');
    setTotal(parseInt(contentLength, 10))
    const res = new Response(new ReadableStream({
      async start(controller) {
        const reader = response.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            setInterval(() => {
              setState(false)
            }, 1500);
            break
          }
          setProgress(progress => progress + value.byteLength)
          controller.enqueue(value);
        }
        controller.close();
      },
    }));
    res.blob().then((blob: Blob) => download(blob, filename));
  }
  return React.useMemo(() => {
    if (state) {
      const percent = Math.floor((progress / total) * 100)
      return <Button size="small" disabled>
        <CircularProgress size={20} variant="determinate" value={percent} sx={{ mr: 1 }} />
      </Button>
    }
    else {
      return <Tooltip title={translate('file.download')} placement="top-start">
        <Button color="primary" sx={{ display: 'inline-flex' }} startIcon={< FileDownloadIcon />} size={"small"}
          onClick={() => {
            notify(`file.downloading`, { type: 'info', messageArgs: { filename: record.filename } })
            dataProvider.download('root', { "id": record.id }).then((response: Response) => {
              if (response.status < 200 || response.status >= 300) {
                notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.statusText } })
              }
              else handler(response)
            })
          }}
        />
      </Tooltip>
    }
  }, [state, total, progress])

};
export default DownloadButton