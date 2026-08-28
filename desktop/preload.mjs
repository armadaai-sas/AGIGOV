import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('agigov', {
  desktop: true,
  openExternal: (url) => ipcRenderer.invoke('agigov:open-external', url),
  getMeta: () => ipcRenderer.invoke('agigov:get-meta'),
});
