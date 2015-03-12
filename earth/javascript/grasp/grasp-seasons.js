// jshint unused: true, undef: true

// exports
/* global
    seasons: true
*/

// libs
/* global
    SceneJS: false,
    sprintf: false,
    mat4: false,
    vec3: false
*/

// def by page?
/* global
    LITE_VERSION: false,
    CONSTRAIN_NAVIGATION: false
*/

// def by seasons<m>-<n>.js
/* global
    experimentDataFromJSON: false,
    experimentDataToJSON: false
*/

// latitude-line.js
/* global
    LatitudeLine: false
*/

// earth-surface-location-indicator.js
/* global
     EarthSurfaceLocationIndicator: false
*/

// solar-system-data.js
/* global
    normalized_initial_earth_eye: false,
    normalized_initial_earth_eye_side: false,
    deg2rad: false,
    rad2deg: false,
    earth_radius_km: false,
    earth_x_pos: false,
    initial_sun_eye_top: false,
    initial_sun_eye_side: false,
    initial_earth_eye_top: false,
    initial_earth_eye_side: false,
    scale_factor: false,
    sun_x_pos: false,
    normalized_initial_earth_eye_top: false,
    sun_earth_line_size_large: false,
    sun_earth_line_size_med: false
*/

// earth-orbit.js
/* global
    earth_ellipse_distance_from_sun_by_month: false,
    earth_ellipse_location_by_month: false
*/

// jpl-earth-ephemerides.js
/* global
    earth_ephemerides_solar_constant_by_month: false
*/

/* DOM IDs referenced:

    button-results
    content

    (the below are configurable per-scence):
    options.canvas || "theCanvas"
    options.choose_month || "choose-month"
    options.choose_tilt || "choose-tilt"
    options.choose_view || "choose-view"
    options.circle_orbit || "circle-orbit"
    options.earth_info_label || "earth-info-label"
    options.orbital_grid || "orbital-grid"
*/

var seasons;

