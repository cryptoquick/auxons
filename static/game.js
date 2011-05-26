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
		for (var x = 0; x <= this.width; x++) {
			this.map[x] = new Array();
			for (var y = 0; y <= this.height; y++) {
				this.map[x][y] = Math.random();
			}
		}
	}
	
	this.makeVertices = function () {
		for (var row = 0; row <= this.height; row++) {
			for (var col = 0; col <= this.width; col++) {
				this.vertices.push(col);
				this.vertices.push(this.map[row][col]);
				this.vertices.push(row);
				this.normals.push(1, 1, 1);
			}
		}
	}
	
	this.makeIndices = function () {
                var wpo = this.width+1;
		for (var row = 0; row < this.height; row++) {
                  if(row%2 == 0) 
                    for (var col = 0; col <= this.width; col++) {
                      this.indices.push(row * wpo + col);
                      this.uv.push(0,0);
                      this.indices.push((row+ 1) * wpo + col);
                      this.uv.push(0,0);
                    }
                  else {
                    for (var col = this.width; col >= 0; col--) {
                      this.indices.push(row * wpo + col);
                      this.uv.push(5,5);
                      this.indices.push((row+1) * wpo + col);
                      this.uv.push(5,5);
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
