var Game = function () {
	this.terrain;
	this.edges;
	this.lastPos = {x: 0.0, y: 0.0};
	
	this.init = function () {
		this.terrain = new Terrain();
		this.terrain.init(16, 16);
	}
	
	this.getPos = function () {
		var results;
		var query = new SceneJS.utils.query.QueryNodePos({
			canvasWidth: $C.ui.window.width,
			canvasHeight: $C.ui.window.height
		});
		query.execute({ nodeId: "terrain0" },
		function(theQuery) {
			results = theQuery.getResults();
		});
		return results;
	}
	
	this.move = function () {
		var pos = $C.game.getPos();
		if ((pos.canvasPos.x != $C.game.lastPos.x) || (pos.canvasPos.y != $C.game.lastPos.y)) {
			console.log("Terrain center is now: " + pos.canvasPos.x + ", " + pos.canvasPos.y);
			$C.game.lastPos.x = pos.canvasPos.x;
			$C.game.lastPos.y = pos.canvasPos.y;
		}
	}
}

var Terrain = function () {
	this.width = 0;
	this.height = 0;
	this.offset = 0;
	this.map = [];
	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.uv = [];
	this.uvSize = 2;
	this.obj;
	
	this.init = function (width, height) {
		this.width = width;
		this.height = height;
		this.offset = -Math.floor(this.width / 2);
		
		this.makeMap();
		
		this.makeVertices();
		this.makeIndices();
		this.makeObject();
		this.addObject();
		this.centerObject();
	}
	
	this.makeMap = function () {
		for (var x = 0; x <= this.width; x++) {
			this.map[x] = new Array();
			for (var y = 0; y <= this.height; y++) {
				this.map[x][y] = Math.random();
			}
		}
	}
	
	// Calculates normals, but unsure if this is the proper way to do it.
	this.calcNormal = function (x, y, z) {
		n = {x: 0.0, y: 0.0, z: 0.0};
		n.x = y * z - z * y;
		n.y = z * x - x * z;
		n.z = x * y - y * x;
		return n;
	}
	
	this.makeVertices = function () {
		for (var row = 0; row <= this.height; row++) {
			for (var col = 0; col <= this.width; col++) {
				var v = {x: col, y: this.map[row][col], z: row};
				this.vertices.push(v.x, v.y, v.z);
				var n = this.calcNormal(v.x, v.y, v.z);
				this.normals.push(n.x, n.y, n.z); // Change into a proper normals calculation.
			}
		}
	}
	
	this.makeIndices = function () {
		var wpo = this.width+1;
		for (var row = 0; row < this.height; row++) {
			if(row % 2 == 0) {
				for (var col = 0; col <= this.width; col++) {
					this.indices.push(row * wpo + col);
					this.uv.push(0,0);
					this.indices.push((row+ 1) * wpo + col);
					this.uv.push(0,0);
				}
			}
			else {
				for (var col = this.width; col >= 0; col--) {
					this.indices.push(row * wpo + col);
					this.uv.push(this.uvSize, this.uvSize);
					this.indices.push((row+1) * wpo + col);
					this.uv.push(this.uvSize, this.uvSize);
				}
			}
		}
	}
	
	this.makeObject = function () {
		this.obj = {
			type: "material",
			id: "terrain0",
			baseColor:		{ r: 0.7, g: 0.2, b: 0.2 },
			specularColor:	{ r: 0.4, g: 0.4, b: 0.4 }, 
			specular:		0.9,
			shine:			0.5,
			nodes: [{
				type: "texture",
				layers: [{
					uri: "static/img/grid128.png",
					minFilter: "linear",
					magFilter: "linear",
					wrapS: "repeat",
					wrapT: "repeat",
					isDepth: false,
					depthMode:"luminance",
					depthCompareMode: "compareRToTexture",
					depthCompareFunc: "lequal",
					flipY: false,
					width: 1,
					height: 1,
					internalFormat:	"lequal",
					sourceFormat:	"alpha",
					sourceType:		"unsignedByte",
					applyTo:		"baseColor",
					blendMode:		"multiply"
				}],
				nodes: [{
					type: "scale",
					x: 4.0,
					y: 4.0,
					z: 4.0,
					nodes: [{
						type: "translate",
						id: "terrainMove",
						x: 0.0,
						y: 0.0,
						z: 0.0,
						nodes: [{
							type: "geometry",
							primitive: "triangle-strip",
							positions: this.vertices,
							normals: this.normals,
							uv: this.uv,
							indices: this.indices
						}]
					}]
				}]
			}]
		}
	}
	
	this.addObject = function () {
		$C.scene.addNode(this.obj, "gridRoot");
	}
	
	this.centerObject = function () {
		SceneJS.withNode("terrainMove").set({x: -this.width / 2, y: 0.0, z: -this.height / 2});
	}
}
