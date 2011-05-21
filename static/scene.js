var mainScene = {
  type: "scene",
  id: "auxons",
  canvasId: "sceneCanvas",

  nodes: [
    {
      type: "lookAt",
      eye: {x: 50.0, y: 50.0, z: 50.0 },
      look: { x: 0.0, y: 0.0, z: 0.0 },
      up: { y: 1.0},

      nodes: [
        {
          type: "camera",
          optics: {
            type: "perspective",
            fovy: 25.0,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.1,
            far: 100.0
          },

          nodes: [
          {
            type: "light",
            mode: "dir",
            color: { r: 0.9, g: 0.9, b: 0.9 },
            diffuse: true,
            specular: true,
            dir: { x: -10.0, y: 0.0, z: -10.0 }
          },
              { 
                type: "rotate",
                id: "pitch",
                x: 1.0,
                angle: 0.0,
                nodes: [
                  {
                    id: "yaw",
                    type: "rotate",
                    y: 1.0,
                    angle: 0.0,
                    nodes: [
                      {
                        type: "rotate",
                        id: "roll",
                        z: 1.0,
                        angle: 0.0,
                        nodes: [
                          {
                            type: "node",
                            id: "mainNode"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
      ]
    }
  ]
    }
  ]
}
