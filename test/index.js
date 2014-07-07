var assert = require('chai').assert;
var sinon = require('sinon');

var Feed = require('stream-feed');
var FeedList = require('feed-list');
var activityMocks = require('activity-mocks');
var raf = require('raf');
var domify = require('domify');

function testFeedList(list) {
    assert.instanceOf(list, FeedList);
    // has .el HTMLElement
    assert.equal(list.el.nodeType, 1);    
}

describe('feed-list', function () {
    it('must be constructed with a feed', function () {
        assert.throws(function () {
            testFeedList(new FeedList());            
        });
    });
    it('can be constructed with opts.el', function () {
        var el = document.createElement('div');
        var list = new FeedList({
            el: el,
            feed: new Feed(nActivities(5))
        });
        testFeedList(list);
        assert.equal(list.el, el);
    });
    it('can be constructed with just a feed', function (done) {
        var n = 5;
        var activities = nActivities(n);
        var feed = new Feed(activities);
        var el = document.createElement('ul');
        assert.equal(feed.length, n);
        var list = new FeedList(feed);
        testFeedList(list);
        // should have rendered initially
        assert.equal(list.el.children.length, n);
        // adding to feed manually should render
        feed.add(nActivities(1))
        assert.equal(list.el.children.length, n+1);
        // write some data into more stream, then fetch it
        // and ensure it was rendered
        var moreAmount = 10;
        nActivities(moreAmount).forEach(function (a) {
            feed.more.write(a);
        })
        feed.fetchMore(moreAmount, function () {
            assert.equal(list.el.children.length, n+1+moreAmount);
            done();
        });
    });
});

var mocks = activityMocks.toArray();
var activitiesCreated = 0;
function createActivity(id) {
    var a = activityMocks.create('livefyre.sitePostCollection');
    // var a = mocks[Math.floor(Math.random() * mocks.length)];
    a.id = id || activitiesCreated++;
    return a;
}

// create an array of N activities
function nActivities(n) {
    var i = 0;
    var activities = [];
    while (i < n) {
        activities.push(createActivity());
        i++;
    }
    return activities;
}
