/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 */

const { defaultProvider } = require("@aws-sdk/credential-provider-node"); // V3 SDK.
const { Client } = require('@opensearch-project/opensearch');
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');

async function main() {
  const client = new Client({
    ...AwsSigv4Signer({
      region: process.env.AWS_REGION || 'us-east-1',
      service: process.env.SERVICE || 'es',
      getCredentials: () => {
        const credentialsProvider = defaultProvider();
        return credentialsProvider();
      },
    }),
    node: process.env.ENDPOINT
  });

  // TODO: remove when OpenSearch Serverless re-adds /
  if (process.env.SERVICE != 'aoss') {
    var info = await client.info();
    var version = info.body.version
    console.log(version.distribution + ": " + version.number);
  }

  // create an index
  const index = 'movies'

  await client.indices.create({ index: index })

  try {
    // index data
    const document = { title: 'Moneyball', director: 'Bennett Miller', year: 2011 };
    await client.index({ index: index, body: document, id: '1' })

    // wait for the document to index
    await new Promise(r => setTimeout(r, 1000));

    // search for the document
    var results = await client.search({ body: { query: { match: { director: 'miller' } } } });
    results.body.hits.hits.forEach((hit) => console.log(hit._source));

    // delete the document
    await client.delete({ index: index, id: '1' })
  } finally {
    // delete the index
    await client.indices.delete({ index: index })
  }
}

main();
