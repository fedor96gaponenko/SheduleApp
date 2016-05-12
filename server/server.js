var cc          = require('config-multipaas'),
    restify     = require('restify'),
    fs          = require('fs');
var config      = cc();
    app         = restify.createServer();
var mongoose = require('mongoose');
// Connect to mongodb
  mongoose.connect('mongodb://admin:admin@ds055905.mlab.com:55905/sheduledb',function(err) {
      if (err) {
        throw err;
      };
  } )
app.use(restify.CORS());
app.use(restify.queryParser());
app.use(restify.fullResponse());
app.use(restify.acceptParser(app.acceptable));
app.use(restify.jsonp());
app.use(restify.bodyParser({ mapParams: false }));
var db = mongoose.connection;

db.on('error', function(error){
    console.log("Error loading the db - "+ error);
});
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open ');
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});


var sheduleSchema = new mongoose.Schema({ shedule: [] });
var  Shedule = mongoose.model('Shedule', sheduleSchema);
data1 =  require( __dirname +'/titles.json');
var writeData =function(data,path1) {

 var mydata = JSON.stringify(data);
  fs.writeFile( __dirname +path1, mydata);
};
var Operations = {
  add: function(data,newData,path1){
      data.push(newData);
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
app.get('/shedules', function (req, res, next)
{
  Shedule.find({}, function (err, shedules){
        
                res.send(shedules);
               console.log("shedulesg");
          
      });
});
app.post('/titles/', function (req, res, next)
{

  Operations.add(data1,req.body,'/titles.json');
  res.send();
  console.log("title post");
});

app.post('/shedules/', function (req, res, next)
{
      var newShed = new Shedule();
       newShed.shedule.push( req.body );
       newShed.save(function () {
    
       Shedule.find({}, function (err, shedules){
        
                res.send(shedules);
               console.log("post");
          
       });
       console.log("new shedule added");
  });  
 console.log("shedule posted");
});

app.put('/shedules/:id', function (req, res, next)
{
	var id = req.params.id;
  var data = [];
  data.push(req.body);
  Shedule.update({_id : id}, {shedule : data},function() {
    Shedule.findById(id, function (err, shedule){
    console.log(shedule.shedule);

      res.send(data);
    });

  }

    );
});

app.del('/shedules/:id', function (req, res, next)
{
  var id = req.params.id;
  Shedule.remove( {_id : id}, function() {
    console.log("shedule deleted"+ id);
    Shedule.find({}, function (err, shedules){
        
                res.send(shedules);
          
       });
  });
  
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