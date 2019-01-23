Google Apps Script that exports all your Google Docs/Sheets/Slides into docx/xlsx/pptx files and PDFs into a folder in your Google Drive.

Replace INSERT_FOLDER_ID_HERE with the ID of the folder you want backups to be placed in.

Create a trigger to run the `backupAll` function if you want to do this on a schedule (e.g. nightly).

Notes:

- By default, only files that you own (as opposed to files others have shared with you) will be backed up.
Remove the `file.getOwner()` check from the `backupAll` method if you want to change that.
- For each file, both an Office file (docx/xlsx/pptx) and a PDF are generated, and combined into a zip file that's placed in the backup folder.
Zipping the backup files ensures that they don't clutter up the recent activity list for Docs/Sheets/Slides.
- The script depends on the lastUpdated dates being correct on both the input files and the files in the backup directory.
If that seems problematic, you could change the `createOrUpdateFileForBlob` method to delete existing backup files rather than updating them.

**As always, this code may have defects that prevent it from working properly. Use at your own risk and remember to periodically verify that your backups are actually working as expected.**