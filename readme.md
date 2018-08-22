# snsr

snsr provides sensor data from [lm-sensors](https://github.com/lm-sensors/lm-sensors).

## usage

``` javascript

var sensors = require("snsr");

sensors(function(err, data){
	console.log(data);
});

```

## format

`data` is an array which of each element holds all values of one sensor.

``` javascript
[{
	_chip: 'nct6779-isa-0290',
	_sensor: 'SYSTIN',
	_type: 'temp',
	_num: 1,
	input: 18,
	max: 0,
	max_hyst: 0,
	alarm: 1,
	type: 4,
	offset: 0,
	beep: 0 
},{
	_chip: 'nct6779-isa-0290',
	_sensor: 'CPUTIN',
	_type: 'temp',
	_num: 2,
	input: 19,
	max: 80,
	max_hyst: 75,
	alarm: 0,
	type: 4,
	offset: 0,
	beep: 0 
}, ... ]
```
