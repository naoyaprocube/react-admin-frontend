import { fetchUtils, HttpError } from 'react-admin';
import { stringify } from 'query-string';
import { convertPeriod } from './components/utils'
import { dummyWorks, dummyAnnounces } from './dummy/dummyObjects'
const apiUrl = '/api';
const guacUrl = '/guacamole'
// const httpClient = fetchUtils.fetchJson;
const httpClient = (url: string, options: any = {}) => {
  if (!options.headers) {
    options.headers = new Headers({
      Accept: 'application/json',
      "Guacamole-Token": url.startsWith(guacUrl) ? localStorage.getItem('token') : null
    });
  }
  options.credentials = 'include';
  return fetchUtils.fetchJson(url, options)
}

export const dataProvider = {
  getList: (resource: any, params: any) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const { includeDir, dirId } = params.meta
    const query = {
      includeDir: includeDir
    };
    const url = `${apiUrl}/${resource}/${dirId}?${stringify(query)}`;
    return httpClient(url).then(({ headers, json }: any) => {
      let list = json
      if (page && perPage) list = list.slice((page - 1) * perPage, page * perPage)
      if (field) list = list.sort((a: any, b: any) => {
        if (includeDir && field === "filename") {
          a[field] = a.filename ? a.filename : a.dirname
          b[field] = b.filename ? b.filename : b.dirname
        }
        if (a[field] < b[field]) {
          if (order === "ASC") return 1
          return -1;
        }
        if (a[field] > b[field]) {
          if (order === "ASC") return -1
          return 1;
        }
        return 0;
      })
      return { headers, list }
    }).then(({ headers, list }: any) => ({
      data: list.map((file: any) => ({ ...file, id: file._id })),
      total: Number(headers.get('Content-Range')),
    }));
  },

  getOne: (resource: any, params: any) => {
    return httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }: any) => ({
      data: { ...json, id: json._id }, //!
    }))
  },

  getMany: (resource: any, params: any) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    return httpClient(url).then(({ json }: any) => ({
      data: json.map((resource: any) => ({ ...resource, id: resource._id })),
    }));
  },

  getManyReference: (resource: any, params: any) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url).then(({ headers, json }: any) => ({
      data: json.map((resource: any) => ({ ...resource, id: resource._id })),
      // total: parseInt(headers.get('content-range').split('/').pop(), 10),
    }));
  },

  update: (resource: any, params: any) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    }).then(({ json }: any) => ({ data: { ...json.data, id: json.data._id } })),

  updateMany: (resource: any, params: any) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    }).then(({ json }: any) => ({ data: json }));
  },

  create: (resource: any, params: any) =>
    httpClient(`${apiUrl}/${resource}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    }).then(({ json }: any) => ({
      data: { ...params.data, id: json._id, }
    })),

  delete: (resource: any, params: any) => {
    function encodeUTF8(str: any) {
      const encoder = new TextEncoder();
      return encoder.encode(str);
    }
    const filename = encodeUTF8(params.id).toString()

    return httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'DELETE',
      headers: new Headers({ 'content-filename': filename }),
      body: JSON.stringify(params.id),
    }).then(({ json }: any) => ({
      ...json,
      id: json._id,
    }))
  },

  deleteMany: (resource: any, params: any) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: 'DELETE',
      body: JSON.stringify(params.ids),
    }).then(({ json }: any) => json);
  },
};

export const FileProvider = {
  ...dataProvider,

  download: (resource: any, params: any) => {
    return fetch(new Request(`${apiUrl}/${resource}/${params.id}/download`, {
      method: "GET",
      credentials: 'include',
      headers: new Headers({
        "Guacamole-Token": localStorage.getItem('token')
      })
    }))
  },

  check: (resource: any, params: any) => {
    return httpClient(`${apiUrl}/${resource}/check`, {
      method: "POST",
      body: JSON.stringify({ "filename": params.title })
    })
  },

  upload: (resource: any, params: any) => {
    let formData = new FormData();
    formData.append('file', params.data.file.rawFile);
    function encodeUTF8(str: any) {
      const encoder = new TextEncoder();
      return encoder.encode(str);
    }
    const filename = encodeUTF8(params.data.file.title).toString()
    return httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'POST',
      headers: new Headers({
        'content-length': params.data.file.size,
        'content-filename': filename
      }),
      body: formData,
    })
  },

  cancel: (resource: any, params: any) => {
    return httpClient(`${apiUrl}/${resource}/cancel`, {
      method: 'POST',
      body: JSON.stringify(params)
    })
  },

  mkdir: (resource: any, params: any) => {
    return httpClient(`${apiUrl}/${resource}/mkdir`, {
      method: 'POST',
      body: JSON.stringify(params)
    }).catch((error) => {
      return error
    });
  },

  rndir: (resource: any, params: any) => {
    return httpClient(`${apiUrl}/${resource}/rndir`, {
      method: 'PUT',
      body: JSON.stringify(params)
    });
  },

  getdirs: (resource: any) => {
    return httpClient(`${apiUrl}/${resource}/getdirs`, {
      method: 'GET'
    })
  },

  getdir: (resource: any, params: any) => {
    return httpClient(`${apiUrl}/${resource}/${params.id}/getdir`, {
      method: 'GET'
    })
  },

  getenv: (resource: any, params: any) => {
    return httpClient(`${apiUrl}/getenv`, {
      method: 'GET'
    })
  },

  rmdir: (resource: any, params: any) => {
    return httpClient(`${apiUrl}/${resource}/${params.id}/rmdir`, {
      method: 'DELETE',
      body: JSON.stringify(params.id),
    })
  },
}

export const WorkProvider = {
  ...dataProvider,

  getList: async (resource: any, params: any) => {
    const { page, perPage } = params.pagination;
    const { q, workStatus } = params.filter

    const url = `${guacUrl}/api/session/data/postgresql/works`;
    // const json = await httpClient(url).then(({ json }) => json)
    const json = dummyWorks
    let work = Object.entries(json).map((array) => array[1])

    const now = new Date
    const theme = resource.split("/")[1];
    work.map((w: any) => {
      w.isNow = w.periods.filter((period: any) =>
        convertPeriod(period).filter((time: Array<number>) =>
          (now.getTime() > time[0] && now.getTime() < time[1])
        ).length > 0
      ).length > 0
      w.isOut = w.periods.filter((period: any) =>
        convertPeriod(period).filter((time: Array<number>) =>
          (now.getTime() > time[0] && now.getTime() < time[1])
        ).length === 0
      ).length === w.periods.length
      w.isBefore = w.periods.filter((period: any) =>
        convertPeriod(period).filter((time: Array<number>) =>
          now.getTime() > time[0]
        ).length === 0
      ).length === w.periods.length
      w.isAfter = w.periods.filter((period: any) =>
        convertPeriod(period).filter((time: Array<number>) =>
          now.getTime() < time[1]
        ).length === 0
      ).length === w.periods.length
    })
    if (theme === "worker") work = work.filter((v: any) => v.isWorker)
    if (theme === "admin") work = work.filter((v: any) => v.isAdmin)
    if (q) work = work.filter((v: any) => v.name.includes(String(q)) || v.idmIdentifier.includes(String(q)))
    if (workStatus) {
      if (workStatus === "now") work = work.filter((v: any) => v.isNow)
      else if (workStatus === "out") work = work.filter((v: any) => v.isOut && !v.isBefore && !v.isAfter)
      else if (workStatus === "before") work = work.filter((v: any) => v.isBefore)
      else if (workStatus === "after") work = work.filter((v: any) => v.isAfter)
    }
    const length = work.length
    if (page && perPage) work = work.slice((page - 1) * perPage, page * perPage)
    return {
      data: work.map((resource: any) => ({ ...resource, id: resource.idmIdentifier })),
      total: length,
      pageInfo: { hasNextPage: (length - (page * perPage)) > 0 }
    }
  },

  getListAll: async (resource: any, params: any) => {
    const url = `${guacUrl}/api/session/data/postgresql/works`;
    // const json = await httpClient(url).then(({ json }) => json)
    const json = dummyWorks
    let work = Object.entries(json).map((array) => array[1])
    work.map((w: any) => {
      w.idmIdentifier = String(w.idmIdentifier.slice(0, 5)).toUpperCase()
    })
    return {
      data: work.map((resource: any) => ({ ...resource, id: resource.idmIdentifier })),
      total: work.length
    }
  },
}

export const ConnectProvider = {
  ...dataProvider,

  getList: async (resource: any, params: any) => {
    const { page, perPage } = params.pagination
    const { field, order } = params.sort
    const { q, protocol, parent } = params.filter
    const workId = resource.split("/")[1]
    const workUrl = `${guacUrl}/api/session/data/postgresql/works/${workId}`
    // const json = await httpClient(workUrl).then(({ json }) => json)
    const json = dummyWorks
    let work:any = Object
      .entries(json)
      .map((array) => array[1])
      .filter((v: any) => {
        return v.idmIdentifier.slice(0, 5) === workId
      })[0]
    let connections = work.connections
    if (q) connections = connections.filter((v: any) => v.name.includes(String(q)))
    if (protocol) connections = connections.filter((v: any) => v.protocol === protocol)
    if (field) connections = connections.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        if (order === "ASC") return 1
        return -1;
      }
      if (a[field] > b[field]) {
        if (order === "ASC") return -1
        return 1;
      }
      return 0;
    })
    if (parent) connections = connections.filter((v: any) =>
      v.parentIdentifier === parent
    )
    const length = connections.length
    if (page && perPage) connections = connections.slice((page - 1) * perPage, page * perPage)
    return {
      data: connections.map((resource: any) => ({ ...resource, id: resource.identifier })),
      total: length
    }
  },

  getActives: async (resource: any, params: any) => {
    const url = `${guacUrl}/api/session/data/postgresql/activeConnections`;
    const json = await httpClient(url).then(({ json }) => json)
    return Object.keys(json).map(function (key) { return json[key] })
  },

  removeActive: (resource: any, params: any) => {
    const { id } = params
    const operation = [{
      "op": "remove",
      "path": "/" + id
    }]
    return httpClient(`${guacUrl}/api/session/data/postgresql/activeConnections`, {
      method: 'PATCH',
      body: JSON.stringify(operation)
    })
  },

  getParentList: async (resource: any, params: any) => {
    const workId = resource.split("/")[1];
    const workUrl = `${guacUrl}/api/session/data/postgresql/works/${workId}`
    // const json = await httpClient(workUrl).then(({ json }) => json)
    const json = dummyWorks
    let work:any = Object
      .entries(json)
      .map((array) => array[1])
      .filter((v: any) => {
        return v.idmIdentifier.slice(0, 5) === workId
      })[0]
    let connections = work.connections
    const parents: Array<any> = []
    connections.map((connection: any) => {
      if (parents.indexOf(connection.parentIdentifier) === -1) parents.push(connection.parentIdentifier)
    })
    return parents
  },
}

export const HistoryProvider = {
  ...dataProvider,

  getList: async (resource: any, params: any) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort
    const { q, duration, startTime } = params.filter
    const workId = resource.split("/")[1];
    const url = `${guacUrl}/api/session/data/postgresql/history/connections`;
    const workUrl = `${guacUrl}/guacamole/api/session/data/postgresql/works/${workId}`
    // const json = await httpClient(workUrl).then(({ json }) => json)
    const json = dummyWorks
    let work:any = Object
      .entries(json)
      .map((array) => array[1])
      .filter((v: any) => {
        return v.idmIdentifier.slice(0, 5) === workId
      })[0]
    const historyJson = await httpClient(url).then(({ json }) => json)
    let history = historyJson
    if (workId !== "all") history = history.filter((v: any) => {
      const ids = work.connections.map((connection: any) => Number(connection.identifier))
      return ids.indexOf(Number(v.connectionIdentifier)) !== -1
    })
    if (q) history = history.filter((v: any) => (
      v.connectionName.includes(String(q))
      || String(v.connectionIdentifier).includes(String(q))
      || v.username.includes(String(q))
    ))
    if (duration) history = history.filter((v: any) => v.endDate - v.startDate >= duration)
    if (startTime) history = history.filter((v: any) => v.startDate >= new Date().getTime() - startTime)
    if (field) history = history.sort((a: any, b: any) => {
      if (field === "duration") {
        const unit = order === "ASC" ? 1 : -1
        if (b.endDate === null) return unit
        return unit * ((a.endDate - a.startDate) - (b.endDate - b.startDate))
      }
      if (a[field] < b[field]) {
        if (order === "ASC") return 1
        return -1;
      }
      if (a[field] > b[field]) {
        if (order === "ASC") return -1
        return 1;
      }
      return 0;
    })
    const length = history.length
    if (page && perPage) history = history.slice((page - 1) * perPage, page * perPage)
    return {
      data: history.map((resource: any) => ({ ...resource, id: resource.identifier })),
      total: length
    }
  },

  download: (resource: any, params: any) => {
    return fetch(new Request(`${guacUrl}/api/session/data/postgresql/history/connections/${params.id}/logs/${params.key}`, {
      method: "GET",
      credentials: 'include',
      headers: new Headers({
        "Guacamole-Token": localStorage.getItem('token')
      })
    }))
  },

}

export const AnnounceProvider = {
  ...dataProvider,

  getList: async (resource: any, params: any) => {
    const { page, perPage } = params.pagination;
    const url = `${guacUrl}/api/session/data/postgresql/notifications`;
    // const json = await httpClient(url).then(({ json }) => json)
    const json = dummyAnnounces
    let announce = Object
      .entries(json)
      .map((array) => array[1])
    const now = new Date
    function compareDate(a: any, b: any) {
      return b.startDate - a.startDate;
    }
    announce = announce.filter((v: any) => (now.getTime() > v.startDate && now.getTime() < v.endDate))
    announce = announce.sort(compareDate)
    const length = announce.length
    if (page && perPage) announce = announce.slice((page - 1) * perPage, page * perPage)
    return {
      data: announce.map((resource: any) => ({ ...resource, id: resource.id })),
      total: length
    }
  },

}

export const SFTPProvider = {
  ...dataProvider,
  getList: async (resource: any, params: any) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const { path, connectionId, token } = params.meta
    const query = {
      path: path,
      id: connectionId,
      token: token,
    };
    const url = `${apiUrl}/sftp/readdir?${stringify(query)}`;
    return httpClient(url).then(({ json }) => {
      const total = json.length
      let list = json
      list = list.map((file: any) => {
        return {
          ...file,
          attrs: {
            ...file.attrs,
            mmtime: file.attrs.mtime * 1000,
            amtime: file.attrs.mtime * 1000,
          }
        }
      })
      if (path !== "/") list = [{
        filename: "..",
        longname: "drw-rw-rw-    1 root     root",
        attrs: {
          "mode": 33188,
          "uid": 0,
          "gid": 0,
          "size": 0,
          "atime": 0,
          "mtime": 0
        }
      }].concat(list)
      if (page && perPage) list = list.slice((page - 1) * perPage, page * perPage)
      if (field) list = list.sort((a: any, b: any) => {
        if (a[field] < b[field]) {
          if (order === "ASC") return 1
          return -1;
        }
        if (a[field] > b[field]) {
          if (order === "ASC") return -1
          return 1;
        }
        return 0;
      })
      return { list, total }
    }).then(({ list, total }) => ({
      data: list.map((file: any) => ({
        ...file,
        id: path === "/" ? "/" + file.filename : path + "/" + file.filename
      })),
      total: total
    }))
  },

  gethome: async (resource: any, params: any) => {
    const query = {
      id: params.connectionId,
      token: params.token,
    };
    const url = `${apiUrl}/sftp/gethome?${stringify(query)}`;
    return httpClient(url)
  },
  readdir: async (resource: any, params: any) => {
    const query = {
      path: params.path,
      id: params.connectionId,
      token: params.token,
    };
    const url = `${apiUrl}/sftp/readdir?${stringify(query)}`;
    return httpClient(url).then(({ json }) => json)
  },
}
