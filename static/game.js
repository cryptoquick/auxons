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
	this.vertexCount = 0;
	this.indexCount = 0;
	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.obj;
	
	this.init = function (width, height) {
		this.width = width;
		this.height = height;
		this.vertexCount = this.width * this.height * 3;
		this.indexCount = this.width * this.height + (this.width - 1) * (this.height - 2);
		
		this.makeVertices();
		this.makeIndices();
		
		this.makeObject();
		this.addObject();
	}
	
	this.makeVertices = function () {
		for (var row = 0; row < this.height; row++) {
			for (var col = 0; col < this.width; col++) {
				this.vertices.push(col);
				this.vertices.push(Math.random());
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
				}
			}
			else { // Odd rows
				for (col = this.width - 1; col > 0; col--) {
					this.indices.push(col + (row + 1) * this.width);
					this.indices.push((col - 1) + row * this.width);
				}
			}
		}
	}
	
	this.makeObject = function () {
		this.obj = {
			type:			"material",
			id: this.id,
			baseColor:		{ r: 0.7, g: 0.2, b: 0.2 },
			specularColor:	{ r: 0.1, g: 0.9, b: 0.0 }, 
			specular:		0.1,
			shine:			0.1,
			nodes: [{
				type: "scale",
				x: 4.0,
				y: 4.0,
				z: 4.0,
				nodes: [{
					type: "geometry",
					primitive: "triangle-strip",
					positions: this.vertices,
					indices: this.indices,
					normals: this.normals
				}]
			}]
		}
	}
	
	this.addObject = function () {
		$C.scene.addNode(this.obj, "gridRoot");
	}
}