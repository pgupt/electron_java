const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const kill = require('tree-kill');

let win;

function createWindow() {
	let platform = process.platform;
	
  /* win = new BrowserWindow({width: 800, height: 600});

   win.loadURL(url.format({
       pathname: path.join(__dirname, 'index.html'),
       protocol: 'file:',
       slashes: true
   }));

   win.on('closed', () => {
       win = null
   }) */
   
   

// Check operating system
if (platform === 'win32') {
   serverProcess = require('child_process')
       .spawn('cmd.exe', ['/c', 'demo.bat'],
           {
               cwd: app.getAppPath() + '/demo/bin'
           });
} else {
   serverProcess = require('child_process')
       .spawn(app.getAppPath() + '/demo/bin/demo');
}

let appUrl = 'http://localhost:8080';

const openWindow = function () {
   mainWindow = new BrowserWindow({
       title: 'Demo',
       width: 640,
       height: 480
   });

   mainWindow.loadURL(appUrl);

   mainWindow.on('closed', function () {
       mainWindow = null;
   });

   mainWindow.on('close', function (e) {
       if (serverProcess) {
           e.preventDefault();
           // kill Java executable
           // kill Java executable
			
			kill(serverProcess.pid, 'SIGTERM', function () {
  				 console.log('Server process killed');

  			 serverProcess = null;

  			 mainWindow.close();
});
       }
   });
};

const startUp = function () {
   const requestPromise = require('minimal-request-promise');

   requestPromise.get(appUrl).then(function (response) {
       console.log('Server started!');
       openWindow();
   }, function (response) {
       console.log('Waiting for the server start...');

       setTimeout(function () {
           startUp();
       }, 200);
   });
};

startUp();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
   if (process.platform !== 'darwin') {
       app.quit()
   }
});

app.on('activate', () => {
   if (win === null) {
       createWindow()
   }
});

