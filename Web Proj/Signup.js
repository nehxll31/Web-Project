var express=require('express');
var app=express();
var mysql=require('mysql');
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);
app.use(express.urlencoded());
app.use(express.static(__dirname));
app.post("/", function(req, res){
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
app.listen(3000);

