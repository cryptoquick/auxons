var Game = function () {
	this.init = function () {
		$C.grid = new Grid();
		$C.grid.init();
	}
}

var Grid = function () {
	this.terrains = {};
	this.curIndex = 0;
	this.terrainSize = {rows: 16, cols: 16};
	this.lastPos = {x: 0.0, y: 0.0};
	
	this.init = function () {
		this.addTerrain(0,0);
		this.populateTerrain(0,0);
		this.addPicking();
	}
	
	/* Building Terrain */
	this.getPos = function (tx, tz) {
		var results;
		var query = new SceneJS.utils.query.QueryNodePos({
			canvasWidth: $C.ui.window.width,
			canvasHeight: $C.ui.window.height
		});
		query.execute({ nodeId: this.nameTerrain(tx, tz) },
		function(theQuery) {
			results = theQuery.getResults();
		});
		return results.canvasPos;
	}
	
	this.onMove = function () {
		var pos = $C.grid.getPos(0,0);
		if ((pos.x != $C.grid.lastPos.x) || (pos.y != $C.grid.lastPos.y)) {
			// Add more terrain as the player translates the grid.
		//	this.checkDir(this.lastPos, );
			
		//	console.log("Terrain center is now: " + pos.x + ", " + pos.y);
			$C.grid.lastPos.x = pos.x;
			$C.grid.lastPos.y = pos.y;
		}
	}
	
	this.newTerrain = function (tx, tz) {
		var name = this.nameTerrain(tx, tz);
		var t = new Terrain();
		t.init(this.terrainSize.rows, this.terrainSize.cols, tx, tz, name);
		this.terrains[name] = t;
	}
	
	this.nameTerrain = function (x, z) {
		return "x" + x + "z" + z;
	}
	
	this.gridCoors = function (gridX, gridY) {
		var x = gridX * this.terrainSize.rows;
		var y = gridY * this.terrainSize.cols;
		return {x: x, y: y};
	}
	
	this.populateTerrain = function (selfX, selfY) {
		// Upper Right
		var ur = this.addTerrain(selfX - 1, selfY);
		if(ur != false) {
			this.checkDir(ur, selfX - 1, selfY);
		};
		
		// Upper Left
		var ul = this.addTerrain(selfX, selfY + 1);
		if(ul != false) {
			this.checkDir(ul, selfX, selfY + 1);
		}
		
		// Lower Right
		var lr = this.addTerrain(selfX, selfY - 1);
		if(lr != false) {
			this.checkDir(lr, selfX, selfY - 1);
		}
		
		// Lower Left
		var ll = this.addTerrain(selfX + 1, selfY);
		if(ll != false) {
			this.checkDir(ll, selfX + 1, selfY);
		}
	}
	
	this.checkExists = function (coorsX, coorsY) {
		var name = this.nameTerrain(coorsX, coorsY);
		
		if (this.terrains[name] == undefined) {
			return false;
		}
		else {
			return true;
		}
	}
	
	this.checkDir = function (dirPos, dirX, dirY) {
		var coors = this.gridCoors(dirX, dirY);
		if ((dirPos.x > 0.0 && dirPos.x < $C.ui.window.width + 200) &&
			(dirPos.y > -200.0 && dirPos.y < $C.ui.window.height + 200)) {
			this.populateTerrain(dirX, dirY);
		}
	}
	
	this.addTerrain = function (gridX, gridY) {
		var coors = this.gridCoors(gridX, gridY);
		if (!this.checkExists(coors.x, coors.y)) {
			this.newTerrain(coors.x, coors.y);
			var terrainCoors = this.getPos(coors.x, coors.y);
			return terrainCoors;
		}
		else {
			return false;
		}
	}
	
	/* Mouse Picking */
	this.addPicking = function () {
		for (t in this.terrains) {
		//	console.log(t.nodeID);
		/*	SceneJS.withNode(t.nodeID).bind("picked",
				function(event) { // Mouse Move
					var params = event.params;
					console.log(t.nodeID);
				}
			);*/
		}
	}
}

