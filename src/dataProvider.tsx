import { fetchUtils, HttpError } from 'react-admin';
import { stringify } from 'query-string';
const apiUrl = '/api';
// const httpClient = fetchUtils.fetchJson;
const httpClient = (url: string, options: any = {}) => {
  if (!options.headers) {
    options.headers = new Headers({
      Accept: 'application/json'
    });
  }
  options.credentials = 'include';
  return fetchUtils.fetchJson(url, options);
}
const dataProvider = {
  getList: (resource: any, params: any) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      page: JSON.stringify(page),
      perpage: JSON.stringify(perPage),
      filter: JSON.stringify(params.filter),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url).then(({ headers, json }) => ({
      data: json.map((resource: any) => ({ ...resource, id: resource._id })),
      total: Number(headers.get('Content-Range'))
    }));
  },

  getOne: (resource: any, params: any) => {
    return httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
      data: { ...json, id: json._id }, //!
    }))
  },

  getMany: (resource: any, params: any) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    return httpClient(url).then(({ json }) => ({
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

    return httpClient(url).then(({ headers, json }) => ({
      data: json.map((resource: any) => ({ ...resource, id: resource._id })),
      // total: parseInt(headers.get('content-range').split('/').pop(), 10),
    }));
  },

  update: (resource: any, params: any) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: { ...json.data, id: json.data.filename } })),

  updateMany: (resource: any, params: any) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },

  create: (resource: any, params: any) =>
    httpClient(`${apiUrl}/${resource}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    }).then((response) => ({
      data: { ...params.data, id: response.json._id, }
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
    }).then(({ json }) => ({
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
    }).then(({ json }) => json);
  },
};

const FileProvider = {
  ...dataProvider,
  create: (resource: any, params: any) => {
    if (resource === 'settings') {
      // fallback to the default implementation
      return dataProvider.create(resource, params);
    }
    function encodeUTF8(str: any) {
      const encoder = new TextEncoder();
      return encoder.encode(str);
    }
    const filename = encodeUTF8(params.data.file.title).toString()
    let formData = new FormData();
    formData.append('file', params.data.file.rawFile,params.data.file.title);
    return httpClient(`${apiUrl}/${resource}`, {
      method: 'POST',
      headers: new Headers({ 'content-filename': filename }),
      body: formData,
    }).then((response) => {
      if (response.status < 200 || response.status >= 300) {
        return { data: { res: response, id: "error" } }
      }
      else if (response.status === 202) {
        return { data: { res: response, id: "cancel" } }
      }
      else return { data: { ...params.data, id: params.data.file.title } }
    })
      .catch((error) => {
        return {
          data: {
            res: {
              status: error.status,
              statusText: error.message
            },
            id: "error"
          }
        }
      });
  },

  download: (resource: any, params: any) => {
    function download(blob: any, filename: any) {
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
    function decodeUTF8(buffer: any) {
      const decoder = new TextDecoder();
      return decoder.decode(buffer);
    }
    return fetch(`${apiUrl}/${resource}/${params.id}/download`, { credentials: 'include' }).then((response) => {
      if (response.status === 200) {
        const UTF8encodedArray = new Uint8Array(response.headers.get('Content-Filename').split(',').map(x => Number(x)))
        const filename = decodeUTF8(UTF8encodedArray);
        response.blob().then(blob => download(blob, filename))
      }
      return response
    })
  },

  check: (resource: any, params: any) => {
    return fetch(`${apiUrl}/${resource}/check`, {
      method: "POST",
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "filename": params.title })
    })
  },

  recreate: (resource: any, params: any) => {
    let formData = new FormData();
    formData.append('file', params.data.file.rawFile);
    return httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'POST',
      headers: new Headers({ 'content-disposition': params.id }),
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
    })
  },

  getdirs: () => {
    return httpClient(`${apiUrl}/getdirs`, {
      method: 'GET'
    })
  },

  getdir: (params:any) => {
    return httpClient(`${apiUrl}/getdir/${params.id}`, {
      method: 'GET'
    })
  },

  getenv: (params:any) => {
    return httpClient(`${apiUrl}/getenv`, {
      method: 'GET'
    })
  },

  rmdir: (params: any) => {
    return fetch(`${apiUrl}/rmdir/${params.id}`, {
      method: 'DELETE'
    })
  },
}
export default FileProvider;
