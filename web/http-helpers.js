var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};


exports.sendResponse = function (response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, exports.headers);
  response.end(JSON.stringify(data));
};

exports.collectData = function (request, cb) {
  var data = '';
  request.on('data', function (chunk) {
    data += chunk;
  });
  request.on('end', function () {
    cb(JSON.parse(data));
  });
};

exports.send404 = function(response){
  exports.sendResponse(response, '404: Page not found', 404);  
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  var encoding  = 'utf-8';
  //1. Check the public folder first before the 
  fs.readFile(archive.paths.siteAssets + asset, encoding, (err, data)=>{
    //if files don't exists, check the archive folder
    if (err) {
      fs.readFile(archive.paths.siteAssets + asset, encoding, (err, data) => {
        if (err) {
          // if we still don't find the file in the archive folder then throw a 404error
          callback ? callback() : exports.send404(res);
        } else {
          // serve the files
          exports.sendResponse(res, data);
        }
      });
    } else {
      //serve the files
      exports.sendResponse(res, data);
    }
  });
};




// As you progress, keep thinking about what helper functions you can put here!
