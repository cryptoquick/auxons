var Structure = function (model, id) {
	// Current highest object name.
	this.id = id;
	this.target = "";
	// Other steps on the way to node-ness.
	this.obj = {};
	
	this.make = function (target) {
		this.target = target;
		
		this.obj = {
			type: "library",
			nodes: [{
				type:			"material",
				id: this.id,
				baseColor:		{ r: 0.9, g: 0.9, b: 0.0 },
				specularColor:	{ r: 0.1, g: 0.9, b: 0.0 }, 
				specular:		0.1,
				shine:			0.1,
				nodes: [{
					type: "scale",
					x: 4.0,
					y: 4.0,
					z: 4.0,
					nodes: [{
						type: "teapot"
					}]
				}]
			}]
		}
		
		$C.scene.addNode(this.obj, "libs")
		
		this.instantiate();
	};
	
	this.instantiate = function () {
		var newNode = {
			type: "instance",
			target: this.id,
			id: this.id + "i"
		};
		
		$C.scene.addNode(newNode, this.target);
	};
};
