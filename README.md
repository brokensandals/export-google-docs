# export-google-docs

Google Apps Script that exports all your Google Docs/Sheets/Slides into docx/xlsx/pptx files and PDFs in a folder in your Google Drive.

I originally posted this as a [gist](https://gist.github.com/brokensandals/6b77f73666323d6e4b94ff1df12a532a).
I've made several variations on it in response to requests by others, as well as changes in my own needs.
Using a regular repo makes these variants easier to keep track of.
If this version doesn't exactly match your needs, see the the [list of branches](https://github.com/brokensandals/export-google-docs/branches) to see some of the ways the script can be adjusted.

**As always, this code may have defects that prevent it from working properly. Use at your own risk and remember to periodically verify that your backups are actually working as expected.**

## About this version

For each file, both an Office file (docx/xlsx/pptx) and a PDF are generated.
Those two files are combined into a zip file that's placed in the backup folder.
(Zipping the backup files ensures that they don't clutter up your recent activity list on docs.google.com.)
There is one zip file per original document.

There is no timestamp or sequence number added to the zip file name, so only the most recent backup of each document is kept.

The script does not update a zip file if the original document has not changed since the zip was last updated.
To determine this, it assumes the `lastUpdated` dates are correct on both the input files and the files in the backup directory.
If that seems problematic, you could change the `createOrUpdateFileForBlob` method to delete existing backup files rather than updating them.

Only files that you own (as opposed to files others have shared with you) will be backed up.
Remove the `file.getOwner()` check from the `backupAll` method if you want to change that.

## Short instructions

Replace INSERT_FOLDER_ID_HERE with the ID of the folder you want backups to be placed in.

Create a trigger to run the `backupAll` function if you want to do this on a schedule (e.g. nightly).

## Long instructions

If you'd like step-by-step setup instructions, see this post: http://brokensandals.net/google-docs-backup
