const chatParser = require('../src/chat-parser');
const exampleData = require('./example-data');
var assert = require('assert');

describe('ChatParser', function () {
    it('should parse a message', function () {
        assert.equal(JSON.stringify(chatParser.parseData(exampleData[0])), JSON.stringify({
            nick: 'luizfelipe0213453757'
        }));
    });
});
