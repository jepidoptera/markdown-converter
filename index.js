const express = require('express');
const http = require('http');
const path = require('path')
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

http.createServer(app).listen(3000);