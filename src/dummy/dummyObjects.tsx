export const dummyWorks: Object = {
  "1": {
      "name": "テスト",
      "identifier": "1",
      "idmIdentifier": "K23YG",
      "attributes": {
          "test": "test"
      },
      "periods": [
          {
              "startTime": "09:00:00",
              "endTime": "18:00:00",
              "validFrom": "2023-09-01",
              "validUntil": "2025-08-31"
          }
      ],
      "connections": [],
      "users": [],
      "isWorker": true,
      "isAdmin": true
  },
  "23": {
      "name": "linux-ssh検証",
      "identifier": "23",
      "idmIdentifier": "082A0",
      "attributes": {},
      "periods": [
          {
              "startTime": "06:00:00",
              "endTime": "20:00:00",
              "validFrom": "2023-11-06",
              "validUntil": "2024-11-05"
          }
      ],
      "connections": [
          {
              "identifier": "8",
              "hostname": "ROOT",
              "remark": "ああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ",
              "protocol": "ssh",
              "lastActive": 1699345006389
          },
          {
              "identifier": "7",
              "hostname": "TEST",
              "remark": "テスト",
              "protocol": "vnc",
              "lastActive": 1697705208868
          },
          {
              "identifier": "1",
              "hostname": "ROOT2",
              "remark": "linux",
              "protocol": "ssh",
              "lastActive": 1699345025027
          },
          {
              "identifier": "4",
              "hostname": "ROOT",
              "remark": "windows",
              "protocol": "rdp",
              "lastActive": 1698295670284
          },
          {
              "identifier": "2",
              "hostname": "ROOT",
              "remark": "aristaEOS",
              "protocol": "ssh",
              "lastActive": 1699344994760
          },
          {
              "identifier": "3",
              "hostname": "ROOT",
              "remark": "chrome",
              "protocol": "vnc",
              "lastActive": 1698295790016
          },
          {
              "identifier": "20",
              "hostname": "ROOT",
              "remark": "linux-ssh",
              "protocol": "ssh",
              "lastActive": 1699344982609
          }
      ],
      "users": [],
      "isWorker": true,
      "isAdmin": true
  },
  "13": {
      "name": "テスト1",
      "identifier": "13",
      "idmIdentifier": "ABCDE",
      "attributes": {},
      "periods": [],
      "connections": [],
      "users": [],
      "isWorker": false,
      "isAdmin": true
  },
}

export const dummyAnnounces: any = {
  "1" : {
    identifier: "1",
    startDate: 1600000000000,
    endDate: 200000000000000,
    message: "てすと\nテスト"
  }
}

