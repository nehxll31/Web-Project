var express=require('express');
var app=express();
var mysql=require('mysql');
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);
app.use(express.urlencoded());
app.use(express.static(__dirname));
app.post("/", function(req, res){
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
			res.render("Login.ejs", {Username: results[0].Name, Email_ID: results[0].Email, Phone_Number: results[0].Phone_Number});
		}
	});
});
app.listen(3000);
		
		