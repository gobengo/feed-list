# feed-list

Render a [stream-feed](https://github.com/gobengo/stream-feed) as a list in an HTMLElement.

## API

Construct with a feed and optionally an HTMLElement .el. Otherwise a `<ul />` .el will be created for you.

`.render(optionalEl)` will set the innerHTML of optionalEl or this.el;

```javascript
var Feed = require('stream-feed');
var FeedList = require('feed-list');

var feed = new Feed([1,2,3]);
var el = document.createElement('ul');

var list = new FeedList(feed);
// another el was created for you
assert(list.el.nodeType === 1)
assert(list.el !== el);
// will render in el (once)
list.render(el);
assert(el.children.length, 3);

// pass opts.el to always render there
var list = new FeedList({
    feed: feed,
    el: el
});
assert(list.el === el);
assert(list.el.children.length, 3);

// re-renders on feed add
feed.add(4);
assert(list.el.children.length, 4);
```


