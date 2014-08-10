var http = (function () {
  function createClient(url, method) {
    var xhr = new XMLHttpRequest()
    method = method || 'GET'
    if ('withCredentials' in xhr) {
      xhr.open(method, url, true)
    } else if (typeof XDomainRequest !== undefined) {
      // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
      xhr = new XDomainRequest()
      xhr.open(method, url)
    } else {
      return null
    }
    return xhr
  }

  function onError(cb) {
    var called = false
    return function (err) {
      if (!called) {
        cb(err || 'error')
        called = true
      }
    }
  }

  function onLoad(xhr, cb) {
    return function () {
      if (xhr.readyState === 4) {
        if(xhr.status >= 200 && xhr.status <= 300) {
          cb(null, xhr.responseText)
        } else {
          cb(new Error('Invalid response status: ' + xhr.status))
        }
      }
    }
  }

  function request(url, data, cb, method) {
    var errorHandler
    var xhr = createClient(url, method)
    if (!xhr) { return }

    errorHandler = onError(cb)
    xhr.onerror = errorHandler
    xhr.ontimeout = errorHandler
    xhr.onload = onLoad(xhr, cb)
    xhr.send(data)
  }

  return {
    get: function (url, cb) {
      request(url, null, cb, 'GET')
    },
    post: function (url, data, cb) {
      request(url, data, cb, 'POST')
    },
    put: function (url, data, cb) {
      request(url, data, cb, 'PUT')
    },
    del: function (url, data, cb) {
      request(url, data, cb, 'DELETE')
    },
    patch: function (url, data, cb) {
      request(url, data, cb, 'PATCH')
    },
    head: function (url, cb) {
      request(url, null, cb, 'HEAD')
    }
  }
}())
