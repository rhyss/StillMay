const Twit = require('twit');
const config = require('./config');
const moment = require('moment');
const bot = new Twit(config);
const helloWorld = 'Hello World! May hasn\'t finished yet';
const myHandle = 'HasMayFinished';
const june = moment('2018-06-01 00:00:00')
const hasMayResigned = false;

tweetStatus = function(tweet) {
	bot.post('statuses/update', tweet, (err, data, response) => {
		if (err) {
			console.log(err);
		} else {
			console.log(`${data.text} tweeted!`);
		};
	})
}

followed = function(eventMessage) {
	var handle = eventMessage.source.screen_name;
	var reply = {
		status: '@' + handle + ' thanks for the follow. Let\'s hope May finishes soon!'
	}
	tweetStatus(reply)
}


tweetReceived = function(tweet) {
	var recipient = tweet.in_reply_to_screen_name;
	var text = tweet.text;
	var from = tweet.user.screen_name;

	console.log('body: ' + text);
	console.log('to:' + recipient);
	console.log('from: ' + from);
	console.log('id: ' + tweet.id_str);


	if (recipient == myHandle) {
		var reply = {
			status: '@' + from + ' ' + reportStatus(),
			in_reply_to_status_id: tweet.id_str
		};
		tweetStatus(reply);
	}
}

reportStatus = function() {
	return reportDate() + ((hasMayResigned && (moment() >= june)) || (! hasMayResigned && (moment() < june)) ? ' and ' : ' but ') + reportTheresa();
}

reportDate = function() {
	return 'It is ' + moment().format('LL') + '. May ' + ((moment() >= june) ? 'has' : 'hasn\'t') + ' finished';
}

reportTheresa = function() {
	return hasMayResigned ? 'MAY HAS RESIGNED!!!' : 'May hasn\'t resigned.';
}

tweetStatus({ status: 'Hello World! ' + reportStatus()})

var stream = bot.stream('user');

stream.on('follow', followed)
stream.on('tweet', tweetReceived)