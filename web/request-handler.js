var path = require('path');
var archive = require('../helpers/archive-helpers');
var urlParser = require('url');
var utils = require('./http-helpers');


// Actions based on the request
var actions = {
  'GET': function (request, response) {
    // show the page to the user
    // response.end(archive.paths.list);
    var parts = urlParser.parse(request.url);
    parts.pathname; //look inside the public and archives/sites
    utils.serveAssets(response, parts.pathname);
    


    //if exists, serve it
    //Prioritize loading from public

   
  },
  'POST': function (request, response) {
        
  }
};

//what to do when the request comes through
exports.handleRequest = function(request, response) {

  var action = actions[request.method];

  if (action) {
    action(request, response);
  } else {
    utils.sendResponse(respone, 'Not found', 404);
  }  
};
