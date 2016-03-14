var express = require('express');
var app = express();
app.use(express.static(__dirname));
app.get('/', function(req, res) {
  res.sendFile(__dirname +'/index.html', function(err){
    if(err)
    {
      	console.log("error");
    }
    else{
      console.log("server is running!");
    }
  })
});
app.listen(1385);