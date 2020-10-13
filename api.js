const express = require("express"),
	  cors    = require("cors"),
	  mongo   = require("mongodb"),
	  MongoClient = mongo.MongoClient,
	  mongourl = `mongodb+srv://abhi:mongo@abhi@cluster0.ddjzu.mongodb.net/zomato?retryWrites=true&w=majority`,
	  morgan  = require("morgan"),
	  fs      = require("fs"),
	  path    = require("path"),
	  port    = process.env.PORT || 2000;
	  accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {flags:'a'});
	  app     = express();
var db;

//APP CONFIGURATION
app.use(cors());
app.use(morgan('tiny', {stream: accessLogStream}));


//API ROUTES
app.get("/", (req, res)=>{
	res.send("<a href='/restaurant'>Restauant</a><br/><a href='/mealtype'>MealType</a><br/><a href='/location'>Location</a>");
});

app.get("/mealtype", (req, res)=>{
	db.collection("mealtype").find().toArray((err, data)=>{
		if(err) throw err;
		res.send(data);
	})
})

app.get("/restaurant", (req, res)=>{
	var query;
	if(req.query.city){
		query = {"city_name": req.query.city}
	}
	else if(req.query.mealtype){
		query = {"type.name": req.query.mealtype}
	}
	else if(req.query.cuisine){
		query = {"Cuisine.name": req.query.cuisine}
	}
	else if(req.query.cuisine && req.query.mealtype){
		query = {"Cuisine.name": req.query.cuisine, "type.name": req.query.mealtype}
	}
	else if(req.query.city && req.query.mealtype){
		query = {"city_name": req.query.city, "type.name": req.query.mealtype}
	}
	else{
		query = {};
	}

	db.collection("restaurant").find(query).toArray((err, data)=>{
		if(err) throw err;
		res.send(data);
	})
});

app.get("/restaurant/:name", (req, res)=>{
	db.collection("restaurant").find({"name": req.params.name}).toArray((err, data)=>{
		if(err) throw err;
		res.send(data);
	})
})

app.get("/location", (req, res)=>{
	db.collection("location").find().toArray((err, data)=>{
		if(err) throw err;
		res.send(data);
	})
});

//MONGO CONNECTION AND SERVER CONNECTION

MongoClient.connect(mongourl,(err, connection)=>{
	if(err) throw err;
	db = connection.db("zomato");
	app.listen(port, (err)=>{
		if(err) throw err;
		console.log("Server is running");
	});
});