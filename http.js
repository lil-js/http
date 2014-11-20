/*! lil-http - v0.1.12 - MIT License - https://github.com/lil-js/http */
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
  'use strict'
  var VERSION = '0.1.12'
  var toStr = Object.prototype.toString
  var slicer = Array.prototype.slice
  var hasOwn = Object.prototype.hasOwnProperty
  var origin = location.origin
  var originRegex = /^(http[s]?:\/\/[a-z0-9\-\.\:]+)[\/]?/i
  var jsonMimeRegex = /application\/json/
  var hasDomainRequest = typeof XDomainRequest !== 'undefined'
  var noop = function () {}

  var defaults = {
    method: 'GET',
    timeout: 30 * 1000,
    auth: null,
    data: null,
    headers: null,
    withCredentials: false,
    responseType: 'text'
  }

  function isObj(o) {
    return o && toStr.call(o) === '[object Object]' || false
  }

  function extend(target) {
    var i, l, x, cur, args = slicer.call(arguments).slice(1)
    for (i = 0, l = args.length; i < l; i += 1) {
      cur = args[i]
      for (x in cur) if (hasOwn.call(cur, x)) target[x] = cur[x]
    }
    return target
  }

  function setHeaders(xhr, headers) {
    if (isObj(headers)) {
      headers['Content-Type'] = headers['Content-Type'] || http.defaultContent
      for (var field in headers) if (hasOwn.call(headers, field)) {
        xhr.setRequestHeader(field, headers[field])
      }
    }
  }

  function getHeaders(xhr) {
    var headers = {}, rawHeaders = xhr.getAllResponseHeaders().trim().split('\n')
    rawHeaders.forEach(function (header) {
      var split = header.trim().split(':')
      var key = split.shift().trim()
      var value = split.join(':').trim()
      headers[key] = value
    })
    return headers
  }

  function isJSONResponse(xhr) {
    return jsonMimeRegex.test(xhr.getResponseHeader('Content-Type'))
  }

  function encodeParams(params) {
    return Object.getOwnPropertyNames(params).filter(function (name) {
      return params[name] !== undefined
    }).map(function (name) {
      var value = (params[name] === null) ? '' : params[name]
      return encodeURIComponent(name) + (value ? '=' + encodeURIComponent(value) : '')
    }).join('&').replace(/%20/g, '+')
  }

  function parseData(xhr) {
    var data = null
    if (xhr.responseType === 'text') {
      data = xhr.responseText
      if (isJSONResponse(xhr) && data) data = JSON.parse(data)
    } else {
      data = xhr.response
    }
    return data
  }

  function buildResponse(xhr) {
    var response = {
      xhr: xhr,
      status: xhr.status,
      data: null,
      headers: {}
    }
    if (xhr.readyState === 4) {
      response.data = parseData(xhr)
      response.headers = getHeaders(xhr)
    }
    return response
  }

  function buildErrorResponse(xhr, error) {
    var response = new Error(error.message)
    extend(response, buildResponse(xhr))
    response.error = error
    response.stack = error.stack
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
        if (xhr.status === 1223) status = 204 // IE9 fix
        if (xhr.status >= 200 && xhr.status < 400) {
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

  function getURL(config) {
    var url = config.url
    if (isObj(config.params)) {
      url += (url.indexOf('?') === -1 ? '?' : '&') + encodeParams(config.params)
    }
    return url
  }

  function XHRFactory(url) {
    if (hasDomainRequest && isCrossOrigin(url)) {
      return new XDomainRequest()
    } else {
      return new XMLHttpRequest()
    }
  }

  function createClient(config) {
    var method = (config.method || 'GET').toUpperCase()
    var auth = config.auth
    var url = getURL(config)

    var xhr = XHRFactory(url)
    if (auth) {
      xhr.open(method, url, true, auth.user, auth.password)
    } else {
      xhr.open(method, url)
    }
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

  function hasContentTypeHeader(config) {
    return (config && isObj(config.headers)
      && config.headers['content-type'] || config.headers['Content-Type'])
      || false
  }

  function buildPayload(xhr, config) {
    var data = config.data
    if (isObj(config.data) || Array.isArray(config.data)) {
      if (hasContentTypeHeader(config) === false) {
        xhr.setRequestHeader('Content-Type', 'application/json')
      }
      data = JSON.stringify(config.data)
    }
    return data
  }

  function request(config, cb, progress) {
    var xhr = createClient(config)
    var data = buildPayload(xhr, config)
    var errorHandler = onError(xhr, cb)

    xhr.onload = onLoad(xhr, cb)
    xhr.onerror = errorHandler
    xhr.ontimeout = errorHandler
    xhr.onabort = errorHandler
    if (typeof progress === 'function') {
      xhr.onprogress = updateProgress(xhr, progress)
    }

    try {
      xhr.send(data)
    } catch (e) {
      errorHandler(e)
    }

    return { xhr: xhr, config: config }
  }

  function requestFactory(method) {
    return function (url, options, cb, progress) {
      var i, l, cur = null
      var config = extend({}, defaults, { method: method })
      var args = slicer.call(arguments)

      for (i = 0, l = args.length; i < l; i += 1) {
        cur = args[i]
        if (typeof cur === 'function') {
          cb = cur
          if (cb !== cur) progress = cur
        } else if (isObj(cur)) {
          extend(config, cur)
        } else if (typeof cur === 'string' && !config.url) {
          config.url = cur
        }
      }

      return request(config, cb || noop, progress)
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
