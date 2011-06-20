var Data = function () {
	this.canvas = "sceneCanvas";
	
	this.main = {};
	
	this.mouse = {
		last: {x: null, y: null},
		dragging: false,
		clicked: false
	}
	
	this.selected = {
		module: 'none'
	}
	
	this.scene = {
		initialized: false
	}
	
	this.polygons = 0;
}
