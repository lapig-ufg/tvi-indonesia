var fs = require("fs");
var async = require("async");
var mongodb = require('mongodb');
var exec = require('child_process').exec;

var geojsonFile = process.argv[2];
var campaign = process.argv[3];
var numInspec = process.argv[4];
var password = (process.argv[5] == null) ? null : process.argv[5];
var initialYear = (process.argv[6] == null) ? 1985 : process.argv[6];
var finalYear = (process.argv[7] == null) ? 2020 : process.argv[7];

var collectionPointsName = "points";
var collectionCampaignName = "campaign";
var dbUrl = 'mongodb://172.18.0.6:27017/tvi-indonesia';

var checkError = function(error) {
	if(error) {
		console.error(error);
		process.exit();
	}
}

var getCoordinates = function(geojsonDataStr) {
	geojsonData = JSON.parse(geojsonDataStr)

	var coordinates = []
	for(var i = 0; i < geojsonData.features.length; i++) {
		coordinates.push(
			{
				"id": geojsonData.features[i].properties['id'],
				"X": geojsonData.features[i].geometry.coordinates[0],
				"Y": geojsonData.features[i].geometry.coordinates[1],
				"uf": geojsonData.features[i].properties['uf'],
				"county": geojsonData.features[i].properties['county'],
				"biome": geojsonData.features[i].properties['biome'],
				"countyCode": geojsonData.features[i].properties['countyCode'],
				"value": geojsonData.features[i].properties.value
			}
		);
	}

	return coordinates;
}

const getInfoByRegionCmd = function(coordinate) {
	regions = "SHP/administrative-boundaries/idn_adm.shp";

	sql = "select json_group_array(json_object( 'countyCode', ADM4_PCODE, 'biome', ADM1_EN, 'state', ADM2_EN, 'county', ADM3_EN )) from idn_adm where ST_INTERSECTS(Geometry,GeomFromText('POINT("+coordinate.X+" "+coordinate.Y+")',4326))"
	return 'ogrinfo -q -geom=no -dialect sqlite -sql "'+sql+'" '+regions;
}

const getInfoByRegion = function(coordinate, callback) {
	exec(getInfoByRegionCmd(coordinate), function(error, stdout, stderr) {
		checkError(error);
	
		let object = JSON.parse(stdout.split("=")[1])[0];
		if(object){
			callback({
				"biome": object.biome,
				"uf": object.state,
				"county": `${object.countyCode} - ${object.county} - ` ,
				"countyCode": object.countyCode
			});
		}else{
			callback({
				"biome":'',
				"uf": '',
				"county": '',
				"countyCode": ''
			});
		}		
	});
}
var getInfoByTileCmd = function(coordinate) {
	tiles = "SHP/tiles/tiles.shp";
	sql = "select PATH, ROW from tiles where ST_INTERSECTS(Geometry,GeomFromText('POINT("+coordinate.X+" "+coordinate.Y+")',4326))"
	return 'ogrinfo -q -geom=no -dialect sqlite -sql "'+sql+'" '+tiles;
}


var getInfoByTile = function(coordinate, callback) {
	exec(getInfoByTileCmd(coordinate), function(error, stdout, stderr){	
		checkError(error);		
		
		var strs = stdout.split("\n");
	
		var row;
		var path;

		for(var i = 0; i < strs.length; i++){
			if(strs[i].match(/ROW/g)){
				row = strs[i].slice(18,21);
				row = Number(row.trim());
			}else if(strs[i].match(/PATH/g)){
				path = strs[i].slice(19,22);
				path = Number(path.trim());
			}
		}

		var result = { 
			"row": row,
			"path": path,
		};

		callback(result);
	});
}

var getDB = function(dbUrl, callback) {
	var MongoClient = mongodb.MongoClient;
	MongoClient.connect(dbUrl, function(err, db) {
			if(err)
				return console.dir(err);
			callback(db);
	});
}

var insertCampaing = function(db) {
	db.collection(collectionCampaignName, function(err, collectionCampaign) {
		var createCamp = {
			"_id": campaign,
			"initialYear": parseInt(initialYear),
			"finalYear": parseInt(finalYear),
			"password": password,
			"landUse": [ 
			    "Formasi Hutan",
		        "Mangrove",
		        "Sagu",
		        "Formasi Non Hutan Lainnya",
		        "Sawah Irigasi",
		        "Sawit",
		        "Perkebunan Kayu Pulp",
		        "Pertanian Lainnya",
		        "Tambang",
		        "Non Vegetasi Lainnya",
		        "Sungai / Danau",
		        "Tambak",
		        "Citra Tertutup Awan"
	    ],
			"numInspec": parseInt(numInspec)
		}

		collectionCampaign.insertOne(createCamp);
	})
			
}

fs.readFile(geojsonFile, 'utf-8', function(error, geojsonDataStr){
	checkError(error);
	
	getDB(dbUrl, function(db) {
		
		db.collection(collectionPointsName, function(err, collectionPoints) {

			var counter = 1;
			var eachFn = function(coordinate, next) {
				getInfoByRegion(coordinate, function(regionInfo) {
					getInfoByTile(coordinate, function(tileInfo) {
						var point = {
							"_id": counter+'_'+campaign,
							"campaign": campaign,	
							"lon": coordinate.X,
							"lat": coordinate.Y,
							"dateImport": new Date(),
							"biome": (coordinate['biome']) ? coordinate['biome'] : regionInfo.biome,
							"uf": (coordinate['uf']) ? coordinate['uf'] : regionInfo.uf,
							"county": (coordinate['county']) ? coordinate['county'] : regionInfo.county,
							"countyCode": (coordinate['countyCode']) ? coordinate['countyCode'] : regionInfo.countyCode,
							"path":tileInfo.path,
							"row":tileInfo.row,
							"userName": [],
							"inspection" : [],
							"underInspection": 0,
							"index": counter++,
							"cached": false,
							"enhance_in_cache": 1
						}

						collectionPoints.insert(point, null, function() {
							console.log("Point " + point._id + " inserted.");
							next();
						});					
					});
				});
			}

			var onComplete = function() {
				db.close();
			};

			insertCampaing(db)
			async.eachSeries(getCoordinates(geojsonDataStr), eachFn, onComplete);
		});
	});
});
