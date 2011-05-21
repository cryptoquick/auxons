function Init () {
	var initTime0 = new Date();
	
	window.$C = new Common();
	
	SceneJS.bind("error", function(e) {
		if (e.exception.message) {
			console.log("Error: " + e.exception.message);
		} else {
			console.log("Error: " + e.exception);
		}
	});

	SceneJS.withNode("auxons").render();
	
	MainScene.start({
		fps: 60,
		idleFunc: $C.MainLoop
	});
	
	var initTime1 = new Date();
	
	console.log("Scene took " + (initTime1 - initTime0) + "ms to initialize");
	
	var testbox = new Structure("testBox");
	testbox.make("mainNode");
}

var Structure = function (name) {
	// Original name.
	this.name = name;
	// Current highest object name.
	this.top = "";
	// Other steps on the way to node-ness.
	this.mat, this.obj = "";
	
	this.make = function (target) {
		this.obj = this.create(this.name);
		this.mat = this.material(this.obj);
		this.top = this.insert(this.mat, target);
	}
	
	this.create = function (_id) {
		var id = _id + "_cube";
		
		SceneJS.Message.sendMessage({
			command: "create",
			nodes: [{
				type: "node",
				id: id,
				nodes: [{
					type: "cube"
				}]
			}]
		});
		
		return id;
	}
	
	this.material = function (_id) {
		var id = _id + "_mat";
		
		SceneJS.Message.sendMessage({
			command: "create",
			nodes: [{
				type: "node",
				id: id,
				nodes: [{
					type:			"material",
					baseColor:		{ r: 1.0, g: 1.0, b: 0.0 },
					specularColor:	{ r: 1.0, g: 1.0, b: 0.0 }, 
					specular:		0.9,
					shine: 			0.9,
					nodes: [{
						type: "node",
						id: id + "_node"
					}]
				}]
			}]
		});
		
		return id;
	}
	
	this.insert = function (id, target) {
		SceneJS.Message.sendMessage({
			command: "update",
			target: target,
			add: {
				node: id
			}
		});
		
		return id;
	}
}