/*! lil-http - v0.1 - MIT License - https://github.com/lil-js/http */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports'], factory)
  } else if (typeof exports === 'object') {
    factory(exports)
    if (typeof module === 'object' && module !== null) {
      module.exports = exports = exports.http
    }
  } else {
    factory((root.lil = root.lil || {}))
  }
}(this, function (exports) {
  var VERSION = '0.1.0'
  var toStr = Object.prototype.toString
  var slicer = Array.prototype.slice
  var origin = location.origin
  var originRegex = /^(http[s]?:\/\/[a-z0-9\-\.\:]+)[\/]?/i

  var defaults = {
    method: 'GET',
    timeout: 30 *  1000,
    auth: null,
    headers: null,
    async: true,
    withCredentials: false,
    responseType: 'text'
  }

  function isObj(o) {
    return o && toStr.call(o) === '[object Object]'
  }

  function isArr(o) {
    return o && toStr.call(o) === '[object Array]'
  }

  function extend(target) {
    var i, l, x, cur, args = slicer.call(arguments).slice(1)
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
      headers['Content-Type'] = headers['Content-Type'] || http.defaultContent
      for (var field in headers) {
        xhr.setRequestHeader(field, headers[field])
      }
    }
  }

  function getHeaders(xhr) {
    var map = {}, headers = xhr.getAllResponseHeaders().split('\n')
    headers.forEach(function (header) {
      if (header) {
        header = header.split(':')
        map[header[0].trim()] = (header[1] || '').trim()
      }
    })
    return map
  }

  function parseData(xhr) {
    var data, content = xhr.getResponseHeader('Content-Type')
    if (xhr.responseType === 'text') {
      data = xhr.responseText
      if (content === 'application/json') data = JSON.parse(data)
    } else {
      data = xhr.response
    }
    return data
  }

  function buildResponse(xhr) {
    return {
      xhr: xhr,
      status: xhr.status,
      data: parseData(xhr),
      headers: getHeaders(xhr)
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
    xhr.responseType = config.responseType
    xhr.timeout = config.timeout
    setHeaders(xhr, config.headers)
    return xhr
  }

  function updateProgress(xhr, cb) {
    return function (ev) {
      if (evt.lengthComputable) {
        cb(ev, evt.loaded / evt.total)
      } else {
        cb(ev)
      }
    }
  }

  function request(config, cb, progress) {
    var xhr = createClient(config)
    var data = isObj(config.data) || isArr(config.data) ? JSON.stringify(config.data) : config.data
    var errorHandler = onError(xhr, cb)

    xhr.addEventListener('load', onLoad(xhr, cb), false)
    xhr.addEventListener('error', errorHandler, false)
    xhr.addEventListener('timeout', errorHandler, false)
    xhr.addEventListener('abort', errorHandler, false)
    if (typeof progress === 'function') xhr.addEventListener('progress', updateProgress(xhr, progress), false)

    try {
      xhr.send(data)
    } catch (e) {
      errorHandler(e)
    }

    return xhr
  }

  function requestFactory(method) {
    return function (url, options, cb, progress) {
      var config = extend({}, defaults)
      var args = slicer.call(arguments)
      var i, cur = null

      for (i = 0, l = args.length; i < l; i += 1) {
        cur = args[i]
        if (typeof cur === 'function') {
          cb = cur
          if (cb !== cur) progress = cur
        } else if (isObj(cur)) {
          extend(config, cur)
        } else if (typeof cur === 'string') {
          config.url = cur
        }
      }

      return request(config, cb, progress)
    }
  }

  function http(config, data, cb, progress) {
    return requestFactory('GET').apply(null, arguments)
  }

  http.VERSION = VERSION
  http.defaults = defaults
  http.defaultContent = 'text/plain'
  http.get = requestFactory('GET')
  http.post = requestFactory('POST')
  http.put = requestFactory('PUT')
  http.del = requestFactory('DELETE')
  http.patch = requestFactory('PATCH')
  http.head = requestFactory('HEAD')

  return exports.http = http
}))
