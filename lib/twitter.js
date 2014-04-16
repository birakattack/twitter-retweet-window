var twit = require('twit'),
    async = require('async'),
    _ = require('underscore'),
    moment = require('moment');

var Twitter = function Twitter(auth, streamPath) {
  this.stream = new twit(auth).stream(streamPath);
  this.mostRetweets = [];
  this.tweetIds = [];
  process.stdout.write('\u001B[2J\u001B[0;0f');
}

Twitter.prototype.getTopTenRetweets = function(interval) {
  var context = this;
  if(!parseInt(interval)) throw new Error("Interval must be an integer");

  this.stream.on('tweet', function(tweet) {
    var minWindowTime = moment().utc().subtract(interval, 'minutes');

    if(tweet.retweeted_status) {
      var tweetMomentDiff = moment(tweet.retweeted_status.created_at, 'ddd MMM DD HH:mm:ss ZZ YYYY').diff(minWindowTime, 'minutes');
      if(tweetMomentDiff <= interval && tweetMomentDiff >= 0) {
        context.addTweet(tweet.retweeted_status);
      }
    }

    //clears console to show updated values
    process.stdout.write('\u001B[2J\u001B[0;0f');
    //print current list of most retweeted tweets within the window
    var count = 0;
    async.each(context.mostRetweets, function(item, callback) {
      console.log(item.created_at + ' ' + item.id + ' ' + item.retweet_count);

      count++;
      callback();
    }, function() {
    });
  });

  this.stream.on('warning', function(warning) {
    context.stream.stop();
    console.log('STREAM STOPPED: ' + warning.message);
  });
};

Twitter.prototype.addTweet = function(tweet) {
  var context = this;

  if(context.mostRetweets.length === 0){
    context.mostRetweets.push(tweet);
  } else {
    //if the tweet already exists within the list remove it
    var tweetIndex = context.getTweetIndex(tweet.id);
    if(tweetIndex > -1) {
      context.mostRetweets.splice(tweetIndex, 1);
    }

    //insert tweet in sorted order
    var insertedIndex = context.addTweetInSortedOrder(tweet);

    //pop trailing last tweet with lowest retweet count
    if(context.mostRetweets.length > 10) {
      context.mostRetweets.pop();
    }
  }
};


Twitter.prototype.getTweetIndex = function(tweet_id) {
  var context = this;
  for(var i=0; i < context.mostRetweets.length; i++) {
    if(context.mostRetweets[i].id === tweet_id) {
      return i;
    }
  }
  return -1;
};

Twitter.prototype.addTweetInSortedOrder = function(tweet) {
  var context = this;
  var sortedIndex = _.sortedIndex(context.mostRetweets, tweet, function(obj) {
        return -obj.retweet_count;
      }, 'retweet_count');
  context.mostRetweets.splice(sortedIndex, 0, tweet);
  return sortedIndex;
};

module.exports = Twitter;
