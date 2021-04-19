from flask import Flask, render_template, request, send_from_directory, jsonify, make_response
app = Flask(__name__)


def get_coords():  # Function that retrieves, organises, and sends on tweet data
    import json
    coords = []
    texts = []
    datetimes = []
    sandies = []
    rest = dict()

    all_info = dict()

    data = json.load(open(
        "found_tweets.json", "r", encoding="utf-8"))

    for tweet in data:
        coords.append(data[tweet]["coord"])
        texts.append(data[tweet]["text"])
        datetimes.append(data[tweet]["datetime"])

        sandies.append(data[tweet]["sandy"])
        rest[tweet] = data[tweet]["rest"]

        all_info[tweet] = {
            "coords": data[tweet]["coord"],
            "text": data[tweet]["text"],
            "datetime": data[tweet]["datetime"],
            "sandy": data[tweet]["sandy"]
        }

        for r in data[tweet]["rest"]:
            all_info[tweet][r] = data[tweet]["rest"][r]

    return coords, texts, datetimes, sandies, all_info


@app.route("/favicon.ico")
def favicon():
    import os
    return send_from_directory(os.path.join(app.root_path, "static"), "favicon.ico")


@app.route('/')
def result():  # Collects data and renders onto map.html with variables
    coords, texts, datetimes, sandies, rest = get_coords()
    return render_template('map.html', result=coords, tweets=texts, dates=datetimes, sandy=sandies, rest=rest)


if __name__ == '__main__':
    app.run(debug=True)