(function() {
"use strict";

seasons = {};
var root = this;
seasons.VERSION = '0.1.0';

//
// Utilities ...
//

function getRadioSelection (form_element) {
    for(var i = 0; i < form_element.elements.length; i++) {
        if (form_element.elements[i].checked) {
            return form_element.elements[i].value;
        }
    }
    return false;
}

function setRadioSelection (form_element, value) {
    var el;
    for(var i = 0; i < form_element.elements.length; i++) {
        el = form_element.elements[i];
        if (el.nodeName == "INPUT") {
            if (form_element.elements[i].value === value) {
                form_element.elements[i].checked = true;
            } else {
                form_element.elements[i].checked = false;
            }
        }
    }
    return false;
}

//
// The Main Object: seasons.Scene

seasons.Scene = function(options) {
    options = options || {};

    this.debugging          = (options.debugging || false);

    // Setting up the scene ...

    this.logger = options.logger || function() {};

    this.scene              = SceneJS.withNode(options.theScene || "theScene");
    this.camera             = SceneJS.withNode(options.camera || "theCamera");
    this.canvas             = document.getElementById(options.canvas || "theCanvas");
    this.optics             = this.camera.get("optics");

    this.linked_scene       = (options.linked_scene || false);
    this.linked_from_scene       = (options.linked_from_scene || false);

    this.setAspectRatio();

    this.look               = SceneJS.withNode(options.look || "lookAt");

    this.circleOrbit        = SceneJS.withNode("earthCircleOrbitSelector");

    if (options.gridSelector !== false) {
        this.gridSelector       = SceneJS.withNode(options.gridSelector || "orbit-grid-selector");
    }

    if (options.earth_tilt !== false) {
        this.earth_tilt  = SceneJS.withNode(options.earth_tilt || "earthRotationalAxisQuaternion");
    }

    this.look_at_selection  = (options.look_at_selection || 'orbit');

    if (options.latitude_line) {
        this.latitude_line = new LatitudeLine(options.latitude_line);
    }

    if (options.earth_surface_location) {
        this.earth_surface_location = new EarthSurfaceLocationIndicator("earth-surface-location-destination");
    }

    if (options.choose_view === false) {
        this.choose_view = false;
    } else {
        this.choose_view = document.getElementById(options.choose_view || "choose-view");
        this.view_selection = getRadioSelection(this.choose_view);
    }

    if (options.orbital_grid === false) {
        this.orbital_grid = false;
    } else {
        this.orbital_grid = document.getElementById(options.orbital_grid || "orbital-grid");
    }

    if (options.earth_pointer === false) {
        this.earth_pointer = false;
    } else {
        this.earth_pointer      = SceneJS.withNode(options.earth_pointer || "earth-pointer");
    }

    if (options.circle_orbit === false) {
        this.circle_orbit = false;
    } else {
        this.circle_orbit = document.getElementById(options.circle_orbit || "circle-orbit");
    }

    this.earth_label        = (options.earth_label || false);
    if (this.earth_label) {
        this.earth_info_label   = document.getElementById(options.earth_info_label || "earth-info-label");
    }

    this.choose_tilt        = (options.choose_tilt || false);
    if (this.choose_tilt) {
        this.choose_tilt = document.getElementById(options.choose_tilt || "choose-tilt");
    }

    this.earth_position      = SceneJS.withNode(options.earth_position || "earth-position");
    this.earth_rotation      = SceneJS.withNode(options.earth_rotation || "earth-rotation");

    if (options.spaceship_position) {
        this.spaceship_position       = SceneJS.withNode(options.spaceship_position);
        this.spaceship_rotation_yaw   = SceneJS.withNode(options.spaceship_rotation_yaw);
        this.spaceship_rotation_pitch = SceneJS.withNode(options.spaceship_rotation_pitch);
    } else {
        this.spaceship_position       = false;
        this.spaceship_rotation_yaw   = false;
        this.spaceship_rotation_pitch = false;
    }

    if (options.spaceship_rotation) {
        this.spaceship_rotation = SceneJS.withNode(options.spaceship_rotation);
    } else {
        this.spaceship_rotation = false;
    }

    if (options.earth_sun_line === false) {
        this.earth_sun_line = false;
    } else {
        this.earth_sun_line = true;
        this.earth_sun_line_rotation    = SceneJS.withNode(options.earth_sun_line_rotation || "earth-sun-line-rotation");
        this.earth_sun_line_translation = SceneJS.withNode(options.earth_sun_line_translation || "earth-sun-line-translation");
        this.earth_sun_line_scale =       SceneJS.withNode(options.earth_sun_line_scale || "earth-sun-line-scale");
    }

    this.ellipseOrbitSelector = SceneJS.withNode(options.ellipseOrbitSelector || "earthEllipseOrbitSelector");
    this.earthTextureSelector = SceneJS.withNode(options.earthTextureSelector || "earthTextureSelector");

    this.canvas_properties  = function () {
        return this.canvas.getBoundingClientRect();
    };

    this.sun_yaw =   0;
    this.sun_pitch = 0;

    this.earth_yaw =   0;
    this.earth_pitch = 0;
    this.max_pitch =  80;

    this.normalized_earth_eye      =   normalized_initial_earth_eye;

    this.normalized_earth_eye_side =   normalized_initial_earth_eye_side;
    this.normalized_earth_eye_top  =   normalized_initial_earth_eye_side;

    // Setting up callbacks for ...
    var self = this;

    // Selecting a Perspective: top, side
    this.choose_view = document.getElementById(options.choose_view || "choose-view");

    if (this.choose_view) {
        this.choose_view.onchange = (function() {
            return function() {
                self.perspectiveChange(this);
            };
        })();
        this.choose_view.onchange();
    }

    // Selecting the time of year: jun, sep, dec, mar
    this.choose_month = document.getElementById(options.choose_month || "choose-month");

    // optional callbacks if month changes
    this.choose_month_callbacks = [];
    if (options.choose_month_callbacks) {
      if (typeof options.choose_month_callbacks === 'function') {
        this.choose_month_callbacks.push(options.choose_month_callbacks);
      } else {
        if (typeof options.choose_month_callbacks.length === "number") {
          for(var i = 0; i < options.choose_month_callbacks.length; i++) {
            this.choose_month_callbacks.push(options.choose_month_callbacks[i]);
          }
        }
      }
    }

    this.month = this.choose_month.value;
    this.choose_month.onchange = (function() {
        return function() {
            self.timeOfYearChange(this);
        };
    })();
    // this.choose_month.onchange();

    // Circular Orbital Path selector ...
    if (this.circle_orbit) {
        this.circle_orbit.onchange = (function() {
            return function() {
                self.circleOrbitPathChange(this);
            };
        })();
        this.circle_orbit.onchange();
    }

    // Orbital Grid selector ...
    if (this.orbital_grid) {
        this.orbital_grid.onchange = (function() {
            return function() {
                self.orbitalGridChange(this);
            };
        })();
        this.orbital_grid.onchange();
    }

    // Selecting an Earth Tilt: yes, no
    if (this.choose_tilt) {
        this.tilt = getRadioSelection(this.choose_tilt);
        this.choose_tilt.onchange = (function() {
            return function() {
                self.updateTilt(this);
            };
        })();
        this.choose_tilt.onchange();
    } else {
        this.tilt = true;
    }

    //
    // Rendering bits ...
    //

    this.earthLabel();
    this.earthPointer();

    this.ellipseOrbitSelector.set("selection", [2]);
    this.earthTextureSelector.set("selection", [1]);

    //
    // Mouse interaction bits ...
    //

    this.earth_yaw          = normalized_initial_earth_eye.x;
    this.earth_pitch        = normalized_initial_earth_eye.y;

    this.sun_yaw            = 0;
    this.sun_pitch          = 0;


    this.dragging           = false;

    this.canvas.addEventListener('mousedown', (function() {
        return function(event) {
            self.mouseDown(event, this);
        };
    })(), true);

    this.canvas.addEventListener('mouseup', (function() {
        return function(event) {
            self.mouseUp(event, this);
        };
    })(), true);

    this.canvas.addEventListener('mouseout', (function() {
        return function(event) {
            self.mouseOut(event, this);
        };
    })(), true);

    this.canvas.addEventListener('mousemove', (function() {
        return function(event) {
            self.mouseMove(event, this);
        };
    })(), true);

};

seasons.Scene.prototype.toJSON = function() {
    var state = {
        month: this.month,
        circle_orbit: this.circle_orbit ? this.circle_orbit.checked : false,
        orbital_grid: this.orbital_grid ? this.orbital_grid.checked : this.orbital_grid,
        tilt: this.choose_tilt ? getRadioSelection(this.choose_tilt) : true,
        view_selection: this.view_selection,
        look_at_selection: this.look_at_selection,
        look_at: {
            eye: JSON.stringify(this.look.get("eye")),
            look: JSON.stringify(this.look.get("look")),
            up: JSON.stringify(this.look.get("up"))
        }
    };
    return state;
};

seasons.Scene.prototype.toJSONStr = function() {
    return JSON.stringify(this.toJSON());
};

seasons.Scene.prototype.fromJSON = function(state, logger) {
    this._timeOfYearChange(state.month);
    this._circleOrbitPathChange(state.circle_orbit);
    this._orbitalGridChange(state.orbital_grid);
    this._perspectiveChange(state.view_selection);
    this._updateTilt(state.tilt);
    this.look_at_selection = state.look_at_selection;
    this.look.set("eye", JSON.parse(state.look_at.eye));
    this.look.set("up", JSON.parse(state.look_at.up));
    this.look.set("look", JSON.parse(state.look_at.look));
    this.logger = logger || function() {};
};

seasons.Scene.prototype.fromJSONstr = function(json_state_str, logger) {
    this.fromJSON(JSON.parse(json_state_str, logger));
};

seasons.Scene.prototype.render = function() {
    this.scene.render();
};

seasons.Scene.prototype.updateTilt = function(form_element) {
    this._updateTilt(getRadioSelection(form_element));
};

seasons.Scene.prototype._updateTilt = function(tilt) {
    if (tilt === true) tilt = 'yes';
    if (tilt === false) tilt = 'no';
    if (this.choose_tilt) setRadioSelection (this.choose_tilt, tilt);
    this.tilt = tilt;
    var tilt_str;
    if (LITE_VERSION) {
      var results = document.getElementById("button-results");
      results.textContent = '';
    }
    switch (tilt) {
        case "yes":
            this.earth_tilt.set("rotation", { x : 0, y : 0, z : 1, angle : 23.5 });
            tilt_str = "Tilted";
            break;

        case "no":
            this.earth_tilt.set("rotation", { x : 0, y : 0, z : 1, angle : 0 });
            tilt_str = "No Tilt";
            break;
    }
};

seasons.Scene.prototype.get_earth_position = function() {
    var ep = this.earth_position.get();
    return [ep.x, ep.y, ep.z];
};

seasons.Scene.prototype.set_earth_position = function(newpos) {
    this.earth_position.set({ x: newpos[0], y: newpos[1], z: newpos[2] });
};

seasons.Scene.prototype.get_orbital_angle = function() {
  var mon = this.month || 'jun';
  var angle = this.month_data[mon].index * 30 - 150;
  return angle;
};

seasons.Scene.prototype.get_earth_distance = function() {
    return earth_ellipse_distance_from_sun_by_month(this.month);
};

seasons.Scene.prototype.get_solar_flux = function() {
    return earth_ephemerides_solar_constant_by_month(this.month);
};

seasons.Scene.prototype.get_normalized_earth_eye = function() {
    var normalized_eye = {};
    var eye = this.look.get("eye");
    var ep = this.earth_position.get();
    normalized_eye.x = eye.x - ep.x;
    normalized_eye.y = eye.y - ep.y;
    normalized_eye.z = eye.z - ep.z;
    return normalized_eye;
};

seasons.Scene.prototype.set_normalized_earth_eye = function(normalized_eye) {
    var eye = {},
        ep = this.earth_position.get(),
        v1 = [normalized_eye.x,  normalized_eye.y,  normalized_eye.z],
        m1 = [],
        angle = this.get_orbital_angle();

    mat4.identity(m1);
    mat4.rotateY(m1, angle * deg2rad);
    mat4.multiplyVec3(m1, v1);
    eye.x = v1[0] + ep.x;
    eye.y = v1[1] + ep.y;
    eye.z = v1[2] + ep.z;
    eye = this.look.set("eye", eye);
};

seasons.Scene.prototype.update_earth_look_at = function(normalized_eye) {
    var eye = {},
        ep = this.earth_position.get(),
        v1 = [normalized_eye.x,  normalized_eye.y,  normalized_eye.z],
        m1 = [],
        angle = this.get_orbital_angle();

    mat4.identity(m1);
    mat4.rotateY(m1, angle * deg2rad);
    mat4.multiplyVec3(m1, v1);
    eye.x = v1[0] + ep.x;
    eye.y = v1[1] + ep.y;
    eye.z = v1[2] + ep.z;
    this.look.set("look", ep );
    this.look.set("eye",  eye );
};

seasons.Scene.prototype.updateSpaceshipPosition = function() {
    if (this.spaceship_position && this.linked_from_scene) {
        var pos = {},
            normalized_eye,
            v1 = vec3.create(),
            v2 = vec3.create(),
            v3 = vec3.create(),
            v4 = vec3.create(),
            m1 = mat4.create(),
            dot,
            north,
            orbital_angle = this.get_orbital_angle(),
            pitch_angle;

        normalized_eye = this.linked_from_scene.normalized_earth_eye;
        v1 = [normalized_eye.x,  normalized_eye.y,  normalized_eye.z];
        mat4.identity(m1);
        mat4.rotateY(m1, (orbital_angle) * deg2rad);
        mat4.multiplyVec3(m1, v1);
        vec3.scale(v1, earth_radius_km * 25);
        pos.x = v1[0];
        pos.y = v1[1];
        pos.z = v1[2];
        this.spaceship_position.set(pos);
        this.spaceship_rotation_yaw.set("angle", orbital_angle - 90);
        vec3.normalize(v1, v2);
        vec3.set(v2, v3);
        north = v3[1];
        v3[1] = 0;
        dot = vec3.dot(v2, v3, v4);
        pitch_angle = Math.acos(dot) * rad2deg;
        if (north > 0) { pitch_angle = -pitch_angle; }
    }
};

seasons.Scene.prototype.mouseDown = function(event) {
    switch(this.look_at_selection) {
        case "orbit":
            this.sun_lastX = event.clientX;
            this.sun_lastY = event.clientY;
            break;

        case "earth":
            this.earth_lastX = event.clientX;
            this.earth_lastY = event.clientY;
            break;
    }
    this.dragging = true;
    this.canvas.style.cursor = "pointer";
};

seasons.Scene.prototype.mouseUp = function() {
    this.dragging = false;
};


seasons.Scene.prototype.mouseOut = function() {
    this.dragging = false;
};

seasons.Scene.prototype.incrementEarthPitch = function(num) {
    this.earth_pitch += num;
    if (this.earth_pitch > this.max_pitch)  this.earth_pitch =  this.max_pitch;
    if (this.earth_pitch < -this.max_pitch) this.earth_pitch = -this.max_pitch;
    return this.earth_pitch;
};

seasons.Scene.prototype.incrementSunPitch = function(num) {
    this.sun_pitch += num;
    if (this.sun_pitch > this.max_pitch)  this.sun_pitch =  this.max_pitch;
    if (this.sun_pitch < -this.max_pitch) this.sun_pitch = -this.max_pitch;
    return this.sun_pitch;
};


seasons.Scene.prototype.mouseMove = function(event, element, new_yaw, new_pitch) {
    if (this.dragging) {

        this.canvas.style.cursor = "pointer";
        var eye4, neweye;
        var up_downQ, up_downQM, left_rightQ, left_rightQM;

        var normalized_eye;
        var constrain_navigation = (typeof CONSTRAIN_NAVIGATION !== 'undefined') && CONSTRAIN_NAVIGATION;

        switch(this.look_at_selection) {
            case "orbit":
                if (!new_yaw) {
                    new_yaw   = (event.clientX - this.sun_lastX) * -0.2;
                    new_pitch = (event.clientY - this.sun_lastY) * -0.2;
                    this.sun_lastX = event.clientX;
                    this.sun_lastY = event.clientY;
                }

                // test for NaN
                if (new_yaw !== new_yaw) new_yaw = 0;
                if (new_yaw !== new_yaw) new_pitch = 0;

                if (constrain_navigation) {
                  new_pitch = 0;
                }

                this.sun_yaw   += new_yaw;
                this.incrementSunPitch(new_pitch);

                switch(this.view_selection) {
                    case "top":
                        eye4 = [initial_sun_eye_top.x, initial_sun_eye_top.y, initial_sun_eye_top.z, 1];
                        break;

                    case "side":
                        eye4 = [initial_sun_eye_side.x, initial_sun_eye_side.y, initial_sun_eye_side.z, 1];
                        break;
                }

                left_rightQ = new SceneJS.Quaternion({ x : 0, y : 1, z : 0, angle : this.sun_yaw });
                left_rightQM = left_rightQ.getMatrix();

                neweye = SceneJS._math_mulMat4v4(left_rightQM, eye4);
                console.log("dragging: yaw: " + sprintf("%3.0f", this.sun_yaw) + ", eye: x: " +
                    sprintf("%3.0f", neweye[0]) + " y: " + sprintf("%3.0f", neweye[1]) + " z: " + sprintf("%3.0f", neweye[2]));

                eye4 = SceneJS._math_dupMat4(neweye);

                up_downQ = new SceneJS.Quaternion({ x : left_rightQM[0], y : 0, z : left_rightQM[2], angle : this.sun_pitch });
                up_downQM = up_downQ.getMatrix();

                neweye = SceneJS._math_mulMat4v4(up_downQM, eye4);

                console.log("dragging: pitch: " + sprintf("%3.0f", this.sun_pitch) + ", eye: x: " +
                    sprintf("%3.0f", neweye[0]) + " y: " + sprintf("%3.0f", neweye[1]) + " z: " + sprintf("%3.0f", neweye[2]) );

                this.look.set("eye",  { x: neweye[0], y: neweye[1], z: neweye[2] } );
                break;

            case "earth":
                if (!new_yaw) {
                    new_yaw   = (event.clientX - this.earth_lastX) * -0.2;
                    new_pitch = (event.clientY - this.earth_lastY) * -0.2;

                    this.earth_lastX = event.clientX;
                    this.earth_lastY = event.clientY;
                }

                // test for NaN
                if (new_yaw !== new_yaw) new_yaw = 0;
                if (new_yaw !== new_yaw) new_pitch = 0;

                if (constrain_navigation) {
                  new_yaw = 0;
                }

                normalized_eye = this.normalized_earth_eye;

                this.earth_yaw   += new_yaw;
                this.incrementEarthPitch(new_pitch);

                eye4 = [normalized_initial_earth_eye_side.x, normalized_initial_earth_eye_side.y, normalized_initial_earth_eye_side.z, 1];

                left_rightQ = new SceneJS.Quaternion({ x : 0, y : 1, z : 0, angle : this.earth_yaw });
                left_rightQM = left_rightQ.getMatrix();

                neweye = SceneJS._math_mulMat4v4(left_rightQM, eye4);

                console.log("dragging: yaw: " + sprintf("%3.0f", this.earth_yaw) + ", eye: x: " +
                    sprintf("%3.0f", neweye[0]) + " y: " + sprintf("%3.0f", neweye[1]) + " z: " + sprintf("%3.0f", neweye[2]));

                eye4 = SceneJS._math_dupMat4(neweye);

                up_downQ = new SceneJS.Quaternion({ x : left_rightQM[0], y : 0, z : left_rightQM[2], angle : this.earth_pitch });
                up_downQM = up_downQ.getMatrix();

                neweye = SceneJS._math_mulMat4v4(up_downQM, eye4);

                console.log("dragging: pitch: " + sprintf("%3.0f", this.earth_pitch) + ", eye: x: " +
                    sprintf("%3.0f", neweye[0]) + " y: " + sprintf("%3.0f", neweye[1]) + " z: " + sprintf("%3.0f", neweye[2]));

                this.normalized_earth_eye =  { x: neweye[0], y: neweye[1], z: neweye[2] };
                this.set_normalized_earth_eye(this.normalized_earth_eye);
                this.updateSpaceshipPosition();
                break;
        }

        console.log("");
        this.earthLabel();
         if (this.linked_scene) { this.linked_scene.updateSpaceshipPosition(); }
        // if (this.linked_scene && !linked) {
        //     this.linked_scene.dragging = true;
        //     this.linked_scene.mouseMove(event, element, new_yaw, new_pitch, true);
        //     this.linked_scene.dragging = false;
        // };
    }
};

seasons.Scene.prototype.earthPointer = function() {
    if (this.earth_pointer) {
        var earth_pos = this.get_earth_position();
        this.earth_pointer.set({ x: earth_pos[0], y: earth_pos[1], z: earth_pos[2] });

    }
};

//
// UI Overlaying WebGL canvas
//

seasons.Scene.prototype.elementGetX = function(el) {
    var xpos = 0;
    while( el !== null ) {
        xpos += el.offsetLeft;
        el = el.offsetParent;
    }
    return xpos;
};

seasons.Scene.prototype.elementGetY = function(el) {
    var ypos = 0;
    while( el !== null ) {
        ypos += el.offsetTop;
        el = el.offsetParent;
    }
    return ypos;
};

seasons.Scene.prototype.earthLabel = function() {
    var lpos;

    if (this.earth_label) {

        var edist = earth_ellipse_distance_from_sun_by_month(this.month);
        var labelStr = this.month_data[this.month].long_name + " ";
        labelStr += sprintf("Earth Distance: %3.1f million km<br>", edist * scale_factor / 1000000);
        // labelStr += sprintf("Solar Radiation:  %4.1f W/m2<br>", solar_flux);
        if (this.debugging) {
            var earth_pos = this.get_earth_position();
            var eye_pos = this.look.get("eye");
            var look_pos = this.look.get("look");

            labelStr += "<br>debug:";
            labelStr += sprintf("<br>earth x: %6.0f   y: %6.0f   z: %6.0f", earth_pos[0], earth_pos[1], earth_pos[2]);
            labelStr += sprintf("<br>look  x: %6.0f   y: %6.0f   z: %6.0f", look_pos.x, look_pos.y, look_pos.z);
            labelStr += sprintf("<br>eye   x: %6.0f   y: %6.0f   z: %6.0f", eye_pos.x, eye_pos.y, eye_pos.z);

            if ( this.look_at_selection === 'orbit') {
                if (this.earth_pointer) {
                    lpos = this.earth_pointer.get();
                    labelStr += sprintf("<br>point x: %6.0f y: %6.0f z: %6.0f", lpos.x, lpos.y, lpos.z);
                }
            }
        }
        this.earth_info_label.innerHTML = labelStr;

        this.earth_info_label.style.top = this.canvas_properties().top + window.pageYOffset  + this.canvas_properties().height - this.earth_info_label.offsetHeight - 10 + "px";
        this.earth_info_label.style.left = this.canvas_properties().right - this.elementGetX(document.getElementById("content")) - this.earth_info_label.offsetWidth + "px";

    }
};


seasons.Scene.prototype.setAspectRatio = function() {
    this.optics.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.set("optics", this.optics);
};


seasons.Scene.prototype.setCamera = function(settings) {
    var prop;
    for(prop in settings) this.optics[prop] = settings[prop];
    this.camera.set("optics", this.optics);
};


seasons.Scene.prototype.perspectiveChange = function(form_element) {
    this._perspectiveChange(getRadioSelection(form_element));
};

seasons.Scene.prototype._perspectiveChange = function(view_selection) {
    if (this.choose_view) setRadioSelection (this.choose_view, view_selection);
    this.view_selection = view_selection;
    switch(this.view_selection) {
        case "top":
        switch(this.look_at_selection) {
            case "orbit":
                this.look.set("eye",  initial_sun_eye_top );
                this.look.set("look", { x: sun_x_pos, y : 0.0, z : 0.0 } );
                this.look.set("up",  { x: 0.0, y: 1.0, z: 0.0 } );
                break;

            case 'earth':
                this.look.set("eye",  initial_earth_eye_top );
                this.look.set("look", { x: earth_x_pos, y : 0.0, z : 0.0 } );
                this.look.set("up",  { x: 0.0, y: 1.0, z: 0.0 } );
                this.update_earth_look_at(normalized_initial_earth_eye_top);
                break;

            case "surface" :
            break;
        }

        break;

        case "side":
        switch(this.look_at_selection) {
            case "orbit":
                this.look.set("eye",  initial_sun_eye_side );
                this.look.set("look", { x: sun_x_pos, y : 0.0, z : 0.0 } );
                this.look.set("up",   { x: 0.0, y: 1.0, z: 0.0 } );
                this.updateSpaceshipPosition();
                break;

            case 'earth':
                this.look.set("eye",  initial_earth_eye_side );
                this.look.set("look", { x: earth_x_pos, y : 0.0, z : 0.0 } );
                this.look.set("up",  { x: 0.0, y: 1.0, z: 0.0 } );
                this.update_earth_look_at(this.normalized_earth_eye);
                break;

            case "surface" :
            break;
        }

        break;
  }

  if (this.linked_scene) {
      this.linked_scene.updateSpaceshipPosition();
  }
};


seasons.Scene.prototype.setEarthSunLine = function() {
    var scale = {};
    var distance2 = earth_ellipse_distance_from_sun_by_month(this.month) / 2;
    var angle = this.month_data[this.month].angle;

    // var distance = earth_ephemerides_datum_by_month('jun').rg * au2km * factor;

    this.earth_sun_line_rotation.set("angle", angle);
    this.earth_sun_line_translation.set({ x: Math.cos(angle * deg2rad)*distance2 , y: 0, z: Math.sin(angle * deg2rad)*-distance2 });
    scale.x = distance2;
    switch(this.look_at_selection) {
        case "orbit":
        scale.y = sun_earth_line_size_large;
        scale.z = sun_earth_line_size_large;
        break;

        case "earth":
        scale.y = sun_earth_line_size_med;
        scale.z = sun_earth_line_size_med;
        break;
    }
    this.earth_sun_line_scale.set(scale);
    if (this.linked_scene) {
        this.linked_scene.setEarthSunLine();
    }
};


seasons.Scene.prototype.timeOfYearChange = function() {
    this._timeOfYearChange(this.choose_month.value);
};

seasons.Scene.prototype._timeOfYearChange = function(month) {
    this.choose_month.value = month;
    var mi_1 = this.month_data[this.month].index;
    this.month = month;
    var mi_2 = this.month_data[month].index;
    if (mi_2 < mi_1) mi_2 = mi_2 + 12;
    var rotation_increment = (mi_2 - mi_1) * 30;

    this.set_earth_position(earth_ellipse_location_by_month(this.month));

    if (this.look_at_selection !== 'orbit') {
        this._perspectiveChange(this.view_selection);
    }
    this.earth_rotation.set("angle", this.earth_rotation.get("angle") + rotation_increment);
    this.setEarthSunLine();
    this.earthLabel();
    this.earthPointer();
    this.updateSpaceshipPosition();
    if (LITE_VERSION) {
      var results = document.getElementById("button-results");
      results.textContent = '';
    }
    if (this.linked_scene) {
        this.linked_scene._timeOfYearChange(month);
    }
    if(this.choose_month_callbacks.length > 0) {
      for(var i = 0; i < this.choose_month_callbacks.length; i++) {
        this.choose_month_callbacks[i](month);
      }
    }
};


// Orbital Paths Indicators

seasons.Scene.prototype.circleOrbitPathChange = function(checkbox) {
    this._circleOrbitPathChange(checkbox.checked);
};

seasons.Scene.prototype._circleOrbitPathChange = function(circle_orbit) {
    if (this.circle_orbit) this.circle_orbit.checked = circle_orbit;
    if (circle_orbit) {

        switch(this.look_at_selection) {
            case "orbit": this.circleOrbit.set("selection", [2]);
            break;
            case 'earth': this.circleOrbit.set("selection", [1]);
            SceneJS.withNode("earthCircleOrbitSelector").set("selection", [1]);
            break;
        }
    } else {
        this.circleOrbit.set("selection", [0]);
    }
};


// Orbital Grid

seasons.Scene.prototype.orbitalGridChange = function(checkbox) {
  this._orbitalGridChange(checkbox.checked);
};

seasons.Scene.prototype._orbitalGridChange = function(orbital_grid) {
    this.orbital_grid.checked = orbital_grid;
    if (orbital_grid) {
        this.gridSelector.set("selection", [1]);
    } else {
        this.gridSelector.set("selection", [0]);
    }
    if (this.linked_scene) {
        this.linked_scene._orbitalGridChange(orbital_grid);
    }
};

seasons.Activity = function(options) {
    this.startTime = Date.now();
    this.version = options.version;
    this.scenes = options.scenes;
    var scenes = [];
    if (this.scenes.scene1) {
      this.scenes.scene1.logger = this.logInteraction;
      scenes.scene1 = this.scenes.scene1.toJSON();
    }
    if (this.scenes.scene3) {
      this.scenes.scene3.logger = this.logInteraction;
      scenes.scene3 = this.scenes.scene3.toJSON();
    }
    this.log = [];
    this.logInteraction({
      "start": Date(),
      // "choose month": this.choose_month.value,
      // "choose city": city.name,
      // "rotation": earth_rotation.checked,
      "scenes": scenes
    });
};

seasons.Activity.prototype.logInteraction = function(interaction) {
    var time = (Date.now() - this.startTime) / 1000,
        item;
    item = [time, interaction];
    this.log.push(item);
};

seasons.Activity.prototype.toJSON = function() {
    var scenes= {};
    var json_object;
    if (this.version == "1.1") {
        scenes.scene = this.scenes.scene.toJSON();
        json_object = {
            version: this.version,
            scenes: scenes,
            table: experimentDataToJSON()
        };
    } else {
        scenes.scene1 = this.scenes.scene1.toJSON();
        scenes.scene3 = this.scenes.scene3.toJSON();
        json_object = {
            version: this.version,
            scenes: scenes,
            table: experimentDataToJSON()
        };
    }
    json_object.log = this.log;
    return json_object;
};

seasons.Activity.prototype.fromJSON = function(json_object) {
    switch (json_object.version) {
        case 1.1:
        this.scenes.scene.fromJSON(json_object.scenes.scene);
        experimentDataFromJSON(json_object.table);
        break;

        case 1.2:
        this.scenes.scene1.fromJSON(json_object.scenes.scene1);
        this.scenes.scene3.fromJSON(json_object.scenes.scene3);
        experimentDataFromJSON(json_object.table);
        break;

        case 1.3:
        this.scenes.scene1.fromJSON(json_object.scenes.scene1);
        this.scenes.scene3.fromJSON(json_object.scenes.scene3);
        experimentDataFromJSON(json_object.table);
        break;
    }
    this.log = json_object.log || {};
    this.logInteraction("load state from saved JSON");
};

// export namespace
if (typeof root !== 'undefined') root.seasons = seasons;
})();
