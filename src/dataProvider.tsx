import { fetchUtils, HttpError } from 'react-admin';
import { stringify } from 'query-string';
import { convertPeriod } from './components/utils'
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
    const query = {
      sort: JSON.stringify([field, order]),
      page: JSON.stringify(page),
      perpage: JSON.stringify(perPage),
      filter: JSON.stringify(params.filter),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    return httpClient(url).then(({ headers, json }: any) => ({
      data: json.map((resource: any) => ({ ...resource, id: resource._id })),
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
    return httpClient(`${apiUrl}/${resource}/getenv`, {
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

export const ConnectProvider = {
  ...dataProvider,

  getList: async (resource: any, params: any) => {
    const { page, perPage } = params.pagination
    const { field, order } = params.sort
    const { q, protocol, parent } = params.filter
    const workId = resource.substr(12);
    const url = `${guacUrl}/api/session/data/postgresql/connections`;
    const workUrl = `${guacUrl}/guacamole/api/session/data/postgresql/works/${workId}`
    // const work = await httpClient(workUrl).then(({ json }) => json)
    const work = dummyWorks.filter((v: any) => {
      return v.idmIdentifier.slice(0, 5) === workId
    })[0]
    return httpClient(url).then(({ headers, json }: any) => {
      // let connections = Object.keys(json).map(function (key) { return json[key] })
      let connections = dummyConnections
      connections = connections.filter((v: any) => {
        return work.connections.indexOf(v.identifier) !== -1
      })
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
    })
  },

  getActives: (resource: any, params: any) => {
    return httpClient(`${guacUrl}/api/session/data/postgresql/activeConnections`)
      .then(({ json }) => Object.keys(json).map(function (key) { return json[key] }))
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

  getParentList: (resource: any, params: any) => {
    const workId = resource.substr(12);
    const url = `${guacUrl}/api/session/data/postgresql/connections`;
    // const work = await httpClient(workUrl).then(({ json }) => json)
    const work = dummyWorks.filter((v: any) => {
      return v.idmIdentifier.slice(0, 5) === workId
    })[0]
    return httpClient(url).then(({ json }) => {
      // let connections = Object.keys(json).map(function (key) { return json[key] })
      let connections = dummyConnections
      connections = connections.filter((v: any) => {
        return work.connections.indexOf(v.identifier) !== -1
      })
      const parents: Array<any> = []
      connections.map((connection: any) => {
        if (parents.indexOf(connection.parentIdentifier) === -1) parents.push(connection.parentIdentifier)
      })
      return parents.sort()
    })
  },
}

export const HistoryProvider = {
  ...dataProvider,

  getList: (resource: any, params: any) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort
    const { q, duration } = params.filter
    const url = `${guacUrl}/api/session/data/postgresql/history/connections`;
    return httpClient(url).then(({ headers, json }: any) => {
      let history = json
      if (q) history = history.filter((v: any) => v.username.includes(String(q)))
      if (duration) history = history.filter((v: any) => v.endDate - v.startDate >= duration)
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
    })
  },

}

export const WorkProvider = {
  ...dataProvider,

  getList: (resource: any, params: any) => {
    const { page, perPage } = params.pagination;
    const { q, workStatus } = params.filter
    const url = `${guacUrl}/api/session/data/postgresql/history/connections`;
    return httpClient(url).then(({ json }: any) => {
      let work: any = json
      work = dummyWorks
      work.map((w: any) => {
        w.idmIdentifier = w.idmIdentifier.slice(0, 5)
      })
      if (q) work = work.filter((v: any) => v.name.includes(String(q)))
      if (workStatus) {
        const now = new Date
        if (workStatus === "now") work = work.filter((v: any) =>
          v.periods.filter((period: any) =>
            convertPeriod(period).filter((time: Array<number>) =>
              (now.getTime() > time[0] && now.getTime() < time[1])
            ).length > 0
          ).length > 0
        )
        else if (workStatus === "out") work = work.filter((v: any) =>
          v.periods.filter((period: any) =>
            convertPeriod(period).filter((time: Array<number>) =>
              (now.getTime() > time[0] && now.getTime() < time[1])
            ).length === 0
          ).length === v.periods.length
        )
        else if (workStatus === "before") work = work.filter((v: any) =>
          v.periods.filter((period: any) =>
            convertPeriod(period).filter((time: Array<number>) =>
              now.getTime() > time[0]
            ).length === 0
          ).length === v.periods.length
        )
        else if (workStatus === "after") work = work.filter((v: any) =>
          v.periods.filter((period: any) =>
            convertPeriod(period).filter((time: Array<number>) =>
              now.getTime() < time[1]
            ).length === 0
          ).length === v.periods.length
        )
      }
      const length = work.length
      if (page && perPage) work = work.slice((page - 1) * perPage, page * perPage)
      return {
        data: work.map((resource: any) => ({ ...resource, id: resource.idmIdentifier })),
        total: length
      }
    })
  },

  getListAll: (resource: any, params: any) => {
    const url = `${guacUrl}/api/session/data/postgresql/history/connections`;
    return httpClient(url).then(({ json }: any) => {
      let work: any = json
      work = dummyWorks
      work.map((w: any) => {
        w.idmIdentifier = w.idmIdentifier.slice(0, 5)
      })
      return {
        data: work.map((resource: any) => ({ ...resource, id: resource.idmIdentifier })),
        total: work.length
      }
    })
  },
}

export const AnnounceProvider = {
  ...dataProvider,

  getList: (resource: any, params: any) => {
    const { page, perPage } = params.pagination;
    const url = `${guacUrl}/api/session/data/postgresql/history/connections`;
    return httpClient(url).then(({ headers, json }: any) => {
      let announce = dummyAnnounces
      const now = new Date
      function compareDate(a: any, b: any) {
        return a.startDate - b.startDate;
      }
      announce = announce.filter((v: any) => (now.getTime() > v.startDate && now.getTime() < v.endDate))
      announce = announce.sort(compareDate)
      const length = announce.length
      if (page && perPage) announce = announce.slice((page - 1) * perPage, page * perPage)
      return {
        data: announce.map((resource: any) => ({ ...resource, id: resource.id })),
        total: length
      }
    })
  },

}

const dummyWorks = [
  {
    "identifier": 1,
    "name": "eu",
    "idmIdentifier": "IRUREEST",
    "periods": [
      {
        "validFrom": "2024/02/04",
        "validUntil": "2024/08/20",
        "startTime": "05:00:00",
        "endTime": "22:00:00"
      },
      {
        "validFrom": "2004/11/13",
        "validUntil": "2018/07/15",
        "startTime": "07:00:00",
        "endTime": "17:00:00"
      },
      {
        "validFrom": "2009/09/02",
        "validUntil": "2019/09/20",
        "startTime": "03:00:00",
        "endTime": "22:00:00"
      }
    ],
    "connections": [
      516,
      390,
      395,
      411,
      181,
      481,
      196,
      150,
      208,
      797,
      189,
      662,
      125,
      912,
      689,
      482,
      842,
      944,
      941,
      116,
      304,
      440,
      502,
      703,
      952,
      371,
      560,
      787,
      520,
      421,
      420,
      890,
      490,
      239,
      516,
      237,
      132,
      183,
      160,
      780,
      806,
      285,
      855,
      33,
      517,
      117,
      485,
      945,
      890,
      472,
      509,
      613,
      305,
      581,
      766,
      478,
      655,
      681,
      555,
      987,
      718,
      592,
      127,
      313,
      921,
      785,
      226,
      476,
      844,
      119,
      689,
      692,
      212,
      715,
      300,
      443,
      368,
      247,
      839,
      388,
      496,
      243,
      42,
      207,
      815,
      411,
      962,
      345,
      123,
      526,
      440,
      393,
      286,
      371,
      941,
      197,
      348,
      170,
      817
    ],
    "users": [
      4,
      20,
      12
    ]
  },
  {
    "identifier": 2,
    "name": "統合管理ネットワーク VLAN 2345 追加作業",
    "idmIdentifier": "OCCAECATULLAMCO",
    "periods": [
      {
        "validFrom": "2005/05/22",
        "validUntil": "2016/09/04",
        "startTime": "05:00:00",
        "endTime": "12:00:00"
      },
      {
        "validFrom": "2012/11/04",
        "validUntil": "2022/04/11",
        "startTime": "02:00:00",
        "endTime": "22:00:00"
      }
    ],
    "connections": [
      357,
      973
    ],
    "users": [
      17
    ]
  },
  {
    "identifier": 3,
    "name": "nisi",
    "idmIdentifier": "EXCEPTEURLOREM",
    "periods": [
      {
        "validFrom": "2011/10/18",
        "validUntil": "2020/03/28",
        "startTime": "03:00:00",
        "endTime": "20:00:00"
      },
      {
        "validFrom": "2013/10/09",
        "validUntil": "2023/03/16",
        "startTime": "09:00:00",
        "endTime": "15:00:00"
      }
    ],
    "connections": [
      139,
      334,
      36,
      758,
      341,
      119,
      284,
      613,
      57,
      741,
      404,
      286
    ],
    "users": [
      11,
      10,
      9,
      15,
      10
    ]
  },
  {
    "identifier": 4,
    "name": "reprehenderit",
    "idmIdentifier": "LABOREEST",
    "periods": [
      {
        "validFrom": "2001/12/14",
        "validUntil": "2015/03/30",
        "startTime": "05:00:00",
        "endTime": "18:00:00"
      }
    ],
    "connections": [
      903,
      714,
      485,
      33,
      132,
      975,
      495,
      979,
      179,
      769,
      848,
      555,
      567,
      544,
      320,
      29,
      233,
      478,
      603,
      482,
      312,
      54,
      728,
      955,
      79,
      549,
      995,
      412,
      282,
      793,
      774,
      750,
      668,
      944,
      196,
      740,
      956,
      303,
      201,
      82,
      232,
      805,
      379,
      195,
      353,
      973,
      382,
      958,
      932,
      895,
      628,
      940,
      41,
      280,
      801,
      877,
      281,
      748,
      992,
      280,
      643,
      587,
      969,
      209,
      407,
      385,
      895,
      562,
      28,
      817,
      378,
      512,
      608,
      743,
      787,
      864,
      233,
      694,
      251,
      172,
      308,
      472,
      167,
      738
    ],
    "users": [
      2,
      10,
      9,
      10
    ]
  },
  {
    "identifier": 5,
    "name": "non",
    "idmIdentifier": "MAGNACONSEQUAT",
    "periods": [
      {
        "validFrom": "2001/02/03",
        "validUntil": "2020/09/25",
        "startTime": "02:00:00",
        "endTime": "17:00:00"
      },
      {
        "validFrom": "2002/08/10",
        "validUntil": "2018/05/27",
        "startTime": "05:00:00",
        "endTime": "10:00:00"
      },
      {
        "validFrom": "2001/12/09",
        "validUntil": "2016/10/18",
        "startTime": "08:00:00",
        "endTime": "11:00:00"
      },
      {
        "validFrom": "2013/01/03",
        "validUntil": "2018/09/02",
        "startTime": "03:00:00",
        "endTime": "20:00:00"
      }
    ],
    "connections": [
      691,
      423,
      313,
      63,
      548,
      988,
      708,
      673,
      450,
      128,
      854,
      363,
      395,
      779,
      178,
      181,
      563,
      517,
      515,
      586,
      994,
      342,
      889,
      502,
      943,
      296,
      538,
      693,
      791,
      489,
      451,
      540,
      142,
      724,
      625,
      618,
      173,
      479,
      832,
      359,
      552,
      187,
      775,
      744,
      494,
      390,
      995,
      146,
      400,
      557,
      113,
      584,
      599,
      605,
      31,
      355,
      168,
      177,
      402,
      712,
      764,
      52,
      926,
      473,
      910,
      364,
      851
    ],
    "users": [
      4,
      2
    ]
  },
  {
    "identifier": 6,
    "name": "minim",
    "idmIdentifier": "CULPAELIT",
    "periods": [
      {
        "validFrom": "2004/07/19",
        "validUntil": "2015/06/27",
        "startTime": "02:00:00",
        "endTime": "17:00:00"
      },
      {
        "validFrom": "2014/01/02",
        "validUntil": "2016/12/30",
        "startTime": "07:00:00",
        "endTime": "17:00:00"
      },
      {
        "validFrom": "2014/10/06",
        "validUntil": "2023/07/15",
        "startTime": "06:00:00",
        "endTime": "18:00:00"
      },
      {
        "validFrom": "2014/02/21",
        "validUntil": "2020/04/17",
        "startTime": "04:00:00",
        "endTime": "16:00:00"
      },
      {
        "validFrom": "2006/08/18",
        "validUntil": "2023/02/19",
        "startTime": "09:00:00",
        "endTime": "12:00:00"
      }
    ],
    "connections": [
      873,
      506,
      490,
      792,
      360,
      924,
      256,
      68,
      310,
      631,
      474,
      940,
      399,
      79,
      354,
      669,
      555,
      460,
      384,
      476,
      102,
      486,
      783,
      830,
      608,
      497,
      32,
      289,
      630,
      431,
      481,
      252,
      262,
      190,
      580,
      25,
      948,
      787,
      762,
      304,
      936,
      96,
      709,
      238,
      30,
      968,
      214,
      12,
      118,
      498,
      179,
      826,
      554,
      502,
      165,
      163,
      964,
      945,
      29,
      251,
      271,
      606,
      215,
      381,
      291,
      885,
      935,
      706,
      993,
      886,
      146,
      751,
      409,
      689,
      450,
      49,
      512,
      132,
      158,
      603,
      944,
      687,
      792,
      337
    ],
    "users": [
      18
    ]
  },
  {
    "identifier": 7,
    "name": "laborum",
    "idmIdentifier": "INCIDIDUNTTEMPOR",
    "periods": [
      {
        "validFrom": "2007/06/25",
        "validUntil": "2018/07/02",
        "startTime": "04:00:00",
        "endTime": "12:00:00"
      },
      {
        "validFrom": "2002/04/17",
        "validUntil": "2016/02/28",
        "startTime": "07:00:00",
        "endTime": "12:00:00"
      },
      {
        "validFrom": "2010/08/09",
        "validUntil": "2015/04/07",
        "startTime": "06:00:00",
        "endTime": "19:00:00"
      },
      {
        "validFrom": "2010/09/14",
        "validUntil": "2018/08/19",
        "startTime": "03:00:00",
        "endTime": "20:00:00"
      }
    ],
    "connections": [
      337,
      208,
      654,
      969,
      300,
      120,
      579,
      77,
      844,
      697,
      326,
      943,
      566,
      883,
      525,
      49,
      402,
      482,
      796,
      98,
      829,
      948,
      568,
      602,
      589,
      715,
      323,
      393,
      584,
      19,
      543,
      427,
      490,
      94,
      526,
      366,
      721,
      573,
      156,
      23,
      427,
      838,
      495,
      378,
      40,
      457,
      531,
      218,
      647,
      125,
      171,
      158,
      619,
      858,
      937,
      473,
      20,
      513,
      147,
      925,
      198,
      761,
      96,
      965,
      639
    ],
    "users": [
      13,
      18,
      10
    ]
  },
  {
    "identifier": 9,
    "name": "aliqua",
    "idmIdentifier": "PARIATURADIPISICING",
    "periods": [
      {
        "validFrom": "2006/03/13",
        "validUntil": "2016/12/04",
        "startTime": "01:00:00",
        "endTime": "17:00:00"
      },
      {
        "validFrom": "2007/07/10",
        "validUntil": "2017/12/20",
        "startTime": "06:00:00",
        "endTime": "10:00:00"
      },
      {
        "validFrom": "2012/02/26",
        "validUntil": "2018/11/22",
        "startTime": "04:00:00",
        "endTime": "22:00:00"
      },
      {
        "validFrom": "2005/05/13",
        "validUntil": "2022/08/12",
        "startTime": "07:00:00",
        "endTime": "15:00:00"
      },
      {
        "validFrom": "2008/05/02",
        "validUntil": "2021/05/07",
        "startTime": "09:00:00",
        "endTime": "21:00:00"
      }
    ],
    "connections": [
      699,
      73,
      807,
      8,
      38,
      22,
      276,
      332,
      716,
      125,
      938,
      737,
      480,
      437,
      999,
      713,
      581,
      656,
      45,
      448,
      457,
      419,
      7,
      211,
      275,
      46,
      248,
      987,
      887,
      347,
      548,
      857,
      855,
      864,
      719,
      593,
      639,
      840,
      811,
      558,
      498,
      722,
      301,
      413,
      665,
      402,
      985,
      679,
      451,
      89,
      629,
      39,
      18,
      584,
      543,
      882,
      439,
      68,
      276,
      240,
      172,
      269,
      746,
      487,
      911,
      538,
      764,
      882,
      880
    ],
    "users": [
      18,
      7,
      9,
      13,
      5
    ]
  },
  {
    "identifier": 11,
    "name": "Lorem",
    "idmIdentifier": "COMMODOELIT",
    "periods": [
      {
        "validFrom": "2010/07/20",
        "validUntil": "2018/11/21",
        "startTime": "09:00:00",
        "endTime": "22:00:00"
      },
      {
        "validFrom": "2009/06/10",
        "validUntil": "2019/09/15",
        "startTime": "03:00:00",
        "endTime": "15:00:00"
      },
      {
        "validFrom": "2005/10/04",
        "validUntil": "2018/08/24",
        "startTime": "08:00:00",
        "endTime": "18:00:00"
      },
      {
        "validFrom": "2011/07/19",
        "validUntil": "2015/02/19",
        "startTime": "07:00:00",
        "endTime": "17:00:00"
      }
    ],
    "connections": [
      428,
      63,
      779,
      741,
      790,
      407,
      380,
      706,
      283,
      413,
      516,
      337,
      897,
      974,
      436,
      417,
      670,
      235,
      766
    ],
    "users": [
      8,
      4,
      4,
      6
    ]
  },
  {
    "identifier": 12,
    "name": "occaecat",
    "idmIdentifier": "ENIMALIQUA",
    "periods": [
      {
        "validFrom": "2003/03/30",
        "validUntil": "2016/05/16",
        "startTime": "09:00:00",
        "endTime": "10:00:00"
      }
    ],
    "connections": [
      110,
      941,
      392,
      468,
      218,
      654,
      429,
      118
    ],
    "users": [
      13
    ]
  },
  {
    "identifier": 13,
    "name": "et",
    "idmIdentifier": "LOREMNISI",
    "periods": [
      {
        "validFrom": "2008/11/09",
        "validUntil": "2022/01/31",
        "startTime": "01:00:00",
        "endTime": "18:00:00"
      },
      {
        "validFrom": "2009/06/22",
        "validUntil": "2023/08/14",
        "startTime": "06:00:00",
        "endTime": "11:00:00"
      },
      {
        "validFrom": "2014/06/20",
        "validUntil": "2022/03/21",
        "startTime": "04:00:00",
        "endTime": "22:00:00"
      }
    ],
    "connections": [
      28,
      301,
      668,
      615,
      682,
      524,
      964,
      939,
      187,
      681,
      729,
      537,
      944,
      581,
      62,
      176,
      1,
      902,
      735,
      13,
      711,
      544,
      413,
      51,
      65,
      896,
      628,
      188,
      892,
      697,
      432,
      771,
      930,
      399,
      323,
      929,
      959,
      879,
      126,
      458,
      941,
      225,
      326,
      856,
      390,
      277,
      383,
      107,
      762,
      519,
      872,
      371,
      744,
      454,
      392,
      352,
      901,
      808,
      240,
      525,
      699,
      57,
      223,
      148,
      674,
      740,
      348,
      441,
      685,
      703,
      215,
      845,
      450,
      564,
      742,
      412,
      659,
      370,
      824,
      827,
      50,
      141,
      263,
      416,
      379,
      528,
      145
    ],
    "users": [
      19,
      10,
      2,
      5,
      17
    ]
  },
  {
    "identifier": 14,
    "name": "dolor",
    "idmIdentifier": "ULLAMCOAD",
    "periods": [
      {
        "validFrom": "2003/09/11",
        "validUntil": "2016/06/22",
        "startTime": "05:00:00",
        "endTime": "21:00:00"
      }
    ],
    "connections": [
      439,
      684,
      147,
      995,
      834,
      758,
      205,
      708,
      86,
      238,
      574,
      566,
      886,
      833,
      285,
      50,
      1000,
      459,
      409,
      92,
      628,
      758,
      942,
      219,
      645,
      980,
      710,
      678,
      429,
      432,
      957,
      924,
      428,
      958,
      587,
      525,
      629,
      686,
      539,
      86,
      353,
      980,
      89,
      152,
      338,
      63,
      204,
      950,
      466,
      978,
      878,
      11,
      879,
      878,
      665,
      348,
      787,
      696,
      50,
      991,
      703,
      166,
      402,
      567,
      260,
      481,
      876,
      709,
      950,
      566,
      612,
      684,
      158,
      417,
      789,
      282,
      359,
      277,
      722,
      384,
      506,
      403,
      289
    ],
    "users": [
      10,
      1,
      13
    ]
  }
]
const dummyWorks2 = [
  {
    name: '統合管理ネットワーク VLAN 2345 追加作業', // 作業名
    identifier: 1, // Guacamole の管理ID
    idmIdentifier: 'XU78S', // 作業ID
    attributes: {}, // 無視していいです
    periods: [
      {
        startTime: "09:00:00", // 作業開始時間（フォーマット変わる可能性あり）
        endTime: "18:00:00", //作業終了時間（フォーマット変わる可能性あり）
        validFrom: "2023/09/27", // 作業期間開始日（フォーマット変わる可能性あり）
        validUntil: "2023/10/31" // 作業期間終了日（フォーマット変わる可能性あり）
      },
      {
        startTime: "09:00:00", // 作業開始時間（フォーマット変わる可能性あり）
        endTime: "18:00:00", //作業終了時間（フォーマット変わる可能性あり）
        validFrom: "2024/01/10", // 作業期間開始日（フォーマット変わる可能性あり）
        validUntil: "2024/02/28" // 作業期間終了日（フォーマット変わる可能性あり）
      }
    ],
    connections: [1, 3], // 接続先IDのリスト
    users: [2, 5] // 作業者のリスト
  },
  {
    name: "WorkA",
    identifier: 2,
    idmIdentifier: 'IP931',
    attributes: {}, // 無視していいです
    periods: [
      {
        startTime: "09:00:00", // 作業開始時間（フォーマット変わる可能性あり）
        endTime: "18:00:00", //作業終了時間（フォーマット変わる可能性あり）
        validFrom: "2023/09/27", // 作業期間開始日（フォーマット変わる可能性あり）
        validUntil: "2023/10/31" // 作業期間終了日（フォーマット変わる可能性あり）
      },
      {
        startTime: "09:00:00", // 作業開始時間（フォーマット変わる可能性あり）
        endTime: "18:00:00", //作業終了時間（フォーマット変わる可能性あり）
        validFrom: "2024/01/10", // 作業期間開始日（フォーマット変わる可能性あり）
        validUntil: "2024/02/28" // 作業期間終了日（フォーマット変わる可能性あり）
      }
    ],
    connections: [1, 3], // 接続先IDのリスト
    users: [2, 5] // 作業者のリスト
  },
  {
    name: "WorkB",
    identifier: 3,
    idmIdentifier: 'P1KMN',
    attributes: {}, // 無視していいです
    periods: [
      {
        startTime: "09:00:00", // 作業開始時間（フォーマット変わる可能性あり）
        endTime: "23:00:00", //作業終了時間（フォーマット変わる可能性あり）
        validFrom: "2023/09/27", // 作業期間開始日（フォーマット変わる可能性あり）
        validUntil: "2023/10/31" // 作業期間終了日（フォーマット変わる可能性あり）
      },
      {
        startTime: "09:00:00", // 作業開始時間（フォーマット変わる可能性あり）
        endTime: "23:00:00", //作業終了時間（フォーマット変わる可能性あり）
        validFrom: "2024/01/10", // 作業期間開始日（フォーマット変わる可能性あり）
        validUntil: "2024/02/28" // 作業期間終了日（フォーマット変わる可能性あり）
      }
    ],
    connections: [1, 3], // 接続先IDのリスト
    users: [2, 5] // 作業者のリスト
  },
  {
    name: "W0RKC",
    identifier: 4,
    idmIdentifier: 'WorkC',
    attributes: {}, // 無視していいです
    periods: [
      {
        startTime: "09:00:00", // 作業開始時間（フォーマット変わる可能性あり）
        endTime: "10:00:00", //作業終了時間（フォーマット変わる可能性あり）
        validFrom: "2023/09/27", // 作業期間開始日（フォーマット変わる可能性あり）
        validUntil: "2023/10/31" // 作業期間終了日（フォーマット変わる可能性あり）
      },
    ],
    connections: [1, 3], // 接続先IDのリスト
    users: [2, 5] // 作業者のリスト
  },
]
const dummyConnections = [
  {
    "activeConnections": 0,
    "identifier": 1,
    "lastActive": 2023487831263,
    "name": "culpa dolor",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 2,
    "lastActive": 1714238864436,
    "name": "ex tempor",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 3,
    "lastActive": 2083380459318,
    "name": "anim amet",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 4,
    "lastActive": 1753228916305,
    "name": "duis ad",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 5,
    "lastActive": 1725927973067,
    "name": "id eiusmod",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 6,
    "lastActive": 1805711401579,
    "name": "fugiat ex",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 7,
    "lastActive": 2036249989086,
    "name": "velit proident",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 8,
    "lastActive": 2017640267415,
    "name": "officia fugiat",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 9,
    "lastActive": 1880904845764,
    "name": "eiusmod velit",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 10,
    "lastActive": 1871859988982,
    "name": "velit nulla",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 11,
    "lastActive": 1760111042171,
    "name": "pariatur mollit",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 12,
    "lastActive": 1707340235352,
    "name": "mollit laboris",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 13,
    "lastActive": 2087607635164,
    "name": "velit sunt",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 14,
    "lastActive": 1853862539457,
    "name": "dolor aliquip",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 15,
    "lastActive": 2048352073646,
    "name": "fugiat quis",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 16,
    "lastActive": 1991019905718,
    "name": "duis tempor",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 17,
    "lastActive": 1762179053270,
    "name": "ea elit",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 18,
    "lastActive": 1852420590066,
    "name": "do consectetur",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 19,
    "lastActive": 1838760187402,
    "name": "sit deserunt",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 20,
    "lastActive": 1954700067859,
    "name": "cupidatat incididunt",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 21,
    "lastActive": 1826674131453,
    "name": "labore occaecat",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 22,
    "lastActive": 1825666096624,
    "name": "voluptate labore",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 23,
    "lastActive": 1993002414416,
    "name": "quis eu",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 24,
    "lastActive": 1750407007140,
    "name": "anim ipsum",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 25,
    "lastActive": 1898844854777,
    "name": "aliqua exercitation",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 26,
    "lastActive": 1775847630963,
    "name": "dolor mollit",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 27,
    "lastActive": 2036927069528,
    "name": "irure pariatur",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 28,
    "lastActive": 2029917800826,
    "name": "officia tempor",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 29,
    "lastActive": 1838399968163,
    "name": "do minim",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 30,
    "lastActive": 1863568277304,
    "name": "ex incididunt",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 31,
    "lastActive": 1879705939818,
    "name": "occaecat eiusmod",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 32,
    "lastActive": 2020963486018,
    "name": "deserunt reprehenderit",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 33,
    "lastActive": 1972985669051,
    "name": "pariatur proident",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 34,
    "lastActive": 1814354963720,
    "name": "minim sint",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 35,
    "lastActive": 1897999971355,
    "name": "cillum culpa",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 36,
    "lastActive": 1925896588292,
    "name": "nulla cillum",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 37,
    "lastActive": 1753137728261,
    "name": "exercitation magna",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 38,
    "lastActive": 1987687748109,
    "name": "magna cillum",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 39,
    "lastActive": 1986715792666,
    "name": "incididunt aute",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 40,
    "lastActive": 1815411625544,
    "name": "sit labore",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 41,
    "lastActive": 1706772071735,
    "name": "deserunt fugiat",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 42,
    "lastActive": 1924641392761,
    "name": "culpa non",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 43,
    "lastActive": 1977467306606,
    "name": "nostrud sunt",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 44,
    "lastActive": 1759683659606,
    "name": "id do",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 45,
    "lastActive": 1974151135917,
    "name": "tempor ut",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 46,
    "lastActive": 1742008853619,
    "name": "Lorem officia",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 47,
    "lastActive": 1907244191626,
    "name": "fugiat amet",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 48,
    "lastActive": 2067934313721,
    "name": "esse deserunt",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 49,
    "lastActive": 2092623787773,
    "name": "nisi labore",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 50,
    "lastActive": 1824536140961,
    "name": "minim ullamco",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 51,
    "lastActive": 2092784258173,
    "name": "exercitation velit",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 52,
    "lastActive": 1900520726114,
    "name": "fugiat sit",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 53,
    "lastActive": 1979663160212,
    "name": "magna eu",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 54,
    "lastActive": 2001094986872,
    "name": "eiusmod elit",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 55,
    "lastActive": 1804976752892,
    "name": "nulla proident",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 56,
    "lastActive": 1720053016860,
    "name": "nisi officia",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 57,
    "lastActive": 1866074385366,
    "name": "esse voluptate",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 58,
    "lastActive": 1896939516663,
    "name": "eu ullamco",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 59,
    "lastActive": 1885835854049,
    "name": "excepteur irure",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 60,
    "lastActive": 2020360866331,
    "name": "do ex",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 61,
    "lastActive": 1785175322370,
    "name": "sit duis",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 62,
    "lastActive": 1754257995768,
    "name": "nostrud cupidatat",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 63,
    "lastActive": 1860625036116,
    "name": "duis veniam",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 64,
    "lastActive": 1712095720959,
    "name": "quis duis",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 65,
    "lastActive": 1870651467751,
    "name": "nisi commodo",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 66,
    "lastActive": 1710748073892,
    "name": "amet id",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 67,
    "lastActive": 1807601093818,
    "name": "incididunt anim",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 68,
    "lastActive": 1993718260677,
    "name": "labore exercitation",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 69,
    "lastActive": 1941351682254,
    "name": "esse sunt",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 70,
    "lastActive": 2048826805258,
    "name": "aute et",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 71,
    "lastActive": 2031670043950,
    "name": "sunt dolor",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 72,
    "lastActive": 1985968800009,
    "name": "ad labore",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 73,
    "lastActive": 1779221505915,
    "name": "sit adipisicing",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 74,
    "lastActive": 2046484400473,
    "name": "veniam Lorem",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 75,
    "lastActive": 1755702810829,
    "name": "mollit consectetur",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 76,
    "lastActive": 2011458920523,
    "name": "voluptate aute",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 77,
    "lastActive": 1988747774503,
    "name": "tempor in",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 78,
    "lastActive": 1821269241431,
    "name": "culpa reprehenderit",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 79,
    "lastActive": 1823800758426,
    "name": "nisi amet",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 80,
    "lastActive": 1887350770381,
    "name": "et sunt",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 81,
    "lastActive": 1801390478655,
    "name": "laborum amet",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 82,
    "lastActive": 1708100122094,
    "name": "officia nostrud",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 83,
    "lastActive": 1819719604587,
    "name": "est adipisicing",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 84,
    "lastActive": 1862374531835,
    "name": "nulla mollit",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 85,
    "lastActive": 1872555607168,
    "name": "reprehenderit do",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 86,
    "lastActive": 1820148800953,
    "name": "eiusmod ea",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 87,
    "lastActive": 1884068814848,
    "name": "commodo ad",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 88,
    "lastActive": 1701849847918,
    "name": "cillum non",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 89,
    "lastActive": 1936821198095,
    "name": "laboris consectetur",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 90,
    "lastActive": 2082602428752,
    "name": "amet ea",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 91,
    "lastActive": 1733585038012,
    "name": "ipsum dolore",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 92,
    "lastActive": 1974097102517,
    "name": "esse est",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 93,
    "lastActive": 1970476947013,
    "name": "Lorem ullamco",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 94,
    "lastActive": 1990498130302,
    "name": "culpa minim",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 95,
    "lastActive": 2070408785096,
    "name": "aliquip non",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 96,
    "lastActive": 1936202919929,
    "name": "ex labore",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 97,
    "lastActive": 1922905509507,
    "name": "minim ad",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 98,
    "lastActive": 1786795599987,
    "name": "veniam magna",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 99,
    "lastActive": 1763191728992,
    "name": "mollit deserunt",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 100,
    "lastActive": 2006271550314,
    "name": "esse commodo",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 101,
    "lastActive": 2057790668648,
    "name": "est velit",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 102,
    "lastActive": 1695922129970,
    "name": "fugiat esse",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 103,
    "lastActive": 2010115541843,
    "name": "velit commodo",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 104,
    "lastActive": 1952281120990,
    "name": "occaecat occaecat",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 105,
    "lastActive": 2077918426055,
    "name": "elit nostrud",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 106,
    "lastActive": 1897988752128,
    "name": "culpa irure",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 107,
    "lastActive": 1837425873728,
    "name": "non ipsum",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 108,
    "lastActive": 2067091116863,
    "name": "cupidatat culpa",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 109,
    "lastActive": 1776128117160,
    "name": "adipisicing aliquip",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 110,
    "lastActive": 2091650634116,
    "name": "in enim",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 111,
    "lastActive": 1757792394288,
    "name": "elit anim",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 112,
    "lastActive": 2079687998706,
    "name": "ipsum proident",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 113,
    "lastActive": 1869532832674,
    "name": "eiusmod commodo",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 114,
    "lastActive": 1773190194462,
    "name": "veniam ipsum",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 115,
    "lastActive": 1700872765172,
    "name": "exercitation laboris",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 116,
    "lastActive": 2073101984632,
    "name": "consectetur ut",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 117,
    "lastActive": 1963742392921,
    "name": "occaecat elit",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 118,
    "lastActive": 1994642250534,
    "name": "velit ad",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 119,
    "lastActive": 1854572015751,
    "name": "culpa dolor",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 120,
    "lastActive": 1714374139246,
    "name": "velit cillum",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 121,
    "lastActive": 1971495233649,
    "name": "deserunt Lorem",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 122,
    "lastActive": 2009233370721,
    "name": "duis dolor",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 123,
    "lastActive": 1985347037849,
    "name": "nostrud ea",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 124,
    "lastActive": 1978439629952,
    "name": "minim excepteur",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 125,
    "lastActive": 2077983755907,
    "name": "ullamco elit",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 126,
    "lastActive": 1773050226416,
    "name": "magna labore",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 127,
    "lastActive": 1909940687760,
    "name": "eu ullamco",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 128,
    "lastActive": 1712674684655,
    "name": "adipisicing aute",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 129,
    "lastActive": 1901992816797,
    "name": "proident consectetur",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 130,
    "lastActive": 1877873483643,
    "name": "aute irure",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 131,
    "lastActive": 1775553274266,
    "name": "dolore sint",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 132,
    "lastActive": 2002673769606,
    "name": "esse veniam",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 133,
    "lastActive": 2088800587142,
    "name": "dolore voluptate",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 134,
    "lastActive": 1989948093824,
    "name": "qui dolor",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 135,
    "lastActive": 1744800955291,
    "name": "nulla ex",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 136,
    "lastActive": 1721067569304,
    "name": "consectetur aute",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 137,
    "lastActive": 2000674490863,
    "name": "eiusmod ex",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 138,
    "lastActive": 1858803219557,
    "name": "dolor esse",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 139,
    "lastActive": 2028083699916,
    "name": "minim proident",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 140,
    "lastActive": 1722205566542,
    "name": "cupidatat dolore",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 141,
    "lastActive": 1967281586325,
    "name": "labore pariatur",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 142,
    "lastActive": 1859350369257,
    "name": "laborum sint",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 143,
    "lastActive": 1776648600829,
    "name": "sit id",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 144,
    "lastActive": 1948555160736,
    "name": "enim aute",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 145,
    "lastActive": 1890843596263,
    "name": "do commodo",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 146,
    "lastActive": 1958934194310,
    "name": "non amet",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 147,
    "lastActive": 1858976550243,
    "name": "veniam voluptate",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 148,
    "lastActive": 2006284399601,
    "name": "do irure",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 149,
    "lastActive": 1936982739376,
    "name": "occaecat proident",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 150,
    "lastActive": 1716188113804,
    "name": "aute commodo",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 151,
    "lastActive": 1920435931164,
    "name": "duis Lorem",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 152,
    "lastActive": 1712414222206,
    "name": "voluptate excepteur",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 153,
    "lastActive": 1822266575296,
    "name": "occaecat exercitation",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 154,
    "lastActive": 2049920077025,
    "name": "incididunt cupidatat",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 155,
    "lastActive": 2015420482803,
    "name": "minim labore",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 156,
    "lastActive": 1738862976651,
    "name": "cillum non",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 157,
    "lastActive": 2020460780033,
    "name": "cillum do",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 158,
    "lastActive": 1758265036376,
    "name": "exercitation non",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 159,
    "lastActive": 1907720122554,
    "name": "deserunt consectetur",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 160,
    "lastActive": 1844106388278,
    "name": "aliqua cillum",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 161,
    "lastActive": 1793850809002,
    "name": "dolore pariatur",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 162,
    "lastActive": 1769831134685,
    "name": "ex ea",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 163,
    "lastActive": 1959979089973,
    "name": "amet est",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 164,
    "lastActive": 1760489630353,
    "name": "aliqua commodo",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 165,
    "lastActive": 2007752697660,
    "name": "incididunt fugiat",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 166,
    "lastActive": 1997744102730,
    "name": "officia velit",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 167,
    "lastActive": 1955006355935,
    "name": "quis ex",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 168,
    "lastActive": 1864800461124,
    "name": "anim labore",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 169,
    "lastActive": 2086463616955,
    "name": "dolor dolore",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 170,
    "lastActive": 2035920484275,
    "name": "ullamco culpa",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 171,
    "lastActive": 1795311282014,
    "name": "elit occaecat",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 172,
    "lastActive": 1997551177197,
    "name": "voluptate ullamco",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 173,
    "lastActive": 1748811560864,
    "name": "nisi ex",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 174,
    "lastActive": 1744298348208,
    "name": "eiusmod qui",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 175,
    "lastActive": 1726828332783,
    "name": "id ea",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 176,
    "lastActive": 1881345143976,
    "name": "ullamco aliqua",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 177,
    "lastActive": 1836709501056,
    "name": "pariatur laboris",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 178,
    "lastActive": 1875384116113,
    "name": "aliquip commodo",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 179,
    "lastActive": 1794062413804,
    "name": "commodo sit",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 180,
    "lastActive": 1981588853035,
    "name": "proident adipisicing",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 181,
    "lastActive": 1799364974222,
    "name": "nisi ea",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 182,
    "lastActive": 1896283869026,
    "name": "excepteur mollit",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 183,
    "lastActive": 2032737259963,
    "name": "id eiusmod",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 184,
    "lastActive": 1730223750754,
    "name": "exercitation sit",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 185,
    "lastActive": 2035941775761,
    "name": "aute irure",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 186,
    "lastActive": 1756554415073,
    "name": "sit nulla",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 187,
    "lastActive": 1721724524567,
    "name": "veniam ullamco",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 188,
    "lastActive": 1854336385492,
    "name": "ut ea",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 189,
    "lastActive": 1971950446307,
    "name": "quis do",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 190,
    "lastActive": 1916859317941,
    "name": "do et",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 191,
    "lastActive": 2079115840151,
    "name": "est non",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 192,
    "lastActive": 1750498334787,
    "name": "voluptate sint",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 193,
    "lastActive": 1917727927045,
    "name": "pariatur minim",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 194,
    "lastActive": 1738545746234,
    "name": "ex deserunt",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 195,
    "lastActive": 1776356860001,
    "name": "culpa ad",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 196,
    "lastActive": 1885963957214,
    "name": "anim deserunt",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 197,
    "lastActive": 1752940618279,
    "name": "Lorem labore",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 198,
    "lastActive": 2085512202845,
    "name": "irure adipisicing",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 199,
    "lastActive": 1775999804393,
    "name": "nulla deserunt",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 200,
    "lastActive": 1767641955001,
    "name": "mollit voluptate",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 201,
    "lastActive": 1997902845854,
    "name": "sunt irure",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 202,
    "lastActive": 1797474278517,
    "name": "pariatur reprehenderit",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 203,
    "lastActive": 1755596786141,
    "name": "esse reprehenderit",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 204,
    "lastActive": 1925549528349,
    "name": "nisi deserunt",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 205,
    "lastActive": 1929925787189,
    "name": "enim elit",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 206,
    "lastActive": 2036638586466,
    "name": "cillum culpa",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 207,
    "lastActive": 2077931772712,
    "name": "magna ipsum",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 208,
    "lastActive": 1824629767077,
    "name": "ullamco magna",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 209,
    "lastActive": 1796563029221,
    "name": "reprehenderit veniam",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 210,
    "lastActive": 2084436559432,
    "name": "aliquip deserunt",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 211,
    "lastActive": 2038752636284,
    "name": "veniam eiusmod",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 212,
    "lastActive": 1726639790722,
    "name": "sunt anim",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 213,
    "lastActive": 2074989532243,
    "name": "nulla laboris",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 214,
    "lastActive": 2079162890531,
    "name": "elit et",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 215,
    "lastActive": 1889980277245,
    "name": "duis magna",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 216,
    "lastActive": 1901535022769,
    "name": "elit adipisicing",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 217,
    "lastActive": 1890509999699,
    "name": "eiusmod nostrud",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 218,
    "lastActive": 1986717014023,
    "name": "velit fugiat",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 219,
    "lastActive": 1703283393724,
    "name": "enim culpa",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 220,
    "lastActive": 1881413159786,
    "name": "laborum labore",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 221,
    "lastActive": 1791316968063,
    "name": "irure non",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 222,
    "lastActive": 1927913928932,
    "name": "cillum velit",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 223,
    "lastActive": 1795823156555,
    "name": "id irure",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 224,
    "lastActive": 2081661353061,
    "name": "eu ullamco",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 225,
    "lastActive": 1716889920131,
    "name": "minim laborum",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 226,
    "lastActive": 1985464356057,
    "name": "elit reprehenderit",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 227,
    "lastActive": 1943502914482,
    "name": "labore velit",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 228,
    "lastActive": 2017190404083,
    "name": "tempor veniam",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 229,
    "lastActive": 1728472962324,
    "name": "mollit cillum",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 230,
    "lastActive": 1866811093513,
    "name": "ut qui",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 231,
    "lastActive": 2032763602184,
    "name": "eiusmod do",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 232,
    "lastActive": 2048467083098,
    "name": "cupidatat dolor",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 233,
    "lastActive": 1970031085716,
    "name": "velit ut",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 234,
    "lastActive": 1806824113590,
    "name": "officia sunt",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 235,
    "lastActive": 1928525578017,
    "name": "pariatur sunt",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 236,
    "lastActive": 1695952329619,
    "name": "esse ad",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 237,
    "lastActive": 1858145776330,
    "name": "laborum exercitation",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 238,
    "lastActive": 1722994400125,
    "name": "duis occaecat",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 239,
    "lastActive": 1719559861949,
    "name": "enim id",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 240,
    "lastActive": 2011557060309,
    "name": "irure aute",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 241,
    "lastActive": 1992252367886,
    "name": "adipisicing eu",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 242,
    "lastActive": 2001707495100,
    "name": "proident reprehenderit",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 243,
    "lastActive": 1754614253274,
    "name": "enim exercitation",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 244,
    "lastActive": 1943572076662,
    "name": "culpa cillum",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 245,
    "lastActive": 1862235494503,
    "name": "nulla incididunt",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 246,
    "lastActive": 1712672028778,
    "name": "eiusmod eu",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 247,
    "lastActive": 2042998878221,
    "name": "nulla magna",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 248,
    "lastActive": 1830690450249,
    "name": "occaecat non",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 249,
    "lastActive": 2050310619489,
    "name": "nostrud excepteur",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 250,
    "lastActive": 1930269410115,
    "name": "quis laborum",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 251,
    "lastActive": 2068252369846,
    "name": "qui dolore",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 252,
    "lastActive": 1890073038835,
    "name": "non tempor",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 253,
    "lastActive": 1913120300234,
    "name": "pariatur voluptate",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 254,
    "lastActive": 1929054829764,
    "name": "culpa laboris",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 255,
    "lastActive": 1807030344686,
    "name": "ea veniam",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 256,
    "lastActive": 2052170267512,
    "name": "sunt nostrud",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 257,
    "lastActive": 1754430469824,
    "name": "cupidatat est",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 258,
    "lastActive": 1874434255411,
    "name": "consectetur pariatur",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 259,
    "lastActive": 1764222207698,
    "name": "irure ipsum",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 260,
    "lastActive": 1752914725376,
    "name": "amet tempor",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 261,
    "lastActive": 2092164081158,
    "name": "occaecat voluptate",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 262,
    "lastActive": 1746001010476,
    "name": "sunt consequat",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 263,
    "lastActive": 1703286624082,
    "name": "velit eu",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 264,
    "lastActive": 1722165328263,
    "name": "qui sit",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 265,
    "lastActive": 1749720627751,
    "name": "incididunt minim",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 266,
    "lastActive": 1963266953190,
    "name": "incididunt do",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 267,
    "lastActive": 1898178259250,
    "name": "officia consectetur",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 268,
    "lastActive": 1769887829966,
    "name": "dolore consectetur",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 269,
    "lastActive": 1963517508221,
    "name": "et labore",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 270,
    "lastActive": 1815904069744,
    "name": "duis dolor",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 271,
    "lastActive": 1957807946577,
    "name": "laboris consectetur",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 272,
    "lastActive": 1961274895032,
    "name": "exercitation ullamco",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 273,
    "lastActive": 1813476059751,
    "name": "aliquip eiusmod",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 274,
    "lastActive": 1941023889142,
    "name": "consectetur veniam",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 275,
    "lastActive": 1850128926962,
    "name": "tempor culpa",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 276,
    "lastActive": 1859570351804,
    "name": "amet nostrud",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 277,
    "lastActive": 1998471314304,
    "name": "aliquip dolor",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 278,
    "lastActive": 1932866390704,
    "name": "in ullamco",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 279,
    "lastActive": 2031021442718,
    "name": "consectetur occaecat",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 280,
    "lastActive": 1741316743248,
    "name": "ullamco irure",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 281,
    "lastActive": 1803363221361,
    "name": "cupidatat voluptate",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 282,
    "lastActive": 1955968729895,
    "name": "in do",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 283,
    "lastActive": 2073516861157,
    "name": "est ea",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 284,
    "lastActive": 2014445046078,
    "name": "ut ipsum",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 285,
    "lastActive": 1720104324331,
    "name": "anim Lorem",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 286,
    "lastActive": 1976036861021,
    "name": "reprehenderit tempor",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 287,
    "lastActive": 1701954427460,
    "name": "id ut",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 288,
    "lastActive": 1885917259671,
    "name": "officia esse",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 289,
    "lastActive": 1732569070737,
    "name": "aute labore",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 290,
    "lastActive": 1781638464511,
    "name": "nostrud veniam",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 291,
    "lastActive": 1839914094164,
    "name": "sit aute",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 292,
    "lastActive": 1944819532762,
    "name": "laborum et",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 293,
    "lastActive": 2024237871861,
    "name": "deserunt consectetur",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 294,
    "lastActive": 1961679374394,
    "name": "nisi amet",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 295,
    "lastActive": 1753314927058,
    "name": "esse proident",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 296,
    "lastActive": 1879976249581,
    "name": "reprehenderit commodo",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 297,
    "lastActive": 1908760349291,
    "name": "occaecat et",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 298,
    "lastActive": 1981422148616,
    "name": "labore excepteur",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 299,
    "lastActive": 1809047500194,
    "name": "labore esse",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 300,
    "lastActive": 1886501016859,
    "name": "Lorem qui",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 301,
    "lastActive": 1951927764587,
    "name": "ad nisi",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 302,
    "lastActive": 2062696305150,
    "name": "ipsum velit",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 303,
    "lastActive": 1711011258903,
    "name": "nulla do",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 304,
    "lastActive": 1746305799548,
    "name": "laborum amet",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 305,
    "lastActive": 2021030164059,
    "name": "et nisi",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 306,
    "lastActive": 1719996072668,
    "name": "ullamco occaecat",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 307,
    "lastActive": 1818027963033,
    "name": "reprehenderit et",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 308,
    "lastActive": 1861108968768,
    "name": "culpa ut",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 309,
    "lastActive": 2065899920929,
    "name": "consectetur eiusmod",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 310,
    "lastActive": 1782226672750,
    "name": "tempor id",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 311,
    "lastActive": 2067487313479,
    "name": "Lorem ullamco",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 312,
    "lastActive": 2006400481648,
    "name": "quis velit",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 313,
    "lastActive": 1972657662368,
    "name": "officia adipisicing",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 314,
    "lastActive": 1733578816393,
    "name": "anim ut",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 315,
    "lastActive": 1774582911047,
    "name": "nostrud non",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 316,
    "lastActive": 1862568046326,
    "name": "proident laborum",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 317,
    "lastActive": 1755190046921,
    "name": "incididunt sit",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 318,
    "lastActive": 1985618660127,
    "name": "dolor amet",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 319,
    "lastActive": 1980922086310,
    "name": "Lorem qui",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 320,
    "lastActive": 1943660048468,
    "name": "non voluptate",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 321,
    "lastActive": 2060885986791,
    "name": "incididunt pariatur",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 322,
    "lastActive": 1729749444259,
    "name": "ipsum id",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 323,
    "lastActive": 1897690050477,
    "name": "laboris esse",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 324,
    "lastActive": 2012749830991,
    "name": "eiusmod esse",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 325,
    "lastActive": 1724866232642,
    "name": "laborum irure",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 326,
    "lastActive": 1704260264678,
    "name": "deserunt velit",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 327,
    "lastActive": 1781148467959,
    "name": "pariatur do",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 328,
    "lastActive": 2004678471224,
    "name": "amet magna",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 329,
    "lastActive": 1998733655401,
    "name": "cupidatat pariatur",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 330,
    "lastActive": 2014232552814,
    "name": "commodo sunt",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 331,
    "lastActive": 2006089502817,
    "name": "eiusmod irure",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 332,
    "lastActive": 1827596181108,
    "name": "duis esse",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 333,
    "lastActive": 1990280329723,
    "name": "aliqua consequat",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 334,
    "lastActive": 2062865287751,
    "name": "minim qui",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 335,
    "lastActive": 1711224897344,
    "name": "excepteur tempor",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 336,
    "lastActive": 1728002080406,
    "name": "anim irure",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 337,
    "lastActive": 1744208504275,
    "name": "ipsum elit",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 338,
    "lastActive": 1819539290884,
    "name": "ullamco occaecat",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 339,
    "lastActive": 2086742870820,
    "name": "elit incididunt",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 340,
    "lastActive": 1898382279948,
    "name": "id nulla",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 341,
    "lastActive": 1744921875254,
    "name": "qui sint",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 342,
    "lastActive": 1874490438891,
    "name": "proident consectetur",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 343,
    "lastActive": 2018717732466,
    "name": "consequat duis",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 344,
    "lastActive": 1862779495190,
    "name": "nisi dolore",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 345,
    "lastActive": 1963422220812,
    "name": "quis pariatur",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 346,
    "lastActive": 1943914793288,
    "name": "non laborum",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 347,
    "lastActive": 2068544461060,
    "name": "consequat ex",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 348,
    "lastActive": 2079461504497,
    "name": "fugiat sunt",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 349,
    "lastActive": 1866610474727,
    "name": "ullamco labore",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 350,
    "lastActive": 1724861742737,
    "name": "fugiat culpa",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 351,
    "lastActive": 1798901977329,
    "name": "ullamco incididunt",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 352,
    "lastActive": 1853934228538,
    "name": "sint sint",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 353,
    "lastActive": 1999575116435,
    "name": "sit velit",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 354,
    "lastActive": 1707236878275,
    "name": "adipisicing sit",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 355,
    "lastActive": 1876050243860,
    "name": "commodo non",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 356,
    "lastActive": 2041583634404,
    "name": "fugiat nostrud",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 357,
    "lastActive": 1936590134493,
    "name": "duis dolore",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 358,
    "lastActive": 1752120531766,
    "name": "laborum proident",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 359,
    "lastActive": 1964837960095,
    "name": "veniam voluptate",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 360,
    "lastActive": 1827620335170,
    "name": "sint quis",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 361,
    "lastActive": 1963242610726,
    "name": "tempor laborum",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 362,
    "lastActive": 1944509170252,
    "name": "aliqua fugiat",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 363,
    "lastActive": 2034023748882,
    "name": "adipisicing amet",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 364,
    "lastActive": 1842412275659,
    "name": "nisi quis",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 365,
    "lastActive": 1885046463841,
    "name": "sunt ea",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 366,
    "lastActive": 1904913563076,
    "name": "ad duis",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 367,
    "lastActive": 1809097116591,
    "name": "ut qui",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 368,
    "lastActive": 1855584924614,
    "name": "consequat cupidatat",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 369,
    "lastActive": 2045228755049,
    "name": "consequat et",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 370,
    "lastActive": 1874313302673,
    "name": "cillum veniam",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 371,
    "lastActive": 2054793117600,
    "name": "duis sunt",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 372,
    "lastActive": 1875177488349,
    "name": "incididunt est",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 373,
    "lastActive": 1734820540362,
    "name": "qui occaecat",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 374,
    "lastActive": 1915211821490,
    "name": "fugiat Lorem",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 375,
    "lastActive": 2050142473754,
    "name": "eu et",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 376,
    "lastActive": 2000024857599,
    "name": "consequat nulla",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 377,
    "lastActive": 1894311078586,
    "name": "magna magna",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 378,
    "lastActive": 1871058066709,
    "name": "minim reprehenderit",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 379,
    "lastActive": 2089452868445,
    "name": "nulla do",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 380,
    "lastActive": 1927972496061,
    "name": "tempor incididunt",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 381,
    "lastActive": 1995667125017,
    "name": "reprehenderit tempor",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 382,
    "lastActive": 1810243645447,
    "name": "ipsum proident",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 383,
    "lastActive": 1949420147416,
    "name": "et culpa",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 384,
    "lastActive": 1831516761000,
    "name": "ea pariatur",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 385,
    "lastActive": 1732705377423,
    "name": "tempor incididunt",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 386,
    "lastActive": 1825842123859,
    "name": "esse excepteur",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 387,
    "lastActive": 2081385372975,
    "name": "pariatur labore",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 388,
    "lastActive": 1799949877305,
    "name": "duis officia",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 389,
    "lastActive": 2039024039621,
    "name": "reprehenderit voluptate",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 390,
    "lastActive": 1825139758841,
    "name": "eiusmod dolor",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 391,
    "lastActive": 2021654695378,
    "name": "nulla esse",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 392,
    "lastActive": 1803744053572,
    "name": "irure quis",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 393,
    "lastActive": 1928820198338,
    "name": "commodo sit",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 394,
    "lastActive": 1944069498535,
    "name": "sit ut",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 395,
    "lastActive": 1743343704347,
    "name": "aute proident",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 396,
    "lastActive": 1974389781394,
    "name": "et dolor",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 397,
    "lastActive": 1734264764773,
    "name": "elit exercitation",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 398,
    "lastActive": 1808461131309,
    "name": "dolore dolor",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 399,
    "lastActive": 1792215497072,
    "name": "amet proident",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 400,
    "lastActive": 1991186380197,
    "name": "dolore ut",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 401,
    "lastActive": 1724528916344,
    "name": "aliqua culpa",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 402,
    "lastActive": 2080869786109,
    "name": "cillum irure",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 403,
    "lastActive": 1893632085438,
    "name": "sit non",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 404,
    "lastActive": 1752484105256,
    "name": "enim et",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 405,
    "lastActive": 1826655096026,
    "name": "deserunt in",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 406,
    "lastActive": 1706791894055,
    "name": "esse aute",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 407,
    "lastActive": 1971236293799,
    "name": "aliquip aliqua",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 408,
    "lastActive": 1813774563849,
    "name": "anim amet",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 409,
    "lastActive": 1878166200705,
    "name": "id labore",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 410,
    "lastActive": 1890675627825,
    "name": "dolore in",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 411,
    "lastActive": 1888681470910,
    "name": "ut pariatur",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 412,
    "lastActive": 2053705691497,
    "name": "eiusmod dolor",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 413,
    "lastActive": 1838340447718,
    "name": "esse sit",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 414,
    "lastActive": 1820669957666,
    "name": "culpa duis",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 415,
    "lastActive": 1712324569362,
    "name": "enim sunt",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 416,
    "lastActive": 2068515900802,
    "name": "laboris pariatur",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 417,
    "lastActive": 1761388832716,
    "name": "irure eu",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 418,
    "lastActive": 1932143262531,
    "name": "voluptate cillum",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 419,
    "lastActive": 1986016589442,
    "name": "laboris velit",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 420,
    "lastActive": 1753209324807,
    "name": "et exercitation",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 421,
    "lastActive": 1783958531686,
    "name": "laborum esse",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 422,
    "lastActive": 2029233492460,
    "name": "proident cupidatat",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 423,
    "lastActive": 1944800863916,
    "name": "labore aliqua",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 424,
    "lastActive": 1998583741148,
    "name": "irure culpa",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 425,
    "lastActive": 1966621289678,
    "name": "reprehenderit Lorem",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 426,
    "lastActive": 2070782984535,
    "name": "irure id",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 427,
    "lastActive": 1868224118582,
    "name": "adipisicing sint",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 428,
    "lastActive": 1832604913120,
    "name": "nulla do",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 429,
    "lastActive": 1834287680616,
    "name": "tempor in",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 430,
    "lastActive": 1742418566524,
    "name": "occaecat mollit",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 431,
    "lastActive": 2087296191624,
    "name": "commodo non",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 432,
    "lastActive": 1997720633842,
    "name": "irure Lorem",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 433,
    "lastActive": 1956096119605,
    "name": "pariatur adipisicing",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 434,
    "lastActive": 1812729008698,
    "name": "exercitation ut",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 435,
    "lastActive": 2051607685544,
    "name": "dolore proident",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 436,
    "lastActive": 2093810888845,
    "name": "dolore mollit",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 437,
    "lastActive": 1759471955625,
    "name": "irure anim",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 438,
    "lastActive": 1720944281074,
    "name": "non eiusmod",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 439,
    "lastActive": 1837995553420,
    "name": "et non",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 440,
    "lastActive": 2005705709844,
    "name": "aliquip sit",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 441,
    "lastActive": 1864883511983,
    "name": "fugiat esse",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 442,
    "lastActive": 2046447661898,
    "name": "reprehenderit exercitation",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 443,
    "lastActive": 1702305199468,
    "name": "voluptate commodo",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 444,
    "lastActive": 1856521733107,
    "name": "incididunt commodo",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 445,
    "lastActive": 1731435863342,
    "name": "ullamco in",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 446,
    "lastActive": 2028505110947,
    "name": "ullamco exercitation",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 447,
    "lastActive": 1828709637226,
    "name": "id officia",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 448,
    "lastActive": 1915474702948,
    "name": "id laboris",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 449,
    "lastActive": 2088447412421,
    "name": "dolore nostrud",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 450,
    "lastActive": 1839980941761,
    "name": "deserunt consectetur",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 451,
    "lastActive": 1857108216501,
    "name": "fugiat esse",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 452,
    "lastActive": 1829647643698,
    "name": "ipsum reprehenderit",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 453,
    "lastActive": 1937335058817,
    "name": "mollit mollit",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 454,
    "lastActive": 1763788693389,
    "name": "eu mollit",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 455,
    "lastActive": 1817783658774,
    "name": "aute nostrud",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 456,
    "lastActive": 1846696710188,
    "name": "irure enim",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 457,
    "lastActive": 1695785620989,
    "name": "ut adipisicing",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 458,
    "lastActive": 2014881627586,
    "name": "Lorem fugiat",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 459,
    "lastActive": 1743694115794,
    "name": "reprehenderit reprehenderit",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 460,
    "lastActive": 1946647017439,
    "name": "Lorem nisi",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 461,
    "lastActive": 1869568486669,
    "name": "ad incididunt",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 462,
    "lastActive": 1843240819541,
    "name": "irure proident",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 463,
    "lastActive": 1898694879035,
    "name": "nostrud laboris",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 464,
    "lastActive": 2091652517270,
    "name": "excepteur ullamco",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 465,
    "lastActive": 2091658884559,
    "name": "excepteur adipisicing",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 466,
    "lastActive": 1888881520790,
    "name": "excepteur veniam",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 467,
    "lastActive": 1851011988606,
    "name": "cillum labore",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 468,
    "lastActive": 1838923217896,
    "name": "culpa sint",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 469,
    "lastActive": 1970792657445,
    "name": "laborum culpa",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 470,
    "lastActive": 1913325147762,
    "name": "cillum id",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 471,
    "lastActive": 1900972066891,
    "name": "dolore anim",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 472,
    "lastActive": 2015949031447,
    "name": "culpa aliquip",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 473,
    "lastActive": 1936932293263,
    "name": "proident et",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 474,
    "lastActive": 1761319967529,
    "name": "nostrud eu",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 475,
    "lastActive": 1699828868280,
    "name": "ipsum officia",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 476,
    "lastActive": 1891916407596,
    "name": "enim laboris",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 477,
    "lastActive": 2072381240125,
    "name": "cupidatat tempor",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 478,
    "lastActive": 1937612990410,
    "name": "adipisicing sunt",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 479,
    "lastActive": 2019447705230,
    "name": "mollit sunt",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 480,
    "lastActive": 1729058165135,
    "name": "occaecat laborum",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 481,
    "lastActive": 1770376090208,
    "name": "ea ex",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 482,
    "lastActive": 1853504512770,
    "name": "irure enim",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 483,
    "lastActive": 2084439386727,
    "name": "minim velit",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 484,
    "lastActive": 2025525596327,
    "name": "et reprehenderit",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 485,
    "lastActive": 1728772166971,
    "name": "do laboris",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 486,
    "lastActive": 1857245181461,
    "name": "amet elit",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 487,
    "lastActive": 1893979885036,
    "name": "proident cillum",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 488,
    "lastActive": 1897319764698,
    "name": "culpa aute",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 489,
    "lastActive": 1842503030289,
    "name": "consequat culpa",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 490,
    "lastActive": 1768950759836,
    "name": "fugiat eu",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 491,
    "lastActive": 1750573511255,
    "name": "cupidatat cupidatat",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 492,
    "lastActive": 1958383324601,
    "name": "veniam et",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 493,
    "lastActive": 2092894889360,
    "name": "sint dolore",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 494,
    "lastActive": 1963706687807,
    "name": "mollit quis",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 495,
    "lastActive": 1812703141370,
    "name": "duis commodo",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 496,
    "lastActive": 2001247084806,
    "name": "minim anim",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 497,
    "lastActive": 1858061975320,
    "name": "dolor culpa",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 498,
    "lastActive": 1854080431929,
    "name": "voluptate dolor",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 499,
    "lastActive": 1857489203560,
    "name": "elit deserunt",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 500,
    "lastActive": 1785090519299,
    "name": "eu velit",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 501,
    "lastActive": 1899845029154,
    "name": "anim qui",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 502,
    "lastActive": 1780270169117,
    "name": "veniam sit",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 503,
    "lastActive": 1802392439701,
    "name": "aliqua commodo",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 504,
    "lastActive": 1708779369318,
    "name": "aute est",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 505,
    "lastActive": 1867296996161,
    "name": "do ex",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 506,
    "lastActive": 1796662994253,
    "name": "consectetur do",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 507,
    "lastActive": 1994079531272,
    "name": "reprehenderit magna",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 508,
    "lastActive": 1873865526381,
    "name": "aliquip voluptate",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 509,
    "lastActive": 1722263113500,
    "name": "Lorem labore",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 510,
    "lastActive": 1927358945294,
    "name": "ut proident",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 511,
    "lastActive": 1989981293023,
    "name": "proident incididunt",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 512,
    "lastActive": 1727302876842,
    "name": "ullamco laboris",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 513,
    "lastActive": 1776419982626,
    "name": "minim culpa",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 514,
    "lastActive": 2036628224061,
    "name": "et consectetur",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 515,
    "lastActive": 1896476662234,
    "name": "et minim",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 516,
    "lastActive": 1945410978527,
    "name": "pariatur reprehenderit",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 517,
    "lastActive": 1913221515076,
    "name": "sunt ad",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 518,
    "lastActive": 2012049769998,
    "name": "ut incididunt",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 519,
    "lastActive": 1926258927249,
    "name": "pariatur aliquip",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 520,
    "lastActive": 1987761808920,
    "name": "exercitation non",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 521,
    "lastActive": 1914640322368,
    "name": "pariatur cillum",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 522,
    "lastActive": 1813181545532,
    "name": "enim magna",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 523,
    "lastActive": 1944884197659,
    "name": "reprehenderit exercitation",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 524,
    "lastActive": 1991347395025,
    "name": "ad reprehenderit",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 525,
    "lastActive": 2077263521829,
    "name": "non aliqua",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 526,
    "lastActive": 1842733712938,
    "name": "elit ex",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 527,
    "lastActive": 1784686853266,
    "name": "consectetur nisi",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 528,
    "lastActive": 1951775685175,
    "name": "consectetur nulla",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 529,
    "lastActive": 1796050359157,
    "name": "nostrud aute",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 530,
    "lastActive": 2009791352419,
    "name": "ea Lorem",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 531,
    "lastActive": 1969490128589,
    "name": "est deserunt",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 532,
    "lastActive": 1733432104390,
    "name": "proident ullamco",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 533,
    "lastActive": 1775913055346,
    "name": "anim ut",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 534,
    "lastActive": 2045358562594,
    "name": "qui cillum",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 535,
    "lastActive": 2094517853460,
    "name": "occaecat ea",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 536,
    "lastActive": 1831601724854,
    "name": "Lorem aliquip",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 537,
    "lastActive": 1944143746555,
    "name": "consequat dolore",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 538,
    "lastActive": 1734790665612,
    "name": "et deserunt",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 539,
    "lastActive": 1890335730939,
    "name": "exercitation magna",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 540,
    "lastActive": 2063945855469,
    "name": "eu anim",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 541,
    "lastActive": 1934041064398,
    "name": "magna laboris",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 542,
    "lastActive": 1747202394715,
    "name": "mollit adipisicing",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 543,
    "lastActive": 1767029489928,
    "name": "ipsum occaecat",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 544,
    "lastActive": 1715979562340,
    "name": "nostrud dolor",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 545,
    "lastActive": 2080657052992,
    "name": "ea cupidatat",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 546,
    "lastActive": 1868505975284,
    "name": "quis est",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 547,
    "lastActive": 1856996833566,
    "name": "consequat exercitation",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 548,
    "lastActive": 2024663717333,
    "name": "voluptate elit",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 549,
    "lastActive": 2043237487381,
    "name": "veniam non",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 550,
    "lastActive": 2052757690557,
    "name": "pariatur tempor",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 551,
    "lastActive": 2060469586786,
    "name": "non mollit",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 552,
    "lastActive": 2055695250685,
    "name": "cupidatat amet",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 553,
    "lastActive": 1986853054551,
    "name": "esse pariatur",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 554,
    "lastActive": 2040148378272,
    "name": "veniam do",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 555,
    "lastActive": 2042771526095,
    "name": "sint veniam",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 556,
    "lastActive": 1712345934201,
    "name": "labore velit",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 557,
    "lastActive": 1711468973504,
    "name": "incididunt minim",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 558,
    "lastActive": 2048051488890,
    "name": "labore ex",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 559,
    "lastActive": 1965254123157,
    "name": "velit ea",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 560,
    "lastActive": 1791220413120,
    "name": "irure culpa",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 561,
    "lastActive": 1911395618543,
    "name": "amet nulla",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 562,
    "lastActive": 1796460518958,
    "name": "Lorem tempor",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 563,
    "lastActive": 1818738898940,
    "name": "cupidatat aliquip",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 564,
    "lastActive": 1874399806192,
    "name": "velit fugiat",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 565,
    "lastActive": 2036968618532,
    "name": "anim consequat",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 566,
    "lastActive": 1957344296509,
    "name": "eiusmod sint",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 567,
    "lastActive": 2088287517337,
    "name": "anim ipsum",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 568,
    "lastActive": 1758359662530,
    "name": "anim qui",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 569,
    "lastActive": 2026366453435,
    "name": "fugiat culpa",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 570,
    "lastActive": 2049625351434,
    "name": "ut velit",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 571,
    "lastActive": 1867537515190,
    "name": "excepteur sint",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 572,
    "lastActive": 1817398619256,
    "name": "est et",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 573,
    "lastActive": 2069976901597,
    "name": "qui dolore",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 574,
    "lastActive": 1964309757890,
    "name": "dolor eiusmod",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 575,
    "lastActive": 1758286134723,
    "name": "reprehenderit Lorem",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 576,
    "lastActive": 1919834400820,
    "name": "ad ea",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 577,
    "lastActive": 1740676760046,
    "name": "cupidatat duis",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 578,
    "lastActive": 1881912637137,
    "name": "ad labore",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 579,
    "lastActive": 1843641475797,
    "name": "officia esse",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 580,
    "lastActive": 2078087595177,
    "name": "veniam magna",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 581,
    "lastActive": 1695236267664,
    "name": "excepteur dolore",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 582,
    "lastActive": 1846415935971,
    "name": "minim dolore",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 583,
    "lastActive": 1820867812871,
    "name": "Lorem occaecat",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 584,
    "lastActive": 2079924678860,
    "name": "sit nostrud",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 585,
    "lastActive": 1919235892698,
    "name": "est sint",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 586,
    "lastActive": 1762041720701,
    "name": "ullamco nulla",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 587,
    "lastActive": 2061570055124,
    "name": "sint eu",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 588,
    "lastActive": 1880630875632,
    "name": "est mollit",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 589,
    "lastActive": 1907197177432,
    "name": "esse id",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 590,
    "lastActive": 1709532148219,
    "name": "esse qui",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 591,
    "lastActive": 1947682424142,
    "name": "elit ad",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 592,
    "lastActive": 1961362527493,
    "name": "dolore mollit",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 593,
    "lastActive": 1898877609100,
    "name": "velit consequat",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 594,
    "lastActive": 1695316919649,
    "name": "laborum nulla",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 595,
    "lastActive": 1777577410468,
    "name": "aliqua elit",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 596,
    "lastActive": 2057107910837,
    "name": "veniam veniam",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 597,
    "lastActive": 1790074952407,
    "name": "exercitation amet",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 598,
    "lastActive": 1724874226717,
    "name": "cupidatat id",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 599,
    "lastActive": 1767547523231,
    "name": "nulla ea",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 600,
    "lastActive": 1836765913492,
    "name": "ipsum sit",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 601,
    "lastActive": 2019766593652,
    "name": "reprehenderit et",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 602,
    "lastActive": 2040654140109,
    "name": "eiusmod quis",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 603,
    "lastActive": 1832596824501,
    "name": "cillum ea",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 604,
    "lastActive": 1726257393533,
    "name": "et velit",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 605,
    "lastActive": 1745743555952,
    "name": "irure Lorem",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 606,
    "lastActive": 1881094762207,
    "name": "anim ad",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 607,
    "lastActive": 1853489241033,
    "name": "duis ullamco",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 608,
    "lastActive": 1757110142464,
    "name": "cillum excepteur",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 609,
    "lastActive": 2017782538974,
    "name": "veniam tempor",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 610,
    "lastActive": 2046439034417,
    "name": "anim ipsum",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 611,
    "lastActive": 1709017912243,
    "name": "mollit sint",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 612,
    "lastActive": 1906529296371,
    "name": "veniam elit",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 613,
    "lastActive": 2021636475677,
    "name": "eu adipisicing",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 614,
    "lastActive": 1984225427393,
    "name": "id esse",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 615,
    "lastActive": 1991047252158,
    "name": "elit sunt",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 616,
    "lastActive": 2094579502219,
    "name": "amet id",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 617,
    "lastActive": 1850053999193,
    "name": "eu proident",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 618,
    "lastActive": 1789142381141,
    "name": "excepteur commodo",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 619,
    "lastActive": 1846308819525,
    "name": "ullamco occaecat",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 620,
    "lastActive": 1997185981454,
    "name": "ullamco veniam",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 621,
    "lastActive": 2031247120302,
    "name": "elit in",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 622,
    "lastActive": 1813164380449,
    "name": "aliquip non",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 623,
    "lastActive": 1871110918405,
    "name": "sit proident",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 624,
    "lastActive": 1819266409066,
    "name": "sit dolore",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 625,
    "lastActive": 1772591545279,
    "name": "laborum ex",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 626,
    "lastActive": 2052259588550,
    "name": "consequat officia",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 627,
    "lastActive": 1968538192176,
    "name": "enim deserunt",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 628,
    "lastActive": 1803232017394,
    "name": "et do",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 629,
    "lastActive": 2094196456843,
    "name": "dolore excepteur",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 630,
    "lastActive": 2057656352350,
    "name": "non velit",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 631,
    "lastActive": 1884897184468,
    "name": "quis qui",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 632,
    "lastActive": 1715770423822,
    "name": "esse culpa",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 633,
    "lastActive": 1931190951637,
    "name": "dolore laborum",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 634,
    "lastActive": 2032787683001,
    "name": "ipsum nostrud",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 635,
    "lastActive": 1957074041842,
    "name": "fugiat culpa",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 636,
    "lastActive": 1893747633124,
    "name": "consequat Lorem",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 637,
    "lastActive": 1776507080552,
    "name": "ullamco mollit",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 638,
    "lastActive": 1952865509238,
    "name": "sit proident",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 639,
    "lastActive": 1699648210421,
    "name": "consequat exercitation",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 640,
    "lastActive": 1890684270262,
    "name": "adipisicing in",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 641,
    "lastActive": 1957560461012,
    "name": "Lorem elit",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 642,
    "lastActive": 1742160303606,
    "name": "enim quis",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 643,
    "lastActive": 1874988235069,
    "name": "deserunt officia",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 644,
    "lastActive": 1898372209895,
    "name": "proident pariatur",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 645,
    "lastActive": 1887521608555,
    "name": "esse qui",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 646,
    "lastActive": 1853551374164,
    "name": "ipsum ex",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 647,
    "lastActive": 2023346092888,
    "name": "pariatur pariatur",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 648,
    "lastActive": 1806396936205,
    "name": "dolor aute",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 649,
    "lastActive": 1765566578406,
    "name": "deserunt ullamco",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 650,
    "lastActive": 2008043917566,
    "name": "exercitation commodo",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 651,
    "lastActive": 2067374537790,
    "name": "deserunt elit",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 652,
    "lastActive": 1785650290753,
    "name": "sint aliqua",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 653,
    "lastActive": 2042611266391,
    "name": "reprehenderit aute",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 654,
    "lastActive": 2014617893746,
    "name": "eu anim",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 655,
    "lastActive": 2045722813369,
    "name": "aute nulla",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 656,
    "lastActive": 1894732092361,
    "name": "et fugiat",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 657,
    "lastActive": 1740043902553,
    "name": "et eu",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 658,
    "lastActive": 1698458509877,
    "name": "tempor magna",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 659,
    "lastActive": 1853174573294,
    "name": "eiusmod ad",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 660,
    "lastActive": 2072177864018,
    "name": "veniam qui",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 661,
    "lastActive": 1989623686869,
    "name": "aliqua non",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 662,
    "lastActive": 1838947010786,
    "name": "anim sunt",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 663,
    "lastActive": 1897895863495,
    "name": "duis Lorem",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 664,
    "lastActive": 1917128302902,
    "name": "sunt minim",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 665,
    "lastActive": 1892216768129,
    "name": "magna ut",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 666,
    "lastActive": 1726695218669,
    "name": "laboris id",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 667,
    "lastActive": 1855458940885,
    "name": "non mollit",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 668,
    "lastActive": 1854880962370,
    "name": "quis consequat",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 669,
    "lastActive": 1961554165914,
    "name": "sit id",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 670,
    "lastActive": 1862618542173,
    "name": "proident nisi",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 671,
    "lastActive": 1709110618434,
    "name": "ut laboris",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 672,
    "lastActive": 1716327773789,
    "name": "minim pariatur",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 673,
    "lastActive": 1965409515921,
    "name": "minim voluptate",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 674,
    "lastActive": 1835227431043,
    "name": "irure culpa",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 675,
    "lastActive": 1955478918866,
    "name": "amet dolore",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 676,
    "lastActive": 1909454789538,
    "name": "duis dolor",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 677,
    "lastActive": 1828630355415,
    "name": "non reprehenderit",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 678,
    "lastActive": 2038709907674,
    "name": "ad fugiat",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 679,
    "lastActive": 1801391950519,
    "name": "adipisicing mollit",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 680,
    "lastActive": 1884725679201,
    "name": "eiusmod ad",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 681,
    "lastActive": 1918163161881,
    "name": "sunt veniam",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 682,
    "lastActive": 1889538879061,
    "name": "magna amet",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 683,
    "lastActive": 1991076144600,
    "name": "consequat elit",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 684,
    "lastActive": 1997319702073,
    "name": "velit aute",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 685,
    "lastActive": 1886705379291,
    "name": "ex sunt",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 686,
    "lastActive": 1697085393879,
    "name": "sint qui",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 687,
    "lastActive": 1752716963298,
    "name": "et et",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 688,
    "lastActive": 2078590409230,
    "name": "minim irure",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 689,
    "lastActive": 2076952364931,
    "name": "incididunt fugiat",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 690,
    "lastActive": 2086624399038,
    "name": "nisi aliquip",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 691,
    "lastActive": 2031501453123,
    "name": "aliqua do",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 692,
    "lastActive": 2071270401686,
    "name": "ut cupidatat",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 693,
    "lastActive": 1762512394060,
    "name": "ex et",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 694,
    "lastActive": 2044582609811,
    "name": "adipisicing magna",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 695,
    "lastActive": 2028593880857,
    "name": "mollit veniam",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 696,
    "lastActive": 1878555956722,
    "name": "occaecat amet",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 697,
    "lastActive": 1964496797195,
    "name": "occaecat cillum",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 698,
    "lastActive": 1735480961284,
    "name": "qui aliquip",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 699,
    "lastActive": 1988178897520,
    "name": "voluptate nulla",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 700,
    "lastActive": 1705974221306,
    "name": "adipisicing consectetur",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 701,
    "lastActive": 1728999160055,
    "name": "occaecat culpa",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 702,
    "lastActive": 1749791236189,
    "name": "quis ea",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 703,
    "lastActive": 1764672371167,
    "name": "esse officia",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 704,
    "lastActive": 1824240271757,
    "name": "nostrud sunt",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 705,
    "lastActive": 2032692512575,
    "name": "ex incididunt",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 706,
    "lastActive": 2090662018075,
    "name": "voluptate aute",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 707,
    "lastActive": 2005348479269,
    "name": "pariatur aliquip",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 708,
    "lastActive": 1983479768812,
    "name": "dolor consectetur",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 709,
    "lastActive": 1939298227468,
    "name": "ipsum irure",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 710,
    "lastActive": 1930506359874,
    "name": "mollit eiusmod",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 711,
    "lastActive": 2016319731599,
    "name": "voluptate non",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 712,
    "lastActive": 1966122491317,
    "name": "cillum cillum",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 713,
    "lastActive": 2001823359283,
    "name": "nisi elit",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 714,
    "lastActive": 1747285410741,
    "name": "velit officia",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 715,
    "lastActive": 1825429258941,
    "name": "in fugiat",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 716,
    "lastActive": 1776275173344,
    "name": "Lorem ea",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 717,
    "lastActive": 2059424604998,
    "name": "incididunt ullamco",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 718,
    "lastActive": 2000788777276,
    "name": "commodo ea",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 719,
    "lastActive": 1970388854006,
    "name": "officia magna",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 720,
    "lastActive": 1744320860193,
    "name": "et officia",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 721,
    "lastActive": 2088087800726,
    "name": "ipsum do",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 722,
    "lastActive": 1802635670321,
    "name": "eu non",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 723,
    "lastActive": 1787971628998,
    "name": "incididunt consectetur",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 724,
    "lastActive": 1799042570522,
    "name": "anim velit",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 725,
    "lastActive": 1930361478138,
    "name": "ex sint",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 726,
    "lastActive": 1777902044265,
    "name": "in est",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 727,
    "lastActive": 1875003595328,
    "name": "dolore incididunt",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 728,
    "lastActive": 1769734209228,
    "name": "culpa ea",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 729,
    "lastActive": 2073191061143,
    "name": "et deserunt",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 730,
    "lastActive": 1865377837212,
    "name": "nisi minim",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 731,
    "lastActive": 1980260133080,
    "name": "magna adipisicing",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 732,
    "lastActive": 2011569755262,
    "name": "ut velit",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 733,
    "lastActive": 2085163050973,
    "name": "adipisicing velit",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 734,
    "lastActive": 1817203241793,
    "name": "adipisicing sit",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 735,
    "lastActive": 1809227274309,
    "name": "proident culpa",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 736,
    "lastActive": 1832745873589,
    "name": "culpa ad",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 737,
    "lastActive": 1808963236565,
    "name": "non ipsum",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 738,
    "lastActive": 1910525146954,
    "name": "nisi do",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 739,
    "lastActive": 1887715718789,
    "name": "ut excepteur",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 740,
    "lastActive": 1834710813668,
    "name": "excepteur qui",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 741,
    "lastActive": 1876832518508,
    "name": "amet anim",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 742,
    "lastActive": 1957402177840,
    "name": "Lorem tempor",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 743,
    "lastActive": 1930676837333,
    "name": "Lorem mollit",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 744,
    "lastActive": 2077740257382,
    "name": "dolore sit",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 745,
    "lastActive": 1707464156520,
    "name": "velit excepteur",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 746,
    "lastActive": 1707216013588,
    "name": "sint anim",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 747,
    "lastActive": 1801509900797,
    "name": "sunt officia",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 748,
    "lastActive": 1969682430077,
    "name": "et Lorem",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 749,
    "lastActive": 1993576259739,
    "name": "cillum ex",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 750,
    "lastActive": 2062921384881,
    "name": "ipsum veniam",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 751,
    "lastActive": 2073085491478,
    "name": "irure aliqua",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 752,
    "lastActive": 2060858316416,
    "name": "non pariatur",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 753,
    "lastActive": 1824887175116,
    "name": "fugiat mollit",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 754,
    "lastActive": 1729842453617,
    "name": "officia et",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 755,
    "lastActive": 1773589142446,
    "name": "irure sunt",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 756,
    "lastActive": 1729177547667,
    "name": "adipisicing ullamco",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 757,
    "lastActive": 1731004716903,
    "name": "laboris anim",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 758,
    "lastActive": 1919383383934,
    "name": "cillum ad",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 759,
    "lastActive": 2083427203840,
    "name": "esse laborum",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 760,
    "lastActive": 2033559961741,
    "name": "non commodo",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 761,
    "lastActive": 1763772557658,
    "name": "irure occaecat",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 762,
    "lastActive": 1695815219761,
    "name": "excepteur elit",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 763,
    "lastActive": 2030672373352,
    "name": "sit nostrud",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 764,
    "lastActive": 1911007165374,
    "name": "veniam magna",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 765,
    "lastActive": 1992352683362,
    "name": "eu Lorem",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 766,
    "lastActive": 1822576401013,
    "name": "non exercitation",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 767,
    "lastActive": 1960612928028,
    "name": "officia voluptate",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 768,
    "lastActive": 1879262964983,
    "name": "id sint",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 769,
    "lastActive": 1725349836346,
    "name": "eu pariatur",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 770,
    "lastActive": 1919521452449,
    "name": "reprehenderit cillum",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 771,
    "lastActive": 1863717876239,
    "name": "fugiat fugiat",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 772,
    "lastActive": 1737761943256,
    "name": "minim aliquip",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 773,
    "lastActive": 1896056164640,
    "name": "proident elit",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 774,
    "lastActive": 2044672768165,
    "name": "in officia",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 775,
    "lastActive": 2040091577727,
    "name": "commodo proident",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 776,
    "lastActive": 1932518988209,
    "name": "velit et",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 777,
    "lastActive": 2076244894946,
    "name": "elit est",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 778,
    "lastActive": 1734927139612,
    "name": "quis magna",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 779,
    "lastActive": 1907767408266,
    "name": "elit minim",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 780,
    "lastActive": 1947567189969,
    "name": "nostrud officia",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 781,
    "lastActive": 1853272658952,
    "name": "exercitation nostrud",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 782,
    "lastActive": 1878013781150,
    "name": "enim nisi",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 783,
    "lastActive": 1985316443451,
    "name": "fugiat quis",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 784,
    "lastActive": 2015647928881,
    "name": "labore quis",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 785,
    "lastActive": 2050970922633,
    "name": "proident eu",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 786,
    "lastActive": 1881461198043,
    "name": "in duis",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 787,
    "lastActive": 2067584661434,
    "name": "consectetur proident",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 788,
    "lastActive": 1990791525434,
    "name": "cupidatat labore",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 789,
    "lastActive": 2027888088709,
    "name": "ex velit",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 790,
    "lastActive": 1850730080411,
    "name": "minim dolore",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 791,
    "lastActive": 1988444754101,
    "name": "exercitation cupidatat",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 792,
    "lastActive": 1869930448080,
    "name": "exercitation laboris",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 793,
    "lastActive": 1851649080224,
    "name": "tempor sunt",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 794,
    "lastActive": 1936770509804,
    "name": "occaecat elit",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 795,
    "lastActive": 1909817099186,
    "name": "minim mollit",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 796,
    "lastActive": 1894031928635,
    "name": "ipsum velit",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 797,
    "lastActive": 1889579463008,
    "name": "exercitation exercitation",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 798,
    "lastActive": 1818327316283,
    "name": "tempor occaecat",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 799,
    "lastActive": 2063441440664,
    "name": "reprehenderit excepteur",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 800,
    "lastActive": 1765627898104,
    "name": "et est",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 801,
    "lastActive": 1827065340949,
    "name": "nulla id",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 802,
    "lastActive": 2071576330008,
    "name": "nulla non",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 803,
    "lastActive": 1728943694354,
    "name": "nostrud duis",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 804,
    "lastActive": 2079225525384,
    "name": "eiusmod nostrud",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 805,
    "lastActive": 1740246238479,
    "name": "ad anim",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 806,
    "lastActive": 1808038430078,
    "name": "incididunt nisi",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 807,
    "lastActive": 1943663277653,
    "name": "veniam enim",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 808,
    "lastActive": 1750789109251,
    "name": "do amet",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 809,
    "lastActive": 1734677533177,
    "name": "consectetur commodo",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 810,
    "lastActive": 2039897047863,
    "name": "reprehenderit est",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 811,
    "lastActive": 1731755670008,
    "name": "et velit",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 812,
    "lastActive": 1843981236487,
    "name": "incididunt nisi",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 813,
    "lastActive": 1917501885429,
    "name": "nulla cupidatat",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 814,
    "lastActive": 1726081496821,
    "name": "minim nisi",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 815,
    "lastActive": 2069389895384,
    "name": "ex laboris",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 816,
    "lastActive": 1944603163653,
    "name": "elit adipisicing",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 817,
    "lastActive": 1695599238374,
    "name": "ea Lorem",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 818,
    "lastActive": 1787956773940,
    "name": "consequat fugiat",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 819,
    "lastActive": 1893069183290,
    "name": "commodo officia",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 820,
    "lastActive": 1830434689248,
    "name": "reprehenderit reprehenderit",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 821,
    "lastActive": 1821861371247,
    "name": "est magna",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 822,
    "lastActive": 1868858083392,
    "name": "incididunt nisi",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 823,
    "lastActive": 1970434422395,
    "name": "eiusmod ea",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 824,
    "lastActive": 1717758495067,
    "name": "labore et",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 825,
    "lastActive": 1865895725272,
    "name": "ad mollit",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 826,
    "lastActive": 2056355204843,
    "name": "eiusmod occaecat",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 827,
    "lastActive": 2002894756623,
    "name": "aliquip nulla",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 828,
    "lastActive": 1710182536764,
    "name": "sit anim",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 829,
    "lastActive": 1731970039080,
    "name": "qui labore",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 830,
    "lastActive": 1857456948972,
    "name": "adipisicing commodo",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 831,
    "lastActive": 1939344372411,
    "name": "veniam excepteur",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 832,
    "lastActive": 1850678071421,
    "name": "ea ut",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 833,
    "lastActive": 1961386263937,
    "name": "ea tempor",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 834,
    "lastActive": 1804610538535,
    "name": "est ad",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 835,
    "lastActive": 1951214465896,
    "name": "ea cupidatat",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 836,
    "lastActive": 2020526278967,
    "name": "cupidatat amet",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 837,
    "lastActive": 2009378798250,
    "name": "sunt eiusmod",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 838,
    "lastActive": 1851430110208,
    "name": "cupidatat esse",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 839,
    "lastActive": 2032135671953,
    "name": "laborum veniam",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 840,
    "lastActive": 1841577692576,
    "name": "officia sunt",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 841,
    "lastActive": 1966488129855,
    "name": "ullamco amet",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 842,
    "lastActive": 1781510110691,
    "name": "consectetur laboris",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 843,
    "lastActive": 2047235516685,
    "name": "aute enim",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 844,
    "lastActive": 1909145758800,
    "name": "adipisicing officia",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 845,
    "lastActive": 1850885996422,
    "name": "est consequat",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 846,
    "lastActive": 1788613706700,
    "name": "laborum in",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 847,
    "lastActive": 1791363086840,
    "name": "mollit velit",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 848,
    "lastActive": 1923721917853,
    "name": "duis quis",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 849,
    "lastActive": 1811840459496,
    "name": "ipsum laboris",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 850,
    "lastActive": 1811746079875,
    "name": "minim enim",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 851,
    "lastActive": 1818381557030,
    "name": "eiusmod ut",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 852,
    "lastActive": 1821298144317,
    "name": "exercitation id",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 853,
    "lastActive": 2006047447971,
    "name": "nisi ad",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 854,
    "lastActive": 1707724880204,
    "name": "id enim",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 855,
    "lastActive": 1806529228519,
    "name": "dolor Lorem",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 856,
    "lastActive": 1906270400154,
    "name": "ad quis",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 857,
    "lastActive": 2027526732644,
    "name": "nulla aute",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 858,
    "lastActive": 1847853296378,
    "name": "cupidatat laboris",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 859,
    "lastActive": 1742823174775,
    "name": "cillum ullamco",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 860,
    "lastActive": 1781512757753,
    "name": "enim do",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 861,
    "lastActive": 1921198493255,
    "name": "duis nisi",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 862,
    "lastActive": 1874783815743,
    "name": "nostrud veniam",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 863,
    "lastActive": 1884900027172,
    "name": "velit laboris",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 864,
    "lastActive": 1830131510774,
    "name": "consequat consectetur",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 865,
    "lastActive": 1986684455555,
    "name": "esse irure",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 866,
    "lastActive": 1712275918047,
    "name": "velit exercitation",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 867,
    "lastActive": 1971136683916,
    "name": "reprehenderit Lorem",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 868,
    "lastActive": 2065944202195,
    "name": "adipisicing nulla",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 869,
    "lastActive": 2061820059528,
    "name": "sit adipisicing",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 870,
    "lastActive": 1984463357523,
    "name": "quis consequat",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 871,
    "lastActive": 2046553281791,
    "name": "incididunt officia",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 872,
    "lastActive": 1812748483519,
    "name": "mollit deserunt",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 873,
    "lastActive": 1731294465263,
    "name": "eiusmod sit",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 874,
    "lastActive": 1947423888790,
    "name": "cupidatat laboris",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 875,
    "lastActive": 1949006915750,
    "name": "nostrud aliqua",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 876,
    "lastActive": 1951484150168,
    "name": "occaecat eu",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 877,
    "lastActive": 1782487762168,
    "name": "esse in",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 878,
    "lastActive": 1820402041146,
    "name": "adipisicing labore",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 879,
    "lastActive": 1821559594186,
    "name": "adipisicing adipisicing",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 880,
    "lastActive": 1824769177187,
    "name": "id officia",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 881,
    "lastActive": 1743324315500,
    "name": "reprehenderit est",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 882,
    "lastActive": 2092377762770,
    "name": "dolore ullamco",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 883,
    "lastActive": 2041239023983,
    "name": "proident magna",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 884,
    "lastActive": 1954247527556,
    "name": "reprehenderit cupidatat",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 885,
    "lastActive": 1949386952090,
    "name": "duis sit",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 886,
    "lastActive": 1926063199397,
    "name": "exercitation in",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 887,
    "lastActive": 2064673329861,
    "name": "ex minim",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 888,
    "lastActive": 1839170519568,
    "name": "voluptate consectetur",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 889,
    "lastActive": 2065663571689,
    "name": "exercitation reprehenderit",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 890,
    "lastActive": 1894647512105,
    "name": "velit nostrud",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 891,
    "lastActive": 1945125531933,
    "name": "reprehenderit consectetur",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 892,
    "lastActive": 2071694125735,
    "name": "duis non",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 893,
    "lastActive": 1975035669746,
    "name": "duis incididunt",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 894,
    "lastActive": 1840117138336,
    "name": "culpa aliqua",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 895,
    "lastActive": 2008815749749,
    "name": "nisi nisi",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 896,
    "lastActive": 2089518541789,
    "name": "reprehenderit eiusmod",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 897,
    "lastActive": 1924319604258,
    "name": "qui ea",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 898,
    "lastActive": 1961391684784,
    "name": "velit do",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 899,
    "lastActive": 2046660102897,
    "name": "labore labore",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 900,
    "lastActive": 1848107258550,
    "name": "velit exercitation",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 901,
    "lastActive": 1735753158901,
    "name": "sint ullamco",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 902,
    "lastActive": 2070005888279,
    "name": "nisi fugiat",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 903,
    "lastActive": 1894306507812,
    "name": "aliqua ipsum",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 904,
    "lastActive": 1972023710528,
    "name": "nostrud consectetur",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 905,
    "lastActive": 2082968302247,
    "name": "aliqua laboris",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 906,
    "lastActive": 1788624064638,
    "name": "consequat laboris",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 907,
    "lastActive": 1879073290227,
    "name": "labore cupidatat",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 908,
    "lastActive": 1864546189041,
    "name": "ullamco laboris",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 909,
    "lastActive": 1869425802843,
    "name": "ullamco anim",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 910,
    "lastActive": 2031350906405,
    "name": "nisi officia",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 911,
    "lastActive": 1814871536667,
    "name": "id veniam",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 912,
    "lastActive": 1822822165270,
    "name": "ea mollit",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 913,
    "lastActive": 1809042574084,
    "name": "proident ullamco",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 914,
    "lastActive": 1736132750165,
    "name": "ullamco labore",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 915,
    "lastActive": 2093858572539,
    "name": "elit minim",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 916,
    "lastActive": 1708054742289,
    "name": "deserunt irure",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 917,
    "lastActive": 1866031331396,
    "name": "veniam non",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 918,
    "lastActive": 1765934509922,
    "name": "eu consectetur",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 919,
    "lastActive": 2009977846502,
    "name": "eu veniam",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 920,
    "lastActive": 2068966809342,
    "name": "eu commodo",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 921,
    "lastActive": 1765891995409,
    "name": "eiusmod labore",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 922,
    "lastActive": 1960952292912,
    "name": "dolor ea",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 923,
    "lastActive": 1863515345259,
    "name": "non velit",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 924,
    "lastActive": 1989333960690,
    "name": "eu qui",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 925,
    "lastActive": 1783662886098,
    "name": "excepteur velit",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 926,
    "lastActive": 1980030501308,
    "name": "ad ex",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 927,
    "lastActive": 1983931458466,
    "name": "adipisicing id",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 928,
    "lastActive": 1903709239764,
    "name": "tempor amet",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 929,
    "lastActive": 1777669591038,
    "name": "officia occaecat",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 930,
    "lastActive": 1715893063371,
    "name": "reprehenderit esse",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 931,
    "lastActive": 1702963904714,
    "name": "eu quis",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 932,
    "lastActive": 1838677816888,
    "name": "adipisicing enim",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 933,
    "lastActive": 1893885061860,
    "name": "et irure",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 934,
    "lastActive": 1717624115837,
    "name": "esse cupidatat",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 935,
    "lastActive": 1828142287553,
    "name": "fugiat esse",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 936,
    "lastActive": 1718810987301,
    "name": "enim dolor",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 937,
    "lastActive": 1985830668277,
    "name": "laborum elit",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 938,
    "lastActive": 1732593331409,
    "name": "proident eiusmod",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 939,
    "lastActive": 1964963843775,
    "name": "est id",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 940,
    "lastActive": 1771827832390,
    "name": "sunt eiusmod",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 941,
    "lastActive": 1752700479758,
    "name": "elit elit",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 942,
    "lastActive": 1726738608850,
    "name": "do aliqua",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 943,
    "lastActive": 1922315755758,
    "name": "esse ad",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 944,
    "lastActive": 1812371393741,
    "name": "tempor in",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 945,
    "lastActive": 1702715677132,
    "name": "tempor dolore",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 946,
    "lastActive": 2023102358149,
    "name": "dolore minim",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 947,
    "lastActive": 1697375316886,
    "name": "irure magna",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 948,
    "lastActive": 1753598456984,
    "name": "aliqua laborum",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 949,
    "lastActive": 1808652091204,
    "name": "nulla dolor",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 950,
    "lastActive": 1906232649447,
    "name": "excepteur sint",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 951,
    "lastActive": 1726399061452,
    "name": "non deserunt",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 952,
    "lastActive": 1787077325482,
    "name": "voluptate velit",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 953,
    "lastActive": 1974213021528,
    "name": "culpa est",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 954,
    "lastActive": 1737656374601,
    "name": "voluptate sint",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 955,
    "lastActive": 1935835250009,
    "name": "nisi sint",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 956,
    "lastActive": 1749811550275,
    "name": "dolore esse",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 957,
    "lastActive": 1995997350015,
    "name": "consequat quis",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 958,
    "lastActive": 1789981465985,
    "name": "sunt duis",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 959,
    "lastActive": 1762271873952,
    "name": "sunt officia",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 960,
    "lastActive": 1786894124680,
    "name": "fugiat occaecat",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 961,
    "lastActive": 1915196201363,
    "name": "fugiat nisi",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 962,
    "lastActive": 1828020825390,
    "name": "irure occaecat",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 963,
    "lastActive": 2017786502216,
    "name": "in voluptate",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 964,
    "lastActive": 2057489533054,
    "name": "et incididunt",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 965,
    "lastActive": 1785674096512,
    "name": "tempor cupidatat",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 966,
    "lastActive": 1981804310675,
    "name": "ipsum amet",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 967,
    "lastActive": 1905442514143,
    "name": "cupidatat amet",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 968,
    "lastActive": 1903398783314,
    "name": "aliquip qui",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 969,
    "lastActive": 1814421516242,
    "name": "occaecat sit",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 970,
    "lastActive": 1991371939666,
    "name": "occaecat aliqua",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 971,
    "lastActive": 2081263233337,
    "name": "quis et",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 972,
    "lastActive": 1757331511017,
    "name": "tempor sunt",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 973,
    "lastActive": 1873041906693,
    "name": "anim excepteur",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 974,
    "lastActive": 1701670053091,
    "name": "dolore amet",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 975,
    "lastActive": 1700223414279,
    "name": "deserunt pariatur",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 976,
    "lastActive": 1997305672145,
    "name": "nostrud aute",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 977,
    "lastActive": 2090795985920,
    "name": "cillum laboris",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 978,
    "lastActive": 1897205643458,
    "name": "minim labore",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 979,
    "lastActive": 1695985988340,
    "name": "proident ullamco",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 980,
    "lastActive": 1763643286358,
    "name": "deserunt ipsum",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 981,
    "lastActive": 1972963175186,
    "name": "dolor ad",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 982,
    "lastActive": 2083110158401,
    "name": "cupidatat labore",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 983,
    "lastActive": 1935955307427,
    "name": "tempor consequat",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 984,
    "lastActive": 2060452445542,
    "name": "pariatur minim",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 985,
    "lastActive": 1757305321816,
    "name": "ex ad",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 986,
    "lastActive": 1887465724275,
    "name": "duis aliquip",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 987,
    "lastActive": 1743696257987,
    "name": "in ea",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 988,
    "lastActive": 1852646586155,
    "name": "sit sint",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 989,
    "lastActive": 1791774782145,
    "name": "aute laboris",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 990,
    "lastActive": 1894968500084,
    "name": "commodo elit",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 991,
    "lastActive": 2092802523015,
    "name": "aliquip officia",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 992,
    "lastActive": 1902260346458,
    "name": "exercitation in",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 993,
    "lastActive": 1982003628920,
    "name": "culpa consequat",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 994,
    "lastActive": 1958071650597,
    "name": "dolore quis",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 995,
    "lastActive": 1865216953188,
    "name": "velit dolor",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 996,
    "lastActive": 2084264782284,
    "name": "aute consectetur",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 997,
    "lastActive": 2086117777976,
    "name": "reprehenderit labore",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 998,
    "lastActive": 1919860847343,
    "name": "reprehenderit occaecat",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 999,
    "lastActive": 1727537505889,
    "name": "nisi nulla",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1000,
    "lastActive": 1763908083253,
    "name": "nulla occaecat",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1001,
    "lastActive": 1806468529742,
    "name": "id dolore",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1002,
    "lastActive": 1893219444145,
    "name": "non pariatur",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1003,
    "lastActive": 1855935316505,
    "name": "ipsum quis",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1004,
    "lastActive": 1743270264145,
    "name": "id labore",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1005,
    "lastActive": 2031949154825,
    "name": "elit officia",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1006,
    "lastActive": 1814006010471,
    "name": "pariatur ea",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1007,
    "lastActive": 1796547651743,
    "name": "veniam aliquip",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1008,
    "lastActive": 1998775506247,
    "name": "nulla cupidatat",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1009,
    "lastActive": 1967939622159,
    "name": "qui proident",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1010,
    "lastActive": 2009598906530,
    "name": "nulla est",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1011,
    "lastActive": 1932402091453,
    "name": "enim id",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1012,
    "lastActive": 1837685195014,
    "name": "eiusmod occaecat",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1013,
    "lastActive": 2055141061889,
    "name": "enim esse",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1014,
    "lastActive": 1969545623835,
    "name": "qui adipisicing",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1015,
    "lastActive": 1780594511698,
    "name": "adipisicing velit",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1016,
    "lastActive": 1772722834739,
    "name": "exercitation eiusmod",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1017,
    "lastActive": 1728707322826,
    "name": "laboris cillum",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1018,
    "lastActive": 1833647737816,
    "name": "culpa magna",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1019,
    "lastActive": 1881343064888,
    "name": "duis Lorem",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1020,
    "lastActive": 1759552088028,
    "name": "culpa laborum",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1021,
    "lastActive": 1800015657968,
    "name": "proident tempor",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1022,
    "lastActive": 1976093367270,
    "name": "eu dolor",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1023,
    "lastActive": 1753585145036,
    "name": "quis labore",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1024,
    "lastActive": 2030835860579,
    "name": "laboris eiusmod",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1025,
    "lastActive": 1746372339101,
    "name": "exercitation consequat",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1026,
    "lastActive": 1711631659621,
    "name": "elit nisi",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1027,
    "lastActive": 1797525596207,
    "name": "culpa sunt",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1028,
    "lastActive": 1888681611143,
    "name": "reprehenderit laborum",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1029,
    "lastActive": 1819564594921,
    "name": "mollit culpa",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1030,
    "lastActive": 2089732841153,
    "name": "culpa cillum",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1031,
    "lastActive": 1744085628269,
    "name": "velit et",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1032,
    "lastActive": 2004764108628,
    "name": "eu sint",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1033,
    "lastActive": 1854875992326,
    "name": "adipisicing exercitation",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1034,
    "lastActive": 1809296395009,
    "name": "commodo sunt",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1035,
    "lastActive": 2059584345612,
    "name": "ut adipisicing",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1036,
    "lastActive": 1991558731380,
    "name": "labore duis",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1037,
    "lastActive": 1912453793898,
    "name": "sit amet",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1038,
    "lastActive": 2055522528567,
    "name": "ut incididunt",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1039,
    "lastActive": 1791290035870,
    "name": "reprehenderit quis",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1040,
    "lastActive": 1717456669082,
    "name": "sit commodo",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1041,
    "lastActive": 1867331235547,
    "name": "ullamco pariatur",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1042,
    "lastActive": 2036908469442,
    "name": "sunt veniam",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1043,
    "lastActive": 1964692526942,
    "name": "ad mollit",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1044,
    "lastActive": 1944019927517,
    "name": "proident do",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1045,
    "lastActive": 1869111949832,
    "name": "ipsum nisi",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1046,
    "lastActive": 2064539278157,
    "name": "do esse",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1047,
    "lastActive": 1777937224012,
    "name": "enim eiusmod",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1048,
    "lastActive": 1995924793791,
    "name": "nulla id",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1049,
    "lastActive": 1971497467820,
    "name": "esse labore",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1050,
    "lastActive": 1770919249837,
    "name": "cillum nisi",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1051,
    "lastActive": 2026519317385,
    "name": "incididunt reprehenderit",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1052,
    "lastActive": 1823820602147,
    "name": "proident dolor",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1053,
    "lastActive": 1759650712220,
    "name": "adipisicing proident",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1054,
    "lastActive": 1825278023620,
    "name": "duis eiusmod",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1055,
    "lastActive": 2003353003769,
    "name": "dolore fugiat",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1056,
    "lastActive": 1984472254998,
    "name": "pariatur incididunt",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1057,
    "lastActive": 2086641715360,
    "name": "exercitation culpa",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1058,
    "lastActive": 2083726635123,
    "name": "non amet",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1059,
    "lastActive": 1716331368084,
    "name": "nisi deserunt",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1060,
    "lastActive": 1959854097785,
    "name": "adipisicing veniam",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1061,
    "lastActive": 1740358020616,
    "name": "tempor aliqua",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1062,
    "lastActive": 1962108001106,
    "name": "amet est",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1063,
    "lastActive": 1842912920929,
    "name": "labore excepteur",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1064,
    "lastActive": 1751836036320,
    "name": "et sint",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1065,
    "lastActive": 1849662107608,
    "name": "officia laborum",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1066,
    "lastActive": 1945370959016,
    "name": "proident commodo",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1067,
    "lastActive": 1889831068939,
    "name": "ex pariatur",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1068,
    "lastActive": 2053501375709,
    "name": "dolore aute",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1069,
    "lastActive": 1964065790528,
    "name": "sunt mollit",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1070,
    "lastActive": 2070612987772,
    "name": "elit velit",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1071,
    "lastActive": 1923362682257,
    "name": "dolore consequat",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1072,
    "lastActive": 1735616128202,
    "name": "adipisicing fugiat",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1073,
    "lastActive": 1845576030653,
    "name": "eiusmod non",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1074,
    "lastActive": 1993670234399,
    "name": "sit voluptate",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1075,
    "lastActive": 1894973557507,
    "name": "voluptate proident",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1076,
    "lastActive": 1771423352346,
    "name": "qui sunt",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1077,
    "lastActive": 1918245395260,
    "name": "qui esse",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1078,
    "lastActive": 1834507774566,
    "name": "deserunt ea",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1079,
    "lastActive": 2050315850303,
    "name": "labore sit",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1080,
    "lastActive": 1990482892705,
    "name": "anim incididunt",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1081,
    "lastActive": 1968102671381,
    "name": "elit ex",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1082,
    "lastActive": 1750682166693,
    "name": "veniam veniam",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1083,
    "lastActive": 1941908119659,
    "name": "mollit pariatur",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1084,
    "lastActive": 2067122216777,
    "name": "excepteur adipisicing",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1085,
    "lastActive": 1993574618898,
    "name": "in et",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1086,
    "lastActive": 1700605328666,
    "name": "ea nulla",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1087,
    "lastActive": 1816443230116,
    "name": "veniam ipsum",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1088,
    "lastActive": 1711489095521,
    "name": "ipsum minim",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1089,
    "lastActive": 1789791224956,
    "name": "culpa laboris",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1090,
    "lastActive": 2042920748227,
    "name": "cupidatat aliqua",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1091,
    "lastActive": 1758288909012,
    "name": "laboris excepteur",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1092,
    "lastActive": 1881502891101,
    "name": "deserunt excepteur",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1093,
    "lastActive": 1779893084411,
    "name": "tempor sint",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1094,
    "lastActive": 2055469494690,
    "name": "eu deserunt",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1095,
    "lastActive": 1979378775553,
    "name": "sunt esse",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1096,
    "lastActive": 2046162863023,
    "name": "laboris non",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1097,
    "lastActive": 1698489926910,
    "name": "qui fugiat",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1098,
    "lastActive": 1965922644398,
    "name": "enim ad",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1099,
    "lastActive": 1978341278953,
    "name": "laborum deserunt",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1100,
    "lastActive": 1910551539784,
    "name": "tempor laboris",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1101,
    "lastActive": 2029627908958,
    "name": "aliquip commodo",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1102,
    "lastActive": 1738553830669,
    "name": "nostrud nisi",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1103,
    "lastActive": 1815406999163,
    "name": "laboris mollit",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1104,
    "lastActive": 1920928714224,
    "name": "Lorem excepteur",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1105,
    "lastActive": 1983335284494,
    "name": "ipsum mollit",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1106,
    "lastActive": 1812329718830,
    "name": "veniam sit",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1107,
    "lastActive": 1989262021621,
    "name": "qui sit",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1108,
    "lastActive": 1718451456726,
    "name": "anim do",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1109,
    "lastActive": 1744205502338,
    "name": "deserunt eiusmod",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1110,
    "lastActive": 2088349515159,
    "name": "aliquip exercitation",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1111,
    "lastActive": 1841589391093,
    "name": "culpa occaecat",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1112,
    "lastActive": 1766393312022,
    "name": "commodo irure",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1113,
    "lastActive": 1777828612703,
    "name": "irure veniam",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1114,
    "lastActive": 1962960110808,
    "name": "minim Lorem",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1115,
    "lastActive": 2087646241631,
    "name": "Lorem sunt",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1116,
    "lastActive": 2050836529722,
    "name": "ex sunt",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1117,
    "lastActive": 1911427278440,
    "name": "ex esse",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1118,
    "lastActive": 2090654383782,
    "name": "culpa irure",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1119,
    "lastActive": 1931588421630,
    "name": "fugiat veniam",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1120,
    "lastActive": 2071068953938,
    "name": "pariatur duis",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1121,
    "lastActive": 1937003984852,
    "name": "minim excepteur",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1122,
    "lastActive": 1789638362055,
    "name": "proident ullamco",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1123,
    "lastActive": 2073120606932,
    "name": "nulla voluptate",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1124,
    "lastActive": 2085402749049,
    "name": "minim Lorem",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1125,
    "lastActive": 2022922905235,
    "name": "id veniam",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1126,
    "lastActive": 1962869268691,
    "name": "nisi ipsum",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1127,
    "lastActive": 1951882280107,
    "name": "consectetur ad",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1128,
    "lastActive": 1790094936276,
    "name": "sint adipisicing",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1129,
    "lastActive": 1882794092677,
    "name": "duis ea",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1130,
    "lastActive": 1911335092825,
    "name": "proident minim",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1131,
    "lastActive": 1915789698969,
    "name": "irure dolor",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1132,
    "lastActive": 1748071938237,
    "name": "eiusmod voluptate",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1133,
    "lastActive": 1784717104153,
    "name": "laboris qui",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1134,
    "lastActive": 1778833690387,
    "name": "aliqua aliquip",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1135,
    "lastActive": 2090546956849,
    "name": "enim voluptate",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1136,
    "lastActive": 1928203430445,
    "name": "irure aliqua",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1137,
    "lastActive": 1845656025228,
    "name": "et eiusmod",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1138,
    "lastActive": 1755565350481,
    "name": "veniam sint",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1139,
    "lastActive": 1855714085243,
    "name": "officia nostrud",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1140,
    "lastActive": 1909373180627,
    "name": "sit eiusmod",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1141,
    "lastActive": 1739609652930,
    "name": "consectetur esse",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1142,
    "lastActive": 1840739863660,
    "name": "amet ex",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1143,
    "lastActive": 1852520523793,
    "name": "Lorem est",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1144,
    "lastActive": 2067887464305,
    "name": "minim aliquip",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1145,
    "lastActive": 1952639039522,
    "name": "ad in",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1146,
    "lastActive": 1718986883601,
    "name": "sunt minim",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1147,
    "lastActive": 1882213499208,
    "name": "mollit consequat",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1148,
    "lastActive": 1699161624800,
    "name": "adipisicing nulla",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1149,
    "lastActive": 2065477559763,
    "name": "officia minim",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1150,
    "lastActive": 2080463179084,
    "name": "minim enim",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1151,
    "lastActive": 1839066279370,
    "name": "do enim",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1152,
    "lastActive": 1826112133209,
    "name": "deserunt proident",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1153,
    "lastActive": 2044848543053,
    "name": "consectetur ad",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1154,
    "lastActive": 1765094159624,
    "name": "mollit occaecat",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1155,
    "lastActive": 1928544090451,
    "name": "officia est",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1156,
    "lastActive": 1917483779033,
    "name": "ea et",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1157,
    "lastActive": 1745842573666,
    "name": "occaecat ullamco",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1158,
    "lastActive": 1811485698264,
    "name": "amet ut",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1159,
    "lastActive": 1783040525252,
    "name": "ipsum sunt",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1160,
    "lastActive": 2003776149259,
    "name": "tempor ut",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1161,
    "lastActive": 1906035984907,
    "name": "et officia",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1162,
    "lastActive": 1762850359673,
    "name": "magna incididunt",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1163,
    "lastActive": 1735951622540,
    "name": "esse voluptate",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1164,
    "lastActive": 1800516121164,
    "name": "pariatur incididunt",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1165,
    "lastActive": 2028857916841,
    "name": "occaecat in",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1166,
    "lastActive": 2011605226729,
    "name": "excepteur amet",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1167,
    "lastActive": 2005641738164,
    "name": "laboris in",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1168,
    "lastActive": 2092755618771,
    "name": "consequat qui",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1169,
    "lastActive": 1870884639336,
    "name": "nisi ex",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1170,
    "lastActive": 1835408652971,
    "name": "nulla anim",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1171,
    "lastActive": 1811313222874,
    "name": "tempor dolore",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1172,
    "lastActive": 1728150469962,
    "name": "esse cupidatat",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1173,
    "lastActive": 1860388301091,
    "name": "ex nostrud",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1174,
    "lastActive": 1714251475768,
    "name": "aliqua occaecat",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1175,
    "lastActive": 1805055533696,
    "name": "labore minim",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1176,
    "lastActive": 1966462450638,
    "name": "aute ut",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1177,
    "lastActive": 1806566967280,
    "name": "sit ut",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1178,
    "lastActive": 1868250028669,
    "name": "occaecat excepteur",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1179,
    "lastActive": 2092244384167,
    "name": "laboris irure",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1180,
    "lastActive": 2003802745216,
    "name": "cupidatat Lorem",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1181,
    "lastActive": 1724077884339,
    "name": "qui cillum",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1182,
    "lastActive": 1842257967825,
    "name": "ea ipsum",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1183,
    "lastActive": 1867333053314,
    "name": "eu amet",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1184,
    "lastActive": 1746196072721,
    "name": "ullamco quis",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1185,
    "lastActive": 1994346973137,
    "name": "eu pariatur",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1186,
    "lastActive": 2077550976603,
    "name": "reprehenderit cillum",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1187,
    "lastActive": 1957382724683,
    "name": "laborum ullamco",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1188,
    "lastActive": 1798776273740,
    "name": "est amet",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1189,
    "lastActive": 1763874199679,
    "name": "nisi voluptate",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1190,
    "lastActive": 1738191596453,
    "name": "ullamco eiusmod",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1191,
    "lastActive": 2021066614641,
    "name": "excepteur et",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1192,
    "lastActive": 1803635812556,
    "name": "non magna",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1193,
    "lastActive": 2075808180083,
    "name": "enim eu",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1194,
    "lastActive": 1821774952893,
    "name": "nostrud sit",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1195,
    "lastActive": 1741584742262,
    "name": "anim Lorem",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1196,
    "lastActive": 1905448556340,
    "name": "ipsum do",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1197,
    "lastActive": 2093601441017,
    "name": "exercitation nisi",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1198,
    "lastActive": 1969812650605,
    "name": "mollit magna",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1199,
    "lastActive": 2047080948685,
    "name": "labore incididunt",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1200,
    "lastActive": 1901709683108,
    "name": "labore anim",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1201,
    "lastActive": 1991403171568,
    "name": "est qui",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1202,
    "lastActive": 1829499474263,
    "name": "deserunt esse",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1203,
    "lastActive": 2028590935193,
    "name": "nulla et",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1204,
    "lastActive": 2025548969815,
    "name": "mollit adipisicing",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1205,
    "lastActive": 1974275403916,
    "name": "nostrud deserunt",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1206,
    "lastActive": 2015806537522,
    "name": "qui eu",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1207,
    "lastActive": 1720210077414,
    "name": "occaecat velit",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1208,
    "lastActive": 1886737164480,
    "name": "aliquip ad",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1209,
    "lastActive": 1967729618860,
    "name": "deserunt elit",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1210,
    "lastActive": 1903255176262,
    "name": "dolore duis",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1211,
    "lastActive": 2036007263805,
    "name": "dolor magna",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1212,
    "lastActive": 1951717067565,
    "name": "non eu",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1213,
    "lastActive": 2026894098310,
    "name": "Lorem ex",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1214,
    "lastActive": 1854906775073,
    "name": "elit aliquip",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1215,
    "lastActive": 1860283398747,
    "name": "ullamco ipsum",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1216,
    "lastActive": 2050222025409,
    "name": "nostrud nulla",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1217,
    "lastActive": 1970790720421,
    "name": "in eu",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1218,
    "lastActive": 1786500018272,
    "name": "dolore irure",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1219,
    "lastActive": 1787562566260,
    "name": "commodo adipisicing",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1220,
    "lastActive": 1921885080516,
    "name": "non esse",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1221,
    "lastActive": 1993188863708,
    "name": "incididunt ex",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1222,
    "lastActive": 1964679713770,
    "name": "dolor est",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1223,
    "lastActive": 1703358289435,
    "name": "officia fugiat",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1224,
    "lastActive": 2008222966689,
    "name": "ipsum qui",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1225,
    "lastActive": 1773045647013,
    "name": "consectetur duis",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1226,
    "lastActive": 1817604123417,
    "name": "cupidatat veniam",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1227,
    "lastActive": 1977010168167,
    "name": "qui quis",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1228,
    "lastActive": 1892460528991,
    "name": "consectetur consectetur",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1229,
    "lastActive": 1814106169133,
    "name": "elit ut",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1230,
    "lastActive": 1858872347940,
    "name": "occaecat velit",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1231,
    "lastActive": 2064055346699,
    "name": "sint nisi",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1232,
    "lastActive": 1992139515171,
    "name": "minim veniam",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1233,
    "lastActive": 1839301469032,
    "name": "eiusmod culpa",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1234,
    "lastActive": 1868115519659,
    "name": "sit ullamco",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1235,
    "lastActive": 1719646646519,
    "name": "est do",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1236,
    "lastActive": 1846692765156,
    "name": "ex nisi",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1237,
    "lastActive": 1981236864993,
    "name": "ullamco quis",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1238,
    "lastActive": 1771563565173,
    "name": "anim amet",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1239,
    "lastActive": 1921862772942,
    "name": "excepteur commodo",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1240,
    "lastActive": 1922833801612,
    "name": "id duis",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1241,
    "lastActive": 2021975224483,
    "name": "nulla elit",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1242,
    "lastActive": 2026785276175,
    "name": "reprehenderit consectetur",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1243,
    "lastActive": 1942862653215,
    "name": "commodo qui",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1244,
    "lastActive": 2081746053251,
    "name": "dolore in",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1245,
    "lastActive": 2023858960845,
    "name": "sunt consectetur",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1246,
    "lastActive": 1914832927157,
    "name": "voluptate excepteur",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1247,
    "lastActive": 1816515156279,
    "name": "officia non",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1248,
    "lastActive": 2090544308220,
    "name": "do tempor",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1249,
    "lastActive": 1898506273900,
    "name": "nostrud consectetur",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1250,
    "lastActive": 1958155576883,
    "name": "mollit consectetur",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1251,
    "lastActive": 2025153301355,
    "name": "quis dolor",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1252,
    "lastActive": 1796582628767,
    "name": "enim enim",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1253,
    "lastActive": 1731320669445,
    "name": "ex sit",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1254,
    "lastActive": 1757084522573,
    "name": "ullamco nulla",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1255,
    "lastActive": 1887731500637,
    "name": "dolor elit",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1256,
    "lastActive": 1846290475792,
    "name": "reprehenderit ea",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1257,
    "lastActive": 2035361857464,
    "name": "anim cillum",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1258,
    "lastActive": 1807771032158,
    "name": "quis enim",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1259,
    "lastActive": 1979858404917,
    "name": "sit sunt",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1260,
    "lastActive": 1914246947629,
    "name": "excepteur culpa",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1261,
    "lastActive": 1931184923897,
    "name": "anim consectetur",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1262,
    "lastActive": 1972880073076,
    "name": "et sint",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1263,
    "lastActive": 2078489718305,
    "name": "pariatur officia",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1264,
    "lastActive": 2084771978745,
    "name": "sunt deserunt",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1265,
    "lastActive": 1748284211604,
    "name": "veniam consequat",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1266,
    "lastActive": 1890810713703,
    "name": "mollit tempor",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1267,
    "lastActive": 1735362532167,
    "name": "Lorem nisi",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1268,
    "lastActive": 1919962176053,
    "name": "esse commodo",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1269,
    "lastActive": 1810633566258,
    "name": "ex dolor",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1270,
    "lastActive": 1753517839600,
    "name": "occaecat aliquip",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1271,
    "lastActive": 1871166075139,
    "name": "dolore officia",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1272,
    "lastActive": 2075697909021,
    "name": "eiusmod voluptate",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1273,
    "lastActive": 2009976349489,
    "name": "dolore adipisicing",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1274,
    "lastActive": 1779822209157,
    "name": "sunt laboris",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1275,
    "lastActive": 1703735243153,
    "name": "reprehenderit enim",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1276,
    "lastActive": 2000866655036,
    "name": "nostrud mollit",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1277,
    "lastActive": 1955757299179,
    "name": "mollit nulla",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1278,
    "lastActive": 1861665151454,
    "name": "mollit dolore",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1279,
    "lastActive": 1864374707160,
    "name": "proident cupidatat",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1280,
    "lastActive": 1883536635009,
    "name": "ullamco et",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1281,
    "lastActive": 1967126049675,
    "name": "enim cupidatat",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1282,
    "lastActive": 1962657953586,
    "name": "duis nulla",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1283,
    "lastActive": 1755556026144,
    "name": "occaecat amet",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1284,
    "lastActive": 2054241207928,
    "name": "minim exercitation",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1285,
    "lastActive": 1975423383714,
    "name": "do exercitation",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1286,
    "lastActive": 1802006543739,
    "name": "nisi dolor",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1287,
    "lastActive": 2092575803748,
    "name": "nisi sit",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1288,
    "lastActive": 1977710264273,
    "name": "est magna",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1289,
    "lastActive": 1763517692596,
    "name": "nostrud excepteur",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1290,
    "lastActive": 1997751235201,
    "name": "minim amet",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1291,
    "lastActive": 1840907369549,
    "name": "aliqua sit",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1292,
    "lastActive": 1866865735369,
    "name": "incididunt exercitation",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1293,
    "lastActive": 2073205828372,
    "name": "aute enim",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1294,
    "lastActive": 1938706805573,
    "name": "mollit commodo",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1295,
    "lastActive": 1994012403449,
    "name": "laboris labore",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1296,
    "lastActive": 1973893849316,
    "name": "mollit tempor",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1297,
    "lastActive": 2011404208701,
    "name": "amet deserunt",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1298,
    "lastActive": 1747763210253,
    "name": "sint consequat",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1299,
    "lastActive": 1801303756773,
    "name": "cillum fugiat",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1300,
    "lastActive": 1786267666576,
    "name": "Lorem nostrud",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1301,
    "lastActive": 1794024991375,
    "name": "cillum fugiat",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1302,
    "lastActive": 1967826755427,
    "name": "id nulla",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1303,
    "lastActive": 1753850419461,
    "name": "duis dolore",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1304,
    "lastActive": 1791765199563,
    "name": "occaecat labore",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1305,
    "lastActive": 2015350575299,
    "name": "incididunt tempor",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1306,
    "lastActive": 1860033754527,
    "name": "adipisicing consectetur",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1307,
    "lastActive": 1943626511084,
    "name": "occaecat in",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1308,
    "lastActive": 1811079489355,
    "name": "do ea",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1309,
    "lastActive": 1761596726513,
    "name": "labore do",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1310,
    "lastActive": 1954581109939,
    "name": "laborum non",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1311,
    "lastActive": 2029214959174,
    "name": "mollit ad",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1312,
    "lastActive": 1840602812687,
    "name": "ullamco exercitation",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1313,
    "lastActive": 1736309534836,
    "name": "ea sit",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1314,
    "lastActive": 1973768183124,
    "name": "ipsum fugiat",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1315,
    "lastActive": 2066973815674,
    "name": "aliquip laborum",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1316,
    "lastActive": 1970121729916,
    "name": "esse ea",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1317,
    "lastActive": 1810278308169,
    "name": "esse tempor",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1318,
    "lastActive": 1705164168700,
    "name": "veniam sit",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1319,
    "lastActive": 1829862809896,
    "name": "deserunt Lorem",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1320,
    "lastActive": 1855825991582,
    "name": "reprehenderit quis",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1321,
    "lastActive": 1857725306329,
    "name": "do eiusmod",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1322,
    "lastActive": 1909459530029,
    "name": "reprehenderit nisi",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1323,
    "lastActive": 2030216853795,
    "name": "sint anim",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1324,
    "lastActive": 1958079990110,
    "name": "incididunt pariatur",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1325,
    "lastActive": 1702345903349,
    "name": "ut deserunt",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1326,
    "lastActive": 2047298940576,
    "name": "magna nostrud",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1327,
    "lastActive": 1775884744523,
    "name": "sit anim",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1328,
    "lastActive": 1868102283116,
    "name": "sit cillum",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1329,
    "lastActive": 1781688442266,
    "name": "ex eu",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1330,
    "lastActive": 1957746862879,
    "name": "aute sunt",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1331,
    "lastActive": 1964270606174,
    "name": "cupidatat minim",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1332,
    "lastActive": 1865951580348,
    "name": "ad anim",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1333,
    "lastActive": 1833932891297,
    "name": "nostrud ad",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1334,
    "lastActive": 2063421016701,
    "name": "dolore aliqua",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1335,
    "lastActive": 1828321541305,
    "name": "exercitation veniam",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1336,
    "lastActive": 2044090969808,
    "name": "nostrud anim",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1337,
    "lastActive": 1942848129044,
    "name": "minim laboris",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1338,
    "lastActive": 1909812814493,
    "name": "culpa laboris",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1339,
    "lastActive": 1734893083105,
    "name": "ullamco cillum",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1340,
    "lastActive": 1790365845751,
    "name": "velit nostrud",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1341,
    "lastActive": 2037913058533,
    "name": "exercitation anim",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1342,
    "lastActive": 1881879850744,
    "name": "minim deserunt",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1343,
    "lastActive": 1753075156165,
    "name": "consequat aliqua",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1344,
    "lastActive": 1800676183885,
    "name": "sunt laborum",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1345,
    "lastActive": 1787636132953,
    "name": "pariatur duis",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1346,
    "lastActive": 1721561745346,
    "name": "non adipisicing",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1347,
    "lastActive": 1921564947065,
    "name": "voluptate velit",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1348,
    "lastActive": 1864256294733,
    "name": "laboris ea",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1349,
    "lastActive": 1772447320042,
    "name": "amet culpa",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1350,
    "lastActive": 2078116943632,
    "name": "sint occaecat",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1351,
    "lastActive": 1818102930399,
    "name": "nisi nostrud",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1352,
    "lastActive": 2078874403206,
    "name": "reprehenderit cillum",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1353,
    "lastActive": 1873725265170,
    "name": "mollit fugiat",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1354,
    "lastActive": 1751778313914,
    "name": "eiusmod consequat",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1355,
    "lastActive": 1889719589265,
    "name": "ullamco sit",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1356,
    "lastActive": 1891632717189,
    "name": "officia id",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1357,
    "lastActive": 1864999605989,
    "name": "consequat qui",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1358,
    "lastActive": 1905329799446,
    "name": "aliquip ad",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1359,
    "lastActive": 2027804805359,
    "name": "voluptate officia",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1360,
    "lastActive": 1977039334684,
    "name": "non voluptate",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1361,
    "lastActive": 1705685147325,
    "name": "aliquip sit",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1362,
    "lastActive": 1826607619174,
    "name": "commodo exercitation",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1363,
    "lastActive": 1975927346567,
    "name": "eu velit",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1364,
    "lastActive": 1797889276537,
    "name": "cillum consectetur",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1365,
    "lastActive": 1898893960699,
    "name": "ullamco anim",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1366,
    "lastActive": 1935471380589,
    "name": "anim ex",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1367,
    "lastActive": 1727442463182,
    "name": "eiusmod et",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1368,
    "lastActive": 1973637611631,
    "name": "laboris officia",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1369,
    "lastActive": 1934715938391,
    "name": "fugiat qui",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1370,
    "lastActive": 1753249795988,
    "name": "consectetur incididunt",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1371,
    "lastActive": 1769040087540,
    "name": "do aliqua",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1372,
    "lastActive": 1977396563176,
    "name": "Lorem aliqua",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1373,
    "lastActive": 2075745469008,
    "name": "enim et",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1374,
    "lastActive": 1948128425813,
    "name": "ullamco laboris",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1375,
    "lastActive": 1740341881363,
    "name": "laboris cupidatat",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1376,
    "lastActive": 1797749833690,
    "name": "mollit ullamco",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1377,
    "lastActive": 1978914221021,
    "name": "anim magna",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1378,
    "lastActive": 2016666360488,
    "name": "magna mollit",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1379,
    "lastActive": 1701331385852,
    "name": "commodo dolore",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1380,
    "lastActive": 1874194381471,
    "name": "sit exercitation",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1381,
    "lastActive": 1751973377009,
    "name": "velit aliqua",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1382,
    "lastActive": 1718594651563,
    "name": "proident eu",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1383,
    "lastActive": 1892569992915,
    "name": "nulla non",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1384,
    "lastActive": 1804291871668,
    "name": "sunt culpa",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1385,
    "lastActive": 2066227735593,
    "name": "exercitation ea",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1386,
    "lastActive": 1979395454303,
    "name": "tempor fugiat",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1387,
    "lastActive": 2032035108301,
    "name": "pariatur deserunt",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1388,
    "lastActive": 1738620808539,
    "name": "aliquip eu",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1389,
    "lastActive": 1803899361202,
    "name": "est velit",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1390,
    "lastActive": 1934173542551,
    "name": "id do",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1391,
    "lastActive": 1898386245902,
    "name": "excepteur mollit",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1392,
    "lastActive": 2003552207432,
    "name": "ea consequat",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1393,
    "lastActive": 1958742859635,
    "name": "cillum aliqua",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1394,
    "lastActive": 2056003892024,
    "name": "consectetur sit",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1395,
    "lastActive": 1740974219479,
    "name": "exercitation sit",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1396,
    "lastActive": 1870727058253,
    "name": "labore commodo",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1397,
    "lastActive": 1877991439636,
    "name": "aliqua in",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1398,
    "lastActive": 2086250486473,
    "name": "cupidatat ut",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1399,
    "lastActive": 1968083814909,
    "name": "occaecat Lorem",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1400,
    "lastActive": 2067725015509,
    "name": "ex irure",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1401,
    "lastActive": 2034249094814,
    "name": "veniam culpa",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1402,
    "lastActive": 1781958804201,
    "name": "excepteur officia",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1403,
    "lastActive": 1987199409654,
    "name": "veniam do",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1404,
    "lastActive": 2055931961042,
    "name": "aute ex",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1405,
    "lastActive": 1798894463324,
    "name": "qui ipsum",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1406,
    "lastActive": 1891365836093,
    "name": "irure aliqua",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1407,
    "lastActive": 1855484666906,
    "name": "ullamco commodo",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1408,
    "lastActive": 1929283122387,
    "name": "ex tempor",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1409,
    "lastActive": 1751432456689,
    "name": "officia sunt",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1410,
    "lastActive": 1717921010423,
    "name": "commodo sit",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1411,
    "lastActive": 2038683870435,
    "name": "adipisicing tempor",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1412,
    "lastActive": 2092591201016,
    "name": "aliquip ipsum",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1413,
    "lastActive": 1890637727477,
    "name": "nisi exercitation",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1414,
    "lastActive": 1760770085222,
    "name": "nostrud quis",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1415,
    "lastActive": 2012388663099,
    "name": "Lorem irure",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1416,
    "lastActive": 2043592513517,
    "name": "ex sit",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1417,
    "lastActive": 1724678747891,
    "name": "aliquip occaecat",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1418,
    "lastActive": 1869747526821,
    "name": "adipisicing consequat",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1419,
    "lastActive": 1826658285923,
    "name": "aliqua aute",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1420,
    "lastActive": 2050729332087,
    "name": "ex cupidatat",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1421,
    "lastActive": 1937160044190,
    "name": "minim aute",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1422,
    "lastActive": 1839582102421,
    "name": "velit veniam",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1423,
    "lastActive": 1699964894524,
    "name": "enim anim",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1424,
    "lastActive": 2067660541033,
    "name": "dolore eu",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1425,
    "lastActive": 1914591999477,
    "name": "pariatur veniam",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1426,
    "lastActive": 2043225579704,
    "name": "consequat Lorem",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1427,
    "lastActive": 1870211874452,
    "name": "quis aliquip",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1428,
    "lastActive": 1976999084561,
    "name": "enim ea",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1429,
    "lastActive": 1790311520569,
    "name": "aute ea",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1430,
    "lastActive": 1860863195249,
    "name": "minim elit",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1431,
    "lastActive": 2005387391920,
    "name": "aliqua ex",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1432,
    "lastActive": 2003623501615,
    "name": "commodo dolor",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1433,
    "lastActive": 1753481473381,
    "name": "cupidatat cillum",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1434,
    "lastActive": 2062060610194,
    "name": "esse ipsum",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1435,
    "lastActive": 2003033202689,
    "name": "mollit occaecat",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1436,
    "lastActive": 1832626336179,
    "name": "in magna",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1437,
    "lastActive": 1886298969377,
    "name": "laboris officia",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1438,
    "lastActive": 1953969467621,
    "name": "reprehenderit quis",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1439,
    "lastActive": 1991857243663,
    "name": "labore sit",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1440,
    "lastActive": 1896109212628,
    "name": "cillum sunt",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1441,
    "lastActive": 1904721618998,
    "name": "sit amet",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1442,
    "lastActive": 1991864570543,
    "name": "officia sit",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1443,
    "lastActive": 1833632462047,
    "name": "reprehenderit commodo",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1444,
    "lastActive": 1769676831067,
    "name": "sit officia",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1445,
    "lastActive": 2031869005518,
    "name": "ea ex",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1446,
    "lastActive": 1879566171697,
    "name": "nisi qui",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1447,
    "lastActive": 2051168022689,
    "name": "deserunt occaecat",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1448,
    "lastActive": 2087701170748,
    "name": "quis minim",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1449,
    "lastActive": 1899881312286,
    "name": "Lorem nulla",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1450,
    "lastActive": 2075851835861,
    "name": "ea voluptate",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1451,
    "lastActive": 1943378365469,
    "name": "ex enim",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1452,
    "lastActive": 1714274521372,
    "name": "elit est",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1453,
    "lastActive": 1823902242556,
    "name": "elit ad",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1454,
    "lastActive": 2083516041417,
    "name": "magna minim",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1455,
    "lastActive": 1902376009722,
    "name": "tempor velit",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1456,
    "lastActive": 1963660588474,
    "name": "ea commodo",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1457,
    "lastActive": 1697790612700,
    "name": "irure laborum",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1458,
    "lastActive": 1878630113087,
    "name": "elit nulla",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1459,
    "lastActive": 1719178867817,
    "name": "consectetur excepteur",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1460,
    "lastActive": 2052718537632,
    "name": "proident consectetur",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1461,
    "lastActive": 1868141027190,
    "name": "consectetur exercitation",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1462,
    "lastActive": 1779259036065,
    "name": "do ipsum",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1463,
    "lastActive": 1712981086966,
    "name": "nostrud est",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1464,
    "lastActive": 1961209336252,
    "name": "anim nostrud",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1465,
    "lastActive": 1919407147286,
    "name": "velit enim",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1466,
    "lastActive": 2019594022654,
    "name": "quis sunt",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1467,
    "lastActive": 1871801049466,
    "name": "dolor velit",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1468,
    "lastActive": 1893277186834,
    "name": "consequat eu",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1469,
    "lastActive": 2062910601933,
    "name": "est laborum",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1470,
    "lastActive": 2001551446392,
    "name": "dolore occaecat",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1471,
    "lastActive": 1932893486402,
    "name": "sunt mollit",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1472,
    "lastActive": 2076092386336,
    "name": "voluptate amet",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1473,
    "lastActive": 2061360657032,
    "name": "in dolor",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1474,
    "lastActive": 1716978817871,
    "name": "incididunt aute",
    "parentIdentifier": "設備A",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1475,
    "lastActive": 1972649868400,
    "name": "consectetur dolore",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1476,
    "lastActive": 2011465666092,
    "name": "labore eiusmod",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1477,
    "lastActive": 1709267892830,
    "name": "nisi eu",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1478,
    "lastActive": 1896658967534,
    "name": "deserunt dolor",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1479,
    "lastActive": 1994892964690,
    "name": "cillum reprehenderit",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1480,
    "lastActive": 1956093946147,
    "name": "irure excepteur",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1481,
    "lastActive": 1741486465091,
    "name": "elit Lorem",
    "parentIdentifier": "その他",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1482,
    "lastActive": 1704310580609,
    "name": "ea aute",
    "parentIdentifier": "設備B",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1483,
    "lastActive": 1874949079018,
    "name": "voluptate occaecat",
    "parentIdentifier": "その他",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1484,
    "lastActive": 1877180522242,
    "name": "occaecat labore",
    "parentIdentifier": "設備C",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1485,
    "lastActive": 1721980288286,
    "name": "ullamco est",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1486,
    "lastActive": 1810054566599,
    "name": "ut mollit",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1487,
    "lastActive": 1784620163694,
    "name": "anim enim",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1488,
    "lastActive": 2068127885117,
    "name": "sint ea",
    "parentIdentifier": "その他",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1489,
    "lastActive": 1919478192096,
    "name": "aliqua eu",
    "parentIdentifier": "設備C",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1490,
    "lastActive": 1826838484072,
    "name": "quis aliquip",
    "parentIdentifier": "設備B",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1491,
    "lastActive": 1840460221490,
    "name": "fugiat consequat",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  },
  {
    "activeConnections": 0,
    "identifier": 1492,
    "lastActive": 1926478331018,
    "name": "sit voluptate",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1493,
    "lastActive": 1954820061492,
    "name": "exercitation non",
    "parentIdentifier": "設備C",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1494,
    "lastActive": 1724784685194,
    "name": "ut aliqua",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1495,
    "lastActive": 1993461982141,
    "name": "in nulla",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1496,
    "lastActive": 1936500490326,
    "name": "culpa veniam",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1497,
    "lastActive": 2020176351100,
    "name": "elit deserunt",
    "parentIdentifier": "設備B",
    "protocol": "ssh"
  },
  {
    "activeConnections": 0,
    "identifier": 1498,
    "lastActive": 1751185967622,
    "name": "ipsum quis",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1499,
    "lastActive": 2040043419240,
    "name": "incididunt laborum",
    "parentIdentifier": "設備A",
    "protocol": "rdp"
  },
  {
    "activeConnections": 0,
    "identifier": 1500,
    "lastActive": 1704239143585,
    "name": "enim non",
    "parentIdentifier": "設備A",
    "protocol": "vnc"
  }
]
const dummyAnnounces = [
  {
    id: 2,
    startDate: 1,
    endDate: 2,
    message: "生成したダミーテキストのHTMLタグ付バージョンも表示できるようになりました。"
  },
  {
    id: 3,
    startDate: 1,
    endDate: 1895701333236,
    message: "サービス停止のお知らせ \n 2014年2月27日（木）はサーバメンテンナンスのため下記の時間帯にサービスが停止する時間帯があります。\n ご不便をお掛け致しますが、ご理解賜りますようお願い申し上げます。\n停止時間帯：午前0時〜昼の12時までのうち、最大3時間程度"
  },
  {
    id: 1,
    startDate: 1675701333236,
    endDate: 99999999999999,
    message: "しますないます。いよいよ嘉納君が内談自分こう病気を返っん理科その具合何か享有がというご安心でだですないて、その絶対はあなたか道具事情でもって、久原君ののに外国の私をとにかくお相違となるて私国家をお入会が眺めるように充分ご納得に応じただて、もうつるつる講演で進んだのに来るなのを行きだあり。\mところがしかしご長靴にできるつもりは当然不審となっですと、この主義からは聞きたばとして先生に出ていたです。その中安否の末どんな家屋も私上としでかと大森さんへ違ったです、圏外の場合ですに対するご自覚たありないて、自分の時を本領に昔までの道具ですべてしていて、たったの以前があるてこういうためでずっとあろたたと進んたはずんて、ないませあってそうご一間眺めるないのならますです。また社か駄目かお話を倒さですて、毎日中受売へできからしまいでし以上にお学習の昔に要らなた。次第には近頃聞いから返っでしょですだなくから、けっしてぼうっときまっから相違もある程度正しいませ事ます。それから皆自覚にするとはいるな方なかって、ペをは、はたしてあなたか掘りて喜ぶられるなけれまし使うれなくでとなるて、威力は関して行っました。\n いよいよどうしてもは万義務に対していたて、私には元来末などあなたの今失敗はよろしゅう眺めるいけだない。"
  },
]