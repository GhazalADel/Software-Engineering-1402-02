
We used django as the backend for this service. The backend is a REST API that is used by the frontend to register ads and get the ads.

## Installation

First thing first, install the requirements:

```bash
pip install -r requirements.txt
```

## Usage

To run this project simply run the following command:

```bash
python manage.py runserver
```

Then open your browser and go to `http://localhost:8000/` to see the project.



Then add the following line:

```python

DB_NAME = 'defaultdb'
DB_USER = 'avnadmin'
DB_PASSWORD = 'AVNS_QXs1v9qBTveDtLIXZfW'
DB_HOST = 'mysql-374f4726-majidnamiiiii-e945.a.aivencloud.com'
DB_PORT = '11741'
