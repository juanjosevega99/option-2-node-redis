//set up dependencies
const express = require("express");
const redis = require("redis");
const axios = require("axios");
const bodyParser = require("body-parser");

//setup port constants
const port_redis = process.env.PORT || 6379;
const port = process.env.PORT || 4000;

//configure redis client on port 6379
const redis_client = redis.createClient(port_redis);

//configure express server
const app = express();

//listen on port 4000;
app.listen(port, () => console.log(`Server running on Port ${port}`));
