import { Terminal } from 'xterm'
import { WebLinksAddon } from 'xterm-addon-web-links';
import { FitAddon } from 'xterm-addon-fit';

export const createReplayTerminal = () => {
  // vscode-snazzy https://github.com/Tyriar/vscode-snazzy
  // copied from xterm.js website
  var baseTheme = {
    foreground: '#eff0eb',
    background: '#282a36',
    selection: '#97979b33',
    black: '#282a36',
    brightBlack: '#686868',
    red: '#ff5c57',
    brightRed: '#ff5c57',
    green: '#5af78e',
    brightGreen: '#5af78e',
    yellow: '#f3f99d',
    brightYellow: '#f3f99d',
    blue: '#57c7ff',
    brightBlue: '#57c7ff',
    magenta: '#ff6ac1',
    brightMagenta: '#ff6ac1',
    cyan: '#9aedfe',
    brightCyan: '#9aedfe',
    white: '#f1f1f0',
    brightWhite: '#eff0eb'
  };

  const term = new Terminal({
    fontFamily: `'Fira Code', ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,'Liberation Mono',monospace`,
    fontSize: 12,
    theme: baseTheme,
    convertEol: true,
    cursorBlink: true,
  });

  term.open(document.getElementById('terminal_view'));
  term.resize(120, 36);

  const weblinksAddon = new WebLinksAddon();
  term.loadAddon(weblinksAddon);

  // fit the xterm viewpoint to parent element
  const fitAddon = new FitAddon();
  term.loadAddon(fitAddon);
  fitAddon.fit();

  return term;
}

export const Init = () => {
  let term = createReplayTerminal();
  var str = [
    ' ┌────────────────────────────────────────────────────────────────────────────┐\n',
    ' │                 \u001b[32;1mhttps://github.com/syssecfsu/witty\x1b[0m <- click it!            │\n',
    ' └────────────────────────────────────────────────────────────────────────────┘\n',
    ''
  ].join('');

  term.writeln(str);

  // adjust the progress bar size to that of terminal
  var view = document.querySelector("#terminal")
  var pbar = document.querySelector("#replay-control")

  return term
}