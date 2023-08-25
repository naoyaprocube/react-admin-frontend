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

  download: (resource: any, params: any) => {
    return fetch(`${apiUrl}/${resource}/${params.id}/download`, { credentials: 'include' })
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

  getdirs: () => {
    return httpClient(`${apiUrl}/getdirs`, {
      method: 'GET'
    })
  },

  getdir: (params: any) => {
    return httpClient(`${apiUrl}/getdir/${params.id}`, {
      method: 'GET'
    })
  },

  getenv: (params: any) => {
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
