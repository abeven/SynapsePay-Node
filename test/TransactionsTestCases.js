'use strict';

var assert = require('chai').assert;
var Users = require('../lib/Users.js');
var Nodes = require('../lib/Nodes.js');
var Transactions = require('../lib/Transactions.js');
var Helpers = require('./Helpers.js');

var createPayload = {
  to: {
    type: 'SYNAPSE-US',
    id: Helpers.to_node_id
  },
  amount: {
    amount: 2.10,
    currency: 'USD'
  },
  extra: {
    supp_id: '1283764wqwsdd34wd13212',
    note: 'Deposit to synapse account',
    webhook: 'http://requestb.in/q94kxtq9',
    process_on: 1,
    ip: '192.168.0.1'
  }
};

var testUser;
var testNode;

describe('Transactions', function() {
  this.timeout(30000);

  beforeEach(function(done) {
    Users.get(
      Helpers.client,
      {
        ip_address: Helpers.ip_address,
        fingerprint: Helpers.fingerprint,
        _id: Helpers.user_id
      },
      function(err, user) {
        testUser = user;
        Nodes.get(
          testUser,
          {
            _id: Helpers.node_id
          },
          function(err, node) {
            testNode = node;
            done();
          }
        );
      });
  });

  describe('create', function() {
    it('should create a Transaction object', function(done) {
      Transactions.create(
        testNode,
        createPayload,
        function(err, transaction) {
          assert(transaction.json.recent_status.note === 'Transaction created');
          done();
        }
      );
    });
  });

  describe('get transactions', function() {
    it('should get multiple transactions in a JSON format', function(done) {
      Transactions.get(
        testNode,
        null,
        function(err, json) {
          assert(json['trans'].length > 0);
          done();
        }
      );
    });
  });

  describe('get with trans _id', function() {
    it('should get a single Transaction object', function(done) {
      Transactions.get(
        testNode,
        {
          _id: Helpers.trans_id
        },
        function(err, transaction) {
          assert(transaction.json['_id'] === Helpers.trans_id);
          done();
        }
      );
    });
  });
});
