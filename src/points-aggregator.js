class PointsAggregator {
    constructor(collection) {
        this.users = collection
    }

    addPoints(nick, points) {
        const user = this.users.findOne({nick: {'$eq': nick}});
        if (user) {
            user.points = (user.points || 0) + points;
            this.users.update(user)
        } else {
            this.users.insert({nick, points});
        }
    }

    getPoints(nick) {
        const result = this.users.find({nick: nick});
        if (result.length === 0) {
            return 0;
        }
        return result[0].points;
    }

    getAllPoints() {
        return (this.users.chain().where(() => {
            return true;
        }).simplesort('points',{desc:true}).data()).map(user => {
            return {nick: user.nick, points: user.points}
        });
    }
}

module.exports = PointsAggregator;