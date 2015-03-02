// Exports
var experimentDataToJSON;
var experimentDataFromJSON;
var scaleCanvas;

(function() {
"use strict";

var dark_side = 0.3;
var i;

/*----------------------------------------------------------------------
 * Canvases 1 and 3
 *---------------------------------------------------------------------*/

SceneJS.createNode({

    type: "node",

    nodes: [

        {

            type: "scene",
            id: "theScene1",
            canvasId: "theCanvas1",
            loggingElementId: "theLoggingDiv1",

            nodes: [

                {
                    type: "lookAt",

                    id: "lookAt1",
                    eye : initial_earth_eye,
                    look : { x : earth_x_pos, y : 0, z : 0.0 },
                    up : { x: 0.0, y: 1.0, z: 0.0 },

                    nodes: [

                        {

                            type: "camera",
                            id: "theCamera1",
                            optics: {
                                type: "perspective",
                                fovy : 50.0,
                                aspect : 1.43,
                                near : earth_view_small_offset,
                                far : milky_way_apparent_radius * 10,
                            },

                            nodes: [

                                {
                                    type: "rotate",
                                    angle: 0,
                                    y: 1.0,

                                    nodes: [

                                        // First simulate the milky-way with a stationary background sphere
                                        {
                                            type: "stationary",

                                            nodes: [

                                                // Size of sky sphere
                                                {
                                                    type: "scale",
                                                    x: milky_way_apparent_radius,
                                                    y: milky_way_apparent_radius,
                                                    z: milky_way_apparent_radius,
                                                    nodes: [

                                                        // Starry texture
                                                        {
                                                            type: "texture",
                                                            layers: [
                                                                {
                                                                    uri: "images/milky_way_panorama_3000x1500.jpg",
                                                                    wrapS: "clampToEdge",
                                                                    wrapT: "clampToEdge",
                                                                    applyTo:"baseColor",
                                                                    blendMode:"multiply"
                                                                }
                                                            ],
                                                            nodes: [

                                                                // Material for texture to apply to
                                                                {
                                                                    type: "material",
                                                                    baseColor:      { r: 1.0, g: 1.0, b: 1.0 },
                                                                    specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
                                                                    specular:       0.0,
                                                                    shine:          0.0,
                                                                    emit:           1.0,

                                                                    nodes: [

                                                                        // Tilt the milky way a little bit
                                                                        {
                                                                            type: "rotate",
                                                                            z: 1,
                                                                            angle: 45.0,
                                                                            nodes: [

                                                                                // Sphere geometry
                                                                                {
                                                                                    type: "sphere"
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
                                },

                                {
                                    type: "light",
                                    mode:                   "point",
                                    pos:                    { x: sun_x_pos, y: 0, z: 0 },
                                    color:                  { r: 1.0, g: 1.0, b: 1.0 },
                                    diffuse:                true,
                                    specular:               true,

                                    constantAttenuation: 1.0,
                                    quadraticAttenuation: 0.0,
                                    linearAttenuation: 0.0
                                },

                                // Integrate our sun, which is defined in sun.js

                                {
                                    type : "instance",
                                    target :"sun"
                                },

                                {
                                    type: "translate",
                                    id: "sun-pointer1",
                                    x: 0, y: 0, z: 0,
                                    nodes: [
                                        {
                                            type: "material",
                                            baseColor:      { r: 1.0, g: 1.0, b: 1.0 },
                                            specularColor:  { r: 1.0, g: 1.0, b: 1.0 },
                                            specular:       0.2,
                                            shine:          0.2,
                                            emit:           1.0,
                                            nodes: [
                                                {
                                                    type: "translate",
                                                    y: sun_radius_km * 20,
                                                    nodes: [
                                                        {
                                                            type: "billboard",
                                                            nodes: [
                                                                {
                                                                    type: "scale",
                                                                    x: 6000,
                                                                    y: 6000,
                                                                    z: 6000,
                                                                    nodes: [
                                                                        {
                                                                            type: "text",
                                                                            mode: "vector",
                                                                            text: "Sun"
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
                                },

                                // Integrate our earth elliptical orbit, which is defined in earth-orbit.js
                                {
                                    type : "instance",
                                    target :"earthEllipseOrbit"
                                },

                                {
                                    type   : "instance",
                                    target : "orbit-grid"
                                },

                                {
                                    type: "translate",
                                    x: 0, y: 0, z: 0,
                                    nodes: [
                                        {
                                            type: "material",
                                            baseColor:          { r: 1.0, g: 1.0, b: 0.0 },
                                            specularColor:      { r: 1.0, g: 1.0, b: 0.0 },
                                            specular:           5.0,
                                            shine:              5.0,
                                            emit:               20.0,
                                            nodes: [
                                                {
                                                    type: "translate",
                                                    y: 0,
                                                    x: earth_orbital_radius_km * 1.1,
                                                    z: earth_orbital_radius_km * -0.2,
                                                    nodes: [
                                                        {
                                                            type: "scale",
                                                            x: 15000,
                                                            y: 15000,
                                                            z: 15000,
                                                            nodes: [
                                                                {
                                                                    type: "rotate",
                                                                    angle: -90,
                                                                    x:     1.0,
                                                                    y:     0.0,
                                                                    z:     0.0,
                                                                    nodes: [
                                                                        {
                                                                            type: "rotate",
                                                                            angle: -90,
                                                                            x:     0.0,
                                                                            y:     0.0,
                                                                            z:     1.0,
                                                                            nodes: [
                                                                                {
                                                                                    type: "text",
                                                                                    mode: "vector",
                                                                                    text: "Jun"
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    type: "translate",
                                                    y: 0,
                                                    x: earth_orbital_radius_km * -0.2,
                                                    z: earth_orbital_radius_km * -1.1,
                                                    nodes: [
                                                        {
                                                            type: "scale",
                                                            x: 15000,
                                                            y: 15000,
                                                            z: 15000,
                                                            nodes: [
                                                                {
                                                                    type: "rotate",
                                                                    angle: -90,
                                                                    x:     1.0,
                                                                    y:     0.0,
                                                                    z:     0.0,
                                                                    nodes: [
                                                                        {
                                                                            type: "rotate",
                                                                            angle: 0,
                                                                            x:     0.0,
                                                                            y:     0.0,
                                                                            z:     1.0,
                                                                            nodes: [
                                                                                {
                                                                                    type: "text",
                                                                                    mode: "vector",
                                                                                    text: "Sep"
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    type: "translate",
                                                    y: 0,
                                                    x: earth_orbital_radius_km * -1.1,
                                                    z: earth_orbital_radius_km * 0.2,
                                                    nodes: [
                                                        {
                                                            type: "scale",
                                                            x: 15000,
                                                            y: 15000,
                                                            z: 15000,
                                                            nodes: [
                                                                {
                                                                    type: "rotate",
                                                                    angle: -90,
                                                                    x:     1.0,
                                                                    y:     0.0,
                                                                    z:     0.0,
                                                                    nodes: [
                                                                        {
                                                                            type: "rotate",
                                                                            angle: 90,
                                                                            x:     0.0,
                                                                            y:     0.0,
                                                                            z:     1.0,
                                                                            nodes: [
                                                                                {
                                                                                    type: "text",
                                                                                    mode: "vector",
                                                                                    text: "Dec"
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    type: "translate",
                                                    y: 0,
                                                    x: earth_orbital_radius_km * 0.2,
                                                    z: earth_orbital_radius_km * 1.1,
                                                    nodes: [
                                                        {
                                                            type: "scale",
                                                            x: 15000,
                                                            y: 15000,
                                                            z: 15000,
                                                            nodes: [
                                                                {
                                                                    type: "rotate",
                                                                    angle: -90,
                                                                    x:     1.0,
                                                                    y:     0.0,
                                                                    z:     0.0,
                                                                    nodes: [
                                                                        {
                                                                            type: "rotate",
                                                                            angle: 180,
                                                                            x:     0.0,
                                                                            y:     0.0,
                                                                            z:     1.0,
                                                                            nodes: [
                                                                                {
                                                                                    type: "text",
                                                                                    mode: "vector",
                                                                                    text: "Mar"
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                            ]
                                        }
                                    ]
                                },

                                // {
                                //     type   : "instance",
                                //     target : "earth-circle-orbit-sun-line"
                                // },

                                {
                                    type: "material",
                                    baseColor:      { r: 1.0, g: 0.0, b: 0.0 },
                                    specularColor:  { r: 1.0, g: 0.0, b: 0.0 },
                                    specular:       20.0,
                                    shine:          20.0,
                                    emit:           20.0,

                                    nodes: [

                                        {
                                            type: "selector",
                                            id: "earthSunLineSelector1",
                                            selection: [0],

                                            nodes: [

                                                {},

                                                {

                                                    type: "translate", // Example translation
                                                    id: "earth-sun-line-translation1",
                                                    x: 0,
                                                    y: 0.0,
                                                    z: earth_x_pos / 2,

                                                    nodes : [

                                                        {

                                                            type: "rotate",
                                                            id: "earth-sun-line-rotation1",
                                                            angle: 270.0,
                                                            y : 1.0,

                                                            nodes: [

                                                                {

                                                                    type: "scale",
                                                                    id: "earth-sun-line-scale1",
                                                                    x: earth_orbital_radius_km / 2,
                                                                    y: sun_earth_line_size_large,
                                                                    z: sun_earth_line_size_large,

                                                                    nodes: [

                                                                        {

                                                                            type: "box",
                                                                        },
                                                                    ]
                                                                },
                                                            ]
                                                        }
                                                    ]
                                                },

                                                {
                                                    type: "geometry",
                                                    primitive: "line-loop",

                                                    positions: [
                                                         sun_x_pos,     0.0,    0.0,
                                                         earth_x_pos,   0.0,    0.0
                                                    ],

                                                    indices : [ 0, 1 ]

                                                },
                                            ]
                                        }
                                    ]
                                },

                                {
                                    type: "translate",
                                    id: "earth-pointer1",
                                    x: earth_x_pos, y: sun_radius_km * 10.5, z: 0,
                                },
                                {
                                    id : "earth-sphere1",
                                    type: "material",
                                    baseColor:      { r: 0.45, g: 0.45, b: 0.45 },
                                    specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
                                    specular:       0.0,
                                    shine:          2.0,
                                    emit:           4.0,

                                    nodes: [

                                        {
                                            type: "translate",
                                            id: "earth-position1",
                                            x: earth_x_pos,
                                            y: 0,
                                            z: 0,

                                            nodes: [
                                                {
                                                     type: "scale",
                                                     x: earth_radius_km,
                                                     y: earth_radius_km,
                                                     z: earth_radius_km,
                                                     nodes: [
                                                         {
                                                            type: "translate",
                                                            id:   "spaceship_position",
                                                            y: earth_radius_km * 0,
                                                            x: earth_radius_km * 0,
                                                            z: earth_radius_km * 0,
                                                            nodes: [
                                                                {
                                                                    type: "rotate",
                                                                    id:   "spaceship_rotation_pitch",
                                                                    angle: 0,
                                                                    x:  1.0,
                                                                    y:  0.0,
                                                                    z:  0.0,
                                                                    nodes: [
                                                                        {
                                                                            type: "rotate",
                                                                            id:   "spaceship_rotation_yaw",
                                                                            angle: 90,
                                                                            x:  0.0,
                                                                            y:  1.0,
                                                                            z:  0.0,
                                                                            nodes: [
                                                                                {
                                                                                    type: "scale",
                                                                                    x: 1000,
                                                                                    y: 1000,
                                                                                    z: 1000,
                                                                                    nodes: [
                                                                                        {
                                                                                            type: "instance",
                                                                                            target: "spaceship"
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
                                                },
                                                {
                                                    type: "quaternion",
                                                    id: "earthRotationalAxisQuaternion1",
                                                    x: 0.0, y: 0.0, z: 0.0, angle: 0.0,

                                                    rotations: [ { x : 0, y : 0, z : 1, angle : 23.5 } ],

                                                    nodes: [

                                                       {
                                                            type: "scale",
                                                            x: earth_radius_km,
                                                            y: earth_radius_km,
                                                            z: earth_radius_km,

                                                            nodes: [

                                                                {
                                                                    type: "rotate",
                                                                    id: 'earth-rotation1',
                                                                    angle: 0,
                                                                    y: 1.0,

                                                                    nodes: [

                                                                        { type: "sphere", id: "esphere1", slices: 45 },

                                                                    ]
                                                                },
                                                                {
                                                                    type: "selector",
                                                                    id: "earthAxisSelector1",
                                                                    selection: [1],
                                                                    nodes: [
                                                                        // 0: no axis indicator
                                                                        { },
                                                                        // 1: display axis indicator
                                                                        {
                                                                            nodes: [
                                                                                {
                                                                                    type: "material",
                                                                                    baseColor:      { r: 1.0, g: 0.1, b: 0.1 },
                                                                                    specularColor:  { r: 1.0, g: 0.1, b: 0.1 },
                                                                                    specular:       2.0,
                                                                                    shine:          2.0,
                                                                                    emit:           0.8,
                                                                                    nodes: [
                                                                                        {
                                                                                            type: "scale",
                                                                                            x: earth_radius_km * 40,
                                                                                            y: earth_radius_km * 1600,
                                                                                            z: earth_radius_km * 40,
                                                                                            nodes: [ { type: "disk" } ]
                                                                                        },
                                                                                        {
                                                                                            type: "translate",
                                                                                            y: earth_radius_km * 1200,
                                                                                            x: earth_radius_km * -200,
                                                                                            nodes: [
                                                                                                {
                                                                                                    type: "billboard",
                                                                                                    nodes: [
                                                                                                        {
                                                                                                            type: "scale",
                                                                                                            x: 3500,
                                                                                                            y: 3500,
                                                                                                            z: 3500,
                                                                                                            nodes: [
                                                                                                                {
                                                                                                                    type: "translate",
                                                                                                                    x: -5,
                                                                                                                    y: 0,
                                                                                                                    z: 0,
                                                                                                                    nodes: [
                                                                                                                        {
                                                                                                                            type: "material",
                                                                                                                            baseColor:      { r: 1.0, g: 1.0, b: 1.0 },
                                                                                                                            specularColor:  { r: 1.0, g: 1.0, b: 1.0 },
                                                                                                                            specular:       2.0,
                                                                                                                            shine:          2.0,
                                                                                                                            emit:           2.0,
                                                                                                                            nodes: [
                                                                                                                                {
                                                                                                                                    type: "text",
                                                                                                                                    mode: "vector",
                                                                                                                                    text: "Earth Axis"
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
                                                                                        },
                                                                                        {
                                                                                            nodes: [
                                                                                                {
                                                                                                    type: "translate",
                                                                                                    y: earth_radius_km * 800,
                                                                                                    nodes: [
                                                                                                        {
                                                                                                            type: "rotate",
                                                                                                            angle: 90,
                                                                                                            x: -1.0,
                                                                                                            nodes: [
                                                                                                                {
                                                                                                                    type: "scale",
                                                                                                                    x: earth_radius_km * 100,
                                                                                                                    y: earth_radius_km * 100,
                                                                                                                    z: earth_radius_km * 100,
                                                                                                                    nodes: [
                                                                                                                      { type: "sphere",
                                                                                                                        slices: 4,
                                                                                                                        rings: 4,
                                                                                                                        majorAxis: 2.0,
                                                                                                                        sweep: 0.5
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
                    ]
                }
            ]
        },

        {

            type: "scene",
            id: "theScene3",
            canvasId: "theCanvas3",
            loggingElementId: "theLoggingDiv3",

            nodes: [

                {
                    type: "lookAt",

                    id: "lookAt3",
                    eye : initial_earth_eye,
                    look : { x : earth_x_pos, y : 0, z : 0.0 },
                    up : { x: 0.0, y: 1.0, z: 0.0 },

                    nodes: [

                        {
                            type: "camera",
                            id: "theCamera3",
                            optics: {
                                type: "perspective",
                                fovy : 50.0,
                                aspect : 1.43,
                                near : earth_view_small_offset,
                                far : milky_way_apparent_radius * 10,
                            },
                            nodes: [

                                // {
                                //     type : "instance",
                                //     target :"sky-sphere"
                                // },

                                {
                                    type: "rotate",
                                    angle: 0,
                                    y: 1.0,

                                    nodes: [

                                        // First simulate the milky-way with a stationary background sphere
                                        {
                                            type: "stationary",

                                            nodes: [

                                                // Size of sky sphere
                                                {
                                                    type: "scale",
                                                    x: milky_way_apparent_radius,
                                                    y: milky_way_apparent_radius,
                                                    z: milky_way_apparent_radius,
                                                    nodes: [

                                                        // Starry texture
                                                        {
                                                            type: "texture",
                                                            layers: [
                                                                {
                                                                    uri: "images/milky_way_panorama_3000x1500.jpg",
                                                                    wrapS: "clampToEdge",
                                                                    wrapT: "clampToEdge",
                                                                    applyTo:"baseColor",
                                                                    blendMode:"multiply"
                                                                }
                                                            ],
                                                            nodes: [

                                                                // Material for texture to apply to
                                                                {
                                                                    type: "material",
                                                                    baseColor:      { r: 1.0, g: 1.0, b: 1.0 },
                                                                    specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
                                                                    specular:       0.0,
                                                                    shine:          0.0,
                                                                    emit:           1.0,

                                                                    nodes: [

                                                                        // Tilt the milky way a little bit
                                                                        {
                                                                            type: "rotate",
                                                                            z: 1,
                                                                            angle: 45.0,
                                                                            nodes: [

                                                                                // Sphere geometry
                                                                                {
                                                                                    type: "sphere"
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
                                },

                                {

                                    id: "sun3",
                                    type: "material",
                                    baseColor:      { r: 1.0, g: 0.95, b: 0.6 },
                                    specularColor:  { r: 1.0, g: 0.95, b: 0.6 },
                                    specular:       2.0,
                                    shine:          2.0,
                                    emit:           1.0,

                                    nodes: [

                                        {
                                            type: "translate",
                                            x: sun_x_pos,
                                            y: 0,
                                            z: 0,

                                            nodes: [
                                                {
                                                    type: "scale",
                                                    x: sun_radius_km,
                                                    y: sun_radius_km,
                                                    z: sun_radius_km,

                                                    nodes: [  { type: "sphere", slices: 60, rings: 60 } ]

                                                }
                                            ]
                                        }
                                    ]
                                },

                                {
                                    type: "material",
                                    baseColor:      { r: 1.0, g: 0.3, b: 0.1 },
                                    specularColor:  { r: 1.0, g: 0.3, b: 0.1 },
                                    specular:       5.0,
                                    shine:          5.0,
                                    emit:           1.0,

                                    nodes: [

                                        {
                                            type: "selector",
                                            id: "earthSunLineSelector3",
                                            selection: [0],

                                            nodes: [

                                                {},

                                                {

                                                    type: "translate", // Example translation
                                                    id: "earth-sun-line-translation3",
                                                    x: 0,
                                                    y: 0.0,
                                                    z: earth_x_pos / 2,

                                                    nodes : [

                                                        {

                                                            type: "rotate",
                                                            id: "earth-sun-line-rotation3",
                                                            angle: 270.0,
                                                            y : 1.0,

                                                            nodes: [

                                                                {

                                                                    type: "scale",
                                                                    id: "earth-sun-line-scale3",
                                                                    x: earth_orbital_radius_km / 2,
                                                                    y: sun_earth_line_size_large,
                                                                    z: sun_earth_line_size_large,

                                                                    nodes: [

                                                                        {

                                                                            type: "box",
                                                                        },
                                                                    ]
                                                                },
                                                            ]
                                                        }
                                                    ]
                                                },

                                                {
                                                    type: "geometry",
                                                    primitive: "line-loop",

                                                    positions: [
                                                         sun_x_pos,     0.0,    0.0,
                                                         earth_x_pos,   0.0,    0.0
                                                    ],

                                                    indices : [ 0, 1 ]

                                                },
                                            ]
                                        }
                                    ]
                                },

                                {
                                    type: "light",
                                    mode:                   "point",
                                    pos:                    { x: sun_x_pos, y: 0, z: 0 },
                                    color:                  { r: 3.0, g: 3.0, b: 3.0 },
                                    diffuse:                true,
                                    specular:               true,

                                    constantAttenuation: 1.0,
                                    quadraticAttenuation: 0.0,
                                    linearAttenuation: 0.0
                                },

                                {
                                    type: "light",
                                    mode:                   "dir",
                                    color:                  { r: dark_side, g: dark_side, b: dark_side },
                                    diffuse:                true,
                                    specular:               true,
                                    dir:                    { x: 1.0, y: 0.0, z: -0.75 }
                                },

                                {
                                    type: "light",
                                    mode:                   "dir",
                                    color:                  { r: dark_side, g: dark_side, b: dark_side },
                                    diffuse:                true,
                                    specular:               true,
                                    dir:                    { x: 1.0, y: 0.0, z: 0.75 }
                                },

                                {
                                    type: "translate",
                                    x: sun_x_pos,
                                    y: 0,
                                    z: 0,
                                    nodes: [

                                        {
                                            type: "scale",
                                            x: 1,
                                            y: 1,
                                            z: 1,
                                            nodes: [

                                                {
                                                    type: "node",

                                                    flags: {
                                                        transparent: true
                                                    },

                                                    nodes: [

                                                        {

                                                            type: "material",

                                                            baseColor:          { r: 0.1, g: 0.8, b: 2.0 },
                                                            specularColor:      { r: 0.1, g: 0.8, b: 2.0 },
                                                            specular:           1.0,
                                                            shine:              2.0,
                                                            emit:               2.0,
                                                            alpha:              0.4,

                                                            nodes: [

                                                                // {
                                                                //     type: "instance",
                                                                //     target: "earth-in-space-elliptical-orbital-path"
                                                                // }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }

                                    ]
                                },

                                // {
                                //     type : "instance",
                                //     target : "earth-sphere"
                                // },

                                {
                                    type: "translate",
                                    id: "earth-position3",
                                    x: earth_x_pos,
                                    y: 0,
                                    z: 0,

                                    nodes: [

                                        //  Earth grid ...
                                        {
                                            type: "material",
                                            baseColor:      { r: 0.4, g: 0.6, b: 0.4 },
                                            specularColor:  { r: 0.4, g: 0.6, b: 0.4 },
                                            specular:       1.0,
                                            shine:          2.0,
                                            emit:           0.4,

                                            nodes: [

                                                {

                                                    type: "selector",
                                                    id: "earth-grid-selector3",
                                                    selection: [0],
                                                    nodes: [

                                                        // 0: off

                                                        {  },

                                                        // 1: on: orbit grid for Earth view

                                                        {
                                                            type: "geometry",
                                                            primitive: "lines",

                                                            positions: orbit_grid_earth_positions,
                                                            indices : orbit_grid_earth_indices

                                                        }
                                                    ]
                                                }
                                            ]
                                        },

                                        {
                                            type: "quaternion",
                                            id: "earthRotationalAxisQuaternion3",
                                            x: 0.0, y: 0.0, z: 0.0, angle: 0.0,

                                            rotations: [ { x : 0, y : 0, z : 1, angle : 23.5 } ],

                                            nodes: [

                                                {
                                                     type: "node",
                                                     id: "latitude-line-destination3",
                                                },

                                                {
                                                    id : "earth-sphere3",
                                                    type: "material",
                                                    baseColor:      { r: 0.45, g: 0.45, b: 0.45 },
                                                    specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
                                                    specular:       0.0,
                                                    shine:          2.0,

                                                    nodes: [

                                                        {
                                                            type: "scale",
                                                            x: earth_radius_km,
                                                            y: earth_radius_km,
                                                            z: earth_radius_km,

                                                            nodes: [

                                                                {
                                                                    type: "rotate",
                                                                    id: 'earth-rotation3',
                                                                    angle: 0,
                                                                    y: 1.0,

                                                                    nodes: [

                                                                        {

                                                                            id: "earth-terrain-texture3",
                                                                            type: "texture",
                                                                            layers: [

                                                                                {

                                                                                   uri:"images/lat-long-grid-invert-units-1440x720-15.png",
                                                                                   blendMode: "add",

                                                                                },
                                                                                {

                                                                                    uri:"images/earth3-monochrome.jpg",

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
                                                                                    internalFormat:"lequal",
                                                                                    sourceFormat:"alpha",
                                                                                    sourceType: "unsignedByte",
                                                                                    applyTo:"baseColor",
                                                                                    blendMode: "multiply",

                                                                                    /* Texture rotation angle in degrees
                                                                                     */
                                                                                    rotate: 180.0,

                                                                                    /* Texture translation offset
                                                                                     */
                                                                                    translate : {
                                                                                        x: 0,
                                                                                        y: 0
                                                                                    },

                                                                                    /* Texture scale factors
                                                                                     */
                                                                                    scale : {
                                                                                        x: -1.0,
                                                                                        y: 1.0
                                                                                    }
                                                                                }
                                                                            ],

                                                                            nodes: [

                                                                                { type: "sphere", id: "esphere3", slices: 45 }
                                                                            ]
                                                                        },

                                                                        {
                                                                             type: "node",
                                                                             id: "earth-surface-location-destination",
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            type: "selector",
                                                            id: "earthAxisSelector3",
                                                            selection: [1],
                                                            nodes: [
                                                                // 0: no axis indicator
                                                                { },
                                                                // 1: display axis indicator
                                                                {
                                                                    nodes: [
                                                                        {
                                                                            type: "material",
                                                                            baseColor:      { r: 0.9, g: 0.1, b: 0.1 },
                                                                            specularColor:  { r: 0.1, g: 0.1, b: 0.1 },
                                                                            specular:       0.2,
                                                                            shine:          0.2,
                                                                            emit:           0.1,
                                                                            nodes: [
                                                                                {
                                                                                    type: "scale",
                                                                                    x: earth_radius_km * 0.02,
                                                                                    y: earth_radius_km * 2.4,
                                                                                    z: earth_radius_km * 0.02,
                                                                                    nodes: [ { type: "disk" } ]
                                                                                },
                                                                                {
                                                                                    type: "material",
                                                                                    baseColor:      { r: 1.0, g: 1.0, b: 1.0 },
                                                                                    specularColor:  { r: 1.0, g: 1.0, b: 1.0 },
                                                                                    specular:       0.2,
                                                                                    shine:          0.2,
                                                                                    emit:           1.0,
                                                                                    nodes: [
                                                                                        {
                                                                                            type: "translate",
                                                                                            y: earth_radius_km * 1.2,
                                                                                            nodes: [
                                                                                                {
                                                                                                    type: "billboard",
                                                                                                    nodes: [
                                                                                                        {
                                                                                                            type: "scale",
                                                                                                            x: 0.3,
                                                                                                            y: 0.3,
                                                                                                            z: 0.3,
                                                                                                            nodes: [
                                                                                                                {
                                                                                                                    type: "text",
                                                                                                                    mode: "vector",
                                                                                                                    text: "Earth Axis"
                                                                                                                }
                                                                                                            ]
                                                                                                        }
                                                                                                    ]
                                                                                                }
                                                                                            ]
                                                                                        }
                                                                                    ]
                                                                                },
                                                                                {
                                                                                    type: "translate",
                                                                                    y: earth_radius_km * 1.2,
                                                                                    nodes: [
                                                                                        {
                                                                                            type: "rotate",
                                                                                            angle: 90,
                                                                                            x: -1.0,
                                                                                            nodes: [
                                                                                                {
                                                                                                    type: "scale",
                                                                                                    x: earth_radius_km * 0.05,
                                                                                                    y: earth_radius_km * 0.05,
                                                                                                    z: earth_radius_km * 0.05,
                                                                                                    nodes: [
                                                                                                      { type: "sphere",
                                                                                                        slices: 4,
                                                                                                        rings: 4,
                                                                                                        sweep: 0.5
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
    ]
});

var scenejs_compilation = true;

SceneJS.setDebugConfigs({
    compilation : {
        enabled : scenejs_compilation
    }
});

/*----------------------------------------------------------------------
 * Scene rendering loop and mouse handler stuff follows
 *---------------------------------------------------------------------*/

var seasons_activity = new seasons.Activity({
    version: 1.2,
    scenes: {
      scene1: new seasons.Scene({
          theScene:                    "theScene1",
          camera:                      "theCamera1",
          canvas:                      "theCanvas1",
          look:                        "lookAt1",
          earth_position:              "earth-position1",
          earth_rotation:              "earth-rotation1",
          spaceship_position:          "spaceship_position",
          spaceship_rotation_yaw:      "spaceship_rotation_yaw",
          spaceship_rotation_pitch:    "spaceship_rotation_pitch",

          earth_sun_line_rotation:     "earth-sun-line-rotation1",
          earth_sun_line_translation:  "earth-sun-line-translation1",
          earth_sun_line_scale:        "earth-sun-line-scale1",

          earth_tilt:                  "earthRotationalAxisQuaternion1",

          choose_view:                 "choose-view",
          choose_month:                "choose-month",
          choose_month_callbacks:       [updateLatitudeLineAndCity, chooseMonthLogger],
          earth_pointer:               "earth-pointer1",
          earth_label:                 true,
          earth_info_label:            "earth-info-label1",
          debugging:                   false,
      }),
      scene3: new seasons.Scene({
          theScene:                    "theScene3",
          camera:                      "theCamera3",
          canvas:                      "theCanvas3",
          look:                        "lookAt3",
          earth_position:              "earth-position3",
          earth_rotation:              "earth-rotation3",
          latitude_line:               "latitude-line-destination3",
          look_at_selection:           "earth",
          gridSelector:                "earth-grid-selector3",
          earth_sun_line_rotation:     "earth-sun-line-rotation3",
          earth_sun_line_translation:  "earth-sun-line-translation3",
          earth_sun_line_scale:        "earth-sun-line-scale3",

          earth_tilt:                  "earthRotationalAxisQuaternion3",

          choose_view:                 "choose-view",
          choose_month:                "choose-month",
          linked_scene:                scene1,
          earth_surface_location:      true,
          earth_pointer:               false,
          earth_label:                 false,
          earth_info_label:            "earth-info-label3",
          debugging:                   true,
      })
    }
});

var scene1 = seasons_activity.scenes.scene1;
var scene3 = seasons_activity.scenes.scene3;

scene3.linked_scene = scene1;
scene1.linked_from_scene = scene3;

scene1.updateSpaceshipPosition();

SceneJS.setDebugConfigs({
    compilation : {
        enabled : false
    }
});

function seasonsRender() {
    scene1.render();
    scene3.render();
}

var earth_rotation = document.getElementById("earth-rotation");

function seasonsAnimate() {
    var sampleTime = new Date().getTime();
    if (keepAnimating) requestAnimFrame(seasonsAnimate);
    if (sampleTime > nextAnimationTime) {
        nextAnimationTime = nextAnimationTime + updateInterval;
        if (sampleTime > nextAnimationTime) nextAnimationTime = sampleTime + updateInterval;
        if (earth_rotation.checked) {
            scene3.earth_rotation.set("angle", scene3.earth_rotation.get("angle") + 0.25);
        }
        seasonsRender();
    }
}

SceneJS.bind("error", function() {
    keepAnimating = false;
});

SceneJS.bind("reset", function() {
    keepAnimating = false;
});

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback) {
           window.setTimeout(callback, 1000/60);
         };
})();

var updateRate = 30;
var updateInterval = 1000/updateRate;
// looks like this may have been *intended* to be `new Data().getTime() + updateInterval`
var nextAnimationTime = new Date().getTime(); //+ updateInterval;
var keepAnimating = true;

requestAnimFrame(seasonsAnimate);

/**
 * callback when the scene object has completely finished loading.
 * check to see if this is embedded inside an iframe (has parent). If yes,
 * assume that this is in WISE4 mode, so let WISE4 know that seasons model has loaded.
 * @return
 */

var zBufferDepth = 0;

var completelyLoaded = false;

function sceneCompletelyLoaded() {
	if (parent && parent.eventManager) {
		if (typeof parent.eventManager != "undefined") {
			parent.eventManager.fire("seasonsModelIFrameLoaded");
		}
	}
}

SceneJS.withNode("theScene3").bind("loading-status",

    function(event) {
        if (zBufferDepth === 0) {
            // not sure if this parseInt is necessary -- comparison above was previously '=='
            // which might have depended on implicit conversion -RK
            zBufferDepth = parseInt(SceneJS.withNode("theScene3").get("ZBufferDepth"), 10);
            var mesg = "using webgl context with Z-buffer depth of: " + zBufferDepth + " bits";
            SceneJS._loggingModule.info(mesg);

        }
        var params = event.params;

        if (params.numNodesLoading > 0) {
        } else {
          if (!completelyLoaded) {
            sceneCompletelyLoaded();
            completelyLoaded = true;
          }
        }

    });

//
// city data experiment table and graph
//

var month_data = {
    "jan": { index:  0, num:   1, short_name: 'JAN', long_name: 'January' },
    "feb": { index:  1, num:   2, short_name: 'FEB', long_name: 'February' },
    "mar": { index:  2, num:   3, short_name: 'MAR', long_name: 'March' },
    "apr": { index:  3, num:   4, short_name: 'APR', long_name: 'April' },
    "may": { index:  4, num:   5, short_name: 'MAY', long_name: 'May' },
    "jun": { index:  5, num:   6, short_name: 'JUN', long_name: 'June' },
    "jul": { index:  6, num:   7, short_name: 'JUL', long_name: 'July' },
    "aug": { index:  7, num:   8, short_name: 'AUG', long_name: 'August' },
    "sep": { index:  8, num:   9, short_name: 'SEP', long_name: 'September' },
    "oct": { index:  9, num:  10, short_name: 'OCT', long_name: 'October' },
    "nov": { index: 10, num:  11, short_name: 'NOV', long_name: 'Novemeber' },
    "dec": { index: 11, num:  12, short_name: 'DEC', long_name: 'December' }
};

var month_names = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

var choose_month = document.getElementById("choose-month");

var selected_city_latitude = document.getElementById("selected-city-latitude");
var city_option;
var active_cities = [];
var city, city_location;

// FIXME: refactor access to key
var c1 = 0;
for (var c = 0; c < cities.length; c++) {
    var this_city = cities[c];
    if (cities[c].active) {
        this_city.key = this_city.name.replace(/\W/, '') + '_' + c1 + '_' + this_city.location.latitude + '_' + this_city.location.longitude;
        active_cities.push(cities[c]);
        c1++;
    }
}

for (i = 0; i < active_cities.length; i++) {
    city_option = document.createElement('option');
    city = active_cities[i];
    city_location = city.location;
    city_option.value = i;
    city_option.textContent = city.name + ', ' + city.country + ', ' +

        sprintf("%2.0f", city_location.latitude) + ' degrees ' + city_location.lat_dir;
    selected_city_latitude.appendChild(city_option);
}

var city_latitude_temperature = document.getElementById("city-latitude-temperature");
var city_latitude_temperature_label = document.getElementById("city-latitude-temperature-label");
var city_latitude_temperature_prediction = document.getElementById("city-latitude-temperature-prediction");
var city_latitude_button_results = document.getElementById("city-latitude-button-results");

function updateLatitudeLineAndCity() {
  var earth_rotation = document.getElementById("earth-rotation");
  if (selected_city_latitude && selected_city_latitude.value !== "city ...") {
    var city_index = Number(selected_city_latitude.value);
    var city = active_cities[city_index];
    var city_location = city.location;
    if (LITE_VERSION) {
      var results = document.getElementById("button-results");
      results.textContent = '';
    }
    scene3.latitude_line.setLatitude(city_location.signed_latitude);
    scene3.earth_surface_location.setLocation(city_location.signed_latitude, city_location.signed_longitude);
    scene3.earth_rotation.set("angle", city_location.signed_longitude + scene3.get_orbital_angle());
  }
  if (earth_rotation) {
    earth_rotation.checked = false;
  }
}

function updateLatitudeLineAndCityHandler() {
  var city = active_cities[Number(selected_city_latitude.value)];
  updateLatitudeLineAndCity();
  seasons_activity.logInteraction({ "choose city": city.name });
}
selected_city_latitude.onchange = updateLatitudeLineAndCityHandler;

function earthRotationLogger() {
  seasons_activity.logInteraction({ "rotation": earth_rotation.checked });
}
earth_rotation.onchange = earthRotationLogger;

function chooseMonthLogger(month) {
  seasons_activity.logInteraction({ "choose month": month });
}

var city_data_table_body = document.getElementById("city-data-table-body");

var table_row, table_data;

var graph_checkbox_callbacks = {};

var city_data_to_plot = [];
(function() {
    for (i = 0; i < active_cities.length; i++) {
        city_data_to_plot.push({});
        var city_data = city_data_to_plot[i];
        var city = active_cities[i];
        city_data.label = city.name;
        city_data.color = city.color;
        city_data.lines = { show: true };
        city_data.points = { show: true };
        city_data.data = [];
        for (var m = 0; m < 12; m++) {
            city_data.data.push([m, null]);
        }
    }
}());

var city_x_axis_tics = [];
for (i = 0; i < 12; i++) {
  var shifted_index = i;
  // var shifted_index = (i + 1) % 12;
  city_x_axis_tics.push([i , month_data[month_names[shifted_index]].short_name]);
}

var table_row_index = 0;

function addExperimentData() {
    if (selected_city_latitude.value == 'city ...' ||
        ! city_latitude_temperature_prediction.value) {
        return false;
    }
    var city_index = Number(selected_city_latitude.value);
    var city = active_cities[city_index];

    var the_month = scene1.month;
    var month = month_data[the_month];

    // FIXME: refactor so this can be changed without affecting _graph_checkbox_callback
    // 0: "Fairbanks"
    // 1: "0"
    // 2: "64.51"
    // 3: "147.43"
    // 4: "jun"
    var city_element_id = city.key + '_' + the_month;

    // if the City/Month row already exists in the

    // data table return without adding a new one
    if (document.getElementById(city_element_id)) return false;

    table_row = document.createElement('tr');
    table_row.id = city_element_id;

    table_row_index++;
    table_data = document.createElement('td');
    table_data.textContent = table_row_index;
    table_row.appendChild(table_data);

    table_data = document.createElement('td');
    table_data.textContent = city.name;
    table_row.appendChild(table_data);

    table_data = document.createElement('td');
    table_data.textContent = month.short_name;
    table_row.appendChild(table_data);

    table_data = document.createElement('td');
    var ave_temp = city.average_temperatures[month.index];
    if (use_fahrenheit) ave_temp = ave_temp * 9 / 5 + 32;
    table_data.textContent = sprintf("%3.1f", ave_temp);
    table_row.appendChild(table_data);

    table_data = document.createElement('td');
    table_data.textContent = city_latitude_temperature_prediction.value;
    table_row.appendChild(table_data);

    // table_data = document.createElement('td');
    // var select, option;
    // select = document.createElement('select');
    // select.name = 'season_' + city_element_id;
    // select.id = 'season_' + city_element_id;
    //
    // option = document.createElement('option');
    // option.disabled = true;
    // option.textContent = "choose...";
    // select.appendChild(option);
    //
    // for (i = 0; i < seasons.length; i++) {
    //     option = document.createElement('option');
    //     option.value = seasons[i];
    //     option.textContent = seasons[i];
    //     select.appendChild(option);
    // };
    // option = document.createElement('option');
    // option.value = "I'm not sure";
    // option.textContent = "I'm not sure";
    // select.appendChild(option);
    // table_data.appendChild(select);
    // table_row.appendChild(table_data);

    // <select id="selected-city-month" name="selected-city-month">
    //   <option disabled selected>date ...</option>
    //   <option value="dec">Dec 21</option>
    //   <option value="mar">Mar 21</option>
    //   <option value="jun">Jun 21</option>
    //   <option value="sep">Sep 21</option>
    // </select>

    table_data = document.createElement('td');
    var graph_checkbox = document.createElement('input');
    graph_checkbox.id = 'graph_' + city_element_id;

    graph_checkbox.type = "checkbox";
    graph_checkbox.checked = true;
    table_data.appendChild(graph_checkbox);
    table_row.appendChild(table_data);

    var graph_checkbox_callback = function() {
        _graph_checkbox_callback(this);
    };

    graph_checkbox_callbacks[graph_checkbox.id] = graph_checkbox_callback;
    graph_checkbox.onchange = graph_checkbox_callback;
    _graph_checkbox_callback(graph_checkbox);

    city_data_table_body.appendChild(table_row);

    // erase previous temperature prediction
    city_latitude_temperature_prediction.value="";

    SortableTable.load();
    return false;
}

// 0: "graph"
// 1: "Fairbanks"
// 2: "0"
// 3: "64.51"
// 4: "147.43"
// 5: "jun"
function _graph_checkbox_callback(element) {
    var graph_id_parts = element.id.split(/_/);
    var city_index = graph_id_parts[2];
    var city_data = city_data_to_plot[city_index];
    var city = active_cities[city_index];
    var month = month_data[graph_id_parts[5]];
    var temperature = city.average_temperatures[month.index];
    if (use_fahrenheit) temperature = temperature * 9 / 5 + 32;
    var shifted_index = month.index;
    if (element.checked) {
        city_data.data[shifted_index] = [shifted_index, temperature];
    } else {
        city_data.data[shifted_index] = [shifted_index, null];
    }
    plotCityData();
}

function justUpdateResults() {
  if (selected_city_latitude.value == 'city ...' ||
    (city_latitude_temperature_prediction && ! city_latitude_temperature_prediction.value)) {
    return false;
  }
  var city_index = Number(selected_city_latitude.value);
  var city = active_cities[city_index];

  var the_month = scene1.month;
  var month = month_data[the_month];
  var results = document.getElementById("button-results");
  var ave_temp = city.average_temperatures[month.index];
  if (use_fahrenheit) ave_temp = ave_temp * 9 / 5 + 32;
  results.textContent = sprintf("%3.1f", ave_temp);
  return false;
}

if (LITE_VERSION) {
  city_latitude_button_results.onsubmit = justUpdateResults;
} else {
  city_latitude_temperature.onsubmit = addExperimentData;
}

// Exported for use by seasons.js
experimentDataToJSON = function() {
    var exp_table = { rows: [] };
    if (city_data_table_body) {
      var rows = city_data_table_body.childElements();
      var row_count = city_data_table_body.childElementCount;
      for (var r = 0; r < row_count; r++) {
          var row = rows[r];
          var cells = row.childElements();
          exp_table.rows.push({
              id:              row.id,
              index:           cells[0].textContent,
              city:            cells[1].textContent,
              month:           cells[2].textContent,
              temp:            cells[3].textContent,
              pred:            cells[4].textContent,
              graph:           cells[5].childElements()[0].checked,
              state:   {
                  scene1: JSON.stringify(scene1.toJSON()),
                  scene3: JSON.stringify(scene3.toJSON())
              }
          });
      }
      exp_table.table_row_index = table_row_index;
    }
    return exp_table;
};

// Exported for use by seasons.js
experimentDataFromJSON = function(exp_table) {
    var i;
    if (!city_data_table_body) { return; }
    var table_rows = city_data_table_body.rows.length;
    for (i = 0; i < table_rows; i++) {
        city_data_table_body.deleteRow(0);
    }

    for (i = 0; i < city_data_to_plot.length; i++) {
        var city_data = city_data_to_plot[i];
        for (var j = 0; j < city_data.data.length; j++) {
            city_data.data[j] = [j, null];
        }
    }

    var table_row, table_data;
    for (i = 0; i < exp_table.rows.length; i++) {
        var row = exp_table.rows[i];

        table_row = document.createElement('tr');
        table_row.id = row.id;

        table_data = document.createElement('td');
        table_data.textContent = row.index;
        table_row.appendChild(table_data);

        table_data = document.createElement('td');
        table_data.textContent = row.city;
        table_row.appendChild(table_data);

        table_data = document.createElement('td');
        table_data.textContent = row.month;
        table_row.appendChild(table_data);

        table_data = document.createElement('td');
        table_data.textContent = row.temp;
        table_row.appendChild(table_data);

        table_data = document.createElement('td');
        table_data.textContent = row.pred;
        table_row.appendChild(table_data);

        table_data = document.createElement('td');
        var graph_checkbox = document.createElement('input');
        graph_checkbox.id = 'graph_' + row.id;

        graph_checkbox.type = "checkbox";

        if(row.graph) {
            graph_checkbox.checked = true;
        } else {
            graph_checkbox.checked = false;
        }
        table_data.appendChild(graph_checkbox);
        table_row.appendChild(table_data);

        // Could almost surely be moved out of the loop. Meanwhile...
        //jshint -W083
        var graph_checkbox_callback = function() {
            _graph_checkbox_callback(this);
        };
        //jshint +W083
        graph_checkbox_callbacks[graph_checkbox.id] = graph_checkbox_callback;
        graph_checkbox.onchange = graph_checkbox_callback;
        _graph_checkbox_callback(graph_checkbox);

        city_data_table_body.appendChild(table_row);
    }
    plotCityData();
    table_row_index = exp_table.table_row_index;
};

//
// Graphs ...
//

var use_fahrenheit = true;

if (use_fahrenheit) {
    city_latitude_temperature_label.textContent =

    city_latitude_temperature_label.textContent.replace(/(C|F)$/, 'F');
} else {
    city_latitude_temperature_label.textContent =

    city_latitude_temperature_label.textContent.replace(/(C|F)$/, 'C');

}

var y_axis = { title: 'Temperature deg F', min: -20, max: 90 };
var graph_degree_string = "deg F";

if (!use_fahrenheit) {
    graph_degree_string = "deg F";
    y_axis.title = 'Temperature deg C';
    y_axis.min = -30;
    y_axis.max = 30;
}

function plotCityData() {
    Flotr.draw($('theCanvas4'), city_data_to_plot,

      {
        xaxis:{

          labelsAngle: 60,

          ticks: city_x_axis_tics,
          title: 'Month',

          noTics: city_x_axis_tics.length,
          min: 0, max: city_x_axis_tics.length - 1,
        },
        yaxis: y_axis,
        title: "Average Monthly Temperatures",
        grid:{ verticalLines: true, backgroundColor: 'white' },
        HtmlText: false,
        legend: false,
        // legend: { position: 'nw', margin: 1, backgroundOpacity: 0.1 },
        mouse:{
          track: true,
          lineColor: 'purple',
          relative: true,
          position: 'nw',
          sensibility: 1, // => The smaller this value, the more precise you've to point
          trackDecimals: 1,
          trackFormatter: function(obj) {
            return obj.series.label + ': ' + month_data[month_names[Number(obj.x) + 1]].short_name +  ', ' + obj.y + ' ' + graph_degree_string;
          }
        },
        crosshair:{ mode: 'xy' }
      }
    );
}

if (!LITE_VERSION) { plotCityData(); }

var city_color_keys = document.getElementById("city-color-keys");

function generateCityColorKeys() {
    // remove the existing list
    var color_key_list = document.getElementById("color-key-list");
    city_color_keys.removeChild(color_key_list);

    // create a new color-key-list
    color_key_list = document.createElement('ul');
    // color_key_list.className = "vlist";
    color_key_list.id = "color-key-list";

    for (var i = 0; i < active_cities.length; i++) {
        var city = active_cities[i];

        // create a list item
        var color_key_item = document.createElement('li');

        // create and add a colored patch
        var color_patch = document.createElement('div');
        color_patch.className = "colorKeyPatch";
        color_patch.style.backgroundColor = city.color;
        color_key_item.appendChild(color_patch);

        // add the city name
        var city_name = document.createElement('span');
        city_name.textContent = city.name;
        color_key_item.appendChild(city_name);

        // add the new list item to the list
        color_key_list.appendChild(color_key_item);
    }
    // insert the new color key list into the document
    city_color_keys.appendChild(color_key_list);
}

if (!LITE_VERSION) { generateCityColorKeys(); }

// exported for use by Flotr
scaleCanvas = function(_unusedArg_canvas, width, height) {
    if (width && height) {
        // possibly 'canvas' here was supposed to be 'oCanvas'?
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = width+"px";
        canvas.style.height = height+"px";

        var oSaveCtx = canvas.getContext("2d");

        oSaveCtx.drawImage(oCanvas, 0, 0, oCanvas.width, oCanvas.height, 0, 0, iWidth, iHeight);
        return oSaveCanvas;
    }
    return oCanvas;
};

choose_month.onchange();

}());
