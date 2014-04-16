var twitter = require('./lib/twitter.js');

var auth = {
  consumer_key: '',
  consumer_secret: '',
  access_token: '',
  access_token_secret: ''
};

var test = new twitter(auth, 'statuses/sample');
test.getTopTenRetweets(process.argv[2]);
