# web-getter for octopod

[![npm Version](https://img.shields.io/npm/v/@octopod-service/web-getter.svg)](https://www.npmjs.com/package/@octopod-service/web-getter)

Allow to download with a limited frequency a web page. It will queue a request to the service (one queue per hostname) and execute it when the timeout has been reached.

## Install

```bash
npm install @octopod-service/web-getter
```

## Usage

```javascript
// TypeScript
import * as getter from '@octopod-service/web-getter'
// JavaScript
const getter = require('@octopod-service/web-getter');

const service = new getter.GetterService('http://...');
service.start();
```

## Call

```javascript
this.call<GetterServiceResult, GetterServiceRequest>('getter', 'request', {
    url: 'http://...'
}, (response, paths, cleanup) => {
    console.log(response.filePath);

    cleanup();
});
```

```javascript
this.call<GetterServiceDirectResult, GetterServiceRequest>('getter', 'direct', {
    url: 'http://...'
}, (response, paths, cleanup) => {
    console.log(response.body);

    cleanup();
});
```
