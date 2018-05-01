const Twit = require('twit');
const config = require('./config');
const moment = require('moment');
const http = require('http');


const bot = new Twit(config);
const helloWorld = 'Hello World! May hasn\'t finished yet';
const myHandle = 'HasMayFinished';
const june = moment('2018-06-01 00:00:00')
const hasMayResigned = false;


const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

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

const messages = [
	'May, May go away. Don\'t come again another day.',
	'May should not do as she May, in May.',
	'May does not amaze me.',
	'MAYDAY, MAYDAY. We have a problem.',
	'May the forth be with you. Not that one though.',
	'Mayo, Mayyyyo. Daylight come and me want May gone.'
]

getARandomMessage = function() {
	return  messages[Math.floor(Math.random() * messages.length)];
}

sendRandomTweet = function() {
	var tweet = {
		status: reportDateTime() + ' ' + getARandomMessage()
	}

	tweetStatus(tweet)
}

reportStatus = function() {
	return reportDateTimeAndMonthStatus() + ((hasMayResigned && (moment() >= june)) || (! hasMayResigned && (moment() < june)) ? ' and ' : ' but ') + reportTheresa();
}

reportDateTime = function() {
	return 'It is ' + moment().format('MMMM Do YYYY, h:mm:ss a') + '.';
}

reportDateTimeAndMonthStatus = function() {
	return reportDateTime() + ' May ' + ((moment() >= june) ? 'has' : 'hasn\'t') + ' finished';
}

reportTheresa = function() {
	return hasMayResigned ? 'MAY HAS RESIGNED!!!' : 'May hasn\'t resigned.';
}

tweetStatus({ status: 'Hello World! ' + reportStatus()})

setInterval(sendRandomTweet, 3600000)  // one hour

var stream = bot.stream('user');

stream.on('follow', followed)
stream.on('tweet', tweetReceived)