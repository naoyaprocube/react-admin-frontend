import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';
const apiUrl = 'http://localhost:3000/fileserver/api';
const httpClient = fetchUtils.fetchJson;

const dataProvider = {
  getList: (resource:any, params:any) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify(params.filter),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url).then(({ headers, json }) => ({
      data: json.map((resource:any) => ({ ...resource, id: resource._id })),
      // total: 10
      total: Number(headers.get('Content-Range').split('/').pop())
    }));
  },
  getOne: (resource:any, params:any) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
      data: { ...json, id: json._id }, //!
    })),

  getMany: (resource:any, params:any) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    return httpClient(url).then(({ json }) => ({
      data: json.map((resource:any) => ({ ...resource, id: resource._id })),
    }));
  },

  getManyReference: (resource:any, params:any) => {
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
      data: json.map((resource:any) => ({ ...resource, id: resource._id })),
      // total: parseInt(headers.get('content-range').split('/').pop(), 10),
    }));
  },

  update: (resource:any, params:any) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ ...json, id: json._id })),

  updateMany: (resource:any, params:any) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },

  create: (resource:any, params:any) =>
    httpClient(`${apiUrl}/${resource}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: { ...params.data, id: json._id },
    })).then((x) => {
      console.log(x);
      return x
    }),

  delete: (resource:any, params:any) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'DELETE',
      body: JSON.stringify(params.id),
    }).then(({ json }) => ({
      ...json,
      id: json._id,
    })),

  deleteMany: (resource:any, params:any) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: 'DELETE',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },
};

const myDataProvider = {
  ...dataProvider,
  create: (resource:any, params:any) => {
    if (resource !== 'files') {
      // fallback to the default implementation
      return dataProvider.create(resource, params);
    }
    console.log("resource:"+resource)
    console.log("params:"+JSON.stringify(params))
    let formData = new FormData();
    formData.append('file', params.data.file.rawFile);
    // console.log(formData)
    return httpClient(`${apiUrl}/${resource}`, {
      method: 'POST',
      body: formData,
    }).then(({ json }) => ({
      data: { ...params.data, id: params.data.file.title },
    })).then((x) => {
      console.log(x);
      return x
    });
  },

  getOne: (resource:any, params:any) => {
    if (resource !== 'files') {
      // fallback to the default implementation
      return dataProvider.getOne(resource, params);
    };
    console.log(params)
    function download(blob:any, filename:any) {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      // the filename you want
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
    fetch(`${apiUrl}/${resource}/${params.id}`)
      .then(function (response) {
        // The response is a Response instance.
        // You parse the data into a useable format using `.json()`
        console.log(response)
        const filename = response.headers.get('Content-Disposition').split('=')[1];
        response.blob().then(blob => download(blob, filename))
      })

    // return httpClient(`${apiUrl}/${resource}/${params.id}`)
    //   .then((data) => {
    //     console.log(data);
    //     return data
    //   })
    //   .then(({headers,body}) => {
    //     const filename = headers.get('Content-Disposition').split('=')[1]
    //     // const filename = json.data.filename
    //     console.log("filename:" + filename)
    //     // const blob = new Blob(body);
    //     console.log("body:" + body)
    //     // download(blob,filename);
    //     return {
    //       data: {}
    //     }
    //   })
  },

}
/**
* Convert a `File` object returned by the upload input into a base 64 string.
* That's not the most optimized way to store images in production, but it's
* enough to illustrate the idea of data provider decoration.
*/
// const convertFileToBase64 = file =>
//   new Promise((resolve, reject) => {
//       console.log("rawfile:" + file.rawFile)
//       console.log("file?:" + (file.rawFile instanceof File))
//       console.log("blob?:" + (file.rawFile instanceof Blob))
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = reject;

//       reader.readAsDataURL(file.rawFile);
//       return reader.result
//   });

export default myDataProvider;
