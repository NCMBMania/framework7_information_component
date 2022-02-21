const $ = Dom7;
(async () => {
  const device = Framework7.getDevice();
  const config = await (await fetch('./js/config.json')).json();
  window.ncmb = new NCMB(config.applicationKey, config.clientKey);
  
  window.app = new Framework7({
    name: 'NCMB Map',
    theme: 'auto',
    el: '#app',
    id: 'com.nifcloud.mbaas.map',
    store: store,
    routes: routes,
    input: {
      scrollIntoViewOnFocus: device.cordova && !device.electron,
      scrollIntoViewCentered: device.cordova && !device.electron,
    },
    statusbar: {
      iosOverlaysWebView: true,
      androidOverlaysWebView: false,
    },
    on: {
      init: function () {
        if (this.device.cordova) {
          cordovaApp.init(this);
        }
      },
    },
  });
})();
