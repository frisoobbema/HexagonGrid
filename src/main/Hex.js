import { Static } from './Static.js'

class Hex {

	constructor ( column, row, hexId, accessible ) {	

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
	Accessible () {
		return this.accessible;
	}

	/**
	* Get access info.
	* @return {bool} accessibility of the hexagon.
	*/
	getCubeCoords () {
		return Static.oddr_to_cube( {x: this.x, y: this.y} );
	}

	/**
	* Create the mesh that can be placed in the ThreeJs scene.
	* @param {THREE.Geometry} dx - Difference in x.
	*/
	createHexMesh ( hexGeometry ) {

		if(this.accessible){
			this.material = new THREE.MeshPhongMaterial ( { color: 0x4cdb4a, wireframe: false } );
		}else{
			this.material = new THREE.MeshPhongMaterial ( { color: 0xffffff, wireframe: false } );
		}
		
		this.mesh = new THREE.Mesh( hexGeometry, this.material );
		this.mesh.rotation.x = ( Math.PI / 180 ) * 90;
	}

	/**
	* Add the hex to the THREE.Group that is used for mouse interaction.
	*/
	addHexMesh ( hexGroup ) {
		var pos = this.getPosition( Static.hexSize );
		this.mesh.position.set( pos.x, pos.y, pos.z );
		hexGroup.add( this.mesh );
		this.mesh.hexId = this.hexId;
	}

	/**
	* Change the color of the hexagon tile.
	* @param {color} color - 0xffffff rgb color.
	*/
	changeColor ( color ) {
		this.material.color.setHex( color );
	}

	/**
	* Change the to the original color.
	*/
	originalColor ( ) {
		if(this.accessible) {
			this.material.color.setHex( 0x4cdb4a );
		} else {
			this.material.color.setHex( 0xffffff );
		}
	}

	/**
	* Get the position where the hex needs to be placed in the scene.
	* @param {number} hexSize - the size of the hexagons in the map.
	* @return {vec3} xyz coords.
	*/
	getPosition ( hexSize ) {
		var width = Math.sqrt(3) * hexSize;
		var height = 2 * hexSize;
		var oddr = 0;

		if( this.y &1 ) {
			oddr = width/2;
		}

		return { x:width * this.x + oddr, y:0, z:(height * this.y ) * 3/4 };
	}

};

export { Hex };