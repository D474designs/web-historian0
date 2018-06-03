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
    var urlPath = parts.pathname === '/' ? '/index.html' : parts.pathname;
    //look inside the public and archives/sites
    //if exists, serve it
    //Prioritize loading from public 
    utils.serveAssets(response, urlPath, () => {
      archive.isUrlInList(urlPath.slice(1), (found) => {
        if (found) {
          utils.sendRedirect(response, '/loading.html');
        } else {
          utils.send404(response);
        }
      });
    });
  },
  'POST': function (request, response) {
    utils.collectData(request, (data) => {
      var url = data.split('=')[1];
      // Is the data in sites.txt?
      archive.isUrlInList(url, (found) => {
        //If yes
        if (found) {
          // Is it archived?
          archive.isUrlArchived(url, (exists) => {
            if (exists) { //if yes              
              //Display page
              utils.sendRedirect(response, '/' + url);
            } else { //if no
              //redirect loading page
              utils.sendRedirect(response, '/loading.html');
            }
          });
          //if no
        } else {
          //append to sites.txt
          archive.addUrlToList(url, () => {
            //redirect loading page
            utils.sendRedirect(response, '/loading.html');
          });
        }
      });
    });
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
