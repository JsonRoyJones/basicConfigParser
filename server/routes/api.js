const express = require("express");

const configController = require("../controllers/configController");

const router = express.Router();

// route for getting specific config values
router.post(
  "/value",
  configController.getConfigValues,
  configController.parseConfigValues,
  configController.makeConfigObj,
  configController.returnValue,
  (req, res) => {
    console.log("server location: ", res.locals.configObj);
    console.log("logging return value: ", res.locals.returnValue);
    res.status(200).json(res.locals.returnValue);
  }
);

// route for importing a new config file
router.post("/import", configController.addConfigFile, (req, res) =>
  res.status(200).json(req.body)
);

module.exports = router;
