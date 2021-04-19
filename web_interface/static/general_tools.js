const sleep = (miliseconds) => { // Custom function to facilitate timeouts
	return new Promise(resolve => setTimeout(resolve, miliseconds))
}

var cfg = {
	// radius should be small ONLY if scaleRadius is true (or small radius is intended)
	// if scaleRadius is false it will be the constant radius used in pixels
	"radius": 16,
	"maxOpacity": .9,
	// scales the radius based on map zoom
	"scaleRadius": false,
	// if set to false the heatmap uses the global maximum for colorization
	// if activated: uses the data maximum within the current map boundaries
	//   (there will always be a red spot with useLocalExtremas true)
	"useLocalExtrema": false,
	// which field name in your data represents the latitude - default "lat"
	latField: 'lat',
	// which field name in your data represents the longitude - default "lng"
	lngField: 'lng',
	// which field name in your data represents the data value - default "value"
	valueField: 'count'
}

function avg_points(lonlat) { // Calculates the center position among a set of coordinates
	let sum_lat = 0
	let sum_lon = 0
	for (var i = 0; i < lonlat.length - 1; i++) {
		sum_lon += lonlat[i][0]
		sum_lat += lonlat[i][1]
	}
	return [sum_lon / lonlat.length, sum_lat / lonlat.length]
};


function update_legend(min, max, count) { // Updates the map's legend
	document.getElementById("min").innerHTML = min.toString()
	document.getElementById("max").innerHTML = ">" + max.toString()
	document.getElementById("tweets_in_view").innerHTML = "Tweets in view: " + count.toString()
}


function update() { // Updates frame/map
	document.getElementById("date_text").innerText = format_date(current_date);
	update_heatmap();
}


mymap = set_map(avg_points(coords)) // Sets up the map

mymap.on("zoomend", function () { // This functions runs every time a zoom has happened
	update();
})
mymap.on("moveend", function () { // This runs every time a move has happened
	update();

})

window.onload = function () { // Initialising our heatmap, and starts updating
	current_date = new Date(datetimes[0]);	// Current date is the first in our set
	current_coords = coords;
	current_texts = texts;
	current_datetimes = datetimes;

	filters = Object.keys(Object.values(rest)[0]).slice(3)


	for (let filter of filters) { // Adds filter to the menu
		let div = document.getElementById("filters")
		let checkbox = document.createElement("input");
		checkbox.type = "checkbox"
		checkbox.name = filter;
		checkbox.id = filter;
		checkbox.onclick = function () {
			if (this.checked) {
				filter_update(this.name)
			}
			else {
				filter_update()
			}
			for (let f of filters) {
				if (f != filter) {
					document.getElementById(f).checked = false;
				}
			}


		}

		div.appendChild(checkbox);

		let label = document.createElement("label");
		label.appendChild(document.createTextNode(filter));
		div.appendChild(label);
	}

	add_heatmap(cfg, mymap, current_coords, parseInt(current_coords.length * 0.001), parseInt(current_coords.length * 0.01))
	update()
	go_to_best_day()


}
