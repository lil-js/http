# [lil](http://lil-js.github.io)'-http [![Build Status](https://api.travis-ci.org/lil-js/http.svg?branch=master)][travis] [![Stories in Ready](https://badge.waffle.io/lil-js/http.png?label=ready&title=Ready)](https://waffle.io/lil-js/http) [![Code Climate](https://codeclimate.com/github/lil-js/uri/badges/gpa.svg)](https://codeclimate.com/github/lil-js/http) [![Gitter chat](https://badges.gitter.im/lil-js/http.png)](https://gitter.im/lil-js/http)

<img align="center" height="150" src="http://lil-js.github.io/img/liljs-logo.png" />

Tiny, lightweight, full featured HTTP client for the browser.

<table>
<tr>
<td><b>Name</b></td><td>http</td>
</tr>
<tr>
<td><b>Version</b></td><td>0.1.17</td>
</tr>
<tr>
<td><b>Size</b></td><td>3 KB / 1 KB (gzipped)</td>
</tr>
<tr>
<td><b>Environment</b></td><td>Browser</td>
</tr>
</table>

## Features

- Simple fully configurable API
- Support any HTTP verb
- Built-in error handling
- Binary response handling support
- Content-Type autodiscovery
- Support auth credentials
- Request progress status report
- Support passing custom headers
- Transparent support for CORS (in IE)
- Simple request state handling based on callback
- Transparent payload JSON serializer

## Installation

Via [Bower](http://bower.io)
```bash
bower install lil-http
```

Via [Component](https://github.com/component/component)
```bash
component install lil-js/http
```

Or loading the script remotely
```html
<script src="//cdn.rawgit.com/lil-js/http/0.1.17/http.js"></script>
```

### Environments

- Chrome >= 5
- Firefox >= 3
- Safari >= 5
- Opera >= 10
- IE >= 9

### Usage

You could fetch de module via `require()` if it's available.
Otherwise, global fallback will be used, exposed via `lil.http`

##### Sample GET request
```js
lil.http.get('/sample.json', {
  auth: { user: 'Tom', password: 'p@s$w0rD' }
  headers: { 'X-Version': '0.1.0' }
}, function (err, res)) {
  if (err) throw new Error('Cannot perform the request: ' + err.status)
  if (res.status === 200) {
    console.log(res.data)
  }
})
```

##### Sample POST request
```js
lil.http.post('/register', {
  data: { user: 'Tom' },
  headers: { 'API-Key': '8c1c4180-36b5-11e4-8510-0800200c9a66' }
}, function (err, res)) {
  if (err) throw new Error('Cannot register: ' + err.status)
  if (res.status === 200) {
    console.log('Registered!')
  }
})
```

### Config options

- **url** `string` - Server request URL
- **data** `mixed` - Payload data to send as body request. See [MDN][sendXHR] for more information
- **params** `object` - Map of key-value query string params
- **headers** `object` - Map of strings representing HTTP headers to send to the server
- **timeout** `number` - Request maximum timeout in milliseconds. Default to 30 seconds
- **auth** `object` -  Authentication credentials to the server. Object must have the `user` and `password` properties with `string` values
- **withCredentials** `boolean` - Whether to set the withCredentials flag on the XHR object. See [MDN][withcredentials] for more information
- **method** `string` - Request HTTP method. Default to `GET`
- **responseType** `string` - Define how to handle the response data. Allowed values are: `text`, `arraybuffer`, `blob` or `document`

### Response/error object

- **data** `mixed` - Body response. If the MIME type is `JSON-compatible`, it will be transparently parsed
- **status** `number` - HTTP response status code
- **headers** `object` - Response headers
- **xhr** `object` - Original XHR instance
- **error** `mixed` - Error info, usually an `Error` instance (in case that an error happens)

## API

#### http(url, options, cb, [ progressCb ])

#### http.get(url, options, cb, [ progressCb ])

#### http.post(url, options, cb, [ progressCb ])

#### http.put(url, options, cb, [ progressCb ])

#### http.delete(url, options, cb, [ progressCb ])

#### http.patch(url, options, cb, [ progressCb ])

#### http.head(url, options, cb, [ progressCb ])

#### http.defaults
Type: `object`

Default client config object

#### http.defaultContent
Type: `string` Value: `text/plain`

Default `Content-Type` request header value

#### http.VERSION

## Contributing

Wanna help? Cool! It will be appreciated :)

You must add new test cases for any new feature or refactor you do,
always following the same design/code patterns that already exist

### Development

Only [node.js](http://nodejs.org) is required for development

Clone the repository
```bash
$ git clone https://github.com/lil-js/http.git && cd http
```

Install dependencies
```bash
$ npm install
```

Generate browser bundle source
```bash
$ make browser
```

Run tests
```bash
$ make test
```

## License

[MIT](http://opensource.org/licenses/MIT) © Tomas Aparicio

[withcredentials]: https://developer.mozilla.org/es/docs/Web/HTTP/Access_control_CORS#Requests_with_credentials
[sendXHR]: https://developer.mozilla.org/es/docs/XMLHttpRequest#send()
[travis]: http://travis-ci.org/lil-js/http
