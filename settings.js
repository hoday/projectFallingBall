		var pixelsPerMeter = 30; // pixels per meter
		
		
		var a = 10; //9.81; // m/s2
		var t = 1/48; // s
		
		var floorHeight = 10;
		
		var replaySlowdownFactor = 1;
		
		var numberConstraintIterations = 5;
		var floorMargin = 0; // units in meters
		
		var radiusPoint = 5; // unit is pixels
		var widthStroke = 3; // unit is pixels;
		
		var colorPoint  = "#FF6666";
		var colorStroke = "#FFAAAA";
		var colorFill   = "#FFEECC";
		
		var colorFloor  = "#777777";
		
		var xCenterDefault = 10;
		var yCenterDefault = 8;
		var xVelocityDefault = 0;
		var yVelocityDefault = -1;
		var radiusDefault = 0.5;
		var angleDefault = -10;
		
		//var stateType = "normal";
		var stateType = "nonnormal";
		
		console.log("loaded settings.js: " + stateType);