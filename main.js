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
