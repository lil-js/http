describe('http', function () {
  var http = lil.http

  it('should expose the http constructor', function () {
    expect(http).to.be.a('function')
  })

  it('should expose the get method', function () {
    expect(http.get).to.be.a('function')
  })

  it('should expose the VERSION property', function () {
    expect(http.VERSION).to.be.a('string')
  })

  describe('GET', function () {
    it('should perform a valid request', function (done) {
      http('fixtures/test.json', function (err, res) {
        expect(err).to.be.null
        expect(res.status).to.be.equal(200)
        expect(JSON.parse(res.data)).to.be.deep.equal({ hello: 'world' })
        expect(res.xhr).to.be.an('object')
        done()
      })
    })

    it('should perform a invalid request', function (done) {
      http('fixtures/invalid', function (err, res) {
        expect(res).to.be.null
        expect(err.status).to.be.equal(404)
        expect(err.xhr).to.be.an('object')
        done()
      })
    })
  })

  describe('POST', function () {
    it('should perform a valid request', function (done) {
      http.post('fixtures/test.json', { data: 'bye' },function (err, res) {
        expect(err).to.be.null
        expect(res.status).to.be.equal(200)
        expect(JSON.parse(res.data)).to.be.deep.equal({ hello: 'world' })
        expect(res.xhr).to.be.an('object')
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

  describe('CORS', function () {
    describe('GET', function () {
      it('should perform a valid request', function (done) {
        http.get('http://server.cors-api.appspot.com/server?enable=true&status=200&credentials=false', function (err, res) {
          expect(err).to.be.null
          expect(res.status).to.be.equal(200)
          expect(res.xhr).to.be.an('object')
          done()
        })
      })
    })

    describe('POST', function () {
      it('should perform a valid request', function (done) {
        http.post('http://server.cors-api.appspot.com/server?enable=true&status=200&credentials=false', function (err, res) {
          expect(err).to.be.null
          expect(res.status).to.be.equal(200)
          expect(res.xhr).to.be.an('object')
          done()
        })
      })
    })
  })
})
