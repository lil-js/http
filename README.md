# lil' http

A lil' module which implements a tiny, full featured HTTP client

**This library is still a work in progress**

## Installation

Via Bower package manager
```bash
$ bower install lil-http
```

```bash
$ component install lil-js/http
```

Or loading the script remotely (just for testing or development)
```html
<script src="//cdn.rawgit.com/lil-js/http/0.1.0/http.js"></script>
```

### Environments

Cross-browser support guaranteed running tests in [Testling](https://ci.testling.com/)

- Chrome >= 5
- Firefox >= 3
- Safari >= 5
- Opera >= 10
- IE >= 8

### Usage

Require the module
```js
var http = require('lil-http')
``` 

Make a GET request
```js
http.get('/sample.json', { headers: { 'X-Version': '0.1.0' }}, function (err, res)) {
  if (res.status === 200) {
    console.log(res.data)
  }
})
```

## API

#### http.get(url, config, cb)

#### http.post(url, data, config, cb)

#### http.put(url, data, config, cb)

#### http.del(url, data, config, cb)

#### http.patch(url, data, config, cb)

#### http.head(url, config, cb)

### Config options

- async `boolean` - Define if the request is asynchronous
- headers `object` - Request headers

### Response object

- **data** `mixed` - Body response
- **status** `number` - HTTP response status code
- **headers** `object` - Response headers

## License

MIT - Tomas Aparicio

