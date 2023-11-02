import { useTranslate, useDataProvider, useRecordContext } from 'react-admin'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import { useNavigate, useParams } from "react-router-dom";

export const SFTPConnectButton = (props: any) => {
  const translate = useTranslate()
  const { workId } = useParams()
  const navigate = useNavigate()
  const record = useRecordContext();
  const dataProvider = useDataProvider()
  const { id } = props
  if (record.protocol !== "ssh") return null
  return (<Button
    children={'SFTP'}
    sx={{ height: 20, ml: 0.5 }}
    variant="contained"
    onClick={() => navigate('/connections/' + workId + '/' + record.identifier + '/SFTP')}
  />)
}