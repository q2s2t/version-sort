/* global describe, it */
'use strict';
var _      = require('underscore');
var chai   = require('chai');
var sorter = require('..');

var expect = chai.expect;

describe('version-sorter module', function () {

  it('should sort softwares by version properly', function () {
    var data = [
      '1.1.0',
      '1.1.4.5687',
      '2.4alpha',
      '2.4beta',
      '2.4',
      '2.4.2',
      '2.4.20alpha',
      '2.4.20beta',
      '2.4.20rc1',
      '2.4.20rc2',
      '2.4.20'
    ];
    var r = sorter(_.shuffle(data));
    expect(r).to.eql(data);
  });

  it('should fail to sort when version format is wrong', function () {
    var data = [ 'wrong?' ];
    try {
      sorter(data);
    } catch (err) {
      var type = Object.prototype.toString.call(err);
      expect(type).to.contain('Error');
    }
  });

});
