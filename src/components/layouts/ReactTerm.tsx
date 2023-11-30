import * as React from 'react'
import { useAccessToken } from '../../tokenProvider'
import { FitAddon } from 'xterm-addon-fit';
import {
  Menu,
  useDataProvider,
  useNotify,
  useTranslate,
  Confirm,
} from 'react-admin';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Slider,
  IconButton,
  Typography,
  AppBar,
  Toolbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toHHMMSS } from '../utils'
import { Terminal, ITerminalOptions, ITerminalAddon } from 'xterm'
const sx = {
  width: "100%",
  height: "100%",
  bgcolor: "#000000",
  "& .xterm": {
    cursor: "text",
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
  "& .xterm.enable-mouse-events": {
    cursor: "default"
  },
  "& .xterm-cursor-pointer": {
    cursor: "pointer"
  },
  "& .xterm.column-select.focus": {
    cursor: "crosshair",
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
export const ReactTerm = (props: any) => {
  const [open, setOpen] = React.useState(false);
  const term = React.useRef(new Terminal())
  const termRef = React.useRef()
  const dataProvider = useDataProvider()
  const [token] = useAccessToken()
  const timing = React.useRef<Array<Array<string>>>(null)
  const timingInc = React.useRef<Array<number>>(null)
  const log = React.useRef<ArrayBuffer>(null)
  const [totalDur, setTotalDur] = React.useState<number>(null)
  const offset = React.useRef<number>(0)
  const index = React.useRef<number>(0)
  const [value, setValue] = React.useState<number>(0);
  const incrementFrame = () => {
    if (timing.current[index.current]) {
      const bytes = Number(timing.current[index.current][1])
      const buffer = log.current.slice(offset.current, offset.current + bytes)
      const ln = new Uint8Array(buffer)
      setValue(value => value + Number(timing.current[index.current][0]))
      offset.current += bytes
      index.current += 1
      term.current.write(ln)
    }
  }
  const reset = () => {
    term.current.reset()
    timing.current = null
    log.current = null
    setTotalDur(null)
    offset.current = 0
    index.current = 0
  }
  const fitAddon = new FitAddon
  const handleOpen = () => {
    setValue(0)
    setOpen(true);
    reset()
    dataProvider.gettm("history", { token: token }).then((res: Response) => {
      return res.text()
    }).then((text: any) => {
      const array = String(text).split("\n")
      let total_dur = 0
      timing.current = array.map((str: string) => {
        const splitted = str.split(" ")
        total_dur += Number(splitted[0])
        return splitted
      })
      timingInc.current = array.map((str: string) => {
        const splitted = str.split(" ")
        total_dur += Number(splitted[0])
        return total_dur
      })
      setTotalDur(total_dur)
    })
    dataProvider.getlog("history", { token: token }).then((res: Response) => {
      return res.arrayBuffer()
    }).then((blob: any) => {
      log.current = blob.slice(19, -18)
    })
    setTimeout(() => {
      term.current.loadAddon(fitAddon)
      term.current.open(termRef.current)
      fitAddon.fit()
      console.log(term)
    }, 500)
    console.log(term)
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (event: any, newValue: number | number[]) => {
    setValue(newValue as number);
  };
  const handleChangeCommitted = (event: any, newValue: number | number[]) => {
    term.current.reset()
    offset.current = 0
    index.current = 0
    let dur = newValue as number
    let i = 0
    let len = 0
    if (totalDur <= dur) dur = totalDur
    while (dur > Number(timing.current[i][0])) {
      dur -= Number(timing.current[i][0])
      len += Number(timing.current[i][1])
      i++
    }
    const bytes = Number(len)
    const buffer = log.current.slice(0, bytes)
    const ln = new Uint8Array(buffer)
    offset.current = bytes
    console.log(offset.current)
    index.current = i
    term.current.write(ln)
  };
  return (<>
    <Button variant="outlined" onClick={handleOpen}>
      Open
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
          <Typography>
            Record
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Box
          sx={sx}
          className={"xterm"}
          ref={termRef}
        />
      </DialogContent>
      <DialogActions>
        <IconButton
          edge="start"
          color="inherit"
          onClick={incrementFrame}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        <Slider
          max={Math.ceil(totalDur)}
          aria-label="Seekbar"
          value={value}
          step={0.1}
          onChange={handleChange}
          onChangeCommitted={handleChangeCommitted}
          valueLabelDisplay="auto"
          valueLabelFormat={(v: number) => toHHMMSS(Math.floor(v))}
        />
        <Typography >
          {toHHMMSS(Math.ceil(totalDur))}
        </Typography>
      </DialogActions>
    </Dialog>
  </>)
}