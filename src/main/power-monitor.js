import { app, powerMonitor } from 'electron';
import store from '../renderer/store';

app.on('ready', () => {
  powerMonitor.on('suspend', () => {
    if (store.getters['activities/stopOnSuspend']) {
      // store.dispatch('trackers/stop');
      console.log('have to stop timer.');
    }
  });

  powerMonitor.on('shutdown', e => {
    e.preventDefault();
    if (store.getters['activities/stopOnShutdown']) {
      // store.dispatch('trackers/stop');
      console.log('have to stop timer.');
    }
    app.quit();
  });
});
