var dbTestMongo = function() { 

  var mongodb = require(DEFS.DIR.DB_CONNECT)('openshift_mongo'); // set global variable db connection

    this.action = function(req, res) {

      // Example: brand_image 
      var reqArrayLocal = {};
      reqArrayLocal.brand_id = '1';
      reqArrayLocal.brand_name = 'hello';
      reqArrayLocal.public_id = '11234';
      reqArrayLocal.image_type = 'logo';
      reqArrayLocal.ldpi = 'www';
      reqArrayLocal.mdpi = 'www';
      reqArrayLocal.hdpi = 'www';

      var collection = dbConnectMongo.collection('brand_image');
      _buildImageJson(reqArrayLocal, function(jsonData) {
        collection.insert([jsonData], function (err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
          }
          dbConnectMongo.close();  
          res.send("Success");
        });
      });
    }

  var _buildImageJson = function(reqArray, callback) {

    /* Sample JSON for Insert*/
    /*{
       "_id" : ObjectId("55c665b70e7e744618b54db9"),
       "brand_id" : "1",
       "brand_name" : "hello",
       "public_id" : "11234",
       "images" : [ 
           {
               "image_type" : "logo",
               "image_resolution" : {
                   "ldpi" : "www",
                   "mdpi" : "www",
                   "hdpi" : "www"
               }
           }
       ]
    }*/

    var jsonData = {};
    var imageResObj = {};
    var images = [];
    var imagesObj = {};
    var keys = Object.keys(reqArray);
    keys.forEach(function(key) { // Loop through each key
      var value = reqArray[key];
      if(key === 'ldpi' || key === 'mdpi' || key === 'hdpi') {
        imageResObj['' + key] = value;
      } else if(key === 'image_type') {
        imagesObj['' + key] = value;
      } else {
        jsonData['' + key] = value;
      }
    });
    imagesObj['image_resolution'] = imageResObj;
    images.push(imagesObj);
    jsonData['images'] = images;
    callback(jsonData);
    return;
  }
}
module.exports = dbTestMongo;
