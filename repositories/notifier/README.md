# Notifier for octopod

[![npm Version](https://img.shields.io/npm/v/@octopod-service/notifier.svg)](https://www.npmjs.com/package/@octopod-service/notifier)

## Install

```bash
npm install @octopod-service/notifier
```

## Usage

```javascript
// TypeScript
import * as notifier from '@octopod-service/notifier'
// JavaScript
const notifier = require('@octopod-service/notifier');

const notifierService = new notifier.NotifierService('http://...');

// Set option
notifierService.operations.push({
    type: 'write-file',
    settings: {
        path: '...'
    }
});

notifierService.types['write-file'] = function(type /* : DestinationType*/, data /* : Notification*/, callback /* : () => void*/)
{
    if(!type.settings.path)
    {
        this.error('Error in "write-file"', 'type.settings.path is not defined');
        return callback();
    }

    const retry = () => {
        require('fs').writeFile(type.settings.path, JSON.stringify(data), (e) => {
            if(!e)
                return callback(); // Success!

            this.error('Error in "write-file"', e);
            return setTimetout(() => retry(), type.retryTimeout ? type.retryTimeout : 10000); // If failed, retry later
        })
    }

    retry();
}

notifierService.start();
```

## Call

```javascript
this.writeToService<Notification>('notifier', 'notify', {
    title: 'title',
    body: 'body\r\nbody.',
    notify: {
        node: this.uid,
        type: this.options.username
    }
}, () => { });
```
