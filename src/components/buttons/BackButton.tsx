import {useTranslate} from 'react-admin'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import { useNavigate } from "react-router-dom";

export const BackButton = (props:any) => {
  const translate = useTranslate()
  const navigate = useNavigate()
  const {dirId} = props
  return (<Button
    startIcon={<ArrowBackIcon />}
    children={translate('ra.action.back')}
    size="small"
    onClick={() => navigate("/files/" + dirId)}
    color="inherit"
  />)
}