var test = require('tape')
var http = require('http')
var each = require('async-each')
var NspAdvisoriesClient = require('../')
var advisoryPayload = require('./helpers/advisory-payload')

test('Should retrieve an advisory', function (t) {
  t.plan(6)

  var client = new NspAdvisoriesClient('http://localhost:3000')
  var payload = advisoryPayload()

  var server = http.createServer(function (req, res) {
    res.setHeader('Content-Type', 'application/json')
    t.equal(req.url, '/' + payload.id, 'Advisory ID was encoded in URL')
    res.end(JSON.stringify(payload))
  })

  server.listen(3000, function (err) {
    t.ifError(err, 'No error starting server')

    client.advisory(payload.id, function (err, advisory) {
      t.ifError(err, 'No error retrieving advisory')
      t.ok(advisory, 'Advisory was retrieved')
      t.equal(advisory.id, payload.id, 'Correct advisory retrieved')

      server.close(function (err) {
        t.ifError(err, 'No error stopping server')
        t.end()
      })
    })
  })
})

test('Should parse dates in advisory payload', function (t) {
  t.plan(8)

  var client = new NspAdvisoriesClient('http://localhost:3000')
  var payload = advisoryPayload()

  var server = http.createServer(function (req, res) {
    res.setHeader('Content-Type', 'application/json')
    t.equal(req.url, '/' + payload.id, 'Advisory ID was encoded in URL')
    res.end(JSON.stringify(payload))
  })

  server.listen(3000, function (err) {
    t.ifError(err, 'No error starting server')

    client.advisory(payload.id, function (err, advisory) {
      t.ifError(err, 'No error retrieving advisory')
      t.ok(advisory, 'Advisory was retrieved')
      t.ok(advisory.created_at instanceof Date, 'created_at was parsed as date')
      t.ok(advisory.updated_at instanceof Date, 'updated_at was parsed as date')
      t.ok(advisory.publish_date instanceof Date, 'publish_date was parsed as date')

      server.close(function (err) {
        t.ifError(err, 'No error stopping server')
        t.end()
      })
    })
  })
})

test('Should only allow string or integer advisory ID', function (t) {
  var client = new NspAdvisoriesClient('http://localhost:3000')

  var cases = [
    null,
    undefined,
    0.56,
    567.9,
    {},
    new Date(),
    false,
    true,
    /[a-z]/
  ]

  t.plan(cases.length + 1)

  each(cases, function (id, cb) {
    client.advisory(id, function (err) {
      t.ok(err, 'Expected error for id ' + id)
      cb()
    })
  }, function (err) {
    t.ifError(err, 'No error while testing cases')
    t.end()
  })
})

test('Should error when server unavailable', function (t) {
  t.plan(1)

  var client = new NspAdvisoriesClient('http://localhost:3000')

  client.advisory('BLAH', function (err) {
    t.ok(err, 'Expected error')
    t.end()
  })
})

test('Should error when status not 200', function (t) {
  t.plan(4)

  var client = new NspAdvisoriesClient('http://localhost:3000')

  var server = http.createServer(function (req, res) {
    res.writeHead(404, 'Not found', {'Content-Type': 'application/json'})
    res.end()
  })

  server.listen(3000, function (err) {
    t.ifError(err, 'No error starting server')

    client.advisory('missing', function (err, advisory) {
      t.ok(err, 'Expected error retrieving advisory')
      t.equal(err.statusCode, 404, 'Error status was 404')

      server.close(function (err) {
        t.ifError(err, 'No error stopping server')
        t.end()
      })
    })
  })
})
