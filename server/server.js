var cc          = require('config-multipaas'),
    restify     = require('restify'),
    fs          = require('fs')

var config      = cc();
    app         = restify.createServer();
var mongoose = require('mongoose');
app.use(restify.CORS());
app.use(restify.queryParser());
app.use(restify.fullResponse());
app.use(restify.acceptParser(app.acceptable));
app.use(restify.jsonp());
app.use(restify.bodyParser({ mapParams: false }));
var url = '127.0.0.1:27017/' + process.env.OPENSHIFT_APP_NAME;
/*
// if OPENSHIFT env variables are present, use the available connection info:
if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    url = process.env.OPENSHIFT_MONGODB_DB_URL +
    process.env.OPENSHIFT_APP_NAME;
}
*/
// Connect to mongodb
/*var connect = function () {
  //  mongoose.connect(url);
  mongoose.connect('mongodb://localhost/test');
};
connect();

var db = mongoose.connection;

db.on('error', function(error){
    console.log("Error loading the db - "+ error);
});

db.on('disconnected', connect);*/
data1 =  require( __dirname +'/titles.json');
data2 =  require( __dirname +'/shedules.json');
var writeData =function(data,path1) {

 var mydata = JSON.stringify(data);
  fs.writeFile( __dirname +path1, mydata);
};
var Operations = {
  add: function(data,idData,path1){
      data.push(idData);
      writeData(data,path1);
    },
  change: function(data,changData,idData,path1){
      data[idData] = changData;
      writeData(data,path1);
    },
  remove: function(data,idData,path1){
      data.splice(idData, 1 );
      writeData(data,path1);
    }

};
// Routes
app.get('/status', function (req, res, next)
{
  res.send("{status: 'ok'}");
});

app.get('/', function (req, res, next)
{
  var data = fs.readFileSync(__dirname + '/../myapp/www/index.html');
  res.status(200);
  res.header('Content-Type', 'text/html');
  res.end(data.toString().replace(/host:port/g, req.header('Host')));
});
app.get('/titles', function (req, res, next)
{
  res.send(data1);
  res.status(200);
  console.log("title get");
});
app.get('/shedules/:id', function (req, res, next)
{
	var id = req.params.id
	//data2 =  require( __dirname +'/shedules.json');
  res.send(data2[id]);
  console.log("shed get");
  res.status(200);
});
app.post('/titles/', function (req, res, next)
{
	
    //data1.push(req.body);
 /*var mydata1 = JSON.stringify(data1);
  fs.writeFile( __dirname +'/titles.json', mydata1,function(){
  });
  res.status(200);*/

  Operations.add(data1,req.body,'/titles.json');
  res.end();
  console.log("title post");
});

app.post('/shedules/', function (req, res, next)
{
    /*data2.push(req.body);
 var mydata2 = JSON.stringify(data2);
  fs.writeFile( __dirname +'/shedules.json', mydata2,function(){
    res.send(data2[data2.length]);
    console.log("shed post");
  });*/
 Operations.add(data2,req.body,'/shedules.json')(res.end());
 console.log("shed post");
});

app.put('/shedules/:id', function (req, res, next)
{
	var id = req.params.id;
   Operations.change(data2,req.body,id,'/shedules.json')(res.end());
});

app.del('/shedules/:id', function (req, res, next)
{
  var id = req.params.id;
   Operations.remove(data2,id,'/shedules.json')(res.end());
 // res.status(200);
});


app.put('/titles/:id', function (req, res, next)
{
	var id = req.params.id;
  Operations.change(data1,req.body,id,'/titles.json')(res.end());
});

app.del('/titles/:id', function (req, res, next)
{
  var id = req.params.id;
  Operations.remove(data1,id,'/titles.json')(res.end());
});

app.get(/\/(css|js|img|lib|font|fonts)\/?.*/, restify.serveStatic({directory: '../myapp/www/'}));

app.listen(config.get('PORT'), config.get('IP'), function () {
  console.log( "Listening on " + '127.0.0.1'+ ", port " + config.get('PORT') )
});