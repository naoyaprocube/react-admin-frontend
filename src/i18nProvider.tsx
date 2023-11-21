import polyglotI18nProvider from 'ra-i18n-polyglot';
import en from 'ra-language-english';
import japaneseMessages from '@bicstone/ra-language-japanese';

en.ra.page.empty = "Any data does not exist."
en.ra.page.invite = "Do you want to upload?"
en.ra.message.delete_title = 'Delete %{id}?'
en.ra.message.delete_content = 'Please do note that this is an irreversible action.'
const english = {
  ...en,
  file: {
    fields: {
      file: 'File',
      filename: 'File Name',
      name: 'Name',
      length: 'Size',
      uploadDate: 'Upload Date',
      metadata:{
        status: 'Status',
        accessHistory: 'Access History',
        unique: "Fullpath"
      },
      Type: 'Type',
      Date: 'Date',
      Protocol: 'Protocol',
      Info: 'Info',
      SourceIP: 'Source IP',
      fileType: 'File Type',
      uploadTime: 'Estimated upload time',
      scanTime: 'Estimated scan time'
    },
    empty: 'Any file does not exist on the file server.',
    downloading: 'Downloading %{filename}',
    download: 'Download',
    upload: 'Upload',
    uploadPageTitle: 'Upload File',
    uploading: 'Uploading %{filename} ...',
    uploading_confirm: 'Do you really want to leave?',
    uploading_cancel: 'Canceled uploading file',
    uploading_cancel_denied: 'Cannot cancel uploading file',
    uploading_time: 'Elapsed time',
    uploaded: 'Uploaded',
    check: 'Checking file',
    sizeover: 'File larger than %{sizeLimit} cannot be uploaded.',
    totalSizeover: 'The total number of bytes in the uploaded file cannot exceed %{totalSizeLimit}. (currently using %{totalSize})',
    alreadyExist: {
      title: 'This file already exists.',
      content: 'A file with the same filename already exists. Do you want to overwrite?'
    },
    
    info: 'Upload File Info',
    infoIcon: 'Info',
    info_sizeover: 'Upload size limit over',
    info_scan_sizeover: 'Scan size limit over',
    statusCodeError: '%{code}: %{text}',
    sec: ' seconds',
    min: ' minutes',
    hour: ' hours'
  },
  dir: {
    dirname: 'Directory Name',
    dirs: 'Directories',
    selectManager: 'Select Manager',
    mkdir: {
      title: 'Create Directory',
      content: 'Can make directory under the %{name}. Input directory name.',
      create: 'Create Directory'
    },
    rmdir: {
      title: 'Delete %{dirName}',
      content: 'All files and directories uploaded under this directory will be deleted. Are you really sure?',
      delete: 'Delete'
    },
    rndir: {
      title: 'Rename %{dirName}',
      content: 'Input directory name.',
      rename: 'Rename'
    },
    create: 'Create',
    rename: 'Rename'
  },
  error: {
    dirAlreadyExist: '%{code}: Cannot make directory that has already exist name'
  },
  pages: {
    homepage: 'Admin Gate',
    workSelect: 'Work Select',
    workflow: 'Application Workflow',
    publicFileManager: 'Public File Manager',
    connectionSelect: 'Connection Select',
    fileManager: 'Work File Manager',
    fileUpload: 'File Upload',
    fileInfo: 'File Info',
    connectionHistory: 'Connection History',
    allConnectionHistory: 'All Connection History',
    SFTPClient: 'SFTP Connection'
  },
  guacamole: {
    announcement: 'Announcement',
    noAnnouncement: 'There is no notification.',
    activeSession: 'Active Session',
    noActiveSession: 'There are currently no active sessions.',
    connect: 'Connect',
    disconnect: 'Disconnect',
    period: 'Work Period',
    deviceConnection: 'Connected Devices',
    workStart: 'Start Work',
    works: 'Responsible work list',
    moveWorkflowTitle: 'Move to the workflow application page',
    moveWorkflowContent: 'Opens in new tab.',
    workerMode: 'Worker Mode',
    adminMode: 'Admin Mode',
    changeWorker: 'Change Worker Mode',
    notWorkerInfo: 'This page cannot be accessed in Admin Mode.',
    changeAdmin: 'Change Admin Mode',
    notAdminInfo: 'This page cannot be accessed in Worker Mode.',
    play: 'Play',
    textlog: 'Text',
    none: 'None',
    field: {
      id: 'ID',
      username: 'Username',
      connectId: 'Connection ID',
      connectionIdentifier: 'Connection ID',
      remark: 'Remark',
      protocol: 'Protocol',
      hostname: 'Host Name',
      lastActive: 'Last Active Date',
      remoteHost: 'Remote Host',
      startDate: 'Start Date',
      duration: 'Duration'
    },

    filter: {
      protocol: {
        name: 'Protocol',
        vnc: 'Browser',
        telnet: 'Telnet',
        rdp: 'RDP',
        ssh: 'SSH',
      },
      parent: {
        name: 'Hosts',
      },
      duration: {
        name: 'Duration',
        "30s": '30 seconds or more',
        "5m": '5 minutes or more',
        "1h": '1 hours or more',
      },
      startTime: {
        name: 'Start Date',
        day: 'Within a day',
        week: 'Within a week',
        month: 'Within a month',
      },
      work: {
        name: 'Status',
        none: 'All',
        before: 'Before-start',
        now: 'In-progress',
        out: 'Off-hours',
        after: 'Finished',
      },
    }
  },
  sftp: {
    transfer: 'Transfer files',
    delete: 'Delete',
    success: 'Success',
    move: 'Move to File Manager',
    draghere: 'Drag and drop file here.',
    fields: {
      mtime: 'Modify Time',
      atime: 'Access Time',
      uid: 'uid',
      gid: 'gid',
    },
  }
}

