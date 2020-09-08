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
      // check to see if string of value is 'true / false', 'on / off', 'yes / no' -> convert to boolean
      // trim to remove whitespace
      const keySplit = splitEl[0].trim();
      const valueSplit = splitEl[1].trim();
      if (
        valueSplit === "true" ||
        valueSplit === "yes" ||
        valueSplit === "on"
      ) {
        splitEl[1] = true;
        console.log("this should be TRUE: ", splitEl[1]);
      } else if (
        valueSplit === "false" ||
        valueSplit === "no" ||
        valueSplit === "off"
      ) {
        splitEl[1] = false;
        console.log("this should be FALSE: ", splitEl[1]);
      } else {
        let numCheck = valueSplit;
        if ((numCheck *= 1 !== "NaN")) {
          // convert to number
          splitEl[1] = numCheck;
        } else {
          // do no conversion and simply store string
          splitEl[1] = valueSplit;
        }
      }
      // store the keys and values at configObj
      configObj[keySplit] = splitEl[1];
    }
  });

  res.locals.configObj = configObj;
  console.log("in configController.makeConfigObj", configObj);

  return next();
};

configController.returnValue = (req, res, next) => {
  const reqVal = req.body.item;
  console.log("reqVal: ", res.locals.configObj[reqVal]);
  res.locals.returnValue = res.locals.configObj[reqVal];
  console.log("Returning this value:  ", res.locals.returnValue);

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
