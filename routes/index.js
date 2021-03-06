var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var obId = require('mongodb').ObjectID;
var assert = require('assert');

var url = 'mongodb://localhost:27017/test';

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/get-data',function(req, res, next){
	var resultArray = [];
	mongo.connect(url, function(err,db){
		assert.equal(null, err);
		var cursor = db.collection('user-data').find();
		cursor.forEach(function(doc, err){
			assert.equal(null ,err);
			resultArray.push(doc);
		},function(){
			db.close();
			res.render('index',{items: resultArray});
		});
	})
});

router.post('/insert',function(req, res, next){
	var item = {
		title: req.body.title,
		content: req.body.content,
		price: req.body.price,
		type: req.body.type,
		url: '/images/tv.png',
		new: req.body.new,
		inptName: req.body.inptName
	};

	if(item.type=="monitor"){
		item.url="/images/monitor.png";
	}
	else if(item.type=="telefon"){
		item.url="/images/phone.png";
	}
	else if(item.type=="komputer"){
		item.url="/images/computer.png";
	}

	mongo.connect(url, function(err, db){
		assert.equal(null, err);
		db.collection('user-data').insertOne(item, function(err, result){
			assert.equal(null, err);
			console.log('Item inserted');
			db.close();
		});
	})

	res.redirect('/');
});

router.post('/update',function(req, res, next){

	var item = {
		title: req.body.title,
		content: req.body.content,
		price: req.body.price,
		type: req.body.type,
		url: '/images/tv.png'
	};

	if(item.type=="monitor"){
		item.url="/images/monitor.png";
	}
	else if(item.type=="telefon"){
		item.url="/images/phone.png";
	}
	else if(item.type=="komputer"){
		item.url="/images/computer.png";
	}

	var id = req.body._id;

	mongo.connect(url, function(err, db){
		assert.equal(null, err);
		db.collection('user-data').updateOne({"_id": obId(id)},{$set: item}, function(err, result){
			assert.equal(null, err);
			console.log('Item updated');
			db.close();
		});
	});
	res.redirect('/');
});

router.post('/delete',function(req, res, next){
	var id = req.body.id;

	mongo.connect(url, function(err, db){
		assert.equal(null, err);
		db.collection('user-data').deleteOne({"_id": obId(id)}, function(err, result){
			assert.equal(null, err);
			console.log('Item deleted');
			db.close();
		});
	});
	res.redirect('/');
});


module.exports = router;
