var Scene = function () {
	this.yaw = 45.0;
	this.pitch = 26.565;
	this.scale = 0.05;
	this.scene = "mainScene";
	this.cam = "mainCamera";
	this.zoomNode = "mainScale";
	this.zoomCurr = 3.0;
	this.zoomIncr = 0.2;
	this.initialized = true;
	this.translation = {x: 0.0, y: 0.0, z: 0.0};
	
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
						type: "translate",
						id: "mainTrans",
						x: 0.0,
						y: 0.0,
						z: 0.0,
						nodes: [{
							type: "light",
							mode: "dir",
							color: {r: 0.9, g: 0.9, b: 0.9},
							diffuse: true,
							specular: true,
							dir: {x: -1.0, y: -1.0, z: -1.0}
						},
						{
							type: "light",
							mode: "dir",
							color: {r: 0.9, g: 0.9, b: 0.9},
							diffuse: true,
							specular: true,
							dir: {x: 1.0, y: 1.0, z: 1.0}
						},
						{
							type: "light",
							mode: "dir",
							color: {r: 0.9, g: 0.9, b: 0.9},
							diffuse: true,
							specular: true,
							dir: {x: -1.0, y: 0.0, z: 1.0}
						},
						{
							type: "light",
							mode: "dir",
							color: {r: 0.9, g: 0.9, b: 0.9},
							diffuse: true,
							specular: true,
							dir: {x: 1.0, y: 0.0, z: -1.0}
						},
						{
							type: "rotate",
							id: "pitch",
							angle: -26.565,
							x: 1.0,
							nodes: [{
								type: "rotate",
								id: "yaw",
								angle: 45.0,
								y: 1.0,
								nodes: [{
									type: "rotate",
									id: "roll",
									angle: 0.0,
									z: 1.0,
									nodes: [{
										type: "scale",
										id: "mainScale",
										x: 3.0,
										y: 3.0,
										z: 3.0,
										nodes: [{
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
													type: "node",
													id: "gridRoot"
												}]
											}]
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
			},
			{
				type: "node",
				id: "libs"
			}]
		});
	}
	
	this.start = function () {
		SceneJS.withNode(this.scene).start({
			fps: 60,
			idleFunc: $C.process
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
	
	this.translate = function (tx, ty, tz) {
		SceneJS.withNode("mainTrans").set("xyz", {x: tx, y: ty, z: tz});
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
	
	this.zoom = function (zoomIn) {
		if (zoomIn) {
			var zoom = this.zoomIncr;
			SceneJS.withNode(this.zoomNode).inc({ x: zoom, y: zoom, z: zoom });
		}
		else {
			var zoom = -this.zoomIncr;
			SceneJS.withNode(this.zoomNode).inc({ x: zoom, y: zoom, z: zoom });
		}
	}
}
