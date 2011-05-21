var MainScene = SceneJS.scene ({
		id:			"auxons",
		canvasId:	"sceneCanvas"
	},
	SceneJS.lookAt({
		eye: 	{ x: 50.0, y: 50.0, z: 50.0 },
		look:	{ y: 1.0 },
		up:		{ y: 1.0 }
	},
		SceneJS.camera({
			optics: {
				type:	"perspective",
				fovy:	25.0,
				aspect:	window.innerWidth / window.innerHeight,
				near:	0.1,
				far:	100.0
			}
		},
			SceneJS.light({
				mode:		"dir",
				color:		{ r: 0.9, g: 0.9, b: 0.9 },
				diffuse:	true,
				specular:	true,
				dir:		{ x: -10.0, y: 0.0, z: -10.0 }
			},
				SceneJS.material({
					baseColor:	{ r: 1.0, g: 1.0, b: 1.0 },
					specular:	0.0,
					shine:		10.0
				},
					SceneJS.rotate({
						id: "pitch",
						x : 1.0,
						angle: 0.0
					},
						SceneJS.rotate({
							id: "yaw",
							y: 1.0,
							angle: 0
						},
							SceneJS.rotate({
								id: "roll",
								z: 1.0,
								angle: 0
							},
								SceneJS.node({
									id: "mainNode"
								})
							)
						)
					)
				)
			)
		)
	)
);