function minimum_markers(amount) { // Calculates minimum amount of markers needed for heatmap
	if (amount < 10) {
		return parseInt(amount * 0.1)
	}
	return parseInt(amount * 0.01)
}
function maximum_markers(amount) { // Calculates number of markers needed for red heatmap
	if (amount < 10) {
		return parseInt(amount * 0.6)
	}
	return parseInt(amount * 0.1)
}

function remove_markers() { // Removes all markers from the map
	mymap.removeLayer(markers);
	markers_list = []
	markers = undefined
}
//Was functioning fine, encountered leaflet error, may be exsternal.
function add_markers(coord, map) { // Creates markers for input coords on input map, puts them on the markers layer
	var icon = new L.Icon.Default()
	icon.options.shadowSize = [0, 0]

	if (markers != undefined) {
		remove_markers();
	}

	for (var i = coord.length - 1; i >= 0; i--) {
		let twitter_code = current_texts[current_coords.indexOf(coord[i])]
		let marker = L.marker([coord[i][0][0], coord[i][0][1]], { icon: icon }).bindPopup(twitter_code) //
		if (marker) {
			markers_list.push(marker);
		}
	}

	markers = L.layerGroup(markers_list);
	markers.addTo(mymap);
}

//Was functioning fine, encountered leaflet error. 
function add_markers_in_view(limit) { // Adds the markers to our map that are in the view
	if (markers != undefined) {
		remove_markers()
	}
	let m = markersInView();
	add_markers(m, mymap,);
}

function markersInView() { // Finds and returns all markers currently in the viewport
	let viewable = []
	for (let coord of data_dict.data) {
		if (mymap.getBounds().contains(coord)) {
			viewable.push([[coord.lat, coord.lng]])
		}
	}
	return viewable;
}

function all() {
	current_coords = coords;
	current_texts = texts;
	current_datetimes = datetimes;

	go_to_best_day();
	update()
}

let sandy_filter = false; //Draws the tweets that mention sandy to the map 
function sandy() {
	let scoords = [];
	let txt = []
	let dt = []
	for (let index in sandy_ids) {
		if (sandy_ids[index] != "false") {
			scoords.push(coords[index])
			txt.push(texts[index])
			dt.push(datetimes[index])
		}
	}

	current_coords = scoords;
	current_texts = txt;
	current_datetimes = dt;
	sandy_filter = true;
	go_to_best_day();
	update();
}

function filter(filter) {
	let tmp = {};
	if (filter == "") {
		return rest
	}
	for (let tweet in rest) {
		data = rest[tweet]
		if (data[filter] == "true") {
			tmp[tweet] = rest[tweet]
		}
	}
	return tmp
}

function filter_update(filt = "") {
	let tweets = filter(filt)
	let coords = []
	let dt = []
	let txt = []

	for (let tweet in tweets) {
		coords.push(tweets[tweet]["coords"])
		dt.push(tweets[tweet]["datetime"])
		txt.push(tweets[tweet]["text"])
	}
	current_coords = coords;
	current_datetimes = dt;
	current_texts = txt;
	go_to_best_day()
	update();
}


function show_all_markers() {
	current_date = new Date(datetimes[0]);	// Current date is the first in our set

	current_coords = coords;
	current_texts = texts;
	current_datetimes = datetimes;

	add_heatmap(cfg, mymap, current_coords, minimum_markers(current_coords.length), maximum_markers(current_coords.length))
	update()
}
