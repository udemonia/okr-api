# Example .env file

This file is located in the config folder but its not included in the repo

Create a .env file and use the below as a guide for the environment variables used.

``` js
PORT=5000
NODE_ENV=development-env
MONGO_URI={{your mongo db url}}

PHOTO_UPLOAD_LIMIT=1000000
PHOTO_UPLOAD_PATH=../public/uploads

JWT_SECRET={{ your random characters }}
JWT_EXPIRE={{ your token expiration time }}

```
