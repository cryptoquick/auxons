var Structure = function (name) {
	// Original name.
	this.target = "";
	// Current highest object name.
	this.name = name;
	// Other steps on the way to node-ness.
	this.mat = "";
	this.instance = "";
	this.target = "";
	
	this.make = function (target) {
		this.target = target;
		this.mat = this.material(this.target);
		this.obj = this.create(this.mat);
		this.instance = this.inst(this.obj);
	};
	
	this.create = function (_id) {
		var id = _id + "_cube";
		/*
		SceneJS.Message.sendMessage({
			command: "create",
			nodes: [{
				type: "node",
				parent: _id,
				id: id,
				nodes: [{
					type: "box"
				}]
			}]
		});*/
		
		var newNode = {
			type: "node",
			parent: _id,
			id: id,
			nodes: [{
				type: "box"
			}]
		};
		
		$C.scene.addNode(newNode, _id);
		return id;
	};
	
	this.material = function (_id) {
		var id = _id + "_mat";
		/*
		SceneJS.Message.sendMessage({
			command: "create",
			nodes: [{
				type:			"material",
				parent:			_id,
				id:				id,
				baseColor:		{ r: 1.0, g: 1.0, b: 0.0 },
				specularColor:	{ r: 1.0, g: 1.0, b: 0.0 }, 
				specular:		0.9,
				shine:			0.9,
			}]
		});*/
		
		var newNode = {
			type:			"material",
			parent:			_id,
			id:				id,
			baseColor:		{ r: 1.0, g: 1.0, b: 0.0 },
			specularColor:	{ r: 1.0, g: 1.0, b: 0.0 }, 
			specular:		0.9,
			shine:			0.9,
		};
		
		$C.scene.addNode(newNode, _id);
		return id;
	};
	
	this.inst = function (_id) {
		var id = _id + "_inst";
		/*
		SceneJS.Message.sendMessage({
			command: "create",
			nodes: [{
				parent: _id,
				type: "instance",
				id: id,
				target: _id
			}]
		});*/
		
		var newNode = {
			parent: _id,
			type: "instance",
			id: id,
			target: _id
		};
		
		$C.scene.addNode(newNode, _id);
		return id;
	};
	
/*	this.insert = function (id) {
		SceneJS.Message.sendMessage({
			command: "update",
			target: this.target,
			add: {
				node: id
			}
		});
		
		return id;
	}*/
};
