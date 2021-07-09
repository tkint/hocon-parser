[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![pipeline status](https://gitlab.com/tkint/hocon-parser/badges/main/pipeline.svg)](https://gitlab.com/tkint/hocon-parser/-/commits/main)
[![coverage report](https://gitlab.com/tkint/hocon-parser/badges/main/coverage.svg)](https://gitlab.com/tkint/hocon-parser/-/commits/main)

# hocon-parser

Javascript library to parse [HOCON (Human-Optimized Config Object Notation)](https://github.com/lightbend/config)

## Usage

### Browser

This library can be used as a ES module in compatible browsers
:

```html
<script type="module">
  import { parseHocon } from 'https://unpkg.com/@tkint/hocon-parser?module';

  const parsed = parseHocon('hello = "world"');
</script>
```

Take a look at the [browser example](examples/browser) for further details.

### NPM

It can also be used in a node project :

```
npm install @tkint/hocon-parser
```

In a Node project, you can then use it as follow :

```js
const { parseHocon } = require('@tkint/hocon-parser');

const parsed = parseHocon('hello = "world"');
```

Take a look at the [node example](examples/node) for further details.

There is also a [vue example](examples/vue) with typescript support.

## Features

Not everything is yet implemented, but I plan to do so. Here is the current state :

| Feature | Implemented |
| ------- | ----------- |
| String value | yes |
| Number value | yes |
| String concatenation | yes |
| Boolean value | no |
| Object value | no |
| Array value | no |
| Null value | no |
| Object merge | no |
| Reference | no |
