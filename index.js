var Request = require('request')
var Joi = require('joi')

function NspAdvisoriesClient (url) {
  if (!(this instanceof NspAdvisoriesClient)) return new NspAdvisoriesClient(url)
  this._url = url || 'https://api.nodesecurity.io/advisories'
}

NspAdvisoriesClient.prototype.advisories = function (opts, cb) {
  var self = this

  if (!cb) {
    cb = opts
    opts = {}
  }

  opts = opts || {}

  Joi.object().keys({
    limit: Joi.number().integer().min(1),
    offset: Joi.number().integer().min(0)
  }).validate(opts, function (err) {
    if (err) return cb(err)

    Request.get({url: self._url, qs: opts, json: true}, function (err, res, body) {
      if (err) return cb(err)
      if (res.statusCode !== 200) return cb(buildError(res, body))

      if (body) {
        body.total = parseInt(body.total, 10)
        body.offset = parseInt(body.offset, 10)
        body.count = parseInt(body.count, 10)

        if (body.results) {
          body.results = body.results.map(parseAdvisory)
        }
      }

      cb(null, body)
    })
  })
}

NspAdvisoriesClient.prototype.advisory = function (id, cb) {
  var self = this

  Joi.alternatives().try(
    Joi.number().integer().min(1),
    Joi.string()
  ).validate(id, function (err) {
    if (err) return cb(err)

    var url = self._url + '/' + encodeURIComponent(id)

    Request.get({url: url, json: true}, function (err, res, body) {
      if (err) return cb(err)
      if (res.statusCode !== 200) return cb(buildError(res, body))

      cb(null, parseAdvisory(body))
    })
  })
}

function parseAdvisory (obj) {
  if (!obj) return

  if (obj.created_at) {
    obj.created_at = new Date(obj.created_at)
  }

  if (obj.updated_at) {
    obj.updated_at = new Date(obj.updated_at)
  }

  if (obj.publish_date) {
    obj.publish_date = new Date(obj.publish_date)
  }

  return obj
}

function buildError (res, body) {
  body = body || {}

  var err = new Error(body.message || body.error || 'Unexpected API response status (' + res.statusCode + ')')

  err.data = body
  err.statusCode = res.statusCode

  return err
}

module.exports = NspAdvisoriesClient
