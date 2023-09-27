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

  getList: (resource: any, params: any) => {
    const { q, protocol } = params.filter
    const url = `${guacUrl}/api/session/data/postgresql/connectionGroups/ROOT/tree`;
    return httpClient(url).then(({ headers, json }: any) => {
      let connections = json.childConnections
      if (q) connections = connections.filter((v: any) => v.name.includes(String(q)))
      if (protocol) connections = connections.filter((v: any) => v.protocol === protocol)
      return {
        data: connections.map((resource: any) => ({ ...resource, id: resource.identifier })),
        total: connections.length
      }
    })
  },

}

export const HistoryProvider = {
  ...dataProvider,

  getList: (resource: any, params: any) => {
    const { page, perPage } = params.pagination;
    const { q, duration } = params.filter
    const url = `${guacUrl}/api/session/data/postgresql/history/connections`;
    return httpClient(url).then(({ headers, json }: any) => {
      let history = json
      if (q) history = history.filter((v: any) => v.username.includes(String(q)))
      if (duration) history = history.filter((v: any) => v.endDate - v.startDate >= duration)
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
    return httpClient(url).then(({ headers, json }: any) => {
      let work = [
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
      }
      const length = work.length
      if (page && perPage) work = work.slice((page - 1) * perPage, page * perPage)
      return {
        data: work.map((resource: any) => ({ ...resource, id: resource.name })),
        total: length
      }
    })
  },
}

export const AnnounceProvider = {
  ...dataProvider,

  getList: (resource: any, params: any) => {
    const url = `${guacUrl}/api/session/data/postgresql/history/connections`;
    return httpClient(url).then(({ headers, json }: any) => {
      let announce = [
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
      const now = new Date
      function compareDate(a: any, b: any) {
        return a.startDate - b.startDate;
      }
      announce=[]
      announce = announce.filter((v: any) => (now.getTime() > v.startDate && now.getTime() < v.endDate))
      announce = announce.sort(compareDate)
      const length = announce.length
      return {
        data: announce.map((resource: any) => ({ ...resource, id: resource.id })),
        total: length
      }
    })
  },

}