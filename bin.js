#!/usr/bin/env node
"use strict";

var config = require("rc")("ipp-server", {
	name : "ipp-server",
	dir  : process.cwd(),
	port : 3000
});
var nonPrivate = require("non-private-ip");
var url        = require("url");
var fs         = require("fs");
var ip         = nonPrivate() || nonPrivate.private();

var Printer = require("./");

var p = new Printer(config);

p.on("job", function (job) {
	var filename = "printjob-" + job.id + "-" + Date.now() + ".ps";

	job.pipe(fs.createWriteStream(filename)).on("finish", function () {
		console.log("printed:", filename);
	});
});

p.server.on("listening", function () {
	console.log("ipp-server listening on:", url.format({
		protocol : "http",
		hostname : ip,
		port     : config.port
	}));
});
