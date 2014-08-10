# thread-http

A [thread.js](https://github.com/h2non/thread.js) module which implements a tiny, full featured HTTP client designed to be used in Web Workers

**This library is still a work in progress**

## Installation

Via Bower package manager
```bash
$ bower install thread-http
```

```bash
$ component install h2non/thread-http
```

Or loading the script remotely (just for testing or development)
```html
<script src="//cdn.rawgit.com/h2non/thread-http/0.1.0/http.js"></script>
```

### Environments

Cross-browser support guaranteed running tests in [Testling](https://ci.testling.com/)

- Chrome >= 5
- Firefox >= 3
- Safari >= 5
- Opera >= 10
- IE >= 8

### Usage

Require the [thread](https://github.com/h2non/thread.js) module
```js
var thread = require('thread')
```

Create a new thread with custom scope and require the `http` module
```js
var worker = thread({
  require: ['http']
})
```

Run task which uses `http`
```js
worker.run(function (done) {
  http.get('data.json', done)
}).then(function (data) {
  console.log(JSON.parse(data).salutation) // -> "Hello World"
})
```

## License

MIT - Tomas Aparicio
