class Static {

  static construct () {

    Static.rowLength = 20;
    Static.columnLength = 10;
    Static.hexSize = 5;
    
    Static.cube_directions = [
      { x:+1, y:0, z:-1 }, { x:+1, y:-1, z:-0 }, { x:0, y:-1, z:+1 },
      { x:-1, y:0, z:+1 }, { x:-1, y:+1, z:-0 }, { x:0, y:+1, z:-1 }
    ];

    Static.cube_diagonals = [
      { x:+2, y:-1, z:-1 }, { x:+1, y:+1, z:-2 }, { x:-1, y:+2, z:-1 }, 
      { x:-2, y:+1, z:+1 }, { x:-1, y:-1, z:+2 }, { x:+1, y:-2, z:+1 }
    ];
    
  };

  static cube_to_id( cube ) {
    return this.oddr_to_id ( this.cube_to_oddr( cube ) );
  };

  static cube_to_oddr( cube ) {
      var x = cube.x + ( cube.z - ( cube.z & 1 ) ) / 2;
      var y = cube.z;
      return { x:x, y:y };
  };

  static oddr_to_id ( offset ) {
    var id = offset.y * Static.columnLength + offset.x;
    return id;
  };

  static oddr_to_cube( offset ) {
    var x = offset.x - ( offset.y - ( offset.y & 1 ) ) / 2;
    var z = offset.y;
    var y = -x-z;
    return { x:x, y:y, z:z }
  };

  static id_to_cube( id ) {
    return this.oddr_to_cube( this.id_to_oddr( id ) );
  };

  static id_to_oddr ( id ) {
    var y = Math.floor( id / Static.columnLength );
    var x = id % Static.columnLength;
    return { x:x, y:y };
  };

  static cube_neighbor( cube, direction ) {
    return this.cube_add( cube, this.cube_directions[direction] );
  };

  static cube_diagonal_neighbor( cube, direction ) {
     return this.cube_add( cube, this.cube_diagonals[direction] );
  };

  static cube_distance ( a, b ) {
    return ( Math.abs( a.x - b.x ) + Math.abs( a.y - b.y ) + Math.abs( a.z - b.z ) ) / 2;
  };

  static cube_range ( cube, range ) {
    var results = [];
    var p, z;
    for ( var x = -range; x <= range; x++ ) {
      for ( var y = Math.max( -range, -x-range ); y <= Math.min( +range, -x+range ); y++ ) {
        z = -x-y;
        p = this.cube_add( cube, { x:x, y:y, z:z } );
        if( !this.out_of_bouds( p ) ) {
          results.push( p );
        }
      }
    }
    return results;
  }

  static intersecting_ranges ( a ,b ) {
    var result = [];
    for( var i = 0; i < a.length; i++ ) {
      var a_cube = a[i];
      for( var o = 0; o < b.length; o++ ) {
        var b_cube = b[o];
        if( a_cube.x == b_cube.x && a_cube.y == b_cube.y && a_cube.z == b_cube.z ){
          result.push( b_cube );
        }
      }
    }
    return result;
  }

  static cube_linedraw( a, b ) {
    var distance = this.cube_distance( a, b );
    var result = [];
    for ( var i = 0; i < distance; i++ ) {
      result.push( this.cube_round( this.cube_lerp( a, b, 1.0/distance * i ) ) );
    }
    return result;
  }

  static lerp( a, b, t ) {
    return a + (b - a) * t;
  }

  static cube_lerp( a, b, t ) {
    return { x:this.lerp( a.x, b.x, t ), y:this.lerp( a.y, b.y, t ), z:this.lerp( a.z, b.z, t ) };
  }
  
  static cube_round( cube ) {

    var rx = Math.round( cube.x );
    var ry = Math.round( cube.y );
    var rz = Math.round( cube.z );

    var x_diff = Math.abs( rx - cube.x );
    var y_diff = Math.abs( ry - cube.y );
    var z_diff = Math.abs( rz - cube.z );

    if ( x_diff > y_diff && x_diff > z_diff ) {
      rx = -ry-rz
    } else if ( y_diff > z_diff ) {
      ry = -rx-rz
    } else {
      rz = -rx-ry
    }
    
    return { x:rx, y:ry, z:rz };

  }

  static out_of_bouds ( cube ) {

    var oddr = this.cube_to_oddr( cube );

    if( oddr.x < 0 || oddr.x >= Static.columnLength ) {
      return true;
    }
    if( oddr.y < 0 || oddr.y >= Static.rowLength ) {
      return true;
    }

    return false;

  }

  static cube_add( cube1, cube2 ) {
    var res = { x:0, y:0, z:0 };
    res.x = cube1.x + cube2.x;
    res.y = cube1.y + cube2.y;
    res.z = cube1.z + cube2.z;
    return res;
  }
    
}

export { Static }