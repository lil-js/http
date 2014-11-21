describe('http', function () {
  var http = lil.http
  var phantom = location.search.indexOf('phantom') !== -1
  var server = 'http://localhost:8882'

  it('should expose the http constructor', function () {
    expect(http).to.be.a('function')
  })

  it('should expose the get method', function () {
    expect(http.get).to.be.a('function')
  })

  it('should expose the VERSION property', function () {
    expect(http.VERSION).to.be.a('string')
  })

  it('should expose the default config options', function () {
    expect(http.defaults).to.be.an('object')
  })

  it('should have a valid default content type', function () {
    expect(http.defaultContent).to.be.equal('text/plain')
  })

  describe('GET', function () {
    it('should perform a valid request', function (done) {
      http('fixtures/test.json', { params: { name: 'Chuck' } }, function (err, res) {
        expect(err).to.be.null
        expect(res.status).to.be.equal(200)
        expect(res.data).to.be.deep.equal({ hello: 'world' })
        expect(res.xhr).to.be.an('object')
        expect(res.headers).to.be.an('object')
        done()
      })
    })

    it('should perform a invalid request', function (done) {
      http('fixtures/invalid', function (err, res) {
        expect(res).to.be.null
        expect(err.status).to.be.equal(404)
        expect(err.xhr).to.be.an('object')
        expect(err.headers).to.be.an('object')
        done()
      })
    })
  })

  describe('POST', function () {
    it('should perform a valid request', function (done) {
      http.post('fixtures/test.json', { data: 'bye' }, function (err, res) {
        expect(res).to.be.null
        expect(err.status).to.be.equal(404)
        done()
      })
    })

    it('should perform a invalid request', function (done) {
      http.post('fixtures/invalid', function (err, res) {
        expect(res).to.be.null
        expect(err.status).to.be.equal(404)
        expect(err.xhr).to.be.an('object')
        done()
      })
    })
  })

  describe('remote server', function () {
    describe('GET', function () {
      describe('fetch a JSON file', function () {
        it('should perform the request and have a valid body', function (done) {
          http.get(server + '/comments.json', function (err, res) {
            expect(res.status).to.be.equal(200)
            expect(res.data).to.be.deep.equal([{id: 1, comment: 'hey there'}])
            done()
          })
        })
      })

      describe('fetch a XML file', function () {
        it('should perform the request and have a valid body', function (done) {
          http.get(server + '/comments.xml', function (err, res) {
            expect(res.status).to.be.equal(200)
            expect(res.data).to.be.equal('<comment>Hey there</comment>\n')
            done()
          })
        })
      })

      describe('error responses', function () {
        it('should not found the resource', function (done) {
          http.get(server + '/not-found', function (err, res) {
            expect(res).to.be.null
            expect(err.status).to.be.equal(phantom ? 0 : 404)
            expect(err.data).to.be.equal('')
            done()
          })
        })

        it('should return a server error', function (done) {
          http.get(server + '/server-error', function (err, res) {
            expect(res).to.be.null
            expect(err.status).to.be.equal(phantom ? 0 : 500)
            expect(err.data).to.be.equal('')
            done()
          })
        })
      })
    })

    describe('timeout', function () {
      it('should exceed the request by timeout', function () {
        http.get(server + '/timeout', { timeout: 500 }, function (err, res) {
          expect(res).to.be.null
          expect(err.status).to.be.equal(0)
          expect(err.data).to.be.equal('')
        })
      })
    })

    describe('POST', function () {
      describe('fetch a JSON file', function () {
        it('should perform the request and have a valid body', function (done) {
          http.post(server + '/comments.json', { data: 'hello' }, function (err, res) {
            expect(res.status).to.be.equal(200)
            expect(res.data).to.be.deep.equal([{id: 1, comment: 'hey there'}])
            done()
          })
        })
      })

      describe('fetch a XML file', function () {
        it('should perform the request and have a valid body', function (done) {
          http.post(server + '/comments.xml', { data: 'hello' }, function (err, res) {
            expect(res.status).to.be.equal(200)
            expect(res.data).to.be.equal('<comment>Hey there</comment>\n')
            done()
          })
        })
      })

      describe('error responses', function () {
        it('should not found the resource', function (done) {
          http.post(server + '/not-found', { data: 'hello' }, function (err, res) {
            expect(res).to.be.null
            expect(err.status).to.be.equal(phantom ? 0 :  404)
            expect(err.data).to.be.equal('')
            done()
          })
        })

        it('should return a server error', function (done) {
          http.post(server + '/server-error', { data: 'hello' }, function (err, res) {
            expect(res).to.be.null
            expect(err.status).to.be.equal(phantom ? 0 : 500)
            expect(err.data).to.be.equal('')
            done()
          })
        })
      })
    })

    describe('PUT', function () {
      describe('fetch a JSON file', function () {
        it('should perform the request and have a valid body', function (done) {
          http.put(server + '/comments.json', { data: 'hello' }, function (err, res) {
            expect(res.status).to.be.equal(200)
            expect(res.data).to.be.deep.equal([{id: 1, comment: 'hey there'}])
            done()
          })
        })
      })

      describe('fetch a XML file', function () {
        it('should perform the request and have a valid body', function (done) {
          http.put(server + '/comments.xml', { data: 'hello' }, function (err, res) {
            expect(res.status).to.be.equal(200)
            expect(res.data).to.be.equal('<comment>Hey there</comment>\n')
            done()
          })
        })
      })

      describe('error responses', function () {
        it('should not found the resource', function (done) {
          http.put(server + '/not-found', { data: 'hello' }, function (err, res) {
            expect(res).to.be.null
            expect(err.status).to.be.equal(phantom ? 0 :  404)
            expect(err.data).to.be.equal('')
            done()
          })
        })

        it('should return a server error', function (done) {
          http.put(server + '/server-error', { data: 'hello' }, function (err, res) {
            expect(res).to.be.null
            expect(err.status).to.be.equal(phantom ? 0 :  500)
            expect(err.data).to.be.equal('')
            done()
          })
        })
      })
    })

    describe('DELETE', function () {
      describe('fetch a JSON file', function () {
        it('should perform the request and have a valid body', function (done) {
          http.del(server + '/comments.json', { data: 'hello' }, function (err, res) {
            expect(res.status).to.be.equal(200)
            expect(res.data).to.be.deep.equal([{id: 1, comment: 'hey there'}])
            done()
          })
        })
      })

      describe('fetch a XML file', function () {
        it('should perform the request and have a valid body', function (done) {
          http.del(server + '/comments.xml', { data: 'hello' }, function (err, res) {
            expect(res.status).to.be.equal(200)
            expect(res.data).to.be.equal('<comment>Hey there</comment>\n')
            done()
          })
        })
      })

      describe('error responses', function () {
        it('should not found the resource', function (done) {
          http.del(server + '/not-found', { data: 'hello' }, function (err, res) {
            expect(res).to.be.null
            expect(err.status).to.be.equal(phantom ? 0 : 404)
            expect(err.data).to.be.equal('')
            done()
          })
        })

        it('should return a server error', function (done) {
          http.del(server + '/server-error', { data: 'hello' }, function (err, res) {
            expect(res).to.be.null
            expect(err.status).to.be.equal(phantom ? 0 : 500)
            expect(err.data).to.be.equal('')
            done()
          })
        })
      })
    })
  })
})
