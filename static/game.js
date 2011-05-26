var Game = function () {
	this.terrain;
	
	this.init = function () {
		this.terrain = new Terrain();
		this.terrain.init(8, 8);
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
	this.obj;
	
	this.init = function (width, height) {
		this.width = width;
		this.height = height;
		this.offset = -Math.floor(this.width / 2);
		
		this.makeMap();
		
		this.makeVertices();
		this.makeIndices();
	//	this.makeUVs();
		
		this.makeObject();
		this.addObject();
	}
	
	this.makeMap = function () {
		for (var x = this.offset; x < this.width + this.offset; x++) {
			this.map[x] = new Array();
			for (var y = this.offset; y < this.height + this.offset; y++) {
				this.map[x][y] = Math.random();
			}
		}
	}
	
	this.makeVertices = function () {
		for (var row = this.offset; row < this.height + this.offset; row++) {
			for (var col = this.offset; col < this.width + this.offset; col++) {
				this.vertices.push(col);
				this.vertices.push(this.map[row][col]);
				this.vertices.push(row);
				this.normals.push(1, 1, 1);
			}
		}
	}
	
	this.makeIndices = function () {
		for (var row = 0; row < this.height - 1; row++) {
			if (row % 2 == 0) { // Even rows
				for (col = 0; col < this.width; col++) {
					this.indices.push(col + row * this.width);
					this.indices.push(col + (row + 1) * this.width);
					this.uv.push(0,0,0,0);
				}
			}
			else { // Odd rows
				for (col = this.width - 1; col > 0; col--) {
					this.indices.push(col + (row + 1) * this.width);
					this.indices.push((col - 1) + row * this.width);
					this.uv.push(5,5,5,5);
				}
			}
		}
	}
	
/*	this.makeUVs = function () {
		for (var row = 0; row < this.height; row++) {
			for (var col = 0; col < this.width; col++) {
				this.uv.push(0);
				this.uv.push(5);
			}
		}
	}*/
	
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
					internalFormat:"lequal",
					sourceFormat:"alpha",
					sourceType: "unsignedByte",
					applyTo:"baseColor",
					blendMode: "multiply"
				}],
				nodes: [{
					type: "scale",
					x: 4.0,
					y: 4.0,
					z: 4.0,
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
		}
	}
	
	this.addObject = function () {
		$C.scene.addNode(this.obj, "gridRoot");
	}
}