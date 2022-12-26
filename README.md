# OpenSearch Node.js Client Demo

Makes requests to Amazon OpenSearch using the [OpenSearch Node.js Client](https://github.com/opensearch-project/opensearch-js). Written in TypeScript.

### Install Prerequisites

#### Nvm

Use [nvm](https://github.com/nvm-sh/nvm#installation-and-update) to install node.js.

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
```

Follow the intructions to add `nvm.sh` and other environment setup to `.bashrc`, reopen a new shell.

#### Node.js

Install the latest LTS node.js. Use `nvm ls-remote` to find the latest version. 

```
nvm install v18.12.1
```

#### Install Packages

Install dependencies.

```
npm install
```

## Running

Create an OpenSearch domain in (AWS) which support IAM based AuthN/AuthZ and run the demo.

```
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=
export AWS_SESSION_TOKEN=
export AWS_REGION=us-west-2

export OPENSEARCH_ENDPOINT=https://....us-west-2.es.amazonaws.com

ts-node src/index.ts
```

The [code](src/index.ts) will connect to OpenSearch, display its version, create an index, add a document, search for it, output the search result, then cleanup.

```
opensearch: 2.3.0

{ title: 'Moneyball', director: 'Bennett Miller', year: 2011 }
```

## License 

This project is licensed under the [Apache v2.0 License](LICENSE.txt).

## Copyright

Copyright OpenSearch Contributors. See [NOTICE](NOTICE.txt) for details.
