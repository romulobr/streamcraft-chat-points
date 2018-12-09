const assert = require('assert');
const PointsAggregator = require('../src/points-aggregator');
const loki = require('lokijs');

describe('Points aggregator', function () {
    let aggregator;
    beforeEach(() => {
        const db = new loki('test.json');
        const users = db.addCollection('users');
        aggregator = new PointsAggregator(users);
    });

    it('starts with 0 points', function () {
        let nick = 'monkey';
        const originalPoints = aggregator.getPoints(nick);
        assert.equal(originalPoints, 0);
    });

    it('adds points to user', function () {
        let nick = 'monkey';
        aggregator.addPoints(nick, 1);
        const points = aggregator.getPoints(nick);
        assert.equal(points, 1);
        aggregator.addPoints(nick, 10);
        const morePoints = aggregator.getPoints(nick);
        assert.equal(morePoints, 11);
    });

    it('returns all points', function () {
        let nick = 'monkey';
        let otherNick = 'other monkey';
        let anotherNick = 'another monkey';

        aggregator.addPoints(otherNick, 2);
        aggregator.addPoints(nick, 1);
        aggregator.addPoints(anotherNick, 3);
        assert.equal(JSON.stringify(aggregator.getAllPoints()), JSON.stringify([
            {
                "nick": "another monkey", "points": 3
            }, {
                "nick": "other monkey", "points": 2
            }, {"nick": "monkey", "points": 1}]));
    });

});
