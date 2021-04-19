function find_radius(min, zoom) { // Calculates the appropriate radius for our heatmap
	return min * ((zoom - (min - 1)) * 2)
}

function generate_data_dict(min_sample, max_sample, data_lists) { // Generates the data structure required by our Heatmap
	res = { data: [], max: max_sample, min: min_sample }
	for (var i = 0; i < data_lists.length; i++) {
		res.data.push({ 'lat': data_lists[i][0], 'lng': data_lists[i][1], 'count': 1 })
	}
	return res
};

function set_map(start_point) { // Makes the map with proper attribution and settings
	let mymap = L.map("mapid").setView([start_point[0], start_point[1]], 6)
	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
		{
			attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
			zoomOffset: -1,
			tileSize: 512,
			maxZoom: 19,
			minZoom: 4,
			id: 'mapbox/streets-v11',
			unloadInvisibleTiles: true,
			accessToken: 'pk.eyJ1IjoianNrMDI2IiwiYSI6ImNrMmV3OGV5YjBjeHQzZHA2bmQxd3c0dDEifQ._o70xMcyRLZ7pDp0HbvnXA'
		}).addTo(mymap);
	return mymap
}

function update_heatmap(full_set = false) { // This function updates our heatmap to align with zoom level details
	let number_of_markers = markersInView().length
	data_dict.min = minimum_markers(number_of_markers) //detail_level[current_zoom]["min"]
	data_dict.max = maximum_markers(number_of_markers) //detail_level[current_zoom]["max"]
	heatmapLayer.setData(data_dict) // Sends the new data_dict into our heatmap
	let zoom = mymap.getZoom(); // Current zoom level
	heatmapLayer.cfg.radius = find_radius(mymap.getMinZoom(), zoom); // Updates radius
	heatmapLayer._update() // Updates the heatmap layer
	update_legend(data_dict.min, data_dict.max, number_of_markers)

}


function add_heatmap(cfg, map, coordinates, min_data_cap, max_data_cap) { // Adds our heatmap to the normal map
	heatmapLayer = new HeatmapOverlay(cfg);
	heatmapLayer.addTo(map)
	data_dict = generate_data_dict(min_data_cap, max_data_cap, coordinates);
	//delete coords // We now have this data in our data_dict, delete coords to save space
	update_legend(min_data_cap, max_data_cap, coordinates.length)
	heatmapLayer.setData(data_dict);
}