japaneseMessages.ra.page.empty = "データが登録されていません。"
japaneseMessages.ra.page.invite = "アップロードしますか？"
japaneseMessages.ra.message.delete_title = '%{id}を削除しますか？'
japaneseMessages.ra.message.delete_content = 'この操作を元に戻すことはできません。'
const japanese = {
  ...japaneseMessages,
  file: {
    fields: {
      file: 'ファイル',
      filename: 'ファイル名',
      name: '名前',
      length: 'サイズ',
      uploadDate: '最終更新日時',
      metadata:{
        status: '状態',
        accessHistory: 'アクセス履歴',
        unique: "フルパス"
      },
      Type: '種別',
      Date: '日時',
      Protocol: 'プロトコル',
      Info: '詳細',
      SourceIP: '送信元IP',
      fileType: 'ファイルタイプ',
      uploadTime: '推定アップロード時間',
      scanTime: '推定ウイルススキャン時間'
    },
    empty: 'ファイルが存在しません',
    downloading: '%{filename}をダウンロード中',
    download: 'ダウンロード',
    upload: 'アップロード',
    uploadPageTitle: 'ファイルをアップロード',
    uploading: '%{filename}をアップロード中...',
    uploading_confirm: '本当にページを離れますか？',
    uploading_cancel: 'アップロードをキャンセルしました。',
    uploading_cancel_denied: 'アップロードをキャンセルできませんでした。',
    uploading_time: '経過時間',
    uploaded: 'アップロード完了',
    check: 'ファイルを検証中',
    sizeover: '%{sizeLimit}以上のファイルはアップロードできません。',
    totalSizeover: 'アップロードされたファイルの総バイト数が %{totalSizeLimit} を超えてアップロードすることはできません。(現在%{totalSize}使用中)',
    alreadyExist: {
      title: 'このファイルはすでに存在しています。',
      content: '同じファイル名のファイルがすでに存在します。上書きしますか？'
    },
    
    info: '選択したファイルの詳細',
    infoIcon: '詳細',
    info_sizeover: 'アップロードサイズ制限超過',
    info_scan_sizeover: 'スキャンサイズ制限超過',
    statusCodeError: '%{code}: %{text}',
    sec: '秒',
    min: '分',
    hour: '時間'
  },
  dir: {
    dirname: 'ディレクトリ名',
    dirs: 'ディレクトリ',
    selectManager: '領域選択',
    mkdir: {
      title: 'ディレクトリを作成',
      content: '%{name}の配下にディレクトリを作成します。ディレクトリ名を入力してください。',
      create: 'ディレクトリを作成'
    },
    rmdir: {
      title: '%{dirName}を削除',
      content: '配下にアップロードされたファイルとディレクトリは全て削除されます。本当によろしいですか？',
      delete: '削除'
    },
    rndir: {
      title: '%{dirName}の名前を変更',
      content: 'ディレクトリ名を入力してください。',
      rename: '名前を変更'
    },
    create: '作成',
    rename: '変更'
  },
  error: {
    dirAlreadyExist: '%{code}: 同じ名前のディレクトリが存在します。'
  },
  pages: {
    homepage: 'Admin Gate',
    workSelect: '従事作業選択',
    workflow: 'ワークフロー申請',
    publicFileManager: '公開領域ファイルマネージャ',
    connectionSelect: '接続先一覧',
    fileManager: '作業領域ファイルマネージャ',
    fileUpload: 'アップロード',
    fileInfo: 'ファイル詳細',
    connectionHistory: '接続履歴',
    allConnectionHistory: '全体接続履歴',
    SFTPClient: 'SFTP接続'
  },
  guacamole: {
    announcement: 'お知らせ',
    noAnnouncement: 'お知らせはありません。',
    activeSession: 'アクティブなセッション',
    noActiveSession: '現在アクティブなセッションはありません。',
    connect: '接続',
    disconnect: '強制切断',
    period: '作業期間',
    deviceConnection: '接続機器',
    workStart: '作業開始',
    works: "担当作業一覧",
    moveWorkflowTitle: 'ワークフロー申請画面に移動します',
    moveWorkflowContent: '新しいタブで開きます。',
    workerMode: '作業者モード',
    adminMode: '管理者モード',
    changeWorker: '作業者モードに切り替える',
    notWorkerInfo: '管理者モードでアクセスできないページです。',
    changeAdmin: '管理者モードに切り替える',
    notAdminInfo: '作業者モードでアクセスできないページです。',
    play: '再生',
    textlog: 'テキスト',
    none: 'なし',
    field: {
      id: 'ID',
      username: 'ユーザー',
      connectId: '接続先ID',
      connectionIdentifier: '接続先ID',
      remark: '補足',
      protocol: 'プロトコル',
      hostname: 'ホスト名',
      lastActive: '最終アクティブ日時',
      remoteHost: '接続元IP',
      startDate: '開始日時',
      duration: '接続時間'
    },

    filter: {
      protocol: {
        name: 'プロトコル',
        vnc: 'ブラウザ',
        telnet: 'Telnet',
        rdp: 'RDP',
        ssh: 'SSH',
      },
      parent: {
        name: 'ホスト',
      },
      duration: {
        name: '接続時間',
        "30s": '30 秒以上',
        "5m": '5 分以上',
        "1h": '1 時間以上',
      },
      startTime: {
        name: '開始日時',
        day: '24時間以内',
        week: '1週間以内',
        month: '1ヶ月以内',
      },
      work: {
        name: '作業状態',
        none: 'すべて',
        before: '開始前',
        now: '現在進行中',
        out: '作業時間外',
        after: '終了済',
      },
    }
  },
  sftp: {
    transfer: 'ファイルを転送',
    delete: '削除',
    success: '処理が完了しました。',
    move: 'ファイルマネージャーへ移動',
    draghere: '接続先のファイルをここへドラッグ&ドロップしてください',
    fields: {
      mtime: '最終更新日時',
      atime: '最終アクセス日時',
      uid: 'uid',
      gid: 'gid',
    },
  }
}

const translations: any = { english, japanese };

export const i18nProvider = polyglotI18nProvider(
  locale => translations[locale],
  'japanese', // default locale
  [{ locale: 'japanese', name: '日本語' }, { locale: 'english', name: 'English' }],
);