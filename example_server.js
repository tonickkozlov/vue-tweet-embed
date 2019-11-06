'use strict'
const express = require('express'),
app = express(),
port = 3002;

app.use("/", express.static(__dirname + '/examples'));

console.log('Listening at port', 3002)
app.listen(port);

module.exports = app
