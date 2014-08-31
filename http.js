/*! lil-http - v0.1 - MIT License - https://github.com/lil-js/http */
(function (global) {
  var VERSION = '0.1.0'
  var lil = global.lil || {}
  var toStr = Object.prototype.toString
  var slice = Array.prototype.slice
  var origin = global.location.origin
  var originRegex = /^(http[s]?:\/\/[a-z0-9\-\.\:]+)[\/]?/i

  var defaults = {
    method: 'GET',
    timeout: 30 *  1000,
    auth: null,
    headers: null,
    async: true,
    withCredentials: false
  }

  function isObj(o) {
    return o && toStr.call(o) === '[object Object]'
  }

  function isFn(fn) {
    return typeof fn === 'function'
  }

  function extend(target) {
    var i, l, x, cur, args = slice.call(arguments).slice(1)
    for (i = 0, l = args.length; i < l; i += 1) {
      cur = args[i]
      for (x in cur) if (cur.hasOwnProperty(x)) {
        target[x] = cur[x]
      }
    }
    return target
  }

  function setHeaders(xhr, headers) {
    if (isObj(headers)) {
      for (var field in headers) {
        xhr.setRequestHeader(field, headers[field])
      }
    }
  }

  function buildResponse(xhr) {
    return {
      status: xhr.status,
      data: xhr.responseText,
      headers: xhr.getAllResponseHeaders(),
      xhr: xhr
    }
  }

  function buildErrorResponse(xhr, error) {
    var response = buildResponse(xhr)
    response.error = error
    return response
  }

  function onError(xhr, cb) {
    var called = false
    return function (err) {
      if (!called) {
        cb(buildErrorResponse(xhr, err), null)
        called = true
      }
    }
  }

  function onLoad(xhr, cb) {
    return function () {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          cb(null, buildResponse(xhr))
        } else {
          cb(buildResponse(xhr), null)
        }
      }
    }
  }

  function isCrossOrigin(url) {
    var match = url.match(originRegex)
    return match && match[1] === origin
  }

  function createClient(config) {
    var xhr = null
    var method = (config.method || 'GET').toUpperCase()
    var auth = config.auth || {}
    var url = config.url

    if (isCrossOrigin(url)) {
      if (typeof XDomainRequest !== 'undefined') {
        xhr = new XDomainRequest()
      }
    } else {
      xhr = new XMLHttpRequest()
    }

    xhr.open(method, url, config.async, auth.user, auth.password)
    xhr.withCredentials = config.withCredentials
    setHeaders(xhr, config.headers)
    return xhr
  }

  function request(config, cb) {
    var errorHandler
    var xhr = createClient(config)
    if (!xhr) { return }

    errorHandler = onError(xhr, cb)
    xhr.onerror = errorHandler
    xhr.ontimeout = errorHandler
    xhr.onload = onLoad(xhr, cb)

    try {
      xhr.send(config.data)
    } catch (e) {
      errorHandler(e)
    }
  }

  function requestFactory(method) {
    return function (url, options, cb) {
      var config = extend({}, defaults)
      var args = slice.call(arguments)
      var i, cur = null

      for (i = 0, l = args.length; i < l; i += 1) {
        cur = args[i]
        if (isFn(cur)) {
          cb = cur
        } else if (isObj(cur)) {
          extend(config, cur)
        } else if (typeof cur === 'string') {
          config.url = cur
        }
      }

      request(config, cb)
    }
  }

  function http(config, data, cb) {
    return requestFactory('GET').apply(null, arguments)
  }

  http.VERSION = VERSION
  http.defaults = defaults
  http.get = requestFactory('GET')
  http.post = requestFactory('POST')
  http.put = requestFactory('PUT')
  http.del = requestFactory('DELETE')
  http.patch = requestFactory('PATCH')
  http.head = requestFactory('HEAD')

  lil.http = http
  if (typeof define === 'function' && define.amd) {
    define(function () { return http })
  } else {
    global.lil = lil
  }
}(this))
