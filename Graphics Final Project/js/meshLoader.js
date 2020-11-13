if (typeof String.prototype.startsWith !== 'function') {
	String.prototype.startsWith = function (str){
		return this.slice(0, str.length) === str;
	};
}
var modelLoader = {};

modelLoader.Mesh = function( objectData ){
	/*
	 *         With the given elementID or string of the OBJ, this parses the
	 *                 OBJ and creates the mesh.
	 *                     */

	var verts = [];
	var norms = [];
	var uvs = [];

	// unpacking stuff
	var packed = {};
	packed.indices = [];

	// array of lines separated by the newline
	var lines = objectData.split( '\n' )
		for( var i=0; i<lines.length; i++ ){

			lines[i] = lines[i].replace(/\s{2,}/g, " "); // remove double spaces

			// if this is a vertex
			if( lines[ i ].startsWith( 'v ' ) ){
				line = lines[ i ].slice( 2 ).split( " " );
					verts.push( line[ 0 ] );
				verts.push( line[ 1 ] );
				verts.push( line[ 2 ] );
			}
			// if this is a vertex normal
			else if( lines[ i ].startsWith( 'vn' ) ){
			}
			// if this is a texture
			else if( lines[ i ].startsWith( 'vt' ) ){
				line = lines[ i ].slice( 3 ).split( " " );
				uvs.push(line[0]);
				uvs.push(line[1]);

			}
			// if this is a face
			else if( lines[ i ].startsWith( 'f ' ) ){
				line = lines[ i ].slice( 2 ).split( " " );
				for(var j=1; j <= line.length-2; j++){
					var i1 = line[0].split('/')[0] - 1;
					var i2 = line[j].split('/')[0] - 1;
					var i3 = line[j+1].split('/')[0] - 1;
					packed.indices.push(i1,i2,i3);
				}
			}
		}
	this.vertices = verts;
	for(i =0; i < uvs.length/2; i++)
	{
		console.log(uvs[i*2], " ", uvs[i*2+1]);
	}
	this.uvs = uvs;
	console.log(this.vertices);
	this.indices = packed.indices;
	console.log(this.indices);
	var face = [0, 0, 0];
	var x = [0, 0, 0];
	var y = [0, 0, 0];
	var z = [0, 0, 0];
	var temp = 0.0;
	var vec1 = [0.0, 0.0, 0.0];
	var vec2 = [0.0, 0.0, 0.0];
	var vec3 = [0.0, 0.0, 0.0];
	var norm = [];
	for(i = 0; i < verts.length; i++)
	{
		norms.push(0);
	}
	for(i = 0; i < this.indices.length/3; i++)
	{
		face[0] = this.indices[i*3];
		face[1] = this.indices[i*3+1];
		face[2] = this.indices[i*3+2];
		for(var j = 0; j < 3; j++)
		{
			x[j] = this.vertices[face[j]*3];
			y[j] = this.vertices[face[j]*3+1];
			z[j] = this.vertices[face[j]*3+2];
		}
		//So the vecs would be point A-C, A-B, and C-B. 
		vec1[0] = x[0] - x[1];
		vec1[1] = y[0] - y[1];
		vec1[2] = z[0] - z[1];
		vec2[0] = x[0] - x[2];
		vec2[1] = y[0] - y[2];
		vec2[2] = z[0] - z[2];
		vec3[0] = x[2] - x[1];
		vec3[1] = y[2] - y[1];
		vec3[2] = z[2] - z[1];
		//And normals would be 12, 13, 23
		norm = cross(vec1, vec2);
		let vert1 = face[0] * 3;
		let vert2 = face[1] * 3;
		let vert3 = face[2] * 3;
		for(var j = 0; j < 3; j++){
			norms[vert1 + j] += norm[j];
			norms[vert2 + j] += norm[j];
			norms[vert3 + j] += norm[j];
		}

	}
	for(i = 0; i < norms.length/3; i++)
	{
		vec1[0] = norms[i*3];
		vec1[1] = norms[i*3+1];
		vec1[2] = norms[i*3+2];
		temp = (vec1[0]* vec1[0]) + (vec1[1]*vec1[1]) + (vec1[2]*vec1[2]);
		temp = Math.sqrt(temp);
		norms[i*3] /= temp;
		norms[i*3+1] /= temp;
		norms[i*3+2] /= temp;

	}
	this.normals = norms;
}
