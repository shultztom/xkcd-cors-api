const express = require("express");
const router = express.Router();
const request = require("request");

/* GET home page */
router.get("/", function(req, res, next) {
  res.render("index", { title: "xkcd API" });
});

/* GET current comic */
router.get("/api", function(req, res, next) {
  let xkcdJSON = "";
  request(
    { uri: "https://xkcd.com/info.0.json", rejectUnauthorized: false },
    function(error, response, body) {
      try {
        xkcdJSON = JSON.parse(response.body);
        res.json(xkcdJSON);
      } catch (error) {
        res.sendStatus(502);
        return;
      }
    }
  );
});

/* GET comic */
/* Pass 0 as a :id to get the most recent comic and any other comic id to get that comic */
router.get("/api/:id", function(req, res, next) {
  let id = req.params.id;

  if (isNaN(id)) {
    // Error
    res.sendStatus(404);
  } else {
    let min = 1;

    request(
      { uri: "https://xkcd.com/info.0.json", rejectUnauthorized: false },
      function(error, response, body) {
        let max = 1;
        let JSONbody = null;
        try {
          JSONbody = JSON.parse(body);
          max = JSONbody.num;
        } catch (error) {
          res.sendStatus(502);
          return;
        }

        if (id <= max && id >= min) {
          let query = "https://xkcd.com/" + id + "/info.0.json";
          let xkcdJSON = "";

          request({ uri: query, rejectUnauthorized: false }, function(
            error,
            response,
            body
          ) {
            try {
              xkcdJSON = JSON.parse(response.body);
              xkcdJSON.maxNum = max;
              res.json(xkcdJSON);
            } catch (error) {
              res.sendStatus(502);
              return;
            }
          });
        } else if (id == 0) {
          // return most recent comic
          JSONbody.maxNum = max;
          res.json(JSONbody);
        } else {
          res.sendStatus(404);
        }
      }
    );
  }
});

module.exports = router;
