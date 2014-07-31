version-sort
============

[![Dependencies Status][gemnasium-image]][gemnasium-url] [![Build Status][travis-image]][travis-url] [![Code quality][codeclimate-image]][codeclimate-url] [![Code coverage][coveralls-image]][coveralls-url] [![Release][npm-image]][npm-url]

> Sort an array of versions.

## Usage

This module sort an array of versions. Here some examples of valid versions:

```
1.1.0
1.1.4
1.1.4.469816
2.4
2.4.2
2.4.20
2.4.20alpha
2.4.20beta
2.4.20rc1
2.4.20rc2
```

To use it just call the module as a function.

```js
var sort = require('version-sort');
data = [ '2.4.20', '2.4.20rc1', '1.1', '2.4.20beta1' ];
sort(data); // '1.1', '2.4.20beta1', '2.4.20rc1', '2.4.20'
```

### Options

```js
var results = sort(data, options);
```

 * `ignore_stages`: *(default: `false`)* Only return stables versions and ignore
   staged versions.
   Example:
   ```js
   var results = sort([ '1.1', '1.1alpha' ], { ignore_stages: true });
   // [ '1.1' ]
   ```

 * `nested`: *(default: `false`)* Use this option to sort object by a field.
   Example:
   ```js
   var softwares = [ { version: '1.1' }, { version: '1.1alpha' } ];
   var results = sort(softwares, { nested: 'version' });
   // [ { version: '1.1alpha' }, { version: '1.1'} ]
   ```

## Installation

```bat
npm install --save version-sort
```


[gemnasium-url]: https://gemnasium.com/quentinrossetti/version-sort
[gemnasium-image]: http://img.shields.io/gemnasium/quentinrossetti/version-sort.svg
[travis-url]: https://travis-ci.org/quentinrossetti/version-sort
[travis-image]: http://img.shields.io/travis/quentinrossetti/version-sort.svg
[codeclimate-url]: https://codeclimate.com/github/quentinrossetti/version-sort
[codeclimate-image]: http://img.shields.io/codeclimate/github/quentinrossetti/version-sort.svg
[coveralls-url]: https://coveralls.io/r/quentinrossetti/version-sort
[coveralls-image]: http://img.shields.io/coveralls/quentinrossetti/version-sort.svg
[npm-url]: https://www.npmjs.org/package/version-sort
[npm-image]: http://img.shields.io/npm/v/version-sort.svg
