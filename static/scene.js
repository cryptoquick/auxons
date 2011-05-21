var Scene = function () {
	this.yaw = 225.0;
	this.pitch = 26.565;
	this.scale = 0.05;
	this.scene = "mainScene";
	this.cam = "mainCamera";
	this.initialized = true;
	
	this.init = function () {
		SceneJS.createNode({
			type: "scene",
			id: this.scene,
			canvasId: $C.canvas,
			nodes: [{
				type: "lookAt",
				eye: {x: 0.0, y: 0.0, z: -100.0},
				look: {x: 0.0, y: 0.0, z: 0.0},
				up: {x: 0.0, y: 1.0, z: 0.0},
				nodes: [{
					type: "camera",
					id: "mainCamera",
					optics: {
						type: "ortho",
						left : -30.0,
						right : 30.0,
						bottom : -30.0,
						top : 30.0,
						near : 0.1,
						far : 1000.0
					},
					nodes: [{
						type: "light",
						mode: "dir",
						color: {r: 0.9, g: 0.9, b: 0.9},
						diffuse: true,
						specular: false,
						dir: {x: 1.0, y: 1.0, z: -1.0}
					},
					{
						type: "light",
						mode: "dir",
						color: {r: 0.9, g: 0.9, b: 0.9},
						diffuse: true,
						specular: false,
						dir: {x: -1.0, y: -1.0, z: -1.0}
					},
					{
						type: "light",
						mode: "dir",
						color: {r: 0.9, g: 0.9, b: 0.9},
						diffuse: true,
						specular: false,
						dir: {x: 1.0, y: 1.0, z: 1.0}
					},
					{
						type: "material",
						baseColor: {r: 0.9, g: 0.9, b: 0.9},
						nodes: [{
							type: "cube",
							xSize: 200,
							ySize: 200,
							zSize: 200,
							nodes: [{
								type: "rotate",
								id: "pitch",
								angle: -26.565,
								x: 1.0,
								nodes: [{
									type: "rotate",
									id: "yaw",
									angle: 225.0,
									y: 1.0,
									nodes: [{
										type: "rotate",
										id: "roll",
										angle: 0.0,
										z: 1.0,
										nodes: [{
											type: "selector",
											id: "root",
											selection: [0,1],
											nodes: [{
												type: "node",
												id: "gridRoot"
											},
											{
												type: "node",
												id: "buildRoot"
											},
											{
												type: "node",
												id: "uiRoot"
											}]
										}]
									}]
								}]
							}]
						}]
					}]
				}]
			},
			{
				type: "node",
				id: "libs"
			}]
		});
		
		// Renderer.
		this.start();
	}
	
	this.start = function () {
		SceneJS.withNode(this.scene).start({
			fps: 30
		});
	}
	
	this.stop = function () {
		SceneJS.withNode(this.scene).stop();
	}
	
	this.render = function () {
		SceneJS.withNode(this.scene).render();
	}
	
	this.rotate = function (rx, ry, rz) {
		SceneJS.withNode("yaw").set("angle", rx);
		SceneJS.withNode("pitch").set("angle", ry);
		SceneJS.withNode("roll").set("angle", rz);
	}
	
	this.camera = function (width, height) {
		SceneJS.withNode(this.cam).set("optics", {
			type: "ortho",
			left : -width * this.scale,
			right : width * this.scale,
			bottom : -height * this.scale,
			top : height * this.scale,
			near : 0.1,
			far : 1000.0
		});
	}
	
	this.addNode = function (node, target) {
		SceneJS.withNode(target).add("node", node);
	}
	
	this.addNodes = function (nodes, target) {
		SceneJS.withNode(target).add("nodes", nodes);
	}
}
