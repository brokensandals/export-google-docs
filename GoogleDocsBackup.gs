var BACKUP_FOLDER_ID = 'INSERT_FOLDER_ID_HERE';

var NATIVE_MIME_TYPES = {};
NATIVE_MIME_TYPES[MimeType.GOOGLE_DOCS] = MimeType.MICROSOFT_WORD;
NATIVE_MIME_TYPES[MimeType.GOOGLE_SHEETS] = MimeType.MICROSOFT_EXCEL;
NATIVE_MIME_TYPES[MimeType.GOOGLE_SLIDES] = MimeType.MICROSOFT_POWERPOINT;

var EXTENSIONS = {};
EXTENSIONS[MimeType.MICROSOFT_WORD] = '.docx';
EXTENSIONS[MimeType.MICROSOFT_EXCEL] = '.xlsx';
EXTENSIONS[MimeType.MICROSOFT_POWERPOINT] = '.pptx';
EXTENSIONS[MimeType.PDF] = '.pdf';

var BACKUP_MIME_TYPES = Object.keys(NATIVE_MIME_TYPES);

function backupAll() {
  const backupFolder = DriveApp.getFolderById(BACKUP_FOLDER_ID);
  
  BACKUP_MIME_TYPES.forEach(function(mimeType) {
    var files = DriveApp.getFilesByType(mimeType);
    while (files.hasNext()) {
      var file = files.next();
      if (file.getOwner() && file.getOwner().getEmail() == Session.getActiveUser().getEmail()) {
        backup(file, backupFolder);
      }
    }
  });
}

function backup(file, folder) {
  var targetName = file.getName() + ' ' + file.getId();
  var lastUpdated = file.getLastUpdated();
  var metadata = getFileMetadata(file);
  
  var pdf = getExportBlob(file, metadata, MimeType.PDF);
  var native = getExportBlob(file, metadata, NATIVE_MIME_TYPES[file.getMimeType()]);
  
  var zip = Utilities.zip([pdf, native], targetName + '.zip');
  
  createOrUpdateFileForBlob(zip, folder, lastUpdated);
}

function createOrUpdateFileForBlob(blob, folder, ifOlderThan) {
  var existingFiles = folder.getFilesByName(blob.getName());
  if (existingFiles.hasNext()) {
    var file = existingFiles.next();
    if (file.getLastUpdated() < ifOlderThan) {
      updateFile(file, blob);
    }
  } else {
    var tmp = Utilities.newBlob([], blob.getContentType(), blob.getName());
    // folder.createFile can only handle blobs up to 10MB, so we'll create
    // an empty file first and then upload to it.
    // We could use the upload API to create and upload the file at the same
    // time, but that's a bit more work.
    var file = folder.createFile(tmp);
    updateFile(file, blob);
  }
}

function updateFile(file, blob) {
  const url = 'https://www.googleapis.com/upload/drive/v2/files/' + file.getId() + '?uploadType=media';
  
  const params = {
    method: 'put',
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    payload: blob
  };
  
  var response = UrlFetchApp.fetch(url, params);
  
  if (response.getResponseCode() < 200 || response.getResponseCode() > 299) {
    throw 'Failed to update file named ' + file.getName();
  }
}

function getFileMetadata(file) {
  const url = 'https://www.googleapis.com/drive/v3/files/' + file.getId() + '?fields=exportLinks';
  console.log(url);
  
  const params = {
    method: 'get',
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() }
  };
  
  return JSON.parse(UrlFetchApp.fetch(url, params).getContentText());
}

function getExportBlob(file, metadata, mime) {
  const url = metadata.exportLinks[mime];
  if (!url) {
    throw 'No export link for MIME type ' + mime + ' for file: ' + file.getId();
  }
  
  const extension = EXTENSIONS[mime];
  
  const params = {
    method: 'get',
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() }
  };
  
  const blob = UrlFetchApp.fetch(url, params).getBlob();
  blob.setName(file.getName() + extension);
  return blob;
}
