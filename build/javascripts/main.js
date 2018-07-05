var Main = (function () {
  'use strict';

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Static = function () {
    function Static() {
      classCallCheck(this, Static);
    }

    createClass(Static, null, [{
      key: "construct",
      value: function construct() {

        Static.rowLength = 20;
        Static.columnLength = 10;
        Static.hexSize = 5;

        Static.cube_directions = [{ x: +1, y: 0, z: -1 }, { x: +1, y: -1, z: -0 }, { x: 0, y: -1, z: +1 }, { x: -1, y: 0, z: +1 }, { x: -1, y: +1, z: -0 }, { x: 0, y: +1, z: -1 }];

        Static.cube_diagonals = [{ x: +2, y: -1, z: -1 }, { x: +1, y: +1, z: -2 }, { x: -1, y: +2, z: -1 }, { x: -2, y: +1, z: +1 }, { x: -1, y: -1, z: +2 }, { x: +1, y: -2, z: +1 }];
      }
    }, {
      key: "cube_to_id",
      value: function cube_to_id(cube) {
        return this.oddr_to_id(this.cube_to_oddr(cube));
      }
    }, {
      key: "cube_to_oddr",
      value: function cube_to_oddr(cube) {
        var x = cube.x + (cube.z - (cube.z & 1)) / 2;
        var y = cube.z;
        return { x: x, y: y };
      }
    }, {
      key: "oddr_to_id",
      value: function oddr_to_id(offset) {
        var id = offset.y * Static.columnLength + offset.x;
        return id;
      }
    }, {
      key: "oddr_to_cube",
      value: function oddr_to_cube(offset) {
        var x = offset.x - (offset.y - (offset.y & 1)) / 2;
        var z = offset.y;
        var y = -x - z;
        return { x: x, y: y, z: z };
      }
    }, {
      key: "id_to_cube",
      value: function id_to_cube(id) {
        return this.oddr_to_cube(this.id_to_oddr(id));
      }
    }, {
      key: "id_to_oddr",
      value: function id_to_oddr(id) {
        var y = Math.floor(id / Static.columnLength);
        var x = id % Static.columnLength;
        return { x: x, y: y };
      }
    }, {
      key: "cube_neighbor",
      value: function cube_neighbor(cube, direction) {
        return this.cube_add(cube, this.cube_directions[direction]);
      }
    }, {
      key: "cube_diagonal_neighbor",
      value: function cube_diagonal_neighbor(cube, direction) {
        return this.cube_add(cube, this.cube_diagonals[direction]);
      }
    }, {
      key: "cube_distance",
      value: function cube_distance(a, b) {
        return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)) / 2;
      }
    }, {
      key: "cube_range",
      value: function cube_range(cube, range) {
        var results = [];
        var p, z;
        for (var x = -range; x <= range; x++) {
          for (var y = Math.max(-range, -x - range); y <= Math.min(+range, -x + range); y++) {
            z = -x - y;
            p = this.cube_add(cube, { x: x, y: y, z: z });
            if (!this.out_of_bouds(p)) {
              results.push(p);
            }
          }
        }
        return results;
      }
    }, {
      key: "intersecting_ranges",
      value: function intersecting_ranges(a, b) {
        var result = [];
        for (var i = 0; i < a.length; i++) {
          var a_cube = a[i];
          for (var o = 0; o < b.length; o++) {
            var b_cube = b[o];
            if (a_cube.x == b_cube.x && a_cube.y == b_cube.y && a_cube.z == b_cube.z) {
              result.push(b_cube);
            }
          }
        }
        return result;
      }
    }, {
      key: "cube_linedraw",
      value: function cube_linedraw(a, b) {
        var distance = this.cube_distance(a, b);
        var result = [];
        for (var i = 0; i < distance; i++) {
          result.push(this.cube_round(this.cube_lerp(a, b, 1.0 / distance * i)));
        }
        return result;
      }
    }, {
      key: "lerp",
      value: function lerp(a, b, t) {
        return a + (b - a) * t;
      }
    }, {
      key: "cube_lerp",
      value: function cube_lerp(a, b, t) {
        return { x: this.lerp(a.x, b.x, t), y: this.lerp(a.y, b.y, t), z: this.lerp(a.z, b.z, t) };
      }
    }, {
      key: "cube_round",
      value: function cube_round(cube) {

        var rx = Math.round(cube.x);
        var ry = Math.round(cube.y);
        var rz = Math.round(cube.z);

        var x_diff = Math.abs(rx - cube.x);
        var y_diff = Math.abs(ry - cube.y);
        var z_diff = Math.abs(rz - cube.z);

        if (x_diff > y_diff && x_diff > z_diff) {
          rx = -ry - rz;
        } else if (y_diff > z_diff) {
          ry = -rx - rz;
        } else {
          rz = -rx - ry;
        }

        return { x: rx, y: ry, z: rz };
      }
    }, {
      key: "out_of_bouds",
      value: function out_of_bouds(cube) {

        var oddr = this.cube_to_oddr(cube);

        if (oddr.x < 0 || oddr.x >= Static.columnLength) {
          return true;
        }
        if (oddr.y < 0 || oddr.y >= Static.rowLength) {
          return true;
        }

        return false;
      }
    }, {
      key: "cube_add",
      value: function cube_add(cube1, cube2) {
        var res = { x: 0, y: 0, z: 0 };
        res.x = cube1.x + cube2.x;
        res.y = cube1.y + cube2.y;
        res.z = cube1.z + cube2.z;
        return res;
      }
    }]);
    return Static;
  }();

  var Hex = function () {
  	function Hex(column, row, hexId, accessible) {
  		classCallCheck(this, Hex);


  		this.x = column;
  		this.y = row;
  		this.hexId = hexId;
  		this.accessible = accessible;

  		this.material;
  		this.mesh;
  	}

  	/**
   * Get access info.
   * @return {bool} accessibility of the hexagon.
   */


  	createClass(Hex, [{
  		key: 'Accessible',
  		value: function Accessible() {
  			return this.accessible;
  		}

  		/**
    * Get access info.
    * @return {bool} accessibility of the hexagon.
    */

  	}, {
  		key: 'getCubeCoords',
  		value: function getCubeCoords() {
  			return Static.oddr_to_cube({ x: this.x, y: this.y });
  		}

  		/**
    * Create the mesh that can be placed in the ThreeJs scene.
    * @param {THREE.Geometry} dx - Difference in x.
    */

  	}, {
  		key: 'createHexMesh',
  		value: function createHexMesh(hexGeometry) {

  			if (this.accessible) {
  				this.material = new THREE.MeshPhongMaterial({ color: 0x4cdb4a, wireframe: false });
  			} else {
  				this.material = new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: false });
  			}

  			this.mesh = new THREE.Mesh(hexGeometry, this.material);
  			this.mesh.rotation.x = Math.PI / 180 * 90;
  		}

  		/**
    * Add the hex to the THREE.Group that is used for mouse interaction.
    */

  	}, {
  		key: 'addHexMesh',
  		value: function addHexMesh(hexGroup) {
  			var pos = this.getPosition(Static.hexSize);
  			this.mesh.position.set(pos.x, pos.y, pos.z);
  			hexGroup.add(this.mesh);
  			this.mesh.hexId = this.hexId;
  		}

  		/**
    * Change the color of the hexagon tile.
    * @param {color} color - 0xffffff rgb color.
    */

  	}, {
  		key: 'changeColor',
  		value: function changeColor(color) {
  			this.material.color.setHex(color);
  		}

  		/**
    * Change the to the original color.
    */

  	}, {
  		key: 'originalColor',
  		value: function originalColor() {
  			if (this.accessible) {
  				this.material.color.setHex(0x4cdb4a);
  			} else {
  				this.material.color.setHex(0xffffff);
  			}
  		}

  		/**
    * Get the position where the hex needs to be placed in the scene.
    * @param {number} hexSize - the size of the hexagons in the map.
    * @return {vec3} xyz coords.
    */

  	}, {
  		key: 'getPosition',
  		value: function getPosition(hexSize) {
  			var width = Math.sqrt(3) * hexSize;
  			var height = 2 * hexSize;
  			var oddr = 0;

  			if (this.y & 1) {
  				oddr = width / 2;
  			}

  			return { x: width * this.x + oddr, y: 0, z: height * this.y * 3 / 4 };
  		}
  	}]);
  	return Hex;
  }();

  var HexMap = function () {
    function HexMap() {
      classCallCheck(this, HexMap);


      this.hexList = [];
      this.hexMeshGroup = new THREE.Group();
      this.createHexMap();
    }

    /**
    * Create some hexagons to make this example a bit "fun" :).
    * Normally this is stored in a database or something like that.
    */


    createClass(HexMap, [{
      key: 'createHexMap',
      value: function createHexMap() {

        var hexGeometry = this.shapeToGeometry(this.pathToShape(this.drawHexagonPath(Static.hexSize)));
        var hexId, access;
        var rowList = [];

        for (var column = 0; column < Static.columnLength; column++) {

          rowList = [];

          for (var row = 0; row < Static.rowLength; row++) {
            hexId = row * Static.columnLength + column;

            // Mark some hexagons access false
            access = hexId == 80 || hexId == 81 || hexId == 82 || hexId == 83 || hexId == 84 || hexId == 85 || hexId == 6 || hexId == 16 || hexId == 17 || hexId == 18 || hexId == 1 || hexId == 62 || hexId == 63 || hexId == 64 || hexId == 74 || hexId == 85 || hexId == 95 || hexId == 47 || hexId == 75 || hexId == 76 || hexId == 77 || hexId == 78 || hexId == 10 || hexId == 11 || hexId == 13 || hexId == 12 || hexId == 14 || hexId == 25 || hexId == 35 || hexId == 46 ? false : true;

            var hex = new Hex(column, row, hexId, access);
            hex.createHexMesh(hexGeometry);
            hex.addHexMesh(this.hexMeshGroup);
            rowList.push(hex);
          }

          this.hexList.push(rowList);
        }

        // Add the created hexagon meshes to the scene.
        scene.add(this.hexMeshGroup);
      }

      /**
      * Get the neighbors of a given hex.
      * @param {Hex} hex - insert the hex object.
      * @return {<Hex>} retuns a list of adjacent hexes.
      */

    }, {
      key: 'getNeighborsOf',
      value: function getNeighborsOf(hex) {

        var result = [];
        var cube = hex.getCubeCoords();
        var neighbor_cube, hex;

        for (var i = 0; i < 6; i++) {

          neighbor_cube = Static.cube_add(cube, Static.cube_directions[i]);

          if (!Static.out_of_bouds(neighbor_cube)) {
            hex = this.getHexById(Static.cube_to_id(neighbor_cube));
            result.push(hex);
          }
        }

        return result;
      }

      /**
      * Get the hexagons in reach of a given distance.
      * @param {Hex} startHex - insert a startpoint hex.
      * @param {number} distance - the distance that can be reached.
      * @return {<Hex>} retuns a list of reachable hexes.
      */

    }, {
      key: 'getReachableOf',
      value: function getReachableOf(startHex, distance) {
        var hex, neighbor_hex, neighbor_cube;

        var result = [];
        result.push(startHex);

        var fringes = [];
        fringes.push([startHex]);

        for (var dist = 1; dist < distance; dist++) {
          fringes.push([]);
          for (var c = 0; c < fringes[dist - 1].length; c++) {
            hex = fringes[dist - 1][c];
            for (var dir = 0; dir < 6; dir++) {
              neighbor_cube = Static.cube_neighbor(hex.getCubeCoords(), dir);
              if (!Static.out_of_bouds(neighbor_cube)) {
                neighbor_hex = this.getHexById(Static.cube_to_id(neighbor_cube));
                if (neighbor_hex.Accessible()) {
                  result.push(neighbor_hex);
                  fringes[dist].push(neighbor_hex);
                }
              }
            }
          }
        }

        return result;
      }

      /**
      * Get a hex by id.
      * @param {number} id - hex id.
      * @return {Hex} returns the hex with the given id if exists.
      */

    }, {
      key: 'getHexById',
      value: function getHexById(id) {
        try {
          var oddr = Static.id_to_oddr(id);
          return this.hexList[oddr.x][oddr.y];
        } catch (err) {
          console.log(err);
        }
      }

      /**
      * Create a path that is hexagon shaped.
      * @param {number} hexagonSize - give the hexagon a size :).
      * @return {<[x,y]>} returns the hex with the given id if exists.
      */

    }, {
      key: 'drawHexagonPath',
      value: function drawHexagonPath(hexagonSize) {

        var points = [];
        var angle_deg, angle_rad;

        for (var i = 0; i <= 6; ++i) {
          angle_deg = 60 * i - 30;
          angle_rad = Math.PI / 180 * angle_deg;

          points.push({ x: hexagonSize * Math.cos(angle_rad), y: hexagonSize * Math.sin(angle_rad) });
        }

        return points;
      }

      /**
      * ThreeJs needs a shape to be extruded. This converts the path to a ThreeJs shape.
      * @param {<[x,y]>} path - Some points in 2d space.
      * @return {THREE.Shape} returns a ThreeJs shape object.
      */

    }, {
      key: 'pathToShape',
      value: function pathToShape(path) {

        var shape = new THREE.Shape();

        for (var i = 0; i < path.length; ++i) {
          shape.lineTo(path[i].x, path[i].y);
        }

        return shape;
      }

      /**
      * Create a 3D geometry object from the shape.
      * @param {THREE.Shape} shape - Add a nice shape.
      * @return {THREE.Geometry} returns the shape extruded to a 3d object.
      */

    }, {
      key: 'shapeToGeometry',
      value: function shapeToGeometry(shape) {
        return new THREE.ExtrudeGeometry(shape, { amount: .5, bevelEnabled: false, steps: 1 });
      }

      /**
      * Returns the hexagon meshes, in this example used for the mouse raycasting.
      * @return {THREE.Group} returns a ThreeJs groep object, that contains all the hex meshes.
      */

    }, {
      key: 'getHexMeshGroup',
      value: function getHexMeshGroup() {
        return this.hexMeshGroup;
      }
    }]);
    return HexMap;
  }();

  var Pathfinding = function () {

  	/**
   * Octile distance.
   * @param {number} dx - Difference in x.
   * @param {number} dy - Difference in y.
   * @return {number} sqrt(dx * dx + dy * dy) for grids.
   */
  	function Pathfinding(map) {
  		classCallCheck(this, Pathfinding);

  		this.hexMap = map;
  		this.nodeChanged = [];
  	}

  	/**
   * Octile distance.
   * @param {number} dx - Difference in x.
   * @param {number} dy - Difference in y.
   * @return {number} sqrt(dx * dx + dy * dy) for grids.
   */


  	createClass(Pathfinding, [{
  		key: 'octile',
  		value: function octile(dx, dy) {
  			var F = Math.SQRT2 - 1;
  			return dx < dy ? F * dx + dy : F * dy + dx;
  		}
  	}, {
  		key: 'backtrace',


  		/**
    * Path backtracing.
    * @param {path} node - [x,y].
    * @return {path} - [x,y] traced back.
    */
  		value: function backtrace(node) {
  			var path = [node];

  			while (node.parent) {
  				node = node.parent;
  				path.push(node);
  			}
  			return path.reverse();
  		}

  		/**
    * Path backtracing.
    * @param {path} node - [x,y].
    * @return {path} - [x,y] traced back.
    */

  	}, {
  		key: 'clear',
  		value: function clear(nodes) {

  			for (var a = 0; a < this.nodeChanged.length; a++) {
  				this.nodeChanged[a].g = 0;
  				this.nodeChanged[a].f = 0;
  				this.nodeChanged[a].h = 0;
  				this.nodeChanged[a].opened = false;
  				this.nodeChanged[a].closed = false;
  				this.nodeChanged[a].parent = null;
  			}

  			this.nodeChanged = [];
  		}

  		/**
    * Path backtracing.
    * @param {cube} start - the staring point.
    * @param {cube} end - the endpoint.
    * @param {hexMap} hexMap - the grid manager.
    * @return {path} - [x,y] with founded path.
    */

  	}, {
  		key: 'find',
  		value: function find(startNode, endNode) {

  			this.clear();

  			// If the start or endnode is not accessible
  			if (!startNode.Accessible() || !endNode.Accessible()) {
  				return [];
  			}

  			var openList = new Heap(function (nodeA, nodeB) {
  				return nodeA.f - nodeB.f;
  			});

  			var SQRT2 = Math.SQRT2;
  			var weight = 1;
  			var node, neighbors, i, neighbor, x, y, ng;

  			// push the start node into the open list
  			openList.push(startNode);
  			startNode.opened = true;

  			while (!openList.empty()) {

  				node = openList.pop();
  				node.closed = true;
  				this.nodeChanged.push(node);

  				if (node.x == endNode.x && node.y == endNode.y) {
  					return this.backtrace(node);
  				}

  				// get neigbours of the current node
  				neighbors = this.hexMap.getNeighborsOf(node);

  				for (i = 0; i < neighbors.length; i++) {

  					neighbor = neighbors[i];
  					this.nodeChanged.push(neighbor);

  					if (neighbor.closed || !neighbor.Accessible()) {
  						continue;
  					}

  					x = neighbor.x;
  					y = neighbor.y;

  					// get the distance between current node and the neighbor
  					// and calculate the next g score
  					ng = node.g + (x - node.x === 0 || y - node.y === 0 ? 1 : SQRT2);

  					if (!neighbor.opened || ng < neighbor.g) {

  						neighbor.g = ng;
  						neighbor.h = neighbor.h || weight * this.octile(Math.abs(x - endNode.x), Math.abs(y - endNode.y));
  						neighbor.f = neighbor.g + neighbor.h;
  						neighbor.parent = node;

  						if (!neighbor.opened) {
  							openList.push(neighbor);
  							neighbor.opened = true;
  						} else {
  							// the neighbor can be reached with smaller cost.
  							// Since its f value has been updated, we have to
  							// update its position in the open list
  							openList.updateItem(neighbor);
  						}
  					}
  				} // end for each neighbor
  			} // end while not open list empty
  			// fail to find the path
  			return [];
  		}
  	}]);
  	return Pathfinding;
  }();

  var Main = function () {
    function Main() {
      classCallCheck(this, Main);


      Static.construct();
      this.helpers();
      this.hexMap = new HexMap();
      this.pathFinder = new Pathfinding(this.hexMap);
      this.marked = [];
    }

    /**
    * Show the helper grid and axis lines.
    */


    createClass(Main, [{
      key: 'helpers',
      value: function helpers() {

        var size = 100;
        var divisions = 10;

        var gridHelper = new THREE.GridHelper(size, divisions);
        scene.add(gridHelper);

        var axesHelper = new THREE.AxesHelper(100);
        scene.add(axesHelper);
      }

      /**
      * Unmark all the marked hexagons.
      */

    }, {
      key: 'unMarkAll',
      value: function unMarkAll() {

        for (var i = 0; i < this.marked.length; i++) {
          this.marked[i].originalColor();
        }

        this.marked = [];
      }

      /**
      * Does nothing at this moment.
      */

    }, {
      key: 'buttonClick',
      value: function buttonClick() {
        console.log("click");
      }

      /**
      * Check mouse events. and run some example code.
      */

    }, {
      key: 'mouseHexIntersection',
      value: function mouseHexIntersection(_raycaster) {

        var intersects = _raycaster.intersectObjects(this.hexMap.getHexMeshGroup().children);

        if (intersects.length > 0) {

          var dd = document.getElementById("dropdown");
          var action = dd.options[dd.selectedIndex].text;

          this.unMarkAll();

          var a = this.hexMap.getHexById(5);
          var b = this.hexMap.getHexById(intersects[0].object.hexId);

          if (action == "pathfinding") {
            var path = this.pathFinder.find(a, b);
            for (var i = 0; i < path.length; i++) {
              path[i].changeColor(0x0000ff);
              this.marked.push(path[i]);
            }
          }

          if (action == "neighbors") {
            var neighbors = this.hexMap.getNeighborsOf(b);
            for (var i = 0; i < neighbors.length; i++) {
              neighbors[i].changeColor(0xff0fff);
              this.marked.push(neighbors[i]);
            }
          }

          if (action == "reach") {
            var reached = this.hexMap.getReachableOf(b, 5);
            for (var i = 0; i < reached.length; i++) {
              reached[i].changeColor(0xff0fff);
              this.marked.push(reached[i]);
            }
          }

          if (action == "linedraw") {
            var lineDraw = Static.cube_linedraw(a.getCubeCoords(), b.getCubeCoords());
            for (var i = 0; i < lineDraw.length; i++) {
              var hex = this.hexMap.getHexById(Static.cube_to_id(lineDraw[i]));
              hex.changeColor(0xff0fff);
              this.marked.push(hex);
            }
          }

          if (action == "intersect") {

            var range_a = Static.cube_range(b.getCubeCoords(), 1);
            for (var i = 0; i < range_a.length; i++) {
              var hex = this.hexMap.getHexById(Static.cube_to_id(range_a[i]));
              hex.changeColor(0xff0fff);
              this.marked.push(hex);
            }

            var range_b = Static.cube_range(a.getCubeCoords(), 3);
            for (var i = 0; i < range_b.length; i++) {
              var hex = this.hexMap.getHexById(Static.cube_to_id(range_b[i]));
              hex.changeColor(0xff0fff);
              this.marked.push(hex);
            }

            var intersect = Static.intersecting_ranges(range_a, range_b);
            for (var i = 0; i < intersect.length; i++) {
              var hex = this.hexMap.getHexById(Static.cube_to_id(intersect[i]));
              hex.changeColor(0xff0000);
              this.marked.push(hex);
            }
          }

          var hex = this.hexMap.getHexById(intersects[0].object.hexId);
          if (action != "intersect") {
            hex.changeColor(0xff0fff);
            this.marked.push(hex);
          }
          var obj = document.getElementById("tileId");
          obj.innerText = hex.x + " - " + hex.y + " id: " + hex.hexId;
        }
      }
    }]);
    return Main;
  }();

  return Main;

}());
