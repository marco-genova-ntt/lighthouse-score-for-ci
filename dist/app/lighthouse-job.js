"use strict";

var _analyzer = require("./analyzer");

(0, _analyzer.launchChromeAndRunLighthouse)('https://www.leroymerlin.it/prodotti/specchi-bagno-CAT35-c').then(_analyzer.defaultLighthouseManager).catch(err => console.error("error during job execution: %s", err.message));