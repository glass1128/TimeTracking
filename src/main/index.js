import { app, BrowserWindow, Tray, Menu, ipcMain, dialog } from 'electron';
import path from 'path';
import './static-path';
import '../renderer/store';
import './power-monitor';
import store from '../renderer/store';
import psList from 'ps-list';

function generateUrl(path = '', query = '') {
  return process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/${path}?${query}`
    : `file://${__dirname}/index.html#${path}?${query}`;
}

function getTrayIcon() {
  switch (process.platform) {
    case 'darwin':
      return '/IconTemplate.png';
    case 'win32':
      return '/icon-tray.ico';
    default:
      return '/icon-tray-light.png';
  }
}

function getLoomProc() {
  switch (process.platform) {
    case 'darwin':
      return 'Loom';
    case 'win32':
      return 'Loom.exe';
    default:
      return null;
  }
}

async function CanBeStart() {
  if (process.platform === 'linux' || process.platform === 'darwin')
    return true;
  const processes = await psList();
  for (const proc of processes) {
    if (proc.name === getLoomProc()) {
      return false;
    }
  }
  return true;
}

var myWindow = null;
var isQuiting;
var tray;

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  // app.exit(0);
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (myWindow) {
      if (myWindow.isMinimized()) myWindow.restore();
      myWindow.focus();
    }
  });
  app.commandLine.appendSwitch('disable-background-timer-throttling');
  app.on('ready', () => {
    const payload = CanBeStart();
    payload.then(value => {
      if (value === true) {
        // tray part
        tray = new Tray(path.join(__static, getTrayIcon()));
        tray.on('double-click', () => {
          myWindow.show();
        });
        tray.setContextMenu(
          Menu.buildFromTemplate([
            {
              label: 'Show App',
              click: function() {
                myWindow.show();
              }
            },
            {
              label: 'Quit',
              click: function() {
                isQuiting = true;
                // myWindow.webContents.send('close');
                const payload = store.dispatch('activities/stop');
                payload.then(value => {
                  store.dispatch('auth/logout');
                  app.quit();
                });
              }
            }
          ])
        );
        // tray part END
        myWindow = new BrowserWindow({
          webPreferences: {
            nodeIntegration: true
          },
          frame: false,
          width: 300,
          height: 500,
          resizable: false,
          fullscreenable: false,
          icon: path.join(__static, '/512x512.png')
        });
        myWindow.once('ready-to-show', () => {
          myWindow.show();
        });
        myWindow.on('close', function(event) {
          if (!isQuiting) {
            event.preventDefault();
            myWindow.hide();
            event.returnValue = false;
          }
        });
        myWindow.loadURL(generateUrl('/'));
      } else {
        console.log('Loom is running.');
        const options = {
          type: 'warning',
          // buttons: ['Cancel', 'Yes, please', 'No, thanks'],
          // defaultId: 2,
          title: 'Warning',
          message: 'Loom is running. Exit loom and run again.'
          // icon: iconImage
          // detail: 'It does not really matter',
          // checkboxLabel: 'Remember my answer',
          // checkboxChecked: true,
        };
        dialog.showMessageBox(null, options, () => {
          app.quit();
        });
      }
    });
  });
}

ipcMain.on('close-me', () => {
  isQuiting = true;
  app.quit();
});
