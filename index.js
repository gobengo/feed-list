'use strict';

module.exports = FeedList;

var Feed = require('stream-feed');
var activityMocks = require('activity-mocks');
var cycle = require('stream-cycle');
var phraser = require('activity-phraser');
var raf = require('raf');
var inherits = require('inherits');
var Event = require('geval');

/**
 * A rendered list of the models in a Feed
 * @constructor
 */
function FeedList(options) {
  var feedList = this;
  var el;
  if ( ! (this instanceof FeedList)) {
    return new FeedList(options);
  }
  /**
   * @param options {Feed|Object}
   * @example {
   *   el: document.getElementById('chillstep-tracks'),
   *   feed: TopicActivityFeed('chillstep')
   * }
   */
  options = options || {};
  this._options = {
    el: options.el || document.createElement('ul'),
    feed: (typeof options.fetchMore === 'function') ? options : options.feed || null
  };

  if ( ! this._options.feed) {
    throw new Error("FeedList must be constructed with a Feed");
  }

  this.el = this._options.el || document.createElement('ul');

  // fetch more on click
  this.el.addEventListener('click', function () {
    self.fetchMore(10);
  });

  /**
   * @event renders - A render ocurred
   * Should occur whenever something is added to the feed
   */
  this.renders = Event(function (emit) {
    render();
    feedList._options.feed.on('add', render);
    function render() {
      emit(feedList.render());
    }
  });
}

/**
 * Render as HTML
 * The phrases are sorted because why not
 */
FeedList.prototype.toHTML = function() {
  var html = this._options.feed.toJSON()
    .map(function (model) {
      return JSON.stringify(model, null, '  ');
    })
    // .sort()
    .map(function (phrase) {
      return "<li><pre>phrase</pre></li>".replace('phrase', phrase);
    })
    .join('\n');
  return html;
};

FeedList.prototype.render = function (el) {
  el = el || this.el;
  if (el) el.innerHTML = this.toHTML();
  return el;
};

function createActivity(id) {
    var mocks = activityMocks.toArray()
    var a = mocks[Math.floor(Math.random() * mocks.length)];
    a.id = id;
    return a;
}
