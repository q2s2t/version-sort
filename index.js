'use strict';
var _ = require('lodash');

/**
 * Read a list of versions an sort it.
 * @module version-sort
 * @function index
 * @param  {array} versions An array of versions to sort.
 * @param {object} opts An object of options.
 * @return {array} The same version array but sorted.*
 * @license http://git.io/bHDfwQ ISC License
 */
module.exports = function (versions, opts) {

  // Options
  var options = {
    ignore_stages: false,
    nested       : false,
    allow_null   : false
  };

  if (opts) {
    options.ignore_stages = opts.ignore_stages || options.ignore_stages;
    options.nested = opts.nested || options.nested;
    options.allow_null = opts.allow_null || options.allow_null;
  }

  // Nested objects
  if (options.nested) {
    var versionsObject = versions;
    versions = [];
    versionsObject.forEach(function (_version) {
      versions.push(_version[options.nested]);
    });
  }

  var regex = /^([\d+\.]+)(([a-z]*)(\d*))$/;

  var store = {
    number     : [],
    stage      : [],
    stageName  : [],
    stageNumber: []
  };
  var lenStore = {
    number     : [],
    sequence   : [],
    stage      : [],
    stageName  : [],
    stageNumber: []
  };
  var len = {
    number     : 0,
    sequence   : 0,
    stageName  : 0,
    stageNumber: 0
  };
  var v = [];

  // Fill stores up!
  versions.forEach(function (_version) {
    var compose = composeVersion(_version, regex, options.allow_null);
    v.push(compose);
    store.number.push(compose.number);
    store.stage.push(compose.stage);
    store.stageName.push(compose.stageName);
    store.stageNumber.push(compose.stageNumber);
  });

  v.forEach(function (_version) {
    // number
    _version.number.split('.').forEach(function (_sequence) {
      lenStore.number.push(parseInt(_sequence));
    });
    // sequence
    lenStore.sequence.push(_version.number.split('.').length);
    // stageName
    if (_version.stageName === null) {
      lenStore.stageName.push('');
    } else {
      lenStore.stageName.push(_version.stageName);
    }
    // stageNumber
    if (_version.stageNumber === null) {
      lenStore.stageNumber.push(0);
    } else {
      lenStore.stageNumber.push(parseInt(_version.stageNumber));
    }
  });

  lenStore.stageName = _.union(lenStore.stageName);
  lenStore.stageName.sort(function(a, b) {
    return a.localeCompare(b);
  });

  // Transform the store on unique stage names in order to place stable versions
  // at the end.
  lenStore.stageName[0] = null;
  lenStore.stageName.push('');


  // Number of digit in the biggest sequence
  len.number      = _.max(lenStore.number).toString().length;
  // Biggest number of sequence
  len.sequence    = _.max(lenStore.sequence);
  //TODO: commenting
  len.stageName   = lenStore.stageName.length.toString().length;
  //TODO: commenting
  len.stageNumber = _.max(lenStore.stageNumber).toString().length;


  var versionsSort = [];

  v.forEach(function (_version, _i) {
    if (options.ignore_stages && _version.stageName) {
      return;
    }
    var calc = '';

    // number
    var split       = _version.number.split('.');
    var missingDots = new Array(len.sequence - split.length + 1).join('.');
    var versionFull = _version.number + missingDots;
    versionFull.split('.').forEach(function (_sequence) {
      calc += new Array(len.number - _sequence.length + 1).join('0');
      calc += _sequence;
    });

    // stageName
    var stageName = _version.stageName || '';
    var stageNameIndex = _.indexOf(lenStore.stageName, stageName);
    var stageNameLen   = stageNameIndex.toString().length;
    var stageNameZero  = new Array(len.stageName - stageNameLen + 1).join('0');
    calc += stageNameZero + stageNameIndex;

    // stageNumber
    var stageNumLen  = lenStore.stageNumber[_i].toString().length;
    var stageNumZero = new Array(len.stageNumber - stageNumLen + 1).join('0');
    calc += stageNumZero + lenStore.stageNumber[_i].toString();

    // parseInt
    calc = parseInt(calc);

    var index = versions[_i];
    var items = { index: index, calc: calc };
    if (options.nested) {
      items.object = versionsObject[_i];
    }
    versionsSort.push(items);
  });

  versionsSort.sort(function (a, b) {
    return b.calc - a.calc;
  });

  var r = [];
  versionsSort.forEach(function (_versionSort) {
    if (options.nested) {
      r.push(_versionSort.object);
      return;
    }
    r.push(_versionSort.index);
  });

  return r.reverse();

};

/**
 * Transform a string into an exploitable version object.
 * @param str The original string
 * @param regex The regex applied
 * @param allowNull Whether null values are accepted
 * @returns {{number: *, stage: (*|null), stageName: (*|null), stageNumber: (*|null)}}
 */
function composeVersion(str, regex, allowNull) {
  if (allowNull){
    str = str || 0;
  } else if (str === null) {
    throw new Error('To allow passing null values set the `allow_null` option as true.');
  }
  var r = regex.exec(str);
  return {
    number     : r[ 1 ],
    stage      : r[ 2 ] || null,
    stageName  : r[ 3 ] || null,
    stageNumber: r[ 4 ] || null
  };
}
