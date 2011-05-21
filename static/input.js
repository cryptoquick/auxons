var Key = function () {
	this.press = function (evt) {
		// Escape key for pause.
		if (evt.keyCode == 27 && evt.type == "keyup") {
			var pauseDiv = document.getElementById('paused');
			
			pauseDiv.style.left = $C.ui.window.width / 2 - 100;
			pauseDiv.style.top = $C.ui.window.height / 2 - 20;
			
			if ($C.state.paused) {
				$C.scene.start();
				
				pauseDiv.style.visibility = 'hidden';
				$C.state.paused = false;
				console.log("Continuing.");
			}
			else {
				$C.scene.stop();
				
				pauseDiv.style.visibility = 'visible';
				$C.state.paused = true;
				console.log("Paused!");
			}
		}
	//	console.log("Key pressed: " + evt.keyCode);
	}
}

var Mouse = function () {
	this.last = {x: null, y: null};
	this.dragging = false;
	this.clicked = false;
	
	this.down = function (evt) {
		this.last = {x: evt.clientX, y: evt.clientY};
		this.dragging = true;
		this.clicked = true;
	//	SceneJS.withNode($C.canvas).pick(evt.clientX, evt.clientY);
	}
	
	this.up = function () {
		this.dragging = false;
		this.clicked = false;
	}
	
	this.move = function (evt) {
		if (this.dragging) {
			var yaw = (evt.clientX - this.last.x) * 0.5;
			var pitch = (evt.clientY - this.last.y) * 0.5;
			
			if (pitch + $C.scene.pitch > 0 && pitch + $C.scene.pitch < 90) {
				$C.scene.yaw += yaw;
				$C.scene.pitch += pitch;
				$C.scene.rotate($C.scene.yaw, -$C.scene.pitch, 0.0);
			}
			
			this.last.x = evt.clientX;
			this.last.y = evt.clientY;
		}
	}
	
	this.wheel = function (evt) {
		var scale = evt.wheelDelta * -0.00005;
		
		if (scale + $C.scene.scale > 0.01 && scale + $C.scene.scale < 0.10) {
			$C.scene.scale += scale;
			$C.ui.resize();
		}
	}
}

var State = function () {
	this.paused = false;
	this.key = false;
}
