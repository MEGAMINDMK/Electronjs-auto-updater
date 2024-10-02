//const squirrelUrl = "http://anyurl:ports";
const squirrelUrl = "http://localhost:90";
 
const startAutoUpdater = (squirrelUrl) => {
  // The Squirrel application will watch the provided URL
 electron.autoUpdater.setFeedURL(`${squirrelUrl}/fm/main/installer/`);//this path includes ,nupkg, release,exe,msi
 
  // Display a success message on successful update
  electron.autoUpdater.addListener("update-downloaded", (event, releaseNotes, releaseName) => {
    electron.dialog.showMessageBox({"message": `The release ${releaseName} has been downloaded. This update will take effect upon next launch`});
  });
 
  // Display an error message on update error
  electron.autoUpdater.addListener("error", (error) => {
   // electron.dialog.showMessageBox({"message": "Auto updater error: "   error});
    console.log({"message": "Auto updater error: "   error})
  });
 
  // tell squirrel to check for updates
  electron.autoUpdater.checkForUpdates();
}
 
app.on('ready', function (){
  // Add this condition to avoid error when running your application locally
  if (process.env.NODE_ENV !== "dev") startAutoUpdater(squirrelUrl)
});

// Squirrel event handling for updates
function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }
  const ChildProcess = require('child_process');
 // const path = require('path');
  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);
  const spawn = function(command, args) {
    let spawnedProcess, error;
    try {
      spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
    } catch (error) {}
    return spawnedProcess;
  };
  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };
  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
    spawnUpdate(['--createShortcut', exeName]);
      setTimeout(app.quit, 1000);
      return true;
    case '--squirrel-uninstall':
     spawnUpdate(['--removeShortcut', exeName]);
      setTimeout(app.quit, 1000);
      return true;
    case '--squirrel-obsolete':
      app.quit();
      return true;
  }
};
if (handleSquirrelEvent()) {
  return;
}
