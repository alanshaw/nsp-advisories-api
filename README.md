# NSP advisories client

A Node.js client for the NSP advisories API.

## Getting started

```js
var client = require('nsp-advisories-api')()

// GET a list of advisories
client.advisories({limit: 100, offset: 0}, function (err, advisories) {
  console.log(advisories)
  // {results: [], total: 52, offset: 0, count: 100}
})

// GET an advisory
var id = 1

client.advisory(id, function (err, advisory) {
  console.log(advisory)
  /*
  { id: 1,
    created_at: Sat Oct 17 2015 20:41:46 GMT+0100 (BST),
    updated_at: Sat Oct 17 2015 20:41:46 GMT+0100 (BST),
    title: 'Arbitrary JavaScript Execution',
    author: 'Jarda Kotěšovec',
    module_name: 'bassmaster',
    publish_date: Sat Oct 18 2015 17:30:01 GMT+0100 (BST),
    cves: [ 'CVE-2014-7205' ],
    vulnerable_versions: '<=1.5.1',
    patched_versions: '>=1.5.2',
    legacy_slug: 'bassmaster_js_injection',
    slug: 'bassmaster_arbitrary-javascript-execution',
    overview: 'A vulnerability exists in bassmaster <= 1.5.1 that allows for an attacker to provide arbitrary JavaScript that is then executed server side via eval.',
    recommendation: 'Update to bassmaster version 1.5.2 or greater.',
    references: '- https://www.npmjs.org/package/bassmaster\n- https://github.com/hapijs/bassmaster/commit/b751602d8cb7194ee62a61e085069679525138c4',
    allowed_scopes: [ 'public', 'admin' ] }
  */
})
```
