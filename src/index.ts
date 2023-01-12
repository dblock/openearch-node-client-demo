var AWS = require('aws-sdk');
var aws4  = require('aws4');
var { Client, Connection } = require("@opensearch-project/opensearch");

var client = new Client({
  node: process.env.ENDPOINT,
  Connection: class extends Connection {
    buildRequestObject (params) {
      var request = super.buildRequestObject(params)
      request.service = 'aoss';
      request.region = process.env.AWS_REGION;

      var contentLength = '0';

      if (request.headers['content-length']) {
        contentLength = request.headers['content-length'];
        request.headers['content-length'] = '0';
      }
      request.headers['x-amz-content-sha256'] = 'UNSIGNED-PAYLOAD';
      request = aws4.sign(request, AWS.config.credentials);
      request.headers['content-length'] = contentLength;

      return request
    }
  }
});

async function index_document() {
  // Create an index with non-default settings.
  var index_name = "my-index";
  var settings = "{ \"settings\": { \"number_of_shards\": 1, \"number_of_replicas\": 0 }, \"mappings\": { \"properties\": { \"title\": {\"type\": \"text\"}, \"director\": {\"type\": \"text\"}, \"year\": {\"type\": \"text\"} } } }";

  var response = await client.indices.create({
    index: index_name,
    body: settings
  });

  console.log("Creating index:");
  console.log(response.body);

  // Add a document to the index
  var document = "{ \"title\": \"Avatar\", \"director\": \"James Cameron\", \"year\": \"2003\" }\n";

  var response = await client.index({
    index: index_name,
    body: document
  });

  console.log("Adding document:");
  console.log(response.body);
}

index_document().catch(console.log);