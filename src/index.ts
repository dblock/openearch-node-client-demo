/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 */

var AWS = require('aws-sdk');
var aws4 = require('aws4');
const { Client, Connection } = require('@opensearch-project/opensearch');

async function main() {
  const client = new Client({
    Connection: class extends Connection {
      buildRequestObject (params) {
        var request = super.buildRequestObject(params)
        request.service = 'aoss';
        request.region = process.env.AWS_REGION || 'us-east-1';
        var body = request.body;
        delete request.headers['content-length']
        request.body = undefined;
        request = aws4.sign(request, AWS.config.credentials);
        request.body = body;
        return request
      }
    },
    node: process.env.OPENSEARCH_ENDPOINT
  });

  // var info = await client.info();
  // var version = info.body.version
  // console.log(version.distribution + ": " + version.number);

  // create an index
  const index = 'movies'
  console.log((await client.indices.create({ index: index })).body);

  try {
    // index data
    const document = { title: 'Moneyball', director: 'Bennett Miller', year: 2011 };
    console.log((await client.index({ index: index, body: document, id: '1' })).body);

    // wait for the document to index
    await new Promise(r => setTimeout(r, 1000));

    // search for the document
    var results = await client.search({ body: { query: { match: { director: 'miller' } } } });
    results.body.hits.hits.forEach((hit) => console.log(hit._source));

    // delete the document
    console.log((await client.delete({ index: index, id: '1' })).body);
  } finally {
    // delete the index
    console.log((await client.indices.delete({ index: index })).body);
  }
}

main();
