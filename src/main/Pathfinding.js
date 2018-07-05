import { Static } from './Static.js'

class Pathfinding {

	/**
	* Octile distance.
	* @param {number} dx - Difference in x.
	* @param {number} dy - Difference in y.
	* @return {number} sqrt(dx * dx + dy * dy) for grids.
	*/
	constructor(map) {
		this.hexMap = map;
		this.nodeChanged = [];
	}

	/**
	* Octile distance.
	* @param {number} dx - Difference in x.
	* @param {number} dy - Difference in y.
	* @return {number} sqrt(dx * dx + dy * dy) for grids.
	*/
 	octile(dx, dy) {
		var F = Math.SQRT2 - 1;
		return (dx < dy) ? F * dx + dy : F * dy + dx;
	};

	/**
	* Path backtracing.
	* @param {path} node - [x,y].
	* @return {path} - [x,y] traced back.
	*/
	backtrace(node) {
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
	clear(nodes) {

		for(var a = 0; a < this.nodeChanged.length; a++){
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

	find (startNode, endNode) {

		this.clear();

		// If the start or endnode is not accessible
		if ( !startNode.Accessible() || !endNode.Accessible()) {
			return [];
		}

		var openList = new Heap( function ( nodeA, nodeB ) { return nodeA.f - nodeB.f; });

		var SQRT2 = Math.SQRT2;
		var weight = 1;
		var node, neighbors, i, neighbor, x, y, ng;

		// push the start node into the open list
		openList.push(startNode);
		startNode.opened = true;

		while ( !openList.empty() ) {

			node = openList.pop();
			node.closed = true;
			this.nodeChanged.push(node);

			if (node.x == endNode.x && node.y == endNode.y ) {
				return this.backtrace(node);
			}

			// get neigbours of the current node
			neighbors = this.hexMap.getNeighborsOf(node);

			for (i = 0; i < neighbors.length; i++) {

				neighbor = neighbors[i];
				this.nodeChanged.push(neighbor);

				if (neighbor.closed || !neighbor.Accessible() ) {
					continue;
				}

				x = neighbor.x;
				y = neighbor.y;

				// get the distance between current node and the neighbor
				// and calculate the next g score
				ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);
				
				if (!neighbor.opened || ng < neighbor.g) {

					neighbor.g = ng;
					neighbor.h = neighbor.h || weight * this.octile(Math.abs(x - endNode.x),Math.abs(y - endNode.y));
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
};

export { Pathfinding }