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

//Middleware Function to Check Cache
checkCache = (req, res, next) => {
  const { id } = req.params;

  redis_client.get(id, (err, data) => {
    if (err) {
      res.status(500).send(err);
    }
    if (data != null) {
      res.send(data);
    } else {
      next();
    }
  });
};

app.get("/starships/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const starShipInfo = await axios.get(
      `https://swapi.co/api/starships/${id}`
    );

    const starShipInfoData = starShipInfo.data;

    //add data to Redis
    redis_client.setex(id, 3600, JSON.stringify(starShipInfoData));

    return res.json(starShipInfoData);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//listen on port 4000;
app.listen(port, () => console.log(`Server running on Port ${port}`));
