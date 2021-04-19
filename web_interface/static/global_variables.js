let markers; // Layer for markers
let markers_list = []

let heatmapLayer; // This will keep our layer for the heatmap
let data_dict; // This will keep the data fed into the heatmap

let current_coords = [];
let current_datetimes = [];
let current_texts = [];
let interval = 2

let best_date;

let shortage_filter = false;
let flood_filter = false;
let power_filter = false;
let traffic_filter = false;
let evac_filter = false;
