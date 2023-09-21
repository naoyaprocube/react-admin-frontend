import * as React from 'react';
import {
  useNotify,
  useRecordContext,
  useDataProvider,
  useTranslate,
} from 'react-admin';
import {
  Button,
  Box,
  Typography,
  Tooltip,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { download, decodeUTF8 } from '../utils'
import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number },
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 30,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

const DownloadButton = (props: any) => {
  const record = useRecordContext();
  const notify = useNotify();
  const translate = useTranslate()
  const dataProvider = useDataProvider();
  const [state, setState] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [total, setTotal] = React.useState(1)
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
            setTimeout(() => {
              setState(false)
              setProgress(0)
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
        <CircularProgressWithLabel size={20} value={percent} sx={{ mr: 1 }} />
      </Button>
    }
    else {
      return <Tooltip title={translate('file.download')} placement="top-start">
        <Button color="primary" sx={{ display: 'inline-flex' }} startIcon={< FileDownloadIcon />} size={"small"}
          onClick={() => {
            notify(`file.downloading`, { type: 'info', messageArgs: { filename: record.filename } })
            dataProvider.download('files', { "id": record.id }).then((response: Response) => {
              if (response.status < 200 || response.status >= 300) {
                if (response.statusText) notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.statusText } })
                else notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: "Error" } })
              }
              else handler(response)
            }).catch((response: any) => {
              notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.message } })
            })
          }}
        />
      </Tooltip>
    }
  }, [state, total, progress])

};
export default DownloadButton