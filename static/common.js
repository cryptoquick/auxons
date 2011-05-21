var Common = function () {
	this.mouse = {
		last: {x: null, y: null},
		dragging: false,
		clicked: false
	}
	
	this.selected = {
		module: 'none'
	}
	
	this.MainLoop = function () {
		if ($C.mouse.clicked) {
			MainScene.pick($C.mouse.last.x, $C.mouse.last.y);
			$C.mouse.clicked = false;
		}
	}
}
