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
      // split further to remove whitespace
      // check key string for whitespace and remove any extras
      const keySplit = splitEl[0]
        .split("")
        .filter(el => el !== " " && el !== "");
      splitEl[0] = keySplit.join("");
      const secondSplit = splitEl[1].split(" ");
      if (
        secondSplit.includes("true") ||
        secondSplit.includes("yes") ||
        secondSplit.includes("on")
      ) {
        splitEl[1] = true;
        console.log("this should be TRUE: ", splitEl[1]);
      } else if (
        secondSplit.includes("false") ||
        secondSplit.includes("no") ||
        secondSplit.includes("off")
      ) {
        splitEl[1] = false;
        console.log("this should be FALSE: ", splitEl[1]);
      } else {
        const filteredSplit = secondSplit.filter(el => el !== " " && el !== "");
        let numCheck = filteredSplit[0];
        if ((numCheck *= 1 !== "NaN")) {
          // convert to number
          splitEl[1] = numCheck;
        } else {
          // do no conversion and simply store string
          splitEl[1] = filteredSplit[0];
        }
      }
      // TODO: store the string (use regex to remove white space)
      // store the keys and values at configObj
      configObj[splitEl[0]] = splitEl[1];
    }
  });

  res.locals.configObj = configObj;
  console.log("in configController.makeConfigObj", configObj);

  return next();
};

configController.returnValue = (req, res, next) => {
  const { reqVal } = req.body;
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
