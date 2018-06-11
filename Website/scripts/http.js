const ajax = {
  get: function(url, callback) {
    var xhr = createCORSRequest('GET', url)
    res(xhr, callback)
  },
  post: function(url, callback) {
    var xhr = createCORSRequest('POST', url)
    res(xhr, callback)
  }
}

function res(xhr, callback) {

  xhr.onreadystatechange = function () {
    var DONE = 4; // readyState 4 means the request is done.
    var OK = 200; // status 200 is a successful return.

    if (xhr.readyState === DONE) {
      if (xhr.status === OK) {
        callback(xhr.responseText)
      }
    } else {
      console.log('Error: ' + xhr.readyState); // An error occurred during the request.
    }
  }
}

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  xhr.send(null)

  return xhr;
}
