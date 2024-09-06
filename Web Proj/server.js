var express=require('express');
var app=express();
var mysql=require('mysql');
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);
app.use(express.urlencoded());
app.use(express.static(__dirname));
app.get("/", function(req, res){
	console.log("Connected.");
	res.sendFile(__dirname+"/Interior.html");
});
app.post("/", function(req, res){
	console.log("Signup");
	var SQLQuery="insert into WebsiteUsers values (NULL, '"+req.body.Name+"', '"+req.body.Email+"', '"+req.body.Contact_Number+"', '"+req.body.Set_Password+"')";
	if(req.body.Set_Password!=req.body.Confirm_Password)
	{
		res.render("Signup.ejs", {messagedata:{message: "The passwords do not match.", sent:"False"}});
	}
	else{
	var con=mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "matrixX45$",
	database: "FullStackProject"
	});
	con.connect();
	con.query("select count(Email) as count from websiteusers where email='"+req.body.Email+"'", function(err, result){
	if (err) console.log("Error");
	if(result[0].count!==0)
	{
		res.render("Signup.ejs", {messagedata:{message:"This email already exists. Please enter another email.", sent: "True"}});
	}
	else
	{
		con.query("select count(Phone_Number) as count from websiteusers where Phone_Number='"+req.body.Contact_Number+"'", function(err, result){
			if (err) console.log("Error");
			if(result[0].count!==0)
			{
				res.render("Signup.ejs", {messagedata:{message:"This phone number already exists. Please enter another phone number.", sent:"True"}});
			}
			else
			{
				con.query(SQLQuery, function (err, result) {
					if (err) console.log("Error");
					res.render("Interior.ejs",{messagedata:{message:"Successfully registered", sent:"True"}});
					});
			}
		});
	}
	});
}
});
app.post("/Interior.html", async function(req, res){
	if(req.body.from_choices=="True"){
		var con=mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "matrixX45$",
		database: "FullStackProject"
	});
	con.connect();
	function insertingintotable(SQLQuery){
		return new Promise((resolve,reject)=>{
			con.query(SQLQuery, function(err, results){
			if(err) consolelog("Error in inserting");
			resolve(results.affectedRows);
			});
		});
	}
	const array=req.body.element_type.split(",");
	let i;
	var alreadypresent="";
	for(i=0; i<array.length-1; i++)
	{
		SQLQuery="insert into choices(email_id, room_name, element_name) select '"+req.body.email_id+"','"+req.body.room_type+"','"+array[i]+"' where not exists(select * from choices where email_id='"+req.body.email_id+"' and room_name='"+req.body.room_type+"' and element_name='"+array[i]+"')";
		console.log("i value is "+i+"for sql query "+SQLQuery);
		var affectedRows;
		affectedRows=await insertingintotable(SQLQuery);
		if(affectedRows==0){
		alreadypresent=alreadypresent+array[i]+",";
		}
	}
	con.query("select * from websiteusers where email='"+req.body.email_id+"'", function(err, results){
		if (err) console.log("Error");
		res.render("Login.ejs", {Username: results[0].Name, Email_ID:results[0].Email, Phone_Number: results[0].Phone_Number, fromchoices:"True", room_type:req.body.room_type, alreadypresent:alreadypresent});
		});
	}
	else if(req.body.choices_to_homepage=="True"){
		console.log("Going to homepage from viewing the choices page.");
		var con=mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "matrixX45$",
		database: "FullStackProject"
		});
		con.connect();
		con.query("select * from websiteusers where email='"+req.body.email_id+"'", function(err, results){
			if(err) console.log("Error");
			res.render("Login.ejs", {Username: results[0].Name, Email_ID:results[0].Email, Phone_Number: results[0].Phone_Number, fromchoices:"No", room_type: req.body.room_type,alreadypresent:""});
		});
	}
	else{
	var SQLQuery="select * from websiteusers where Email='"+req.body.Email_ID+"' and Set_Password='"+req.body.Password+"'";
	var con=mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "matrixX45$",
	database: "FullStackProject"
	});
	con.connect();
	con.query(SQLQuery, function (err, results) {
		if (err) console.log("Error");
		if(results.length==0)
		{
			res.render("Unsuccessful_Login.ejs");
		}
		else
		{
			res.render("Login.ejs", {Username: results[0].Name, Email_ID: results[0].Email, Phone_Number: results[0].Phone_Number, fromchoices:"False",room_type:req.body.room_type,alreadypresent:""});
		}
	});
}
});
app.post("/LivingRoom.html", function(req, res) {
	console.log("Living room entered.");
	res.render("LivingRoom.ejs", {Username: req.body.name, email_id: req.body.email_id});
});
app.post("/KitchenRoom.html", function(req, res) {
	console.log("kitchen room entered.");
	res.render("KitchenRoom.ejs", {Username: req.body.name, email_id: req.body.email_id});
});
app.post("/BedRoom.html", function(req, res) {
	console.log("Bed room entered.");
	res.render("BedRoom.ejs", {Username: req.body.name, email_id: req.body.email_id});
});
app.post("/False_Ceiling.html", function(req, res){
	res.render("False_Ceiling.ejs", {Username: req.body.Username, email_id: req.body.Email_ID, Room_Name: req.body.Room_Name});
});
app.post("/Chandeliers.html", function(req, res){
	res.render("Chandeliers.ejs", {Username: req.body.Username, email_id: req.body.Email_ID, Room_Name: req.body.Room_Name});
});
app.post("/Flooring.html", function(req, res){
	res.render("Flooring.ejs", {Username: req.body.Username, email_id: req.body.Email_ID, Room_Name: req.body.Room_Name});
});
app.post("/Furniture.html", function(req, res){
	res.render("Furniture.ejs", {Username: req.body.Username, email_id: req.body.Email_ID, Room_Name: req.body.Room_Name});
});
app.post("/plants.html", function(req, res){
	res.render("plants.ejs", {Username: req.body.Username, email_id: req.body.Email_ID, Room_Name: req.body.Room_Name});
});
app.post("/YourChoices.html", function(req,res){
	if(req.body.delete_your_choices=="True"){
		console.log("Deleting");
		var con=mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "matrixX45$",
		database: "FullStackProject"
		});
		con.connect();
		SQLQuery="delete from choices where email_id='"+req.body.email_id+"' and room_name='"+req.body.room_name+"' and element_name='"+req.body.element_name+"'";
		console.log(SQLQuery);
		con.query(SQLQuery, function(err, Results){
			con.query("select distinct room_name, element_name, image_link from choices, images_links where choices.element_name=images_links.image_name and choices.email_id='"+req.body.email_id+"'", function(err, Results1){
		res.render("YourChoices.ejs",{Results:Results1, email_id: req.body.email_id, Username:req.body.name});
			});
		});
	}
	else{
	var con=mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "matrixX45$",
	database: "FullStackProject"
	});
	con.connect();
	con.query("select distinct room_name, element_name, image_link from choices, images_links where choices.element_name=images_links.image_name and choices.email_id='"+req.body.email_id+"'", function(err, Results){
		res.render("YourChoices.ejs",{Results:Results, email_id: req.body.email_id, Username:req.body.name});
	});
	}
});
app.listen(3000);
