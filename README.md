# export-google-docs

Google Apps Script that exports all your Google Docs/Sheets/Slides into docx/xlsx/pptx files and PDFs in a folder in your Google Drive.

I originally posted this as a [gist](https://gist.github.com/brokensandals/6b77f73666323d6e4b94ff1df12a532a).
I've made several variations on it in response to requests by others, as well as changes in my own needs.
Using a regular repo makes these variants easier to keep track of.
If this version doesn't exactly match your needs, see the the [list of branches](https://github.com/brokensandals/export-google-docs/branches/all) to see some of the ways the script can be adjusted.

**As always, this code may have defects that prevent it from working properly. Use at your own risk and remember to periodically verify that your backups are actually working as expected.**

## About this version

For each file, both an Office file (docx/xlsx/pptx) and a PDF are generated.
Those two files are combined into a zip file that's placed in the backup folder.
(Zipping the backup files ensures that they don't clutter up your recent activity list on docs.google.com.)
There is one zip file per original document.

The date is appended to each zip file's name.
If you run the script more than once in a day, the later run might overwrite backups from earlier in the day.

The script does not delete zip files from earlier dates.
You'll need to take care of that yourself if you don't want the number of zips to grow forever.

Only files that you own (as opposed to files others have shared with you) will be backed up.
Remove the `file.getOwner()` check from the `backupAll` method if you want to change that.

## Limitations

Google's export API has a file size limit of 10MB.
If the exported form of a particular document is larger than that, this script will not be able to back it up.

## Short instructions

1. Create a new [Google Apps Script](https://script.google.com/) project and copy the [GoogleDocsBackup.gs script](GoogleDocsBackup.gs) file into it.

2. In the script, replace INSERT_FOLDER_ID_HERE with the ID of the folder you want backups to be placed in.

3. Run the `backupAll` function.
You'll probably want to create a trigger to run it on a schedule (e.g. nightly).

## Long instructions

If you'd like step-by-step setup instructions, see this post: http://brokensandals.net/google-docs-backup
