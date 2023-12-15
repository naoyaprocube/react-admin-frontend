import * as nodePath from 'path-browserify';

export function download(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export function decodeUTF8(buffer: any) {
  const decoder = new TextDecoder();
  return decoder.decode(buffer);
}

export const humanFileSize = (bytes: any, si = false, dp = 1) => {
  const thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }
  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
  return bytes.toFixed(dp) + ' ' + units[u];
}

export const toHHMMSS = (sec: number) => {
  const conv = String(sec)
  var sec_num = parseInt(conv, 10); // don't forget the second param
  var hours: number | string = Math.floor(sec_num / 3600);
  var minutes: number | string = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds: number | string = sec_num - (hours * 3600) - (minutes * 60);

  if (hours < 10) { hours = "0" + String(hours); }
  if (minutes < 10) { minutes = "0" + String(minutes); }
  if (seconds < 10) { seconds = "0" + String(seconds); }
  return String(hours) + ':' + String(minutes) + ':' + String(seconds);
}

export const estimatedUploadTime = (bytes: number, limit: number = 1024 * 1024 * 1024 * 1024, speed: number = 32 * 1024 * 1024) => {
  let check = true
  if (bytes > limit) check = false
  const time = Math.floor(bytes / speed)
  const sec = time % 60
  const min = Math.floor(time / 60) % 60
  const hour = Math.floor(time / (60 * 60))
  let label = 'file.sec'
  let est = 0
  if (sec === 0 && min === 0 && hour === 0) {
    label = 'file.sec'
    est = 1
  }
  else if (min === 0 && hour === 0) {
    label = 'file.sec'
    est = sec
  }
  else if (min > 0 && hour === 0) {
    label = 'file.min'
    est = min
  }
  else if (hour > 0) {
    label = 'file.hour'
    est = hour
  }
  return { check, sec, min, hour, label, est }
}

export const convertPeriod = (period: {
  startTime: string,
  endTime: string,
  validFrom: string,
  validUntil: string,
}) => {
  const ret: Array<Array<number>> = []
  const validFrom = period.validFrom.replaceAll("/", "-")
  const validUntil = period.validUntil.replaceAll("/", "-")
  const GMT = "T00:00:00.000+09:00"
  let day = Date.parse(validFrom + GMT)
  const dayMS = 24 * 60 * 60 * 1000
  const startTimeMS = Date.parse(validFrom + "T" + period.startTime + ".000+09:00") - Date.parse(validFrom + GMT)
  const endTimeMS = Date.parse(validFrom + "T" + period.endTime + ".000+09:00") - Date.parse(validFrom + GMT)
  while (day < Date.parse(validUntil + GMT) + dayMS) {
    ret.push([day + startTimeMS, day + endTimeMS])
    day += dayMS
  }
  return ret
}

export const stringToColor = (str: string) => {
  const colorArray = [
    "#ef9a9a", //"red"
    "#f48fb1", //"pink"
    "#ce93d8", //"purple"
    "#b39ddb", //"deepPurple"
    "#9fa8da", //"indigo"
    "#90caf9", //"blue"
    "#81d4fa", //"lightBlue"
    "#80deea", //"cyan"
    "#80cbc4", //"teal"
    "#a5d6a7", //"green"
    "#c5e1a5", //"lightGreen"
    "#e6ee9c", //"lime"
    "#fff59d", //"yellow"
    "#ffe082", //"amber"
    "#ffcc80", //"orange"
    "#ffab91", //"deepOrange"
  ]
  const number = Array.from(str).map(ch => ch.charCodeAt(0)).reduce((a, b) => a + b)
  const index = number % 16
  return colorArray[index]
};

export const statusToColor = (work: any) => {
  if (work.isNow) return "#80deea" //cyan
  if (work.isBefore) return "#c5e1a5" //lightGreen
  if (work.isAfter) return "#ef9a9a" //red
  else return "#fff59d" //yellow
};

export const statusStringToColor = (status: string) => {
  if (status === "now") return "#80deea" //cyan
  if (status === "before") return "#c5e1a5" //lightGreen
  if (status === "after") return "#ef9a9a" //red
  else return "#fff59d" //yellow
};

export const getClientIdentifier = (id: number, type: string, workId: string) => {
  const base64urlEncode = function base64urlEncode(value: any) {
    return btoa(value).replace(/[+/=]/g,
      (str) => ({
        '+': '-',
        '/': '_',
        '=': ''
      })[str]
    );
  };
  return base64urlEncode([
    id,
    type,
    "postgresql",
    workId,
  ].join('\0'))
};

export const resolvePath = (path: string) => {
  const UNIX_SEP_REGEX = /\//g;
  const WIN_SEP_REGEX = /\\/g;
  // Unix separators normalize nicer on both unix and win platforms
  const resolvedPath = path.replace(WIN_SEP_REGEX, '/');

  // Join cwd with new path
  const joinedPath = nodePath.normalize(resolvedPath)

  // Create FTP client path using unix separator
  const clientPath = joinedPath.replace(WIN_SEP_REGEX, '/');

  return clientPath
}