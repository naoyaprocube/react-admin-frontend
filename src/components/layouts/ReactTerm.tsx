import * as React from 'react'
import { useAccessToken } from '../../tokenProvider'
import { FitAddon } from 'xterm-addon-fit';
import {
  useDataProvider,
  useRecordContext,
  useTranslate,
} from 'react-admin';
import {
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Slider,
  IconButton,
  Typography,
  AppBar,
  Toolbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { toHHMMSS } from '../utils'
import { RecordTextDownloadButton } from '../buttons/RecordTextDownloadButton'
import { Terminal } from 'xterm'
const sx = {
  width: "100%",
  height: "100%",
  bgcolor: "#000000",
  "& .xterm": {
    position: "relative",
    userSelect: "none",
    msUserSelect: "none",
    webkitUserSelect: "none",
  },
  "& .xterm:focus": {
    outline: "none"
  },
  "& .xterm-helpers": {
    position: "absolute",
    top: 0,
    zIndex: 5,
  },
  "& .xterm-helper-textarea": {
    padding: 0,
    border: 0,
    margin: 0,
    position: "absolute",
    opacity: 0,
    left: "-9999em",
    top: 0,
    width: 0,
    height: 0,
    zIndex: -5,
    whiteSpace: "nowrap",
    overflow: "hidden",
    resize: "none",
  },
  "& .composition-view": {
    background: "#000",
    color: "#FFF",
    display: "none",
    position: "absolute",
    whiteSpace: "nowrap",
    zIndex: 1,
  },
  "& .composition-view.active": {
    display: "block",
  },
  "& .xterm-viewport": {
    backgroundColor: "#000",
    overflowY: "scroll",
    cursor: "default",
    position: "absolute",
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
  },
  "& .xterm-screen": {
    position: "relative"
  },
  "& .xterm-screen canvas": {
    position: "absolute",
    left: 0,
    top: 0,
  },
  "& .xterm-scroll-area": {
    visibility: "hidden"
  },
  "& .xterm-char-measure-element": {
    display: "inline-block",
    visibility: "hidden",
    position: "absolute",
    top: 0,
    left: "-9999em",
    lineHeight: " normal",
  },
  "& .xterm-accessibility": {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    zIndex: 10,
    color: "transparent",
    pointerEvents: "none",
  },
  "& .xterm-message": {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    zIndex: 10,
    color: "transparent",
    pointerEvents: "none",
  },
  "& .live-region": {
    position: "absolute",
    left: -"9999px",
    width: "1px",
    height: "1px",
    overflow: "hidden",
  },
  "& .xterm-dim": {
    opacity: 1
  },
  "& .xterm-underline-1": { textDecoration: "underline" },
  "& .xterm-underline-2": { textDecoration: "double underline" },
  "& .xterm-underline-3": { textDecoration: "wavy underline" },
  "& .xterm-underline-4": { textDecoration: "dotted underline" },
  "& .xterm-underline-5": { textDecoration: "dashed underline" },
  "& .xterm-overline": {
    textDecoration: "overline",
  },
  "& .xterm-overline.xterm-underline-1": { textDecoration: "overline underline" },
  "& .xterm-overline.xterm-underline-2": { textDecoration: "overline double underline" },
  "& .xterm-overline.xterm-underline-3": { textDecoration: "overline wavy underline" },
  "& .xterm-overline.xterm-underline-4": { textDecoration: "overline dotted underline" },
  "& .xterm-overline.xterm-underline-5": { textDecoration: "overline dashed underline" },
  "& .xterm-strikethrough": {
    textDecoration: "line-through",
  },
  "& .xterm-screen .xterm-decoration-container .xterm-decoration": {
    zIndex: 6,
    position: "absolute",
  },
  "& .xterm-screen .xterm-decoration-container .xterm-decoration.xterm-decoration-top-layer": {
    zIndex: 7,
  },
  "& .xterm-decoration-overview-ruler": {
    zIndex: 8,
    position: "absolute",
    top: 0,
    right: 0,
    pointerEvents: "none",
  },
  "& .xterm-decoration-top": {
    zIndex: 2,
    position: "relative",
  }
}

const Term = (props: any) => {
  const { termRef, term } = props
  const fitAddon = new FitAddon
  React.useEffect(() => {
    term.current.loadAddon(fitAddon)
    term.current.open(termRef.current)
    fitAddon.fit()
  }, [])
  return (
    <Box
      sx={sx}
      className={"xterm"}
      ref={termRef}
    />)
}

export const ReactTerm = (props: any) => {
  const [open, setOpen] = React.useState(false);
  const [play, setPlay] = React.useState(false);
  const interval = React.useRef(null)
  const term = React.useRef(new Terminal())
  const termRef = React.useRef()
  const dataProvider = useDataProvider()
  const record = useRecordContext();
  const translate = useTranslate()
  const [token] = useAccessToken()
  const timing = React.useRef<Array<Array<string>>>(null)
  const timingInc = React.useRef<Array<number>>(null)
  const log = React.useRef<ArrayBuffer>(null)
  const [totalDur, setTotalDur] = React.useState<number>(null)
  const offset = React.useRef<number>(0)
  const index = React.useRef<number>(0)
  const [value, setValue] = React.useState<number>(0);
  const logs = Object.keys(record.logs).length !== 0 ?
    Object.entries(record.logs).map(([key, value]) => ({ key, value }))
    : null
  const filteredTS = logs ? logs.filter((v: any) => v.value.type === "TYPESCRIPT") : null
  const filteredTM = logs ? logs.filter((v: any) => v.value.type === "TYPESCRIPT_TIMING") : null
  const keyTS = (
    !!filteredTS
    && filteredTS.length > 0
  ) ? filteredTS[0].key : null
  const keyTM = (
    !!filteredTM
    && filteredTM.length > 0
  ) ? filteredTM[0].key : null
  React.useEffect(() => {
    if (play) {
      interval.current = setInterval(() => {
        setValue(value => value + 0.1)
      }, 100)
    }
    else {
      clearInterval(interval.current)
    }
  }, [play])
  React.useEffect(() => {
    if (play) {
      if (value >= timingInc.current[index.current]) {
        advanceFrame(false)
      }
      if (value > totalDur) {
        setPlay(false)
      }
    }
  }, [value])
  const advanceFrame = (skip: boolean) => {
    if (timing.current[index.current]) {
      if (skip) {
        setValue(value => timingInc.current[index.current])
        setPlay(false)
      }
      const bytes = Number(timing.current[index.current][1])
      const buffer = log.current.slice(offset.current, offset.current + bytes)
      const ln = new Uint8Array(buffer)

      offset.current += bytes
      index.current += 1
      term.current.write(ln)
    }
  }
  const backFrame = () => {
    if (!!timingInc.current[index.current - 1]) {
      if (index.current === 1) {
        setValue(value => 0)
        term.current.reset()
        setPlay(false)
        offset.current = 0
        index.current = 0
      }
      else {
        setValue(value => timingInc.current[index.current - 1])
        handleChangeCommitted(null, timingInc.current[index.current - 1])
      }
    }
  }
  const reset = () => {
    setValue(0)
    setOpen(true);
    setPlay(false)
    term.current.reset()
    timing.current = null
    log.current = null
    setTotalDur(null)
    offset.current = 0
    index.current = 0
  }
  const handleOpen = () => {
    reset()
    dataProvider.gettm("history", { id: String(record.identifier), key: keyTM, token: token }).then((res: Response) => {
      return res.text()
    }).then((text: any) => {
      const array = String(text).split("\n")
      let total_dur = 0
      timingInc.current = array.map((str: string) => {
        const splitted = str.split(" ")
        total_dur += Number(splitted[0])
        return total_dur
      })
      timing.current = array.map((str: string) => {
        const splitted = str.split(" ")
        return splitted
      })
      setTotalDur(total_dur)
    })
    dataProvider.getlog("history", { id: String(record.identifier), key: keyTS, token: token }).then((res: Response) => {
      return res.arrayBuffer()
    }).then((blob: any) => {
      log.current = blob.slice(19, -18)
    })
  };
  const handleClose = () => {
    setOpen(false);
    setPlay(false)
  };
  const handleChange = (event: any, newValue: number | number[]) => {
    setValue(newValue as number);
  };
  const handleChangeCommitted = (event: any, newValue: number | number[]) => {
    term.current.reset()
    setPlay(false)
    offset.current = 0
    index.current = 0
    let dur = newValue as number
    let i = 0
    let len = 0
    if (totalDur <= dur) dur = totalDur
    while (Math.floor(dur * 100000) / 100000 > Number(timing.current[i][0])) {
      dur -= Number(timing.current[i][0])
      len += Number(timing.current[i][1])
      i++
    }
    const bytes = Number(len)
    const buffer = log.current.slice(0, bytes)
    const ln = new Uint8Array(buffer)
    offset.current = bytes
    index.current = i
    term.current.write(ln)
  };
  if (!(keyTS && keyTM)) return null
  return (<>
    <Button sx={{ height: 20, ml: 0.3 }} variant="contained" onClick={handleOpen} startIcon={<PlayArrowIcon />}>
      <Typography component="pre" variant="body2">
        {translate('guacamole.playSSHRecord')}
      </Typography>
    </Button>
    <Dialog
      fullScreen
      open={open}
      onClose={() => {
        handleClose()
      }}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ width: 1 }}>
            {translate('guacamole.playSSHRecordTitle')}
          </Typography>
          <RecordTextDownloadButton record={record} token={token} />
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Term term={term} termRef={termRef} />
      </DialogContent>
      <DialogActions sx={{ ml: 1, mr: 1 }}>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => setPlay(!play)}
        >
          {play ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => backFrame()}
        >
          <SkipPreviousIcon />
        </IconButton>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => advanceFrame(true)}
        >
          <SkipNextIcon />
        </IconButton>
        <Slider
          max={totalDur}
          aria-label="Seekbar"
          value={value}
          step={0.1}
          onChange={handleChange}
          onChangeCommitted={handleChangeCommitted}
          valueLabelDisplay="auto"
          valueLabelFormat={(v: number) => toHHMMSS(Math.ceil(v))}
        />
        <Typography component="pre" sx={{ pl: 2 }}>
          {toHHMMSS(Math.ceil(value))}/{toHHMMSS(Math.ceil(totalDur))}
        </Typography>
      </DialogActions>
    </Dialog>
  </>)
}