function Init () {
	var initTime0 = new Date();
		
	// Common Data object.
	window.$C = new Data();
	
	// Initialize User Interface.
	$C.ui = new UI();
	$C.ui.init();
	
	// Make main scene.
	$C.scene = new Scene();
	$C.scene.init();
	
	// Create other key objects.
	$C.mouse = new Mouse();
	$C.key = new Key();
//	$C.pick = new Pick();
	$C.state = new State();
	
	// Add event listeners.
	window.onresize = $C.ui.resize;
	document.onmousedown = $C.mouse.down;
	document.onmouseup = $C.mouse.up;
	document.onmousemove = $C.mouse.move;
	document.onmousewheel = $C.mouse.wheel;
	document.onkeyup = $C.key.press;
	document.onkeydown = $C.key.press;
	
	$C.initialized = true;
	$C.gameStarted = false;
	$C.ui.resize();
	
	$C.process = function () {
		$C.ui.calcFps();
		if ($C.gameStarted) {
			$C.grid.onMove();
		}
	}
	
	// Scene has to be loaded before doing game stuff.
	SceneJS.withNode($C.scene.name).bind("loading-status",
		function(event) {
			var params = event.params;

			if (params.numNodesLoading == 0 && !$C.gameStarted) {
				$C.game = new Game();
				$C.game.init();
				$C.gameStarted = true;
			}
		});
	
	$C.scene.start();
	
	var initTime1 = new Date();
	console.log("Scene took " + (initTime1 - initTime0) + "ms to initialize.");
}
