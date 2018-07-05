import { Hex } from './Hex.js'
import { Static } from './Static.js'

class HexMap {

  constructor ( ) {

    this.hexList = [];
    this.hexMeshGroup = new THREE.Group();
    this.createHexMap ( );

  }

  /**
  * Create some hexagons to make this example a bit "fun" :).
  * Normally this is stored in a database or something like that.
  */
  createHexMap ( ) {

    var hexGeometry = this.shapeToGeometry ( this.pathToShape( this.drawHexagonPath ( Static.hexSize ) ) );
    var hexId, access;
    var rowList = [];

    for ( var column = 0; column < Static.columnLength; column++ ) {

      rowList = [];

      for ( var row = 0; row < Static.rowLength; row++ ) {
        hexId = row * Static.columnLength + column;

        // Mark some hexagons access false
        access = ((hexId == 80 || hexId == 81 ||hexId == 82 || hexId == 83 || hexId == 84 || hexId == 85 || hexId == 6 || hexId == 16 ||hexId == 17 || hexId == 18 || hexId == 1 || hexId == 62 || hexId == 63 || hexId == 64 || hexId == 74 || hexId == 85 || hexId == 95|| hexId == 47|| hexId == 75|| hexId == 76|| hexId == 77|| hexId == 78 || hexId == 10 || hexId == 11 || hexId == 13 || hexId == 12 || hexId == 14 || hexId == 25 || hexId == 35 || hexId == 46) ? false : true );
        
        var hex = new Hex( column, row, hexId, access );
        hex.createHexMesh( hexGeometry );
        hex.addHexMesh( this.hexMeshGroup );
        rowList.push( hex );
      }

      this.hexList.push( rowList );
    }

    // Add the created hexagon meshes to the scene.
    scene.add( this.hexMeshGroup );
  }

  /**
  * Get the neighbors of a given hex.
  * @param {Hex} hex - insert the hex object.
  * @return {<Hex>} retuns a list of adjacent hexes.
  */
  getNeighborsOf( hex ) {

    var result = [];
    var cube = hex.getCubeCoords();
    var neighbor_cube, hex;

    for ( var i = 0; i < 6; i++ ) {

      neighbor_cube = Static.cube_add( cube, Static.cube_directions[i] );

      if( !Static.out_of_bouds( neighbor_cube ) ) {
        hex = this.getHexById( Static.cube_to_id( neighbor_cube ) );
        result.push( hex );
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
  getReachableOf( startHex, distance ) {
    var hex, neighbor_hex, neighbor_cube;

    var result = [];
    result.push(startHex);

    var fringes = [];
    fringes.push([startHex]);

    for (var dist = 1; dist < distance; dist++ ) {
      fringes.push([]);
      for (var c = 0; c < fringes[dist-1].length; c++) {
        hex = fringes[dist-1][c];
        for (var dir = 0; dir < 6; dir++ ) {
          neighbor_cube = Static.cube_neighbor(hex.getCubeCoords(), dir);
          if( !Static.out_of_bouds( neighbor_cube ) ) {
            neighbor_hex = this.getHexById(Static.cube_to_id(neighbor_cube));
            if( neighbor_hex.Accessible() ) {
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
  getHexById ( id ) {
    try {
      var oddr = Static.id_to_oddr( id );
      return this.hexList[oddr.x][oddr.y];
    } catch ( err ) {
      console.log(err);
    }
  }

  /**
  * Create a path that is hexagon shaped.
  * @param {number} hexagonSize - give the hexagon a size :).
  * @return {<[x,y]>} returns the hex with the given id if exists.
  */
  drawHexagonPath ( hexagonSize ) {

    var points = [];
    var angle_deg, angle_rad;

    for ( var i = 0; i <= 6; ++i ) {
      angle_deg = 60 * i - 30;
      angle_rad = Math.PI / 180 * angle_deg;

      points.push( { x: hexagonSize * Math.cos(angle_rad), y: hexagonSize * Math.sin(angle_rad) } );
    }

    return points;
  }

  /**
  * ThreeJs needs a shape to be extruded. This converts the path to a ThreeJs shape.
  * @param {<[x,y]>} path - Some points in 2d space.
  * @return {THREE.Shape} returns a ThreeJs shape object.
  */
  pathToShape ( path ) {

    var shape = new THREE.Shape();

    for ( var i = 0; i < path.length; ++i ) {
      shape.lineTo ( path[i].x, path[i].y );
    }

    return shape;
  }

  /**
  * Create a 3D geometry object from the shape.
  * @param {THREE.Shape} shape - Add a nice shape.
  * @return {THREE.Geometry} returns the shape extruded to a 3d object.
  */
  shapeToGeometry ( shape ) {
    return new THREE.ExtrudeGeometry( shape, { amount: .5, bevelEnabled: false, steps: 1 } );
  }

  /**
  * Returns the hexagon meshes, in this example used for the mouse raycasting.
  * @return {THREE.Group} returns a ThreeJs groep object, that contains all the hex meshes.
  */
  getHexMeshGroup () {
    return this.hexMeshGroup;
  }

};

export { HexMap };