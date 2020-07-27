function setupWebViewJavascriptBridge(callback) {
  var u = navigator.userAgent;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (isAndroid) {
    if (window.WebViewJavascriptBridge) {
      callback(WebViewJavascriptBridge)
    } else {
      document.addEventListener('WebViewJavascriptBridgeReady', function () {
        callback(WebViewJavascriptBridge)
      }, false);
    }
    return;
  }

  if (isiOS) {
    if (window.WebViewJavascriptBridge) {
      return callback(WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'https://__bridge_loaded__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
      document.documentElement.removeChild(WVJBIframe)
    }, 0)
  }
}
export default {
  callhandler(data, callback) {
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler('BanianAppHandler', data, callback)
    })
  },
  registerhandler(callback) {
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.registerHandler('BanianH5Handler', function (data, responseCallback) {
        callback(data, responseCallback)
      })
    })
  }
}
/*
  this.$bridge.callhandler({ // ->App
    priType:'',
    secType: "",
    data: {}
  }, (value) => {}) //data app传送  function app的回调


  this.$bridge.registerhandler((data, responseCallback) => { app->
    responseCallback(data) // data接受app responseCallback回复app
  })
*/