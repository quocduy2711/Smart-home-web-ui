const { contextBridge, ipcMain } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // You can add IPC calls here if needed
  ipcRenderer: {
    send: async (channel, args) => {
      // Whitelist channels
      const validChannels = [];
      if (validChannels.includes(channel)) {
        ipcMain.send(channel, args);
      }
    },
    receive: (channel, func) => {
      const validChannels = [];
      if (validChannels.includes(channel)) {
        ipcMain.receive(channel, (event, ...args) => func(...args));
      }
    },
  },
});
