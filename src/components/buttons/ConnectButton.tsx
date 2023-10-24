import * as React from 'react';
import {
  useTranslate,
  useRecordContext,
  useDataProvider,
} from 'react-admin'
import { Button, Typography } from '@mui/material';
import { getClientIdentifier } from '../utils'
import { FireContext } from '../pages/ConnectionsList'

export const ConnectButton = (props: any) => {
  const { id, type, workId } = props
  const { fire, setFire } = React.useContext(FireContext);
  const record = useRecordContext();
  const translate = useTranslate()
  const identifier = id ? getClientIdentifier(id, type, workId) : getClientIdentifier(record.identifier, type, workId)
  const dataProvider = useDataProvider()
  return (
    <Button
      variant="contained"
      sx={{ height: 20, m: 0.3 }}
      onClick={() => {
        dataProvider.getenv("files", {}).then(({ json }: any) => {
          setFire(!fire)
          window.open( json.guacUrl + "/#/client/" + identifier, identifier)
        })
      }}
    >
      <Typography component="pre" variant="body2">
        {translate('guacamole.connect')}
      </Typography>

    </Button>

  )
}