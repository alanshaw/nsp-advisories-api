var Faker = require('faker')

module.exports = function () {
  var version = Faker.random.number() + '.' + Faker.random.number() + '.' + Faker.random.number()
  return {
    id: Faker.random.number(),
    created_at: Faker.date.past().toISOString(),
    updated_at: Faker.date.past().toISOString(),
    title: Faker.lorem.sentence(),
    author: Faker.name.findName(),
    module_name: Faker.name.firstName().toLowerCase(),
    publish_date: Faker.date.past().toISOString(),
    cves: [
      'CVE-2015-' + Faker.random.number()
    ],
    vulnerable_versions: '<' + version,
    patched_versions: '>=' + version,
    legacy_slug: Faker.lorem.sentence().toLowerCase().replace(/[^a-z0-9]/g, '-'),
    slug: Faker.lorem.sentence().toLowerCase().replace(/[^a-z0-9]/g, '-'),
    overview: Faker.lorem.paragraph(),
    recommendation: Faker.lorem.sentence(),
    references: Faker.lorem.sentence(),
    allowed_scopes: []
  }
}
