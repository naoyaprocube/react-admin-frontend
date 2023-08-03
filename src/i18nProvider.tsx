import polyglotI18nProvider from 'ra-i18n-polyglot';
import en from 'ra-language-english';
import japaneseMessages from '@bicstone/ra-language-japanese';

en.ra.action.create = "Upload"
en.ra.page.empty = "Any file does not exist on the file server."
en.ra.page.invite = "Do you want to upload?"
en.ra.message.delete_title = 'Delete %{id}?'
en.ra.message.delete_content = 'Please do note that this is an irreversible action.'
const english = {
  ...en,
  resources: {
    root: {
      name: 'File Server',
      fields: {
        file: 'File',
        filename: 'File Name',
        length: 'Size',
        uploadDate: 'Upload Date',
        metadata:{
          status: 'Status',
          accessHistory: 'Access History'
        },
        Type: 'Type',
        Date: 'Date',
        Protocol: 'Protocol',
        Info: 'Info',
        SourceIP: 'Source IP',
        fileType: 'File Type',
        uploadTime: 'Estimated upload time',
        scanTime: 'Estimated scan time'
      }
    }
  },
  file: {
    downloading: 'Downloading %{filename}',
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
    info_sizeover: 'Upload size limit over',
    info_scan_sizeover: 'Scan size limit over',
    statusCodeError: '%{code}: %{text}',
    sec: ' seconds',
    min: ' minutes',
    hour: ' hours'
  }
}

japaneseMessages.ra.action.create = "アップロード"
japaneseMessages.ra.page.empty = "ファイルは存在しません。"
japaneseMessages.ra.page.invite = "アップロードしますか？"
japaneseMessages.ra.message.delete_title = '%{id}を削除しますか？'
japaneseMessages.ra.message.delete_content = 'この操作を元に戻すことはできません。'
const japanese = {
  ...japaneseMessages,
  resources: {
    root: {
      name: 'ファイルサーバー',
      fields: {
        file: 'ファイル',
        filename: 'ファイル名',
        length: 'サイズ',
        uploadDate: '最終更新日時',
        metadata:{
          status: '状態',
          accessHistory: '更新履歴'
        },
        Type: '更新種別',
        Date: '日時',
        Protocol: 'プロトコル',
        Info: '詳細',
        SourceIP: '送信元IP',
        fileType: 'ファイルタイプ',
        uploadTime: '推定アップロード時間',
        scanTime: '推定ウイルススキャン時間'
      }
    }
  },
  file: {
    downloading: '%{filename}をダウンロード中',
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
    info_sizeover: 'アップロードサイズ制限超過',
    info_scan_sizeover: 'スキャンサイズ制限超過',
    statusCodeError: '%{code}: %{text}',
    sec: '秒',
    min: '分',
    hour: '時間'
  }
}

const translations: any = { english, japanese };

export const i18nProvider = polyglotI18nProvider(
  locale => translations[locale],
  'japanese', // default locale
  [{ locale: 'japanese', name: '日本語' }, { locale: 'english', name: 'English' }],
);