export const testHistory: any = [
  {
    "startDate": 1689750628857,
    "endDate": 1689750637937,
    "remoteHost": "10.0.1.33",
    "username": "guacadmin",
    "active": false,
    "identifier": "1",
    "uuid": "8063df49-c55f-347b-802d-0c1168c0c119",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "1",
    "sharingProfileIdentifier": null,
    "workId": "23",
    "sharingProfileName": null
  },
  {
    "startDate": 1697442312855,
    "endDate": 1697442327957,
    "remoteHost": "10.0.1.38",
    "username": "admin",
    "active": false,
    "identifier": "86",
    "uuid": "f4fe7bcf-81aa-3763-947c-bb9748fb32af",
    "attributes": {},
    "logs": {
      "d4bb26f6-7841-32e5-827a-f104adfaf1c4": {
        "type": "SERVER_LOG",
        "description": {
          "key": "RECORDING_STORAGE.INFO_SERVER_LOG",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "hostname": "192.168.202.12",
    "protocol": "ssh",
    "sharingProfileIdentifier": null,
    "workId": "23",
    "sharingProfileName": null
  },
  {
    "startDate": 1689750644981,
    "endDate": 1689750648074,
    "remoteHost": "10.0.1.33",
    "username": "guacadmin",
    "active": false,
    "identifier": "2",
    "uuid": "9d4f66ae-b0e6-3d87-a074-e8c04320c961",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "1",
    "hostname": "192.168.202.13",
    "protocol": "vnc",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1689750724128,
    "endDate": 1689751058011,
    "remoteHost": "10.0.1.33",
    "username": "guacadmin",
    "active": false,
    "identifier": "3",
    "uuid": "52871880-4953-3c46-9b3a-a2ed9b9cbc89",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1689756817014,
    "endDate": 1689756838424,
    "remoteHost": "10.0.1.32",
    "username": "guacadmin",
    "active": false,
    "identifier": "4",
    "uuid": "3c1501f5-df64-31df-a140-a7b68cb7aad3",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1697445336313,
    "endDate": 1697445344121,
    "remoteHost": "10.0.1.24",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "91",
    "uuid": "3cc630de-61c7-30c6-a3b9-32e9c1ab02b9",
    "attributes": {},
    "logs": {
      "bef6e5e1-bb5b-383c-8e87-dfac125cfff9": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "5a1fcb6e-75ac-3453-8177-6817ee167a2c": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "fa28eb05-060b-3e8a-bf46-f1d6cbaabd1d": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "23",
    "sharingProfileName": null
  },
  {
    "startDate": 1690250549443,
    "endDate": 1690250555926,
    "remoteHost": "10.0.1.33",
    "username": "guacadmin",
    "active": false,
    "identifier": "5",
    "uuid": "a7271d78-ddee-3437-8c22-afb646dc3caf",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1693289773916,
    "endDate": 1693289774463,
    "remoteHost": "10.0.1.6",
    "username": "nigauri@procube.jp",
    "active": false,
    "identifier": "64",
    "uuid": "130fa5df-0ada-3460-b747-a1fe9256952f",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "3",
    "connectionName": "192.168.0.5",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1690250560440,
    "endDate": 1690250566678,
    "remoteHost": "10.0.1.33",
    "username": "guacadmin",
    "active": false,
    "identifier": "6",
    "uuid": "bf9df7ce-b026-3432-9961-8833a681d34b",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1697442346123,
    "endDate": 1697504046733,
    "remoteHost": "10.0.1.38",
    "username": "admin",
    "active": false,
    "identifier": "88",
    "uuid": "f4355caa-1070-3071-aed2-aa8321e9b7fc",
    "attributes": {},
    "logs": {
      "64701061-69c5-34da-9cac-f81779cf382c": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "d2ad0d05-f7bc-35cc-bf11-3c41bb8cb49a": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "e4937264-5ab8-309e-a84d-4480551564a2": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1690251307668,
    "endDate": 1690251329349,
    "remoteHost": "10.0.1.5",
    "username": "guacadmin",
    "active": false,
    "identifier": "7",
    "uuid": "4769d8ad-c38b-3c5e-94c8-e99a865f20df",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1693289833853,
    "endDate": 1693301990520,
    "remoteHost": "10.0.1.6",
    "username": "nigauri@procube.jp",
    "active": false,
    "identifier": "65",
    "uuid": "cf97bce1-d5f1-322a-9f02-dde030944c7d",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "3",
    "connectionName": "chrome",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1690251709852,
    "endDate": 1690251731411,
    "remoteHost": "10.0.1.5",
    "username": "guacadmin",
    "active": false,
    "identifier": "8",
    "uuid": "47d2a228-662f-3f84-b968-a5b12855dec8",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1690261950269,
    "endDate": 1690261971809,
    "remoteHost": "10.0.1.5",
    "username": "guacadmin",
    "active": false,
    "identifier": "9",
    "uuid": "5746e64d-aa28-33f7-95fd-423deff48efb",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1697504071233,
    "endDate": 1697504092086,
    "remoteHost": "10.0.1.38",
    "username": "admin",
    "active": false,
    "identifier": "92",
    "uuid": "d9666d3f-5d6a-335d-bf49-e052d6130967",
    "attributes": {},
    "logs": {
      "43ef7957-2d49-3d2e-b610-0b939851aedb": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "2fab75dd-3e9f-37d5-bb47-4f08d9bca78f": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "992c81e6-3643-3f7c-8806-db33562e3eba": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1690268775858,
    "endDate": 1690268796131,
    "remoteHost": "10.0.1.31",
    "username": "guacadmin",
    "active": false,
    "identifier": "10",
    "uuid": "b9deb9d5-9034-3dc4-ba25-5b1e9f825988",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1690345946986,
    "endDate": 1690346982342,
    "remoteHost": "10.0.1.29",
    "username": "guacadmin",
    "active": false,
    "identifier": "11",
    "uuid": "85d86ec5-3205-399c-b874-f3dcbc0f862b",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1697510199100,
    "endDate": 1697510207127,
    "remoteHost": "10.0.1.24",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "94",
    "uuid": "f0821e2a-51bc-3cea-bf45-9a41549fcd53",
    "attributes": {},
    "logs": {
      "76682f87-55a0-32da-af10-bfa99a5e4b14": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "072358d2-2f26-3a01-8a41-19286d5c11e3": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "1bce8794-84d5-3b39-a9e6-9f694e978030": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1697510213245,
    "endDate": 1697510217038,
    "remoteHost": "10.0.1.24",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "95",
    "uuid": "4e061e24-6d05-3315-ad35-19ff6a1a4c00",
    "attributes": {},
    "logs": {
      "d34587e6-bf3f-3218-ab7f-8ad141e546bc": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "3eb78801-4291-3a3d-92b5-8e8cd7a7ff09": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "feaddb8e-5b32-308e-af5a-7c0156eea428": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1697515569530,
    "endDate": 1697515868097,
    "remoteHost": "10.0.1.23",
    "username": "admin",
    "active": false,
    "identifier": "97",
    "uuid": "ace4b7b8-cc98-3fde-a473-ab0d7dbb0f05",
    "attributes": {},
    "logs": {
      "8aafcadf-3ef7-369d-b9a1-6dc556f87655": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "9942adb4-a33c-373b-83c0-2a3167742c5c": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "3322a6ca-5768-352a-88b2-2264bf873cb6": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1697516486915,
    "endDate": 1697516548107,
    "remoteHost": "10.0.1.23",
    "username": "admin",
    "active": false,
    "identifier": "98",
    "uuid": "c223cd71-cc8d-3aab-a12a-8e3594456a24",
    "attributes": {},
    "logs": {
      "19ca1387-68b7-3810-9c35-d559efeec6de": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "357088a6-084d-3bf8-bc6f-6adb6da737cc": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "db9e21c5-2c29-35da-b8bd-d91c8f9e35c4": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1697521611993,
    "endDate": 1697521615605,
    "remoteHost": "10.0.1.23",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "99",
    "uuid": "42263c84-520e-36f0-9bc2-2361ad67101b",
    "attributes": {},
    "logs": {
      "b366329a-6622-37c1-8c19-fe42790b1b30": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "104c72ba-a3bf-3a16-acd9-adc9fbe463a8": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "8de50d61-3bc3-3051-9a57-d641b09daf50": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1697596147612,
    "endDate": 1697596153660,
    "remoteHost": "10.0.1.23",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "105",
    "uuid": "7dd7a953-c3f4-390c-b400-4231372e8eba",
    "attributes": {},
    "logs": {
      "7c8f1d1a-d075-30f1-a297-66396cb8d946": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "aee840a8-a945-3173-b020-d633efe3c82c": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "1c1f949c-ea0f-30c4-8d14-4862863dc156": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1697595780372,
    "endDate": 1697596274381,
    "remoteHost": "10.0.1.24",
    "username": "admin",
    "active": false,
    "identifier": "103",
    "uuid": "7f9b8e6f-bd32-3999-bd29-a63bf3b1a72d",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "3",
    "connectionName": "chrome",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1697596285110,
    "endDate": 1697596303646,
    "remoteHost": "10.0.1.24",
    "username": "admin",
    "active": false,
    "identifier": "107",
    "uuid": "ff8a25da-2118-3dd8-a03f-fe1af05a6896",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "3",
    "connectionName": "chrome",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1691648034014,
    "endDate": 1691648037885,
    "remoteHost": "10.0.1.12",
    "username": "mitsuru@procube.jp",
    "active": false,
    "identifier": "19",
    "uuid": "2cf5c723-499d-35a9-83a0-4fd8b5dc5697",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1691648122664,
    "endDate": 1691648124563,
    "remoteHost": "10.0.1.12",
    "username": "mitsuru@procube.jp",
    "active": false,
    "identifier": "20",
    "uuid": "fde31346-971e-3733-a7c2-57b02de72343",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1697596305984,
    "endDate": 1697596581155,
    "remoteHost": "10.0.1.24",
    "username": "admin",
    "active": false,
    "identifier": "108",
    "uuid": "a90cd718-d954-3b5f-8d46-c7355f0290bc",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "3",
    "connectionName": "chrome",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1691648697392,
    "endDate": 1691648697655,
    "remoteHost": "10.0.1.12",
    "username": "mitsuru@procube.jp",
    "active": false,
    "identifier": "21",
    "uuid": "75b6dda2-00c9-330a-869c-f8eaac87d77a",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1691648720214,
    "endDate": 1691648720455,
    "remoteHost": "10.0.1.12",
    "username": "mitsuru@procube.jp",
    "active": false,
    "identifier": "22",
    "uuid": "7e139612-1cf0-341d-8517-af0148c22bb3",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1697596586750,
    "endDate": 1697596586858,
    "remoteHost": "10.0.1.24",
    "username": "admin",
    "active": false,
    "identifier": "109",
    "uuid": "965c2552-a09e-30a9-88d3-8b2687dc8d70",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "3",
    "connectionName": "chrome",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1691648765279,
    "endDate": 1691648765591,
    "remoteHost": "10.0.1.12",
    "username": "mitsuru@procube.jp",
    "active": false,
    "identifier": "23",
    "uuid": "2a845cf4-de12-3f8e-8639-70bc71ad0184",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1691649230022,
    "endDate": 1691649230261,
    "remoteHost": "10.0.1.12",
    "username": "mitsuru@procube.jp",
    "active": false,
    "identifier": "24",
    "uuid": "f91a88a4-65d4-3844-9a68-55ce0733f044",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1697596599420,
    "endDate": 1697596599566,
    "remoteHost": "10.0.1.24",
    "username": "admin",
    "active": false,
    "identifier": "113",
    "uuid": "c2414ffd-6adb-3661-bb3e-236b759d760b",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "3",
    "connectionName": "chrome",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1691649398927,
    "endDate": 1691649834124,
    "remoteHost": "10.0.1.12",
    "username": "mitsuru@procube.jp",
    "active": false,
    "identifier": "26",
    "uuid": "6caf3bd5-fab3-305e-8ab9-c2a654ff4e9c",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1697597170500,
    "endDate": 1697597242836,
    "remoteHost": "10.0.1.24",
    "username": "admin",
    "active": false,
    "identifier": "116",
    "uuid": "244b48f5-d986-3473-b528-a7500dd51987",
    "attributes": {},
    "logs": {
      "1191b39f-2782-39cc-816a-3f3d02545c26": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "87abbc45-93d6-3aa0-91b5-96612fa368c9": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "b8f5629d-0543-37ea-add9-fd08d4d0c638": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1691649234943,
    "endDate": 1691650062500,
    "remoteHost": "10.0.1.12",
    "username": "mitsuru@procube.jp",
    "active": false,
    "identifier": "25",
    "uuid": "185bc86d-1b81-392b-8282-be9ddf1afbbc",
    "attributes": {},
    "logs": {
      "1f0952e8-7c17-3213-80a8-a8038226109f": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "7a84cb6e-62ef-313d-b601-a570c3794105": {
        "type": "SERVER_LOG",
        "description": {
          "key": "RECORDING_STORAGE.INFO_SERVER_LOG",
          "variables": null
        }
      },
      "e769cb09-9e58-3feb-8095-bb7a2c726309": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1697606547870,
    "endDate": 1697606553124,
    "remoteHost": "10.0.1.23",
    "username": "admin",
    "active": false,
    "identifier": "118",
    "uuid": "f845d64e-834b-3457-9671-41983ad0eed0",
    "attributes": {},
    "logs": {
      "2a612b70-4dfa-3022-9242-268a3c1fa588": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "79dea10b-c42b-3358-8274-7d5a19be1640": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "6aea8e67-6132-3c0d-8e09-6ddc0267d262": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1697606942394,
    "endDate": 1697606955478,
    "remoteHost": "10.0.1.23",
    "username": "admin",
    "active": false,
    "identifier": "119",
    "uuid": "18b11912-9982-3d59-a913-1c5bcb5588c5",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "3",
    "connectionName": "chrome",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1697677017373,
    "endDate": 1697677025153,
    "remoteHost": "10.0.1.24",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "124",
    "uuid": "cd603d5d-e0a4-30c3-a45b-15e770b564c3",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "3",
    "connectionName": "chrome",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1697677754759,
    "endDate": 1697678091310,
    "remoteHost": "10.0.1.24",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "125",
    "uuid": "e2d4036a-8a8e-39dd-bf43-d5104a44afac",
    "attributes": {},
    "logs": {
      "4860e671-9275-3806-997c-604f6a472af9": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "9ad9b095-1084-3b02-a793-f1fbc9f2be0a": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "40228087-e252-3c20-93bd-182d378032a6": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1697682001821,
    "endDate": 1697682002682,
    "remoteHost": "10.0.1.24",
    "username": "admin",
    "active": false,
    "identifier": "128",
    "uuid": "6d25668d-ccf4-391f-b8c1-7bcf55b8d833",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "4",
    "connectionName": "windows",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1697693635132,
    "endDate": 1697693642165,
    "remoteHost": "10.0.1.38",
    "username": "admin",
    "active": false,
    "identifier": "130",
    "uuid": "5aa1eeea-94bc-36ed-83c8-857991f1d4f5",
    "attributes": {},
    "logs": {
      "763480ba-8f5d-37a6-bc42-7a5cc18e8aa4": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "bcb9e6f9-3370-38c7-9619-068ca59f98f7": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "feb31a36-f4a2-3b41-91d5-7e68e7fec9a7": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1697704545300,
    "endDate": 1697704553805,
    "remoteHost": "10.0.1.23",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "132",
    "uuid": "8ad8e28e-940c-3346-bfd5-d59ffc162e58",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1697704862524,
    "endDate": 1697704867701,
    "remoteHost": "10.0.1.24",
    "username": "admin",
    "active": false,
    "identifier": "133",
    "uuid": "399ee8dc-ec6d-37e0-946f-55ce478c6d6c",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "3",
    "connectionName": "chrome",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1694690004795,
    "endDate": 1694690054894,
    "remoteHost": "10.0.1.13",
    "username": "mitsuru@procube.jp",
    "active": false,
    "identifier": "79",
    "uuid": "62ad7048-6196-3627-b3c5-f24477396dd9",
    "attributes": {},
    "logs": {
      "77f0e91a-fb86-378d-9d46-e40dae9facc7": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "da45c0d4-533c-3cbf-9ea4-d6b5ec9cad19": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "fd0b7888-77a0-3f5f-ac14-7348c65ae08c": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1697704882632,
    "endDate": 1697704885567,
    "remoteHost": "10.0.1.24",
    "username": "admin",
    "active": false,
    "identifier": "134",
    "uuid": "f65579bf-9871-37a7-b2b0-7b716a6aaf69",
    "attributes": {},
    "logs": {
      "186be807-1934-35c2-849a-802b0154ac54": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "b9ca0bd4-9a05-3565-8ec3-10636d78521c": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "9f29a34e-837b-3b40-8b37-48696c1064fc": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1692334807253,
    "endDate": 1692334823842,
    "remoteHost": "10.0.1.26",
    "username": "mitsuru@procube.jp",
    "active": false,
    "identifier": "37",
    "uuid": "a71fea1c-4b77-3366-b15b-ac49888ed7ac",
    "attributes": {},
    "logs": {
      "07adff73-475d-3b1e-b93b-7a55ca5d6994": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "f17a84e3-3aca-3b78-8d4a-b95cc7565b8e": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "31d2b889-6401-390f-9f87-e90d87f3d3ca": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1697705198041,
    "endDate": 1697705204430,
    "remoteHost": "10.0.1.23",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "136",
    "uuid": "ba6862e2-321f-3193-b789-4d9d833dccb3",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "19",
    "connectionName": "テストArista1",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1692337727854,
    "endDate": 1692337734073,
    "remoteHost": "10.0.1.26",
    "username": "mitsuru@procube.jp",
    "active": false,
    "identifier": "38",
    "uuid": "25066dc3-d8dc-3cc7-884e-11425bf15b69",
    "attributes": {},
    "logs": {
      "12976765-742d-3045-8b5a-752fcaf22486": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "f895bf3e-2a47-3467-a57a-52304252fd43": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "1230f1a8-ca0d-33c6-aca3-a5a0bb10bc8a": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1692337737395,
    "endDate": 1692337742112,
    "remoteHost": "10.0.1.26",
    "username": "mitsuru@procube.jp",
    "active": false,
    "identifier": "39",
    "uuid": "51b5597e-8383-31c0-9810-09fb296d4e1f",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1697705208868,
    "endDate": 1697705208966,
    "remoteHost": "10.0.1.23",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "138",
    "uuid": "7194ab20-5687-3b2c-8e78-b90ea8c2496e",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "7",
    "connectionName": "テスト",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1692337879385,
    "endDate": 1692337883683,
    "remoteHost": "10.0.1.26",
    "username": "mitsuru@procube.jp",
    "active": false,
    "identifier": "40",
    "uuid": "c7e096e6-b8ed-3171-ac69-54061a222e00",
    "attributes": {},
    "logs": {
      "23044ada-22e1-3381-b563-b8c20f9b2efc": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "5aedbf94-d570-3557-98d9-9b9b6ad37d7f": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "882c9ba2-fbcf-3155-be38-f307a67d1752": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1697785926169,
    "endDate": 1697786732103,
    "remoteHost": "10.0.1.38",
    "username": "admin",
    "active": false,
    "identifier": "140",
    "uuid": "ed0a3ed1-7684-3b75-97f5-cd9f582409bc",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "3",
    "connectionName": "chrome",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1698212619310,
    "endDate": 1698212655080,
    "remoteHost": "10.0.1.13",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "142",
    "uuid": "f1d2b765-595c-3e22-ba47-c33f0eb42f9a",
    "attributes": {},
    "logs": {
      "39ac65f5-f074-3149-9f58-8e2c9b24e365": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "5561cf85-c503-32db-a2f2-fa813e91b6ee": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "d5ab96b6-e374-3ee2-abda-4123bec11de8": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1693203979649,
    "endDate": 1693203999693,
    "remoteHost": "10.0.1.30",
    "username": "admin",
    "active": false,
    "identifier": "62",
    "uuid": "35c462fe-6d03-3460-923b-00013333431c",
    "attributes": {},
    "logs": {
      "c1c0eb7c-2a80-3213-89b4-c14da01b4210": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "9f832559-7966-34a9-a1df-0801223aab21": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "5efa20f0-2392-3fce-8dca-bd9100f373f2": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1695342201892,
    "endDate": 1695342241386,
    "remoteHost": "10.0.1.3",
    "username": "testuser",
    "active": false,
    "identifier": "82",
    "uuid": "53c3395a-1c99-354f-ab4c-91f2b6802772",
    "attributes": {},
    "logs": {
      "436d8b2f-e04d-3f1e-be91-edc6f09522ef": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "443cb8e7-f2da-3808-8f00-7d04c3cf1431": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "38d25675-3e2b-3640-b1fc-ddfd4de486ff": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1698213746123,
    "endDate": 1698213754711,
    "remoteHost": "10.0.1.13",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "145",
    "uuid": "600197f0-19ca-34c4-a591-4f118e6623f0",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "3",
    "connectionName": "chrome",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1698213731730,
    "endDate": 1698213755235,
    "remoteHost": "10.0.1.13",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "144",
    "uuid": "225fc3a5-4e34-32f0-a0bd-fb0ec93c533e",
    "attributes": {},
    "logs": {
      "bfe0d269-ccab-331a-8feb-c692cd6ee523": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "e888e956-7cae-360b-aa2c-17dbd9d1537e": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "2bc1d6b3-cfd1-39d1-a458-e483e403d567": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1692859957026,
    "endDate": 1692861488910,
    "remoteHost": "10.0.1.30",
    "username": "nigauri@procube.jp",
    "active": false,
    "identifier": "46",
    "uuid": "938794f2-cd5f-368b-8148-bc11a9cea29c",
    "attributes": {},
    "logs": {
      "d2fb38f4-588b-3de5-bd8c-60930d613349": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "a92a3fb3-5075-3d93-ab39-3bdafec9308c": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "a50ae425-e197-3454-9215-044842787fcd": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1698295655834,
    "endDate": 1698295660298,
    "remoteHost": "10.0.1.31",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "150",
    "uuid": "eadaba8c-693f-3ca9-b68f-4cafefa6efdd",
    "attributes": {},
    "logs": {
      "bab6029e-808e-3f78-baf7-8cf4be995b42": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "77514626-c250-30e4-b190-4bd5b14507a3": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "2b85d532-54ce-3f0c-9281-165da928c72a": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1698295670284,
    "endDate": 1698295685879,
    "remoteHost": "10.0.1.31",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "152",
    "uuid": "9096eee6-dd79-3f8f-9f06-b91a1ff8d86c",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "4",
    "connectionName": "windows",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1698295662568,
    "endDate": 1698295690205,
    "remoteHost": "10.0.1.31",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "151",
    "uuid": "7ab6814d-21d6-3890-9780-09d3ade76e2d",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1698295790016,
    "endDate": 1698295799293,
    "remoteHost": "10.0.1.31",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "154",
    "uuid": "5372dffd-a843-3e26-a663-15ecf01adc86",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "3",
    "connectionName": "chrome",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1698295783031,
    "endDate": 1698295803826,
    "remoteHost": "10.0.1.31",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "153",
    "uuid": "db8a2425-7185-3efa-ad26-420e4c6a6094",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "3",
    "connectionName": "chrome",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1698733906481,
    "endDate": 1698733910970,
    "remoteHost": "10.0.1.34",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "155",
    "uuid": "ae4f90e3-0b3f-34f8-9ba7-660e0e5f6671",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1698733921438,
    "endDate": 1698733929035,
    "remoteHost": "10.0.1.34",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "157",
    "uuid": "8f30b043-884d-384f-b489-732189740581",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "19",
    "connectionName": "テストArista1",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1698733912547,
    "endDate": 1698733930102,
    "remoteHost": "10.0.1.34",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "156",
    "uuid": "6fb3e053-99e8-3863-a84b-2be0136f94a5",
    "attributes": {},
    "logs": {
      "1a3c29ef-4ac8-37b8-bcdf-1593c15660bb": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "518991cf-cfe0-3569-92de-0c759c1c00df": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "173bc3d4-cf9c-3242-aa21-3513dc7a84ab": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1692954523038,
    "endDate": 1692954566103,
    "remoteHost": "10.0.1.30",
    "username": "mitsuru@procube.jp",
    "active": false,
    "identifier": "55",
    "uuid": "a4888a37-ca54-3077-af1b-2dc93b28e79c",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1692954616275,
    "endDate": 1692954697116,
    "remoteHost": "10.0.1.30",
    "username": "mitsuru@procube.jp",
    "active": false,
    "identifier": "57",
    "uuid": "fbfefd79-01ec-3571-b174-27696b4e05ac",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1692954577771,
    "endDate": 1692954697122,
    "remoteHost": "10.0.1.30",
    "username": "mitsuru@procube.jp",
    "active": false,
    "identifier": "56",
    "uuid": "7573e188-4d7c-3d83-bdbe-041614f0f1b9",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1692954469796,
    "endDate": 1692954697125,
    "remoteHost": "10.0.1.30",
    "username": "mitsuru@procube.jp",
    "active": false,
    "identifier": "54",
    "uuid": "a1c353a1-8dc6-3c62-9f4e-f61de8fef996",
    "attributes": {},
    "logs": {
      "2035b6b8-b940-31f0-949c-49f42caf5a5f": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "5e3cbc04-c820-35d7-86a3-b66e696cd68f": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "369099d9-b9e1-3227-bfd6-c88e6df1df78": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1692954779835,
    "endDate": 1692954780573,
    "remoteHost": "10.0.1.30",
    "username": "mitsuru@procube.jp",
    "active": false,
    "identifier": "58",
    "uuid": "440197cd-d1e1-3464-b5c4-7272f72f0126",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "3",
    "connectionName": "192.168.0.5",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1692954954906,
    "endDate": 1692955007521,
    "remoteHost": "10.0.1.30",
    "username": "mitsuru@procube.jp",
    "active": false,
    "identifier": "59",
    "uuid": "31db51b3-914e-3197-8ef3-135fca3352d6",
    "attributes": {},
    "logs": {
      "3cabe65a-5a8e-3ea2-b854-99b876eac299": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "c9e8790a-dced-3043-806f-1d41e3f470fc": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "d942ab02-9a2d-312e-95e4-002b79a78369": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1693288617628,
    "endDate": 1693289665576,
    "remoteHost": "10.0.1.2",
    "username": "admin",
    "active": false,
    "identifier": "63",
    "uuid": "5eeffdd9-afb4-320f-91ef-0c082d5a7c8b",
    "attributes": {},
    "logs": {
      "41a79d25-788b-3101-a5bd-ae76d1e7626e": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "22618c07-c154-3485-9338-bd07fbea041c": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "453cdf9d-59a0-3356-9dfb-0cbcce37e0da": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1693388901518,
    "endDate": 1693388924265,
    "remoteHost": "10.0.1.33",
    "username": "admin",
    "active": false,
    "identifier": "66",
    "uuid": "95fa7ecb-370f-3d22-ab90-b2beb9a00924",
    "attributes": {},
    "logs": {
      "c7dc07c6-30b6-3ab0-ba65-04dbf4cf2d50": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "bae94414-38de-3508-ab00-5548ee7f87ff": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "4fc65ac0-d6fb-384d-b7f7-38c6645d8bfe": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1693462615328,
    "endDate": 1693462664202,
    "remoteHost": "10.0.1.174",
    "username": "admin",
    "active": false,
    "identifier": "67",
    "uuid": "1efef3b7-049e-390c-be74-effe86e1ab83",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1690764772639,
    "endDate": 1690764786286,
    "remoteHost": "10.0.1.31",
    "username": "admin",
    "active": false,
    "identifier": "12",
    "uuid": "a99e3dbc-14e6-3664-8261-2809df888090",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1690852889016,
    "endDate": 1690852905617,
    "remoteHost": "10.0.1.18",
    "username": "admin",
    "active": false,
    "identifier": "13",
    "uuid": "0c6cab5d-887b-3329-b174-fef96daac96e",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1693462669122,
    "endDate": 1693462683077,
    "remoteHost": "10.0.1.174",
    "username": "admin",
    "active": false,
    "identifier": "68",
    "uuid": "659cbd66-75dd-385c-af69-15356283bc64",
    "attributes": {},
    "logs": {
      "ca40fd58-3851-3570-850e-5da092652e4a": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "c42b8d34-2900-3a10-93ca-e04231e69c82": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "c305c0e7-92cd-375c-90ec-da31a873495b": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1690865136496,
    "endDate": 1690865139515,
    "remoteHost": "10.0.1.5",
    "username": "admin",
    "active": false,
    "identifier": "14",
    "uuid": "da7cb142-d5f5-3683-ad22-98b1a1f132b4",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1690935920127,
    "endDate": 1690935924556,
    "remoteHost": "10.0.1.3",
    "username": "admin",
    "active": false,
    "identifier": "15",
    "uuid": "5dd58b9b-3b83-30e1-800c-438128b9a567",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1693462876034,
    "endDate": 1693463274330,
    "remoteHost": "10.0.1.174",
    "username": "admin",
    "active": false,
    "identifier": "69",
    "uuid": "186fe24a-efda-3be2-969b-f122213bb856",
    "attributes": {},
    "logs": {
      "2b0292de-5791-3378-af66-96fd8a99c497": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "eb085abd-ff90-3af5-a93f-d22756fce8dc": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "b750e02d-e7d8-38f3-b124-b1fc1d20caf9": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1690968317109,
    "endDate": 1690968321789,
    "remoteHost": "10.0.1.3",
    "username": "admin",
    "active": false,
    "identifier": "16",
    "uuid": "f2081b80-0746-372e-871e-aba7663cb687",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1691049601497,
    "endDate": 1691049607178,
    "remoteHost": "10.0.1.3",
    "username": "admin",
    "active": false,
    "identifier": "17",
    "uuid": "f921ed8e-def9-3a43-b2bd-35571571df92",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1693465600027,
    "endDate": 1693465609261,
    "remoteHost": "10.0.1.174",
    "username": "admin",
    "active": false,
    "identifier": "70",
    "uuid": "e3a8d919-8c0b-389e-bff7-52525268b465",
    "attributes": {},
    "logs": {
      "e7e1883d-5fb6-3a50-ba9c-5bd2c82fc189": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "97870520-0317-3ab0-bc4a-2d4a6a6ff420": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "c7da8d8a-6c15-3c04-a15a-a7b83e8e3e85": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1691118660434,
    "endDate": 1691118665027,
    "remoteHost": "10.0.1.8",
    "username": "admin",
    "active": false,
    "identifier": "18",
    "uuid": "25ab0622-48d5-3d67-a5e0-dca21bbe87af",
    "attributes": {},
    "logs": {
      "9bfdcc9e-60e9-3d91-b0c1-42704dd43669": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "68180b97-0248-31c5-a81f-f54babb5f0ec": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "d1eaa806-6cd0-325e-8b54-27cf74322fe6": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1693465924935,
    "endDate": 1693472682176,
    "remoteHost": "10.0.1.174",
    "username": "admin",
    "active": false,
    "identifier": "71",
    "uuid": "db946cbd-5b0a-3ac2-8616-e92bfd3daaa6",
    "attributes": {},
    "logs": {
      "4307072e-d0fc-3642-94ba-aebba470216b": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "4c74b457-72d3-3dfb-9276-1237eb1ca7c4": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "a8a8ce9d-01e4-368d-8f6d-c11e7a80c352": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1693528202349,
    "endDate": 1693528223262,
    "remoteHost": "10.0.1.35",
    "username": "admin",
    "active": false,
    "identifier": "72",
    "uuid": "53e2bb04-4b7e-3662-9f0a-6ff2b7c1f030",
    "attributes": {},
    "logs": {
      "5613f852-efc4-3d96-b60d-9bca67732ac3": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "a309c4cb-61ee-3a9c-8c3e-b54d761b1860": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "bb3e6e1f-1d69-3824-9e4b-b33a43365adc": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1693528510442,
    "endDate": 1693533928046,
    "remoteHost": "10.0.1.35",
    "username": "admin",
    "active": false,
    "identifier": "73",
    "uuid": "04c43a17-eb04-38bb-a48c-8f91cdb183a4",
    "attributes": {},
    "logs": {
      "a78ebabe-468d-3def-be66-40d3b1e54b08": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "09ea79e5-ebc1-3a2f-bbe1-bad4702c72a5": {
        "type": "SERVER_LOG",
        "description": {
          "key": "RECORDING_STORAGE.INFO_SERVER_LOG",
          "variables": null
        }
      },
      "acf0a7bb-a9ee-3601-b304-946483c79f89": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1693534706645,
    "endDate": 1693536408850,
    "remoteHost": "10.0.1.35",
    "username": "admin",
    "active": false,
    "identifier": "74",
    "uuid": "f865900f-bbef-335b-94a5-7dc6b219910e",
    "attributes": {},
    "logs": {
      "58cdd83c-f237-3a23-af3d-158d5878167e": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "e8a11aec-99df-323c-8f98-2a0447d28fb2": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "6d682b8a-86a9-32bf-95cb-22ec2ca88d9a": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1691650038229,
    "endDate": 1691650665266,
    "remoteHost": "10.0.1.12",
    "username": "admin",
    "active": false,
    "identifier": "27",
    "uuid": "7ca0e391-4af9-310e-ae41-f3c7c4f4e36e",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1694086232626,
    "endDate": 1694086233401,
    "remoteHost": "10.0.1.20",
    "username": "admin",
    "active": false,
    "identifier": "75",
    "uuid": "8073de39-40c3-3baf-af80-b9900f402dd2",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "4",
    "connectionName": "windows",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1691650707965,
    "endDate": 1691650712886,
    "remoteHost": "10.0.1.12",
    "username": "admin",
    "active": false,
    "identifier": "28",
    "uuid": "f69d5b60-6d75-38ed-909e-578eb9550ff7",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1691650748309,
    "endDate": 1691650752226,
    "remoteHost": "10.0.1.12",
    "username": "admin",
    "active": false,
    "identifier": "29",
    "uuid": "aa590fcc-e12e-3fb5-b4a3-db0f86f1d701",
    "attributes": {},
    "logs": {
      "dd2be18c-35d4-326b-b295-07039931dcd7": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "32b8f82d-849d-37c2-a539-ff391bdc6a73": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "51cc1517-744e-3fdb-aed6-86d93674b4e7": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1694086310587,
    "endDate": 1694086311120,
    "remoteHost": "10.0.1.20",
    "username": "admin",
    "active": false,
    "identifier": "76",
    "uuid": "22460887-3c4f-3f3a-a0d4-a28ca35c58c8",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "4",
    "connectionName": "windows",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1691650755456,
    "endDate": 1691650763191,
    "remoteHost": "10.0.1.12",
    "username": "admin",
    "active": false,
    "identifier": "30",
    "uuid": "345c60f5-4bdd-3406-9ec8-0f5f9f51dadd",
    "attributes": {},
    "logs": {
      "f0ca2377-cc6f-38aa-b8ca-2c736eb1400a": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "fa0f554f-0631-355f-a897-a1b118654d29": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "1ff73988-e85a-3880-b5ee-9c545ed22b6d": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1691650766114,
    "endDate": 1691650768888,
    "remoteHost": "10.0.1.12",
    "username": "admin",
    "active": false,
    "identifier": "31",
    "uuid": "afba8a25-9b61-30e5-a60e-7be2dee84997",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1694507430107,
    "endDate": 1694507431037,
    "remoteHost": "10.0.1.23",
    "username": "admin",
    "active": false,
    "identifier": "77",
    "uuid": "dc5b543f-8f61-3411-aeb5-d3e3224b0ba4",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "4",
    "connectionName": "windows",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1691650790232,
    "endDate": 1691650790481,
    "remoteHost": "10.0.1.12",
    "username": "admin",
    "active": false,
    "identifier": "32",
    "uuid": "c338cfc2-34c4-3586-8d2c-7c793330c839",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1691650798657,
    "endDate": 1691650836211,
    "remoteHost": "10.0.1.12",
    "username": "admin",
    "active": false,
    "identifier": "33",
    "uuid": "972e5476-bd8f-37ec-b5fa-0cfedd4d8037",
    "attributes": {},
    "logs": {
      "e29fe16b-ada9-373c-8f32-5bf8d62e4c64": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "14fc7490-b0d7-3919-8f59-4006228e5cea": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "52543fc4-4257-382c-a1cf-7ed7632f2a65": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1694669526655,
    "endDate": 1694669557414,
    "remoteHost": "10.0.1.10",
    "username": "admin",
    "active": false,
    "identifier": "78",
    "uuid": "2def5369-ead1-32ee-9356-7bf1e0443d84",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "3",
    "connectionName": "chrome",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1691650895838,
    "endDate": 1691652312954,
    "remoteHost": "10.0.1.12",
    "username": "admin",
    "active": false,
    "identifier": "34",
    "uuid": "40ffc435-4386-3261-9579-557e9aad8512",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1691652318099,
    "endDate": 1691657229700,
    "remoteHost": "10.0.1.12",
    "username": "admin",
    "active": false,
    "identifier": "35",
    "uuid": "96a9d8ba-a5f1-3e95-9c6b-a4534253d12e",
    "attributes": {},
    "logs": {
      "968e69bd-2284-31a2-8b5a-d5d504e4a191": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "fd9694cd-4a9d-32b7-85e8-b09f1bcfe371": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "78cd95d9-1fee-38cf-9b6a-52f999dff3f8": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1692244923308,
    "endDate": 1692244940669,
    "remoteHost": "10.0.1.26",
    "username": "admin",
    "active": false,
    "identifier": "36",
    "uuid": "4b423f59-8434-343b-8df4-c2ca42689f8e",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1694763511602,
    "endDate": 1694763545913,
    "remoteHost": "10.0.1.13",
    "username": "admin",
    "active": false,
    "identifier": "80",
    "uuid": "92851f8e-40d5-38e8-872b-67c996ed7334",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "3",
    "connectionName": "chrome",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1694763550443,
    "endDate": 1694763551094,
    "remoteHost": "10.0.1.13",
    "username": "admin",
    "active": false,
    "identifier": "81",
    "uuid": "31ad8dd7-60d1-35ee-b7d5-b76f3810f232",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "4",
    "connectionName": "windows",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1692777767878,
    "endDate": 1692777808754,
    "remoteHost": "10.0.1.12",
    "username": "admin",
    "active": false,
    "identifier": "41",
    "uuid": "e2c6dd8a-f0fc-3f22-8e11-a054cff3a839",
    "attributes": {},
    "logs": {
      "fc6b833b-7d8d-30a8-a874-f2df9ca04d3e": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "d5e88920-ecae-300e-8739-56c18b4dc1a8": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "5d2e2b41-3f61-34ba-a55a-bdb9fbe75279": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1692778468470,
    "endDate": 1692778502797,
    "remoteHost": "10.0.1.12",
    "username": "admin",
    "active": false,
    "identifier": "42",
    "uuid": "edb9f282-35e6-3a10-bf3f-f1bdabb43aa5",
    "attributes": {},
    "logs": {
      "9bf5110c-e454-395b-8c1d-3d1a8c67c7fd": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "85111922-cd0e-3c75-8da8-9b8845544059": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "8c1cfd07-9797-34f6-9d21-a7e76231f2f6": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1692778506441,
    "endDate": 1692778516226,
    "remoteHost": "10.0.1.12",
    "username": "admin",
    "active": false,
    "identifier": "43",
    "uuid": "d655a5fc-b13d-3d9f-b46a-0b874b0a3ef9",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1692778597374,
    "endDate": 1692778620555,
    "remoteHost": "10.0.1.12",
    "username": "admin",
    "active": false,
    "identifier": "44",
    "uuid": "b4423111-0688-32f7-b537-73cd095451a1",
    "attributes": {},
    "logs": {
      "798a6e53-f15a-31b4-a4a1-630e05db0218": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "cac2d93e-6422-38ee-8624-858c4c810a2d": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "cea02f3d-d8bc-361c-bfda-8de73cb11078": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1692778624727,
    "endDate": 1692778797536,
    "remoteHost": "10.0.1.12",
    "username": "admin",
    "active": false,
    "identifier": "45",
    "uuid": "87f7e558-8b9e-38ea-9dad-98deba904f4e",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1692886591668,
    "endDate": 1692886698879,
    "remoteHost": "10.0.1.26",
    "username": "admin",
    "active": false,
    "identifier": "48",
    "uuid": "72ae31ab-63fa-3145-a954-88210bbd3651",
    "attributes": {},
    "logs": {
      "5c90950e-a2a6-3662-ac94-746fea17a5ab": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "ca24db30-1b96-3c7d-9d1d-4df3aada551b": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "a044e903-183d-332e-bb5c-7a431e3c4b8d": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1692886515962,
    "endDate": 1692886700012,
    "remoteHost": "10.0.1.26",
    "username": "admin",
    "active": false,
    "identifier": "47",
    "uuid": "fdf244e0-cdd9-3fa7-ab2d-03773b22ba5c",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1692923772070,
    "endDate": 1692923887250,
    "remoteHost": "10.0.1.26",
    "username": "admin",
    "active": false,
    "identifier": "49",
    "uuid": "37ab9592-e4af-3230-ac22-d912b06f8d93",
    "attributes": {},
    "logs": {
      "85cd45ad-7bc9-39db-92b8-3dfefea0d8f0": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "c6a8ecb4-06ad-3110-b700-a802b860d4c5": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "f0aee055-f799-356e-989e-bde412b6a245": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1692923891436,
    "endDate": 1692923896396,
    "remoteHost": "10.0.1.26",
    "username": "admin",
    "active": false,
    "identifier": "50",
    "uuid": "9d15d50d-0abc-3c4d-ab55-fc9a029baccd",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1692923899965,
    "endDate": 1692923905680,
    "remoteHost": "10.0.1.26",
    "username": "admin",
    "active": false,
    "identifier": "51",
    "uuid": "1e4d3a5a-11d0-33cd-b795-8a8f33c21f87",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1692923909090,
    "endDate": 1692923925549,
    "remoteHost": "10.0.1.26",
    "username": "admin",
    "active": false,
    "identifier": "52",
    "uuid": "c39952a5-3aad-3dec-bd8c-d307d5859973",
    "attributes": {},
    "logs": {
      "3af73362-2e64-37b1-8d12-2970ccf4f001": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "461ef984-6e42-354f-999c-0867dbffa0bc": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "7ab87745-27b1-355f-bcd6-cd9f8118a118": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1692941212924,
    "endDate": 1692941387115,
    "remoteHost": "10.0.1.12",
    "username": "admin",
    "active": false,
    "identifier": "53",
    "uuid": "e5adf067-6a3a-3c92-ac8c-dd954360d6dd",
    "attributes": {},
    "logs": {
      "b0426763-9329-3f76-9cf8-40aa8c135665": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "1b0c262a-c908-3f71-ae5a-2f6ccc3aa274": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "3bb059a1-4567-35bd-ba5e-6e1752ec16d8": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1693190446546,
    "endDate": 1693190484355,
    "remoteHost": "10.0.1.12",
    "username": "admin",
    "active": false,
    "identifier": "60",
    "uuid": "436364c9-5253-3cf2-ae0c-d3f86537f72e",
    "attributes": {},
    "logs": {
      "f5a540f7-cf83-3ca4-ae26-40c4cd42ea53": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "9881f525-fc73-366e-bea0-a023dfb9e187": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "078e6489-340e-30c0-aba9-523e2607330a": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1693203861437,
    "endDate": 1693203878920,
    "remoteHost": "10.0.1.30",
    "username": "admin",
    "active": false,
    "identifier": "61",
    "uuid": "b6f97ac6-c03e-3fe1-9a1b-7a754d32418e",
    "attributes": {},
    "logs": {
      "9b18d5a1-a874-33dc-86fd-0f674b8c0955": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "c854aafd-8d74-333d-b8c8-d60e8b125945": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "9596bd0b-0b8a-39a3-a17b-a4869cb164c5": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1695615334967,
    "endDate": 1695615345753,
    "remoteHost": "10.0.1.31",
    "username": "hiroya@procube.jp",
    "active": false,
    "identifier": "83",
    "uuid": "cf7fd0fc-8e92-38a5-8fd9-64dc6085f7ec",
    "attributes": {},
    "logs": {
      "0c590a37-57fe-3c44-9f88-f7dd52fc4db9": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "26a5b912-298a-38e5-b669-c67b551a6c5e": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "cc0b294f-ec39-3aa1-a9c7-e60d56a6cd9e": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1697442336099,
    "endDate": 1697442340410,
    "remoteHost": "10.0.1.38",
    "username": "admin",
    "active": false,
    "identifier": "87",
    "uuid": "2118ce44-0311-3c71-830a-2837fb08ab9d",
    "attributes": {},
    "logs": {
      "3f8dfb8c-00cb-37e1-a3c7-5ce25ece9278": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "bd4796d8-4aef-37ce-ac5e-96b302a63505": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "1677a0cc-787d-38e6-922e-5a6103900998": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1696482090739,
    "endDate": 1696482166912,
    "remoteHost": "10.0.1.2",
    "username": "admin",
    "active": false,
    "identifier": "84",
    "uuid": "31fcf7b5-ea3a-302b-9220-b58091f02cf5",
    "attributes": {},
    "logs": {
      "662d4760-ad65-3393-b939-939fcff1474f": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "482c2d78-5827-301c-89eb-b68d42233a63": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "3867a171-e641-3d48-a240-22f13d313299": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "",
    "sharingProfileName": null
  },
  {
    "startDate": 1697441817141,
    "endDate": 1697441876907,
    "remoteHost": "10.0.1.38",
    "username": "admin",
    "active": false,
    "identifier": "85",
    "uuid": "78416a47-bd7f-3d9a-89b3-e460ab668404",
    "attributes": {},
    "logs": {
      "885c8d12-55ee-380a-bc29-58d327c80374": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "099b7a8e-7b70-36a4-a791-f9bbcbc9c357": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "493bd215-9487-36ad-8345-87837d4bc178": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "IRURE",
    "sharingProfileName": null
  },
  {
    "startDate": 1697445326039,
    "endDate": 1697445327753,
    "remoteHost": "10.0.1.24",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "89",
    "uuid": "b129a2a4-7abc-31ee-97b3-d9993c79de1a",
    "attributes": {},
    "logs": {
      "ee148a50-9048-3baa-b874-979bbea803e3": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "1d6a0829-875f-37e4-ab52-cc3d6df0cf66": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "558a8cdf-814b-39c8-b2aa-bc2ad06bea3d": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1697445330690,
    "endDate": 1697445334957,
    "remoteHost": "10.0.1.24",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "90",
    "uuid": "9b348969-92d2-3f63-9fbe-86ebffe634c2",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1697504104042,
    "endDate": 1697504109351,
    "remoteHost": "10.0.1.38",
    "username": "admin",
    "active": false,
    "identifier": "93",
    "uuid": "2f995350-21a2-3b51-80d4-c99cb46d238c",
    "attributes": {},
    "logs": {
      "4b81837b-9d04-3af5-aa6c-0179196debb0": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "2b01e8e7-36be-3aaa-bd9c-41bcb2d84080": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "65dfa4fd-9a5b-35a5-8888-0c6b41602fa1": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1697510328654,
    "endDate": 1697510333823,
    "remoteHost": "10.0.1.24",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "96",
    "uuid": "28c793da-3598-39c9-a32d-2aa8d4cae227",
    "attributes": {},
    "logs": {
      "4308d9f6-cbb2-3f4c-803b-2108dc3c3f9a": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "9bd14648-2648-3b54-849d-b18356a4cc0b": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "57780d09-7ea5-3185-a50f-a3a6dd3c20de": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1697594815445,
    "endDate": 1697594828103,
    "remoteHost": "10.0.1.23",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "102",
    "uuid": "4c78c580-88e8-3a2d-b47e-34863e7b5f07",
    "attributes": {},
    "logs": {
      "da915870-be3e-302e-936b-9e416a47aff4": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "fe0780a3-9118-3be1-8ac1-81bdff1b845d": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "e59b35ba-a651-334b-8abf-fa5077cb2d40": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1697596133716,
    "endDate": 1697596144323,
    "remoteHost": "10.0.1.23",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "104",
    "uuid": "efe626b6-f0ec-3418-8d59-9c0973da34c2",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1697596166747,
    "endDate": 1697596175651,
    "remoteHost": "10.0.1.23",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "106",
    "uuid": "c5295418-3337-3aa3-bcd5-5e7024f40f48",
    "attributes": {},
    "logs": {
      "be017954-666f-305d-acbe-687cf215089a": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "24b00a53-342c-31a7-8969-ff15c87c4c3c": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "24bf9116-ab06-3a71-adf7-97365788e685": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1697596591889,
    "endDate": 1697596592000,
    "remoteHost": "10.0.1.24",
    "username": "admin",
    "active": false,
    "identifier": "110",
    "uuid": "6a80d0f5-c6eb-3103-b303-c07056fe7553",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "3",
    "connectionName": "chrome",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1697596595735,
    "endDate": 1697596595850,
    "remoteHost": "10.0.1.24",
    "username": "admin",
    "active": false,
    "identifier": "111",
    "uuid": "1eaccb9b-e330-3648-90f5-6654f001bb7e",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "3",
    "connectionName": "chrome",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1697596597445,
    "endDate": 1697596597546,
    "remoteHost": "10.0.1.24",
    "username": "admin",
    "active": false,
    "identifier": "112",
    "uuid": "4521dd51-7fed-3453-9c9f-f63b5c1e9ebd",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "3",
    "connectionName": "chrome",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1697596682255,
    "endDate": 1697597119224,
    "remoteHost": "10.0.1.24",
    "username": "admin",
    "active": false,
    "identifier": "114",
    "uuid": "bbae6fd3-b4f1-303a-a181-2a1976a97209",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "3",
    "connectionName": "chrome",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1697597121342,
    "endDate": 1697597167445,
    "remoteHost": "10.0.1.24",
    "username": "admin",
    "active": false,
    "identifier": "115",
    "uuid": "f812f461-10e7-313d-8691-950ebd294090",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "3",
    "connectionName": "chrome",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1697605529684,
    "endDate": 1697605538423,
    "remoteHost": "10.0.1.23",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "117",
    "uuid": "60aab4bb-3f04-3e5c-8186-1216afc27ea3",
    "attributes": {},
    "logs": {
      "3056b1d5-bf6e-3c8f-9440-c9d770178928": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "e3c68a95-17e0-3b82-8807-2b4ccb9b40fc": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "158ed601-73bc-3565-a6fe-f5386eea2fcb": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1697676301557,
    "endDate": 1697676307734,
    "remoteHost": "10.0.1.24",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "120",
    "uuid": "8ea3f0d9-7257-31d0-8122-0b333375d7a8",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1697676305752,
    "endDate": 1697676323124,
    "remoteHost": "10.0.1.24",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "121",
    "uuid": "2e7b96e1-f79b-359e-9f9f-9b2bcf9267b7",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "3",
    "connectionName": "chrome",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1697676440939,
    "endDate": 1697676453854,
    "remoteHost": "10.0.1.24",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "122",
    "uuid": "7e55c8fd-f427-3312-a09f-d107ded2a198",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1697676455176,
    "endDate": 1697676464894,
    "remoteHost": "10.0.1.24",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "123",
    "uuid": "4c95bebd-c2ed-3852-b815-0206180ef30f",
    "attributes": {},
    "logs": {
      "a03e70ae-017e-300c-a33f-9aeafdfdb533": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "2e300846-12ae-3d06-8207-4be1acbb8b96": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "b1fb1c44-fcda-3156-b80f-c842de0652fa": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1697677766007,
    "endDate": 1697677788278,
    "remoteHost": "10.0.1.24",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "126",
    "uuid": "8fa8f2b6-9794-39cf-beae-2f62d18561f6",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1697677772816,
    "endDate": 1697678026837,
    "remoteHost": "10.0.1.24",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "127",
    "uuid": "39396ee4-35b7-384f-b1ac-7596d8522c8c",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "3",
    "connectionName": "chrome",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1697682050709,
    "endDate": 1697682059547,
    "remoteHost": "10.0.1.24",
    "username": "admin",
    "active": false,
    "identifier": "129",
    "uuid": "822ec874-03e2-34de-93d3-7058a417529d",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1697704539887,
    "endDate": 1697704570666,
    "remoteHost": "10.0.1.23",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "131",
    "uuid": "7b7f3f68-491e-3e0f-ad76-7f196b449598",
    "attributes": {},
    "logs": {
      "9b422230-f839-389b-a38e-70742041a1ce": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "0b1f11ac-51c7-3e90-a9e7-9f7a45abe6dd": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "20f3993c-65fa-3ccb-b697-e103d159072a": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1697705194877,
    "endDate": 1697705194990,
    "remoteHost": "10.0.1.23",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "135",
    "uuid": "7e0d8cfa-2085-3c38-8b6b-0d5c896c0e92",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "8",
    "connectionName": "テスト用",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1697705202956,
    "endDate": 1697705203152,
    "remoteHost": "10.0.1.23",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "137",
    "uuid": "b6bc33b2-888f-306c-8e26-4e4982582d13",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "7",
    "connectionName": "テスト",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1697783901072,
    "endDate": 1697783956596,
    "remoteHost": "10.0.1.38",
    "username": "admin",
    "active": false,
    "identifier": "139",
    "uuid": "90214078-4d4c-3131-98b3-656ffbc2f563",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "2",
    "connectionName": "aristaEOS",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1698041450158,
    "endDate": 1698041481443,
    "remoteHost": "10.0.1.38",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "141",
    "uuid": "737bdde6-2509-3b91-9c02-8f2e0a26febc",
    "attributes": {},
    "logs": {
      "0123436a-ceab-352d-be74-d0ea34b74ffb": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "048c9bac-de35-3ad4-8b21-93fe04ef5ed1": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "5fbc41e7-2b47-3fc9-b1ba-397f273061b6": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1698212665853,
    "endDate": 1698212684690,
    "remoteHost": "10.0.1.13",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "143",
    "uuid": "0a683b88-1992-3185-9a62-22a8e1024a85",
    "attributes": {},
    "logs": {
      "e5ec3da8-ecb3-3615-8cdc-852b5115ca44": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "32979c83-d32d-380f-8611-9416caa2a942": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "e5e64faa-9a74-3889-b2e2-1d2f04602fe7": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1698213814662,
    "endDate": 1698213815898,
    "remoteHost": "10.0.1.13",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "146",
    "uuid": "64a99485-2466-380c-a456-e67caf264ba6",
    "attributes": {},
    "logs": {
      "57ca29e5-48e6-3540-ab62-75d77f3a86eb": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "392b654b-f7f9-3799-a2ec-27113adb9977": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "22206ed0-fb9d-3a70-a932-9f4672a9c476": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1698213823071,
    "endDate": 1698213827736,
    "remoteHost": "10.0.1.13",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "147",
    "uuid": "f9e08252-ec98-3850-8fad-0fc38e2950b1",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "4",
    "connectionName": "windows",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1698213835348,
    "endDate": 1698213855116,
    "remoteHost": "10.0.1.13",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "148",
    "uuid": "bd6a6e68-24af-3cd5-a43c-e96ca8d2da73",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "3",
    "connectionName": "chrome",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1698216459143,
    "endDate": 1698216499376,
    "remoteHost": "10.0.1.13",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "149",
    "uuid": "38ab8cd9-a772-3e45-9d80-c360c65e78b8",
    "attributes": {},
    "logs": {
      "8a3babf8-709d-3ff7-9e28-da05ce7364fa": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      },
      "5942f3f4-cbaf-3b2e-8279-ccde180bb543": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "f8917cf5-2845-3451-bd1a-7c42f67d1f71": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "082A0",
    "sharingProfileName": null
  },
  {
    "startDate": 1698733925550,
    "endDate": 1698733925670,
    "remoteHost": "10.0.1.34",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "158",
    "uuid": "c99075c5-4f73-3706-b9e8-8f22e5a966c9",
    "attributes": {},
    "logs": {},
    "connectionIdentifier": "8",
    "connectionName": "テスト用",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  },
  {
    "startDate": 1698733950573,
    "endDate": 1698733955503,
    "remoteHost": "10.0.1.34",
    "username": "naoya@procube.jp",
    "active": false,
    "identifier": "159",
    "uuid": "dd49cf05-66ed-3e94-89d4-ca6a6a59d65e",
    "attributes": {},
    "logs": {
      "b539e400-35cc-34a7-a164-96679691c8fb": {
        "type": "TYPESCRIPT_TIMING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT_TIMING",
          "variables": null
        }
      },
      "40abe3ab-f784-331c-a2cf-a39018b6a2e2": {
        "type": "GUACAMOLE_SESSION_RECORDING",
        "description": {
          "key": "RECORDING_STORAGE.INFO_GUACAMOLE_SESSION_RECORDING",
          "variables": null
        }
      },
      "ff0d646f-dc10-3164-a019-4fe77c6e84cb": {
        "type": "TYPESCRIPT",
        "description": {
          "key": "RECORDING_STORAGE.INFO_TYPESCRIPT",
          "variables": null
        }
      }
    },
    "connectionIdentifier": "1",
    "connectionName": "linux",
    "sharingProfileIdentifier": null,
    "workId": "undefined",
    "sharingProfileName": null
  }
]