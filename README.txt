Prerequisites:
    * Spark 2.4.4
    * Hadoop 2.7
    * Python 3.7 with
        - flask
        - PySpark
        - nltk

In this folder, everything needed to run the project without performing the
scraping of the data and/or analysis is included.

To run the front-end:
    - run flask_site.py
        it HAS to be run from within the web_interface folder
    - open http://localhost:5000

If running the entire process, the following steps are needed:
    1) Run tweets.py
            this fetches all the tweets and prepares them for PySpark
    2) Run the Jupyter Notebook spark_final.ipynb
            PySpark cleans and filters the data as described in the project
            description and exports the tagged classes as CSV
    3) Run combine_datasets.py
            this converts the CSV file from PySpark with the full dataset and
            readies it for the front-end
    4) Run the front-end as described above.
