import codecs, json
al = {}
for i in range(8):
	with codecs.open(f"./../sparkorama/csv_ut/part-0000{i}-3581bb79-d5b3-4fec-82d1-e88bb216614d-c000.csv", "r", encoding="utf-8") as data:
		for line in data:
			try:
				tid, sandy = line.replace("\n", "").replace("\r", "").replace("\t", "").split(",")
				al[tid] = sandy
			except:
				print(line, i)

json.dump(al, open(f"../testern.json", "w", encoding="utf-8"))