
function format_date(date) {
	let year = date.getFullYear();
	let month = ("0" + date.getMonth()).slice(-2);
	let day = ("0" + date.getDate()).slice(-2);

	let hour = ("0" + date.getHours()).slice(-2);
	let minutes = "00";

	let date_text = year + "-" + month + "-" + day
	let hour_text = hour + ":" + minutes

	return date_text + " @ " + hour_text
}

function date_indices(interval, date = current_date) { // Finds all the indexes between two datetimes
	start = new Date(date)
	console.log(start)
	end = new Date(date)
	end.setHours(end.getHours() + interval)
	console.log(end)
	//end.setDate(end.getDate()+1)

	let indices = []
	for (let date in current_datetimes) {
		let look_date = new Date(current_datetimes[date])

		if (start <= look_date && look_date <= end) {
			indices.push(date)
		}
	}
	return indices
}

function get_date_tweets(interval, date = current_date) { // Gets  tweets from indices 
	let indices = date_indices(interval, date);
	let tweets = []
	for (let index of indices) {
		tweets.push(current_coords[index])
	}
	console.log(tweets.length)
	return tweets
}

function set_day(date) { // Sets the current day/datetime
	current_date = new Date(date);
	filter_datetimes();
}

function advance_hour(date = null) { // Advances datetime by 1 hour
	if (date == null) {
		date = current_date
	}
	date.setHours(date.getHours() + 1);
	filter_datetimes(interval);
	update();
}

function regress_hour(date = null) { // Regresses datetime by 1 hour
	if (date == null) {
		date = current_date
	}

	date.setHours(date.getHours() - 1);
	filter_datetimes(interval);
	update();
}

function advance_day(date = null) { // Advances datetime by 1 day
	if (date == null) {
		date = current_date
	}

	date.setDate(date.getDate() + 1);
	filter_datetimes(interval);
	update();
}

function regress_day(date = null) { // Regresses datetime by 1 day
	if (date == null) {
		date = current_date
	}

	date.setDate(date.getDate() - 1);
	filter_datetimes(interval);
	update();
}

function start_play() { // Starts playback with default rate of 500
	button = document.getElementById("play");
	if (button.value == "⏸") {
		button.value = "▶"
		console.log("stop")
	}
	else {
		button.value = "⏸"
		go_to_start();
		play_time(300);
	}

}

function play_time(rate) { // Plays through the dataset from current_date to the end of the dataset
	if (document.getElementById("play").value == "▶") {
		go_to_best_day()
	}
	else if (current_date < new Date(current_datetimes[current_datetimes.length - 1])) {
		sleep(rate).then(() => advance_hour()).then(() => play_time(rate))
	}
	else {
		console.log("you're in the future, son")
	}
}

function filter_datetimes(interval) { // Updates the heatmap to use only datetime-relevant tweets
	let tweets = get_date_tweets(interval)
	data_dict = generate_data_dict(minimum_markers(tweets.length), maximum_markers(tweets.length), tweets);
	heatmapLayer.setData(data_dict)
}

function find_best_day() {
	// For each day, count tweets with contains_sandy
	// The day with the most tweets will become current_date
	// After play_time() we will revert to best day

	let high = 0;
	let high_date;
	let check_date = new Date(current_datetimes[0]);
	check_date.setHours(0)
	check_date.setMinutes(0)

	let end_date = new Date(current_datetimes[current_datetimes.length - 1])

	while (check_date <= end_date) {
		let dates = get_date_tweets(2, check_date);
		if (dates.length >= high) {
			high = dates.length;
			high_date = check_date
		}
		check_date.setDate(check_date.getDate() + 1)
	}

	best_date = high_date;
}

function go_to_best_day() {
	find_best_day()
	current_date = new Date(best_date);
	current_date.setDate(current_date.getDate() - 1)
	filter_datetimes(interval);
	update()
}

function go_to_start() { // Goes back to 5 hours before dataset starts, and sets the appropriate tweets
	current_date = new Date(current_datetimes[0])
	current_date.setHours(0)
	filter_datetimes(interval)
	update()
}
