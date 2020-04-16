const BACKUP_FOLDER_ID = 'INSERT_FOLDER_ID_HERE';

const NATIVE_MIME_TYPES = {
  [MimeType.GOOGLE_DOCS]: MimeType.MICROSOFT_WORD,
  [MimeType.GOOGLE_SHEETS]: MimeType.MICROSOFT_EXCEL,
  [MimeType.GOOGLE_SLIDES]: MimeType.MICROSOFT_POWERPOINT,
};

const EXTENSIONS = {
  [MimeType.MICROSOFT_WORD]: '.docx',
  [MimeType.MICROSOFT_EXCEL]: '.xlsx',
  [MimeType.MICROSOFT_POWERPOINT]: '.pptx',
};

const BACKUP_MIME_TYPES = Object.keys(NATIVE_MIME_TYPES);

function backupAll() {
  const backupFolder = DriveApp.getFolderById(BACKUP_FOLDER_ID);
  const toZip = [];
  for (const mimeType of BACKUP_MIME_TYPES) {
    const files = DriveApp.getFilesByType(mimeType);
    while (files.hasNext()) {
      const file = files.next();
      if (file.getOwner() && file.getOwner().getEmail() === Session.getActiveUser().getEmail()) {
        toZip.push(...buildExports(file));
      }
    }
  }
  const name = 'GoogleDocs-' + Utilities.formatDate(new Date(), 'UTC', "yyyy-MM-dd'T'HHmmSS'Z'") + '.zip';
  const zip = Utilities.zip(toZip, name);
  backupFolder.createFile(zip);
}

function buildExports(file) {
  const targetName = file.getName() + ' ' + file.getId();
  const pdf = getPdfBlob(file, targetName);
  const native = getNativeBlob(file, targetName);
  return [pdf, native];
}

function getPdfBlob(file, targetName) {
  const blob = file.getAs('application/pdf');
  blob.setName(targetName + '.pdf');
  return blob;
}

function getNativeBlob(file, targetName) {
  const nativeMimeType = NATIVE_MIME_TYPES[file.getMimeType()];
  const extension = EXTENSIONS[nativeMimeType];
  const url = 'https://www.googleapis.com/drive/v2/files/' + file.getId() + '/export?mimeType=' + nativeMimeType;
  const params = {
    method: 'get',
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
  };
  const blob = UrlFetchApp.fetch(url, params).getBlob();
  blob.setName(targetName + extension);
  return blob;
}
