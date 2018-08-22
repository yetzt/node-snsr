#!/usr/bin/env node

var cex = require("command-exists");
var exec = require("child_process").exec;

var excache = null; // cache executable found

function snsr(fn){
	if (!(this instanceof snsr)) return new snsr(fn);
	var self = this;
	
	(function(next){ // check and cache if sensors binary is present
		if (excache === true) return next();
		if (excache === false) return fn("no sensors", []);
		cex("sensors", function(err, ex){
			excache = false;
			if (err || !ex) return fn("no sensors", []);
			exec("sensors -v", function(err, stdout, stderr){
				if (err) return fn("no sensors", []);
				if (!/^sensors version [0-9\.]+ with libsensors version [0-9\.]+\n?$/m.test(stdout)) fn("no sensors", []);
				excache = true;
				next();
			});
		});
	})(function(){
		exec("sensors -Au", function(err, stdout, stderr){
			if (err) return fn(err, []);
			return self.parse(stdout, fn);
		});
	});
	
	return this;
};

snsr.prototype.parse = function(data, fn){
	var self = this;
	
	try {
	
		data = data.split(/\n\n+/g).reduce(function(result, sensor){

			var values = [];
			var chip = null;
			var snsr = null;

			return result.concat(sensor.split(/\n/g).reduce(function(result,v,i){
				if (i === 0) {
					chip = v;
				} else if (v[0] !== " ") {
					snsr = v.replace(/:$/,'');
				} else if (v.match(/^  ((temp|fan|intrusion|in|power|beep)([0-9]+)?_([a-z\_]+)): ([0-9]+(\.[0-9]+)?)$/)) {
					result.push({
						chip: chip, 
						sensor: snsr, 
						label: RegExp.$1,
						type: RegExp.$2,
						num: RegExp.$3,
						key: RegExp.$4,
						value: parseFloat(RegExp.$5) 
					});
				}
			
				return result;
			
			},[]));

		},[]).reduce(function(result, value){
			if (!result[value.chip+"-"+value.sensor]) result[value.chip+"-"+value.sensor] = [];
			result[value.chip+"-"+value.sensor].push(value);
			return result;
		},{});
	
		data = Object.keys(data).map(function(k){
			return data[k].reduce(function(x,v){
				x[v.key] = v.value;
				return x;
			},{
				_chip: data[k][0].chip,
				_sensor: data[k][0].sensor,
				_type: data[k][0].type,
				_num: (!!data[k][0].num) ? parseInt(data[k][0].num,10) : null,
			});
		});
		
	} catch (err) {
		return fn(err, []);
	}
		
	fn(null, data);
	
	return this;
};

module.exports = snsr;
