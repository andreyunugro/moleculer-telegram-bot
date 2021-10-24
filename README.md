# moleculer-telegram

Send Messages, Photos, and Documents to Telegram using Telegram Bot API with [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) module.

![unittest](https://github.com/andreyunugro/moleculer-telegram/actions/workflows/unittest.yml/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/andreyunugro/moleculer-telegram/badge.svg?branch=main)](https://coveralls.io/github/andreyunugro/moleculer-telegram?branch=main)

# Install

```bash
$ npm install moleculer-telegram --save
```

# Usage

> Before use please set the `TELEGRAM_TOKEN` environment variables.

```js
const { ServiceBroker } = require('moleculer');
const TelegramService = require('moleculer-telegram');

// Create broker
const broker = new ServiceBroker({ logger: console });

// Load my service
broker.createService({
    name: 'telegram',
    mixins: [TelegramService()]
});

// Start server
broker.start().then(() => {
  broker
    .call('telegram.sendMessage', { to: '', message: 'Hello Telegram!' })
    .then(res => console.log('Telegram message sent.'))
    .catch(console.error);
});
```

# Settings

<!-- AUTO-CONTENT-START:SETTINGS -->
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `telegramToken` | `String` | **required** | Telegram Bot API Token. Visit [How do I create a bot?](https://core.telegram.org/bots#3-how-do-i-create-a-bot). |

<!-- AUTO-CONTENT-END:SETTINGS -->

<!-- AUTO-CONTENT-TEMPLATE:SETTINGS
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
{{#each this}}
| `{{name}}` | {{type}} | {{defaultValue}} | {{description}} |
{{/each}}
{{^this}}
*No settings.*
{{/this}}

-->

# Actions
<!-- AUTO-CONTENT-START:ACTIONS -->
## `sendMessage` 

Send a Telegram Message

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `to` | `String` \| `Number` | **required** | Message target |
| `message` | `String` | **required** | Message text |
| `parse_mode` | `String` | - | Optional parse mode |
| `disable_web_page_preview` | `Boolean` | - | Optional disable web page preview |
| `disable_notification` | `Boolean` | - | Optional disable notification |
| `reply_to_message_id` | `Number` | - | Optional reply to message id |
| `reply_markup` | `Any` | - | Optional reply markup |

## `sendPhoto` 

Send a Telegram Photo using URL.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `to` | `String` \| `Number` | **required** | Send photo target |
| `photo` | `String` | **required** | Photo URL |
| `parse_mode` | `String` | - | Optional parse mode |
| `caption` | `String` | - | Optional photo caption |
| `disable_notification` | `Boolean` | - | Optional disable notification |
| `reply_to_message_id` | `Number` | - | Optional reply to message id |
| `reply_markup` | `Any` | - | Optional reply markup |
| `fileOpts.filename` | `String` | - | Optional filename |
| `fileOpts.contentType` | `String` | - | Optional file content type |

## `sendDocument` 

Send a Telegram Document using URL.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `to` | `String` \| `Number` | **required** | Send document target |
| `doc` | `String` | **required** | Document URL |
| `parse_mode` | `String` | - | Optional parse mode |
| `caption` | `String` | - | Optional document caption |
| `disable_notification` | `Boolean` | - | Optional disable notification |
| `reply_to_message_id` | `Number` | - | Optional reply to message id |
| `reply_markup` | `Any` | - | Optional reply markup |
| `fileOpts.filename` | `String` | - | Optional filename |
| `fileOpts.contentType` | `String` | - | Optional file content type |


<!-- AUTO-CONTENT-END:ACTIONS -->

<!-- AUTO-CONTENT-TEMPLATE:ACTIONS
{{#each this}}
## `{{name}}` {{#each badges}}{{this}} {{/each}}
{{#since}}
_<sup>Since: {{this}}</sup>_
{{/since}}

{{description}}

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
{{#each params}}
| `{{name}}` | {{type}} | {{defaultValue}} | {{description}} |
{{/each}}
{{^params}}
*No input parameters.*
{{/params}}

{{/each}}
-->

# Methods

<!-- AUTO-CONTENT-START:METHODS -->
## `sendMessage` 

Send a message

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `to` | `String` \| `Number` | - | Message target |
| `message` | `String` | - | Body of the message |
| `opts` | `TelegramBot.SendMessageOptions` | - | Send message options |

## `sendPhoto` 

Send a photo

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `to` | `String` \| `Number` | - | Message target |
| `photo` | `String` \| `Stream` \| `Buffer` | - | Photo to send |
| `opts` | `TelegramBot.SendPhotoOptions` | - | Send photo options |
| `fileOpts` | `TelegramBot.fileOpts` | - | Send photo file options |

## `sendDocument` 

Send a document

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `to` | `String` \| `Number` | - | Message target |
| `doc` | `String` \| `Stream` \| `Buffer` | - | Document to send |
| `opts` | `TelegramBot.SendDocumentOptions` | - | Send document options |
| `fileOpts` | `TelegramBot.fileOpts` | - | Send document file options |

<!-- AUTO-CONTENT-END:METHODS -->

<!-- AUTO-CONTENT-TEMPLATE:METHODS
{{#each this}}
## `{{name}}` {{#each badges}}{{this}} {{/each}}
{{#since}}
_<sup>Since: {{this}}</sup>_
{{/since}}

{{description}}

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
{{#each params}}
| `{{name}}` | {{type}} | {{defaultValue}} | {{description}} |
{{/each}}
{{^params}}
*No input parameters.*
{{/params}}

{{/each}}
-->

# Test
```
$ npm test
```

In development with watching

```
$ npm run ci
```

# License
The project is available under the [MIT license](https://tldrlegal.com/license/mit-license).
