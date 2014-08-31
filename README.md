# [lil](http://lil-js.github.io)'-http [![Build Status](https://api.travis-ci.org/h2non/angular-thread.svg?branch=master)][travis]

A lil' module which implements a tiny, simple but full featured HTTP client

<table>
<tr>
<td><b>Name</b></td><td>http</td>
</tr>
<tr>
<td><b>Version</b></td><td>0.1.x</td>
</tr>
<tr>
<td><b>Size</b></td><td>4 KB / 1 KB (gzip)</td>
</tr>
</table>

## Installation

Via [Bower](http://bower.io)
```bash
bower install lil-http
```
Via [Component](http://component.io/)
```bash
component install lil-js/http
```

Or loading the script remotely
```html
<script src="//cdn.rawgit.com/lil-js/http/0.1.0/http.js"></script>
```

### Environments

Cross-browser support guaranteed running tests in [BrowserStack](http://browserstack.com/)

- Chrome >= 5
- Firefox >= 3
- Safari >= 5
- Opera >= 10
- IE >= 9

### Usage


Make a GET request
```js
lil.get('/sample.json', { headers: { 'X-Version': '0.1.0' }}, function (err, res)) {
  if (res.status === 200) {
    console.log(res.data)
  }
})
```

## API

#### http(url, options, cb)

#### http.get(url, options, cb)

#### http.post(url, options, cb)

#### http.put(url, options, cb)

#### http.del(url, options, cb)

#### http.patch(url, options, cb)

#### http.head(url, options, cb)

### Config options

- **data** `mixed` - Payload data to send as body request
- **headers** `object` - Map of strings representing HTTP headers to send to the server
- **timeout** `number` - Request maximum timeout in milliseconds
- **auth** `object` -  Authentication credentials to the server. Object must have the `user` and `password` properties
- **async** `boolean` - Set to `false` if the request must be performed as synchronous operation (not recommended)
- **withCredentials** `boolean` - Whether to set the withCredentials flag on the XHR object. See [MDN][withcredentials] for more information

### Response object

- **data** `mixed` - Body response
- **status** `number` - HTTP response status code
- **headers** `object` - Response headers
- **xhr** `object` -  Original XHR instance

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
[travis]: http://travis-ci.org/lil-js/http
