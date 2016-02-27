var dbTest = function(){
// Connect to the database
  var dbConnect = require(DEFS.DIR.DB_CONNECT)('openshift');
  
  this.mysqlAction = function(req, res) {

    dbConnect.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
      if (err) {
        res.send('Solving 1 + 1 Inline using DB Query : Failure : NOT OK' + JSON.stringify(err));
      } else {
        res.send('Solving 1 + 1 Inline using DB Query : Success : OK : ' + rows[0].solution);
      }
    });
  }
}
module.exports = dbTest;
