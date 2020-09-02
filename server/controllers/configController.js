// require in fs to read config file
const fs = require("fs");
const path = require("path");

const configDir = path.join(__dirname, "../../data/validConfig.ini");

const configController = {};

configController.getConfigValues = (req, res, next) => {
  res.locals.config = fs.readFileSync(configDir, (err, data) => {
    if (err) {
      return next(err);
    }
    const config = data;
    res.locals.config = config;
    return next();
  });
  // write code here
  // use fs to read config values and return the corresponding value
  return next();
};

configController.parseConfigValues = (req, res, next) => {
  const { config } = res.locals;
  // convert buffer to array
  const buf = config.toString().split("\n");
  console.log("in controller: ", buf);
  // create JSON object from array
  res.locals.converted = buf;

  return next();
};

configController.makeConfigObj = (req, res, next) => {
  const { converted } = res.locals;
  // iterate over array and create configObj
  const configObj = {};
  converted.forEach(el => {
    // ignore comments from config file
    if (el[0] !== "#") {
      const splitEl = el.split("=");
      // convert the strings to proper data types
      // check to see if first character is a number
      // check to see if number contains a '.'
      // check to see if string of value is 'true / false', 'on / off', 'yes / no' -> convert to boolean
      // ELSE do no conversion and simply store the string (use regex to remove white space)
      // store the keys and values at configObj
      configObj[splitEl[0]] = splitEl[1];
    }
  });

  res.locals.configObj = configObj;
  console.log("in configController.makeConfigObj", configObj);

  return next();
};

configController.addConfigFile = (req, res, next) => {
  res.locals.config = req.body.data;
  const { configFile } = req.body;
  const configPost = `${configDir}/${configFile}.ini`;
  fs.writeFile(configPost, JSON.stringify(res.locals.config), err => {
    if (err) {
      return next(err);
    }
    console.log("file saved!");
    return next();
  });
  // write code here
  // use fs to write entire config file to data directory
  return next();
};

module.exports = configController;
