var mongo  		= require('mongodb');
var monk   		= require('monk');
var bcrypt 		= require('bcrypt');
var db     		= monk('localhost:27017/mydb');
var jwt    		= require('jwt-simple');
var collection  = db.get('usercollection');

exports.index = function(req, res){
  res.render('index');
};

exports.register = function(req, res){
  	res.render('register');
};

exports.create =  function(req, res){
	//Validations
	if(req.body.password == req.body.password2 && req.body.username.length>0 && req.body.password.length>0){
		//Create username
		bcrypt.hash(req.body.password, 5, function( err, bcryptedPassword) {
			collection.insert({
		        "username" : req.body.username,
		        "password" : bcryptedPassword
		    }, function (err, doc) {
		        if (err) {
		            res.json("An Error Ocurred");
		        }
		        else {
		            res.json("inserted");
		        }
		    });
		});
	}else{
		res.json("Complete All The Fields");
	}
}

exports.signin =  function(req, res){
	//Get Usertname
	if(req.body.password && req.body.username){
		collection.findOne({"username": req.body.username}, function(err, doc) {
	       if(doc != null){
	       		//Bcrypt to ssee if the passwords match
	       		bcrypt.compare(req.body.password, doc.password, function(err, match){
	       			if(match){
		       			var tokenSecret ="YourSecretCode";
		       			var token = jwt.encode({username: req.body.username}, tokenSecret);
						res.json({token : token});
					}else{
						res.json("error");
					}
	       			//Create JWT token
				});
	       }else{
	       	res.json("error");
	       }
	    });
	}else{
		res.json("error");
	}
};

exports.profile = function (req, res){
	res.render('profile');
};

exports.token = function (req, res){
	var tokenSecret ="YourSecretCode";
	var decoded = jwt.decode(req.headers.token, tokenSecret);
	res.json(decoded.username);
};