var Terrain = function () {
	this.width = 0;
	this.length = 0;
	this.offset = {x: 0.0, y: 0.0, z: 0.0};
	this.map = [];
	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.uv = [];
	this.colors = [];
	this.uvSize = 2;
	this.obj;
	this.nodeID = "";
	
	this.init = function (width, length, offsetX, offsetZ, name) {
		this.width = width;
		this.length = length;
		this.offset.x = offsetX;
		this.offset.z = offsetZ;
		this.nodeID = name;
		
		this.makeMapNoise();
		
		this.makeVertices();
		this.makeIndices();
		this.makeNormals();
		this.makeColors();
		this.makeObject();
		this.addObject();
		this.centerObject();
		
	//	console.log(this.vertices.length + " vertices", this.indices.length + " indices", this.normals.length + " normals", this.uv.length + " uvs", this.colors.length + " colors");
	}
	
	this.makeMap = function () {
		for (var x = 0; x <= this.width; x++) {
			this.map[x] = new Array();
			for (var y = 0; y <= this.length; y++) {
				this.map[x][y] = Math.random();
			}
		}
	}
	
	this.makeMapNoise = function () {
		var scale = 25.0; // vertical scale of terrain
		var factor = 0.025; // sample distance, affects smoothness of terrain
		var yOffset = -25;
		noiseDetail(4, 0.70); // octaves, fallout
		noiseSeed(123);
		
		for (var x = 0; x <= this.width; x++) {
			this.map[x] = new Array();
			for (var y = 0; y <= this.length; y++) {
				this.map[x][y] = noise(
					(x + this.offset.x) * factor,
					(y + this.offset.z) * factor
				) * scale + yOffset;
			}
		}
	}
	
	// Calculates normals, but unsure if this is the proper way to do it.
	this.calcNormal = function (i) {
	/*	var d = 0.0001;
		var p = vec3.create([this.vertices[i] + d,this.vertices[i+1] + d,this.vertices[i+2] + d]);
		var s = vec3.create([this.vertices[i+3] + d,this.vertices[i+4] + d,this.vertices[i+5] + d]);
		var t = vec3.create([this.vertices[i+6] + d,this.vertices[i+7] + d,this.vertices[i+8] + d]);
		var q = vec3.subtract(p, s);
		var r = vec3.subtract(s, t);
		var n = vec3.cross(q, r);
			n = vec3.normalize(n);
		*/
		
		v1 = [this.vertices[i+0], this.vertices[i+1], this.vertices[i+2]];
		v2 = [this.vertices[i+3], this.vertices[i+4], this.vertices[i+5]];
		v3 = [this.vertices[i+6], this.vertices[i+7], this.vertices[i+8]];
		
		Qx = v2[0] - v1[0];
		Qy = v2[1] - v1[1];
		Qz = v2[2] - v1[2];
		Px = v3[0] - v1[0];
		Py = v3[1] - v1[1];
		Pz = v3[2] - v1[2];
		
		var n = {};
		n.x = Py * Qz - Pz * Qy;
		n.y = Pz * Qx - Px * Qz;
		n.z = Px * Qy - Py * Qx;
		
		// Kludges to get rid of the circuit-board pattern and other artifacts.
		// FIXME
		if (n.x < 0.0)
			n.x = -n.x;
		if (n.y < 0.0)
			n.y = -n.y;
		if (n.z < 0.0)
			n.z = -n.z;
		
		if (n.x == 0 && n.y == 0 && n.z == 0)
			n.z = 1;
		
		if (n.x == 1 && n.y == 1 && n.z == 1) {
			n.x = 0;
		}
		
		if (isNaN(n.x))
			n.x = 1;
		if (isNaN(n.y))
			n.y = 1;
		if (isNaN(n.z))
			n.z = 1;
		
		return n;
	}
	
	this.makeNormals = function () {
		for (var i = 0, ii = this.vertices.length; i < ii; i += 3) {
			var result = this.calcNormal(i);
			this.normals.push(result.x, result.y, result.z);
		}
		console.log(this.normals.slice(this.normals.length - 33,this.normals.length-1));
	}
	
	this.makeVertices = function () {
		for (var row = 0; row <= this.length; row++) {
			for (var col = 0; col <= this.width; col++) {
				var v = {x: col, y: this.map[col][row], z: row};
				this.vertices.push(v.x, v.y, v.z);
				this.uv.push(row, col);
			}
		}
	}
	
	this.makeIndices = function () {
		var wpo = this.width+1;
		for (var row = 0; row < this.length; row++) {
			if(row % 2 == 0) {
				for (var col = 0; col <= this.width; col++) {
					this.indices.push(row * wpo + col);
				//	this.uv.push(0,0);
					this.indices.push((row+ 1) * wpo + col);
				//	this.uv.push(0,0);
				}
			}
			else {
				for (var col = this.width; col >= 0; col--) {
					this.indices.push(row * wpo + col);
				//	this.uv.push(this.uvSize, this.uvSize);
					this.indices.push((row+1) * wpo + col);
				//	this.uv.push(this.uvSize, this.uvSize);
				}
			}
		}
	}
	
	this.makeColors = function () {
		var scale = 25.0; // vertical scale of terrain
		var factor = 0.025; // sample distance, affects smoothness of terrain
		var yFactor = 0.025;
		var yOffset = -20;
		noiseDetail(4, 0.70); // octaves, fallout
		noiseSeed(123);
		var colors = [];
		var temp = [];
		
		for (var x = 0; x <= this.width; x++) {
			temp[x] = new Array();
			for (var y = 0; y <= this.length; y++) {
				temp[x][y] = noise(
					(x + this.offset.x) * factor,
					(y + this.offset.z) * factor
				) * scale + yOffset;
			}
		}
		
	/*	for (var x = 0; x <= this.width; x++) {
	//	for (var x = this.width; x >= 0; x--) {
			for (var y = 0; y <= this.length; y++) {
		//	for (var y = this.width; y >= 0; y--) {
				var color = noise(
					(x + this.offset.x) * factor,
					(y + this.offset.z) * factor
				) * scale + yOffset;
			//	var color = this.map[y][x];
				colors.push(color);
			}
		}*/
		
		for (var x = 0; x <= this.width; x++) {
			for (var y = 0; y <= this.length; y++) {
				colors.push(temp[y][x]);
			}
		}
		
		// Must be sufficiently large values;
		var min = 10.0;
		var max = -10.0;
		
	/*	for (var i = 0, ii = colors.length; i < ii; i++) {
			if (colors[i] < min) {
				min = colors[i];
			}
			if (colors[i] > max) {
				max = colors[i];
			}
		}*/
		
		var range = max - min;
		
	//	console.log(min, max);
		
		for (var i = 0, ii = colors.length; i < ii; i++) {
			colors[i] = (colors[i] - min) / range;
		}
		
		// Colors, going top -> down.
		for (var i = 0, ii = colors.length; i < ii; i++) {
			if (colors[i] < 0.20) {
				this.colors.push(1.0, 1.0, 1.0, 1.0);
			}
			else if (colors[i] < 0.40) {
				this.colors.push(0.275, 0.1, 0.0, 1.0);
			}
			else if (colors[i] < 0.60) {
				this.colors.push(0.0, 1.0, 0.0, 1.0);
			}
			else if (colors[i] < 0.75) {
				this.colors.push(1.0, 1.0, 0.0, 1.0);
			}
			else if (colors[i] < 1.0) {
				this.colors.push(0.0, 0.0, 1.0, 1.0);
			}
			else if (colors[i] >= 1.0) {
				this.colors.push(1.0, 0.0, 1.0, 1.0);
			}
		}
	}
	
	this.makeObject = function () {
		this.obj = {
			type: "translate",
			id: this.nodeID,
			x: this.offset.x,
			y: this.offset.y,
			z: this.offset.z,
			nodes: [{
				type: "geometry",
				primitive: "triangle-strip",
				positions: this.vertices,
				indices: this.indices,
				normals: this.normals,
				uv: this.uv,
				colors: this.colors
			}]
		}
	}
	
	this.addObject = function () {
		$C.scene.addNode(this.obj, "gridRoot");
	}
	
	this.centerObject = function () {
		SceneJS.withNode(this.nodeID).set({x: -this.width / 2 + this.offset.x, y: this.offset.y, z: -this.length / 2 + this.offset.z});
	}
}
