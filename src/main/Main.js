import { HexMap } from './HexMap.js'
import { Static } from './Static.js'
import { Pathfinding } from './Pathfinding.js'


class Main {

  constructor () {

    Static.construct();
    this.helpers();
    this.hexMap = new HexMap();
    this.pathFinder = new Pathfinding(this.hexMap);
    this.marked = [];
  }

  /**
  * Show the helper grid and axis lines.
  */
  helpers () {

    var size = 100;
    var divisions = 10;

    var gridHelper = new THREE.GridHelper( size, divisions );
    scene.add( gridHelper );

    var axesHelper = new THREE.AxesHelper( 100 );
    scene.add( axesHelper );
  }

  /**
  * Unmark all the marked hexagons.
  */
  unMarkAll() {

    for ( var i = 0; i < this.marked.length; i++) {
      this.marked[i].originalColor();
    }

    this.marked = [];
  }

  /**
  * Does nothing at this moment.
  */
  buttonClick() {
        console.log("click");
  }

  /**
  * Check mouse events. and run some example code.
  */
  mouseHexIntersection ( _raycaster ) {

    var intersects = _raycaster.intersectObjects( this.hexMap.getHexMeshGroup().children );

    if(intersects.length > 0) {

      var dd = document.getElementById("dropdown");
      var action = dd.options[dd.selectedIndex].text;

      this.unMarkAll();

      var a = this.hexMap.getHexById( 5 );
      var b = this.hexMap.getHexById( intersects[0].object.hexId );

      if (action == "pathfinding") {
        var path = this.pathFinder.find( a, b );
        for ( var i = 0; i < path.length; i++ ) {
          path[i].changeColor( 0x0000ff );
          this.marked.push( path[i] );
        }
      }
      
      if (action == "neighbors") {
        var neighbors = this.hexMap.getNeighborsOf( b );
        for ( var i = 0; i < neighbors.length; i++ ) {
          neighbors[i].changeColor( 0xff0fff );
          this.marked.push( neighbors[i] );
        }
      }

      if (action == "reach") {
        var reached = this.hexMap.getReachableOf( b , 5 );
        for (var i = 0; i < reached.length; i++) {
          reached[i].changeColor( 0xff0fff );
          this.marked.push(reached[i]);
        }
      }

      if (action == "linedraw") {
        var lineDraw = Static.cube_linedraw( a.getCubeCoords() , b.getCubeCoords() );
        for (var i = 0; i < lineDraw.length; i++) {
          var hex = this.hexMap.getHexById( Static.cube_to_id( lineDraw[i] ) );
          hex.changeColor( 0xff0fff );
          this.marked.push( hex );
        }
      }

      if (action == "intersect") {

        var range_a = Static.cube_range( b.getCubeCoords(), 1 );
        for (var i = 0; i < range_a.length; i++) {
          var hex = this.hexMap.getHexById( Static.cube_to_id( range_a[i] ) );
          hex.changeColor( 0xff0fff );
          this.marked.push( hex );
        }

        var range_b = Static.cube_range( a.getCubeCoords(), 3 );
        for (var i = 0; i < range_b.length; i++) {
          var hex = this.hexMap.getHexById( Static.cube_to_id( range_b[i] ) );
          hex.changeColor( 0xff0fff );
          this.marked.push( hex );
        }

        var intersect = Static.intersecting_ranges(range_a,range_b);
        for (var i = 0; i < intersect.length; i++) {
          var hex = this.hexMap.getHexById( Static.cube_to_id( intersect[i] ) );
          hex.changeColor( 0xff0000 );
          this.marked.push( hex );
        }
      }

      var hex = this.hexMap.getHexById(intersects[0].object.hexId);
      if (action != "intersect") {
        hex.changeColor( 0xff0fff );
        this.marked.push(hex);
      }
      var obj = document.getElementById("tileId");
      obj.innerText = hex.x + " - "+ hex.y + " id: " + hex.hexId;

    }
  
  }

};

export { Main };