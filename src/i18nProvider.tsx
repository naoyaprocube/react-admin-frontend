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
    files: {
      name: 'File Server',
      fields: {
        file: 'File',
        filename: 'File Name',
        length: 'Size',
        uploadDate: 'Upload Date',
        Type: 'Type',
        Date: 'Date',
        Protocol: 'Protocol',
        fromName: 'From Name',
        toName: 'To Name'
      }
    }
  },
  file: {
    downloading: 'Downloading %{filename}',
    uploading: 'Uploading %{filename}',
    uploading_confirm: 'Do you really want to leave?',
    uploaded: 'Uploaded',
    check: 'Checking file',
    sizeover: 'File larger than %{sizeLimit} cannot be uploaded.',
    totalSizeover: 'The total number of bytes in the uploaded file cannot exceed %{totalSizeLimit}. (currently using %{totalSize})',
    alreadyExist: {
      title: 'This file already exists.',
      content: 'A file with the same filename already exists. Do you want to overwrite?'
    }
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
    files: {
      name: 'ファイルサーバー',
      fields: {
        file: 'ファイル',
        filename: 'ファイル名',
        length: 'サイズ',
        uploadDate: '最終更新日時',
        Type: '更新種別',
        Date: '日時',
        Protocol: 'プロトコル',
        fromName: '変更前ファイル名',
        toName: '変更後ファイル名'
      }
    }
  },
  file: {
    downloading: '%{filename}をダウンロード中',
    uploading: '%{filename}をアップロード中',
    uploading_confirm: '本当にページを離れますか？',
    uploaded: 'アップロード完了',
    check: 'ファイルを検証中',
    sizeover: '%{sizeLimit}以上のファイルはアップロードできません。',
    totalSizeover: 'アップロードされたファイルの総バイト数が %{totalSizeLimit} を超えてアップロードすることはできません。(現在%{totalSize}使用中)',
    alreadyExist: {
      title: 'このファイルはすでに存在しています。',
      content: '同じファイル名のファイルがすでに存在します。上書きしますか？'
    }
  }
}

const translations: any = { english, japanese };

export const i18nProvider = polyglotI18nProvider(
  locale => translations[locale],
  'japanese', // default locale
  [{ locale: 'japanese', name: '日本語' }, { locale: 'english', name: 'English' }],
);