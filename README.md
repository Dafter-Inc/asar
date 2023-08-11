# asar

Selfie App for Asar's #CleanAirForBlueSkies Campaign

## Usage

Some environment variables are needed for the application to run.

Core:

- SECRET_KEY = ""
- DATABASE_URI = (postgresql://username:password@host:port/database) or (sqlite:///app.db)

Storage (for the images - will require Cloudinary account)

- CLOUD_NAME = 
- API_KEY = 
- API_SECRET = 

To run, use the following command:

```
python main.py
```
