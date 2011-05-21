var UI = function () {
	this.window = {};
	this.canvas;
	this.toolbar;
	
	this.init = function () {
		this.window = {width: window.innerWidth, height: window.innerHeight};
		this.canvas = document.getElementById($C.canvas);
	}
	
	this.postInit = function () {
	//	this.toolbar = new Toolbar();
	//	this.toolbar.init();
	}
	
	// This can implement 2xAA by rendering to a 2x larger canvas, then scale it down with styles.
	this.resize = function () {
		$C.ui.window = {width: window.innerWidth, height: window.innerHeight};
		
		$C.ui.canvas.setAttribute("height", $C.ui.window.height);
		$C.ui.canvas.setAttribute("width", $C.ui.window.width);
		
		if ($C.scene.initialized) {
			$C.scene.camera($C.ui.window.width, $C.ui.window.height);
			$C.scene.render();
		}
		
		console.log("Resized.");
	}
}

var Toolbar = function () {
	this.element;
	this.width = 300;
	this.height = 100;
	this.position = {x: 0, y: 0};
	
	this.init = function () {
		// UI elements
	}
	
	this.move = function () {
		
	}
}

var Button = function () {
	
}

var Pick = function () {
	
}