
var locations = function() {

  var locationsApi       = require(DEFS.DIR.API_HELPER_LOCATIONS);
  var locObj             = new locationsApi();

  this.getLocationsAction = function(req,res) {

    locObj.getLocations(function(locationsApi) {
    // API error
      if(!locationsApi) {
        console.log('Locations API error');
        res.send(JSON.stringify({ 'error' : 'Get Locations DB call failed' }));
      } else {
        res.send(JSON.stringify({ 'locationList' : locationsApi }));
      }
    });
  }

  this.getLocationsByIdAction = function(req,res) {

    if(typeof req.query.name === 'undefined') {
      res.send(JSON.stringify({ 'error' : 'No location name provided to fetch the ID' }));
    } else {
      locObj.getLocationId(req.query.name, function(id) {
        if(!id) {
          console.log('Location ID API error');
          res.send(JSON.stringify({ 'error' : 'Get Location ID DB call failed' }));
      } else {
          res.send(JSON.stringify({ 'locationId' : id }));
        }
      });
    }
  }

}
module.exports = locations;
