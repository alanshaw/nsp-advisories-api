var test = require('tape')
var http = require('http')
var each = require('async-each')
var url = require('url')
var NspAdvisoriesClient = require('../')
var advisoryPayload = require('./helpers/advisory-payload')

test('Should retrieve list of advisories', function (t) {
  t.plan(8)

  var client = new NspAdvisoriesClient('http://localhost:3000')
  var payload = []

  for (var i = 0; i < 1138; i++) {
    payload.push(advisoryPayload())
  }

  var server = http.createServer(function (req, res) {
    res.setHeader('Content-Type', 'application/json')

    var qs = url.parse(req.url, true).query
    var offset = parseInt(qs.offset, 10) || 0
    var limit = parseInt(qs.limit, 10) || 100
    var results = payload.slice(offset, offset + limit)

    res.end(JSON.stringify({
      results: results,
      total: payload.length,
      offset: offset,
      count: results.length
    }))
  })

  server.listen(3000, function (err) {
    t.ifError(err, 'No error starting server')

    client.advisories(function (err, resp) {
      t.ifError(err, 'No error retrieving advisories')
      t.ok(resp, 'Response was retrieved')
      t.ok(Array.isArray(resp.results), 'Results was array')
      t.equal(resp.total, payload.length, 'Total was correct')
      t.equal(resp.offset, 0, 'Offset was zero')
      t.equal(resp.count, resp.results.length, 'Count was correct')

      server.close(function (err) {
        t.ifError(err, 'No error stopping server')
        t.end()
      })
    })
  })
})

test('Should retrieve limited list of advisories', function (t) {
  t.plan(4)

  var client = new NspAdvisoriesClient('http://localhost:3000')
  var payload = []

  for (var i = 0; i < 1138; i++) {
    payload.push(advisoryPayload())
  }

  var server = http.createServer(function (req, res) {
    res.setHeader('Content-Type', 'application/json')

    var qs = url.parse(req.url, true).query
    var offset = parseInt(qs.offset, 10) || 0
    var limit = parseInt(qs.limit, 10) || 100
    var results = payload.slice(offset, offset + limit)

    res.end(JSON.stringify({
      results: results,
      total: payload.length,
      count: results.length
    }))
  })

  server.listen(3000, function (err) {
    t.ifError(err, 'No error starting server')

    var limit = 10

    client.advisories({limit: limit}, function (err, resp) {
      t.ifError(err, 'No error retrieving advisories')
      t.equal(resp.results.length, limit, 'Results were limited to ' + limit)

      server.close(function (err) {
        t.ifError(err, 'No error stopping server')
        t.end()
      })
    })
  })
})

test('Should retrieve offset list of advisories', function (t) {
  t.plan(4)

  var client = new NspAdvisoriesClient('http://localhost:3000')
  var payload = []
  var payloadCount = 1138

  for (var i = 0; i < payloadCount; i++) {
    payload.push(advisoryPayload())
  }

  var server = http.createServer(function (req, res) {
    res.setHeader('Content-Type', 'application/json')

    var qs = url.parse(req.url, true).query
    var offset = parseInt(qs.offset, 10) || 0
    var limit = parseInt(qs.limit, 10) || 100
    var results = payload.slice(offset, offset + limit)
    console.log(offset, limit, results.length)

    res.end(JSON.stringify({
      results: results,
      total: payload.length,
      count: results.length
    }))
  })

  server.listen(3000, function (err) {
    t.ifError(err, 'No error starting server')

    var offset = payloadCount - 5
    var limit = 10

    client.advisories({offset: offset, limit: limit}, function (err, resp) {
      t.ifError(err, 'No error retrieving advisories')
      t.equal(resp.results.length, Math.min(limit, payloadCount - offset), 'Number of results was correct')

      server.close(function (err) {
        t.ifError(err, 'No error stopping server')
        t.end()
      })
    })
  })
})

test('Should allow only integer limit', function (t) {
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
    /[a-z]/,
    'str'
  ]

  t.plan(cases.length + 1)

  each(cases, function (limit, cb) {
    client.advisories({limit: limit}, function (err) {
      t.ok(err, 'Expected error for limit ' + limit)
      cb()
    })
  }, function (err) {
    t.ifError(err, 'No error while testing cases')
    t.end()
  })
})

test('Should allow minimum limit of 1', function (t) {
  t.plan(1)
  var client = new NspAdvisoriesClient('http://localhost:3000')

  client.advisories({limit: -3}, function (err) {
    t.ok(err, 'Expected error for limit -3')
    t.end()
  })
})

test('Should allow only integer offset', function (t) {
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
    /[a-z]/,
    'str'
  ]

  t.plan(cases.length + 1)

  each(cases, function (offset, cb) {
    client.advisories({offset: offset}, function (err) {
      t.ok(err, 'Expected error for offset ' + offset)
      cb()
    })
  }, function (err) {
    t.ifError(err, 'No error while testing cases')
    t.end()
  })
})

test('Should allow minimum offset of 0', function (t) {
  t.plan(1)
  var client = new NspAdvisoriesClient('http://localhost:3000')

  client.advisories({offset: -12}, function (err) {
    t.ok(err, 'Expected error for limit -12')
    t.end()
  })
})
