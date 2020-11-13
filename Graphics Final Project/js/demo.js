var gl = null; //our OpenGL handler

var GC = {};   //the graphics context
var m;
var m1;
var m2; //The model

//initialize the graphics context variables
GC.shaderProgram = null;          //our GLSL program
GC.shaderProgram2 = null;
GC.shaderProgram3 = null;
GC.canvas = null;
GC.vertexPositionAttribute = null;//location of vertex positions in GLSL program
GC.vertexPositionAttribute2 = null;
GC.vertexPositionAttribute3 = null;
GC.barycentricBuffer = null;      //array passed to shader to create wireframe display
GC.textureCoordBuffer = null;
GC.textureCoordAttribute = null;
GC.textureCoordAttribute2 = null;
GC.normalBuffer = null;
GC.normalAttribute = null;
GC.normalAttribute3 = null;
GC.uSampler = null;
GC.texture = null;
GC.barycentricAttribute = null;   //location of barycentric coordinate array in GLSL program
GC.barycentricAttribute2 = null;
GC.barycentricAttribute3 = null;
GC.perspectiveMatrix = null;      //the Perspective matrix
GC.mvMatrix = null;               //the ModelView matrix
GC.mvMatrixStack = [];            //the ModelView matrix stack
GC.model_mtx = null;
GC.norm_mtx = null;
GC.norm_mtx2 = null;
GC.mesh = null;                   //the current mesh
GC.mouseDown = null;              //boolean check for mouseDown
GC.width = 1200;                   //render area width
GC.height = 720;                  //render area height
GC.tex_norm = null;
GC.tex_diffuse = null;
GC.tex_depth = null;
GC.cubetex = null;
GC.show_tex = null;
GC.depth_scale = null;
GC.num_layers = null;
GC.vert_tang = null;
GC.vert_tangPtr = null;
GC.vert_bitang = null;
GC.vert_bitangPtr = null;
GC.vert_uv = null;
GC.vert_uvPtr = null;
GC.fogColorLocation = null;
GC.fogColorLocation2 = null;
GC.fogColorLocation3 = null;
GC.fogAmountLocation = null;
GC.fogAmountLocation2 = null;
GC.fogAmountLocation3 = null;

var camera = new ArcBall();              //create a new arcball camera
camera.setBounds(GC.width,GC.height);    //initialize camera with screen space dimensions

//demo constructor
function demo(canvasName,Mesh) {
    this.canvasName = canvasName;
    GC.mesh = Mesh;
}

function normalize(vector) {
	magnitude = vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2];
	magnitude = Math.sqrt(magnitude);
	vector[0] = vector[0]/magnitude;
	vector[1] = vector[1]/magnitude;
	vector[2] = vector[2]/magnitude;
	return vector;
}

//initialize webgl, populate all buffers, load shader programs, and start drawing
demo.prototype.init = function(){
    this.canvas = document.getElementById(this.canvasName);
    this.canvas.width = GC.width;
    this.canvas.height = GC.height;

    //Here we check to see if WebGL is supported 
	this.initWebGL(this.canvas);
	
	GC.canvas =  this;

    gl.clearColor(0.0,0.0,0.0,1.0);     //background to black
    gl.clearDepth(1.0);                 //set depth to yon plane
    gl.enable(gl.DEPTH_TEST);           //enable depth test
    gl.depthFunc(gl.LEQUAL);            //change depth test to use LEQUAL

    //set mouse event callbacks
    this.setMouseEventCallbacks();

    //set keyboard event callbacks
    this.setKeyboardEventCallbacks();

    //Get opengl derivative extension -- enables using fwidth in shader
    gl.getExtension("OES_standard_derivatives");
    
    //init the shader programs
    this.initShaders();

	//init the vertex buffe
	this.initGeometryBuffers(0);
	this.initGeometryBuffers(1);
	this.initGeometryBuffers(2);

}

demo.prototype.MainLoop = function(){
	drawScene();
}

demo.prototype.setMouseEventCallbacks = function(){
    //-------- set callback functions
    this.canvas.onmousedown = this.mouseDown;
    this.canvas.onmousewheel = this.mouseWheel;

        //--Why set these to callbacks for the document object?
    document.onmouseup = this.mouseUp;          
    document.onmousemove = this.mouseMove;
    
        //--touch event callbacks
    this.canvas.ontouchstart = this.touchDown;
    this.canvas.ontouchend = this.touchUp;
    this.canvas.ontouchmove = this.touchMove;
    //-------- end set callback functions
}

demo.prototype.setKeyboardEventCallbacks = function(){
        //--Why set these to callbacks for the document object?
    document.onkeydown = this.keyDown;          
}

//initialize the shaders and grab the shader variable attributes
demo.prototype.initShaders = function(){

    //Load the shaders
    var fragmentShader = this.getShader("FragmentShader2");
    var vertexShader = this.getShader("VertexShader2");

    this.shaderProgram = gl.createProgram();
    gl.attachShader(this.shaderProgram, vertexShader);
    gl.attachShader(this.shaderProgram, fragmentShader);
    gl.linkProgram(this.shaderProgram);

    if(!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)){
        console.log("unable to init shader program");
    }

    GC.vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "vPos");
	gl.enableVertexAttribArray(GC.vertexPositionAttribute);
	
    GC.barycentricAttribute = gl.getAttribLocation(this.shaderProgram, "bary");
	gl.enableVertexAttribArray(GC.barycentricAttribute);
	
	GC.normalAttribute = gl.getAttribLocation(this.shaderProgram, "norm");
	gl.enableVertexAttribArray(GC.normalAttribute);

	GC.fogColorLocation = gl.getUniformLocation(this.shaderProgram, "u_fogColor");
	GC.fogAmountLocation = gl.getUniformLocation(this.shaderProgram, "u_fogAmount");

	
	var fragmentShader2 = this.getShader("FragmentShader1");
	var vertexShader2 = this.getShader("VertexShader1");

	this.shaderProgram2 = gl.createProgram();
	gl.attachShader(this.shaderProgram2, vertexShader2);
	gl.attachShader(this.shaderProgram2, fragmentShader2);
	gl.linkProgram(this.shaderProgram2);

	if(!gl.getProgramParameter(this.shaderProgram2, gl.LINK_STATUS)){
        console.log("unable to init shader program 2");
	}
	
	GC.vertexPositionAttribute2 = gl.getAttribLocation(this.shaderProgram2, "vPos");
	gl.enableVertexAttribArray(GC.vertexPositionAttribute2);
	
    GC.barycentricAttribute2 = gl.getAttribLocation(this.shaderProgram2, "bary");
	gl.enableVertexAttribArray(GC.barycentricAttribute2);
	
	GC.textureCoordAttribute = gl.getAttribLocation(this.shaderProgram2, "aTextureCoord");
	gl.enableVertexAttribArray(GC.textureCoordAttribute);

	GC.vert_tangPtr = gl.getAttribLocation(this.shaderProgram2, "vert_tang");
	gl.enableVertexAttribArray(GC.vert_tangPtr);

	GC.vert_bitangPtr = gl.getAttribLocation(this.shaderProgram2, "vert_bitang");
	gl.enableVertexAttribArray(GC.vert_bitangPtr);

	GC.vert_uvPtr = gl.getAttribLocation(this.shaderProgram2, "vert_uv");
	gl.enableVertexAttribArray(GC.vert_uvPtr); 

	GC.fogColorLocation2 = gl.getUniformLocation(this.shaderProgram2, "u_fogColor");
	GC.fogAmountLocation2 = gl.getUniformLocation(this.shaderProgram2, "u_fogAmount");


	var fragmentShader3 = this.getShader("FragmentShader3");
	var vertexShader3 = this.getShader("VertexShader3");

	this.shaderProgram3 = gl.createProgram();
	gl.attachShader(this.shaderProgram3, vertexShader3);
	gl.attachShader(this.shaderProgram3, fragmentShader3);
	gl.linkProgram(this.shaderProgram3);

	if(!gl.getProgramParameter(this.shaderProgram3, gl.LINK_STATUS)){
        console.log("unable to init shader program 3");
	}
	
	GC.vertexPositionAttribute3 = gl.getAttribLocation(this.shaderProgram3, "vPos");
	gl.enableVertexAttribArray(GC.vertexPositionAttribute3);
	
    GC.barycentricAttribute3 = gl.getAttribLocation(this.shaderProgram3, "bary");
	gl.enableVertexAttribArray(GC.barycentricAttribute3);

	GC.normalAttribute3 = gl.getAttribLocation(this.shaderProgram3, "norm");
	gl.enableVertexAttribArray(GC.normalAttribute3);

	GC.textureCoordAttribute2 = gl.getAttribLocation(this.shaderProgram3, "aTextureCoord");
	gl.enableVertexAttribArray(GC.textureCoordAttribute2);

	GC.fogColorLocation3 = gl.getUniformLocation(this.shaderProgram3, "u_fogColor");
	GC.fogAmountLocation3 = gl.getUniformLocation(this.shaderProgram3, "u_fogAmount");

	GC.shaderProgram = this.shaderProgram;
	GC.shaderProgram2 = this.shaderProgram2;
	GC.shaderProgram3 = this.shaderProgram3;
}

function setupShader2() {

}

function loadTexture(gl, url) {
	console.log("working with ", url);
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	const level = 0;
	const internalFormat = gl.RGBA;
	const width = 1;
	const height = 1;
	const border = 0;
	const srcFormat = gl.RGBA;
	const srcType = gl.UNSIGNED_BYTE;
	const pixel = new Uint8Array([0, 0, 255, 255]);
	gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
	const image = new Image();
	image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

		if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
			gl.generateMipmap(gl.TEXTURE_2D);
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl. CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl. CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			}
	};
	image.src = url;
	return texture;
}

function isPowerOf2(value) {
	return (value & (value-1)) == 0;
}



//initialize the buffers for drawing and the edge highlights
demo.prototype.initGeometryBuffers = function(num){
	console.log("num is ", num);

	if(num == 0) m = GC.mesh.model;
	else if(num== 1)
	{
		m1 = GC.mesh.model;
		console.log(m1);
	}
	else if(num == 2) m2 = GC.mesh.model;

  //create an OpenGL buffer
  GC.barycentricBuffer = gl.createBuffer();
  GC.textureCoordBuffer = gl.createBuffer();
  GC.vert_tang = gl.createBuffer();
  GC.vert_bitang = gl.createBuffer();
  GC.vert_uv = gl.createBuffer();
  
  var verts = [];                 //array to hold vertices laid out according to indices
  var bary = [];                    //array of 1s and 0s passed to GLSL to draw wireframe
  var norms = []; 
  var min = [90000,90000,90000];    //used for bounding box calculations
  var max = [-90000,-90000,-90000]; //used for bounding box calculations

    // Loop through the indices array and create a vertices array (this means
    //     duplicating data) from the listed indices
    m.indices.forEach(function(d,i){
        //grab the x,y,z values for the current vertex
        vx = (parseFloat(m.vertices[d*3]));
        vy = (parseFloat(m.vertices[d*3+1]));
        vz = (parseFloat(m.vertices[d*3+2]));

		let nx = (parseFloat(m.normals[d*3]));
		let ny = (parseFloat(m.normals[d*3+1]));
		let nz = (parseFloat(m.normals[d*3+2]));

        //add this vertex to our array
		verts.push(vx + (num * 3),vy,vz);
		norms.push(nx, ny, nz);
        //check to see if we need to update the min/max
        if(vx < min[0]) min[0] = vx;
        if(vy < min[1]) min[1] = vy;
        if(vz < min[2]) min[2] = vz;
        if(vx > max[0]) max[0] = vx;
        if(vy > max[1]) max[1] = vy;
        if(vz > max[2]) max[2] = vz;

        //What does this do?
        if(i%3 == 0){
            bary.push(1,0,0);
        } else if(i % 3 == 1){
            bary.push(0,1,0);
        } else if(i % 3 == 2){
            bary.push(0,0,1);
        }
    });
    var textureCoordinates = []
	var tangs = [];
	var bitangs = [];

	var u1;
	var v1;
	for(i = 0; i < m.uvs.length/2; i++) {
        u1 = (parseFloat(m.uvs[i*2]));
        u2 = (parseFloat(m.uvs[i*2+1]));
        textureCoordinates.push(u1, u2);
	};
	for(i = 0; i < m.uvs.length/6; i++) {
		var point1 = [];
		var point2 = [];
		var point3 = [];
		var edge1 = [];
		var edge2 = [];
		var uv1 = [];
		var uv2 = [];
		var uv3 = [];
		var deltauv1 = [];
		var deltauv2 = [];
		var tangent = [];
		var bitangent = [];
		point1.push(verts[i*9], verts[i*9+1], verts[i*9+2]);
		point2.push(verts[i*9+3], verts[i*9+4], verts[i*9+5]);
		point3.push(verts[i*9+6], verts[i*9+7], verts[i*9+8]);
		uv1.push(textureCoordinates[i*6], textureCoordinates[i*6+1]);
		uv2.push(textureCoordinates[i*6+2], textureCoordinates[i*6+3]);
		uv3.push(textureCoordinates[i*6+4], textureCoordinates[i*6+5]);

		edge1.push(point2[0]-point1[0], point2[1]-point1[1], point2[2]-point1[2]);
		edge2.push(point3[0]-point1[0], point3[1]-point1[1], point3[2]-point1[2]);

		deltauv1.push(uv2[0] - uv1[0], uv2[1] - uv1[1]);
		deltauv2.push(uv3[0] - uv1[0], uv3[1] - uv1[1]);

		var f = 1.0/ (deltauv1[0] * deltauv2[1] - deltauv2[0] * deltauv1[1]);
		tangent.push(f * (deltauv2[1] * edge1[0] - deltauv1[1] * edge2[0]));	
		tangent.push(f * (deltauv2[1] * edge1[1] - deltauv1[1] * edge2[1]));
		tangent.push(f * (deltauv2[1] * edge1[2] - deltauv1[1] * edge2[2]));
		tangent = normalize(tangent);

		bitangent.push(f * (-deltauv2[0] * edge1[0] + deltauv1[0] * edge2[0]));
		bitangent.push(f * (-deltauv2[0] * edge1[1] + deltauv1[0] * edge2[1]));
		bitangent.push(f * (-deltauv2[0] * edge1[2] + deltauv1[0] * edge2[2]));
		bitangent = normalize(bitangent);

		tangs.push(tangent[0], tangent[1], tangent[2]);
		tangs.push(tangent[0], tangent[1], tangent[2]);
		tangs.push(tangent[0], tangent[1], tangent[2]);
		bitangs.push(bitangent[0], bitangent[1], bitangent[2]);
		bitangs.push(bitangent[0], bitangent[1], bitangent[2]);
		bitangs.push(bitangent[0], bitangent[1], bitangent[2]);
	}

	  //set the min/max variables
	  console.log(verts.length);
	  console.log(textureCoordinates.length);
	  if(num == 0) {
  m.minX = min[0]; m.minY = min[1]; m.minZ = min[2];
  m.maxX = max[0]; m.maxY = max[1]; m.maxZ = max[2];
	  }
	  else if(num == 1) {
		m1.minX = min[0]; m1.minY = min[1]; m1.minZ = min[2];
		m1.maxX = max[0]; m1.maxY = max[1]; m1.maxZ = max[2];
	  }
	  else if(num == 2) {
		m2.minX = min[0]; m2.minY = min[1]; m2.minZ = min[2];
		m2.maxX = max[0]; m2.maxY = max[1]; m2.maxZ = max[2];
	  }

  //calculate the largest range in x,y,z
  var s = Math.max( Math.abs(min[0]-max[0]),
		  Math.abs(min[1]-max[1]),
		  Math.abs(min[2]-max[2]))

	  //calculate the distance to place camera from model
	  var d = (s/2.0)/Math.tan(45/2.0);

  //place the camera at the calculated position
  camera.position[2] = d;

  //orient the camera to look at the center of the model
  if(num == 0) camera.lookAt = [(m.minX+m.maxX)/2.0,(m.minY+m.maxY)/2.0,(m.minZ+m.maxZ)/2.0];
  if(num == 1) camera.lookAt = [(m1.minX+m.maxX)/2.0,(m1.minY+m1.maxY)/2.0,(m1.minZ+m1.maxZ)/2.0];
  if(num == 2) camera.lookAt = [(m2.minX+m2.maxX)/2.0,(m2.minY+m2.maxY)/2.0,(m2.minZ+m2.maxZ)/2.0];

  //bind the data we placed in the bary array to an OpenGL buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, GC.barycentricBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bary), gl.STATIC_DRAW);

  m.vertexBuffer = gl.createBuffer();
  //bind the data we placed in the verts array to an OpenGL buffer
  if(num == 0)  gl.bindBuffer(gl.ARRAY_BUFFER, m.vertexBuffer);
  if(num == 1)  gl.bindBuffer(gl.ARRAY_BUFFER, m1.vertexBuffer);
  if(num == 2)  gl.bindBuffer(gl.ARRAY_BUFFER, m2.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

  GC.normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, GC.normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(norms), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, GC.textureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, GC.vert_tang);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangs), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, GC.vert_bitang);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bitangs), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, GC.vert_uv);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
  GC.tex_norm = loadTexture(gl, "toy_box_normal.png");
  GC.tex_diffuse = loadTexture(gl, "toy_box_diffuse.png");
  GC.tex_depth = loadTexture(gl, "toy_box_disp.png");
  GC.cubetex = loadTexture(gl, "UT.png");
  console.log(GC.cubetex);
}

function clearscreen() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
//the drawing function

var fogColor = [0.8, 0.9, 1, 1];

var settings = {
	fogAmount: .75,
	fogAmount2: .75,
	fogAmount3: .8,
};

function drawModel() {

	gl.clearColor(fogColor[0], fogColor[1], fogColor[2], fogColor[3]);
	clearscreen();
	gl.useProgram(GC.canvas.shaderProgram);
	gl.disableVertexAttribArray(GC.vertexPositionAttribute2);
	gl.disableVertexAttribArray(GC.barycentricAttribute2);
	gl.disableVertexAttribArray(GC.vtextureCoordAttribute);
	gl.disableVertexAttribArray(GC.vert_tangPtr);
	gl.disableVertexAttribArray(GC.vert_bitangPtr);
	gl.disableVertexAttribArray(GC.vert_uvPtr);
	gl.disableVertexAttribArray(GC.vertexPositionAttribute);
	gl.disableVertexAttribArray(GC.normalAttribute);
	gl.disableVertexAttribArray(GC.barycentricAttribute);
	gl.disableVertexAttribArray(GC.vertexPositionAttribute3);
	gl.disableVertexAttribArray(GC.barycentricAttribute3);
	gl.disableVertexAttribArray(GC.normalAttribute3);
	gl.disableVertexAttribArray(GC.textureCoordAttribute2);


	GC.perspectiveMatrix = makePerspective(45, GC.width/GC.height, 0.1, Math.max(2000.0,m.maxZ));
	var lookAtMatrix = makeLookAt(camera.position[0],camera.position[1],camera.position[2],
			camera.lookAt[0],camera.lookAt[1],camera.lookAt[2],
			0,1,0);

	//set initial camera lookat matrix
	mvLoadIdentity(GC);

	//multiply by our lookAt matrix
	mvMultMatrix(lookAtMatrix,GC);

	//--------- camera rotation matrix multiplicaton
	//translate to origin of model for rotation
	mvTranslate([(m.minX+m.maxX)/2.0,(m.minY+m.maxY)/2.0,(m.minZ+m.maxZ)/2.0],GC);

	mvMultMatrix(camera.Transform,GC);//multiply by the transformation
	//--------- camera rotation matrix multiplicaton
	mvTranslate([(m.minX+m.maxX)/2.0,(m.minY+m.maxY)/2.0,(m.minZ+m.maxZ)/2.0],GC);

	mvMultMatrix(camera.Transform,GC);//multiply by the transformation

	//translate back to original origin
	mvTranslate([-(m.minX+m.maxX)/2.0,-(m.minY+m.maxY)/2.0,-(m.minZ+m.maxZ)/2.0],GC);
	//---------
	
	//passes modelview and projection matrices to the vertex shader
	setMatrixUniforms(GC, GC.shaderProgram);

	GC.norm_mtx = GC.mvMatrix;
	GC.norm_mtx = GC.norm_mtx.inverse();
	GC.norm_mtx = GC.norm_mtx.transpose();

	var pnormal = gl.getUniformLocation(GC.shaderProgram, "normal_mtx");
	gl.uniformMatrix4fv(pnormal, false, new Float32Array(GC.norm_mtx.flatten()));

	gl.uniform4fv(GC.fogColorLocation, fogColor);
	gl.uniform1f(GC.fogAmountLocation, settings.fogAmount2);

	//pass the vertex buffer to the shader
	gl.bindBuffer(gl.ARRAY_BUFFER, m.vertexBuffer);
	gl.vertexAttribPointer(GC.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(GC.vertexPositionAttribute);

	gl.bindBuffer(gl.ARRAY_BUFFER, GC.normalBuffer);
	gl.vertexAttribPointer(GC.normalAttribute, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(GC.normalAttribute);

	//pass the barycentric coords to the shader for edge detection
	gl.bindBuffer(gl.ARRAY_BUFFER, GC.barycentricBuffer);
	gl.vertexAttribPointer(GC.barycentricAttribute, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(GC.barycentricAttribute);

	gl.uniform1i(GC.uSampler, 0);

	//draw everything
	gl.drawArrays(gl.TRIANGLES,0,m.indices.length);
	gl.disableVertexAttribArray(GC.vertexPositionAttribute);
	gl.disableVertexAttribArray(GC.normalAttribute);
	gl.disableVertexAttribArray(GC.barycentricAttribute);

	gl.useProgram(GC.shaderProgram2);
	mvTranslate([(m1.minX+m1.maxX)/2.0,(m1.minY+m1.maxY)/2.0,(m1.minZ+m1.maxZ)/2.0],GC);

	mvMultMatrix(camera.Transform,GC);//multiply by the transformation

	//translate back to original origin
	mvTranslate([-(m1.minX+m1.maxX)/2.0,-(m1.minY+m1.maxY)/2.0,-(m1.minZ+m1.maxZ)/2.0],GC);
	//---------
	
	//passes modelview and projection matrices to the vertex shader
	setMatrixUniforms(GC, GC.shaderProgram2);

	GC.norm_mtx2 = GC.mvMatrix;
	GC.norm_mtx2 = GC.norm_mtx2.inverse();
	GC.norm_mtx2 = GC.norm_mtx2.transpose();

	var pnormal2 = gl.getUniformLocation(GC.shaderProgram2, "norm_mtx");
	gl.uniformMatrix4fv(pnormal2, false, new Float32Array(GC.norm_mtx2.flatten()));
	
	gl.uniform4fv(GC.fogColorLocation2, fogColor);
	gl.uniform1f(GC.fogAmountLocation2, settings.fogAmount3);

	//pass the vertex buffer to the shader
	gl.bindBuffer(gl.ARRAY_BUFFER, m1.vertexBuffer);
	gl.vertexAttribPointer(GC.vertexPositionAttribute2, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(GC.vertexPositionAttribute2);

	//pass the barycentric coords to the shader for edge detection
	gl.bindBuffer(gl.ARRAY_BUFFER, GC.barycentricBuffer);
	gl.vertexAttribPointer(GC.barycentricAttribute2, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(GC.barycentricAttribute2);

	gl.bindBuffer(gl.ARRAY_BUFFER, GC.textureCoordBuffer);
	gl.vertexAttribPointer(GC.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(GC.vtextureCoordAttribute);

	gl.bindBuffer(gl.ARRAY_BUFFER, GC.vert_tang);
	gl.vertexAttribPointer(GC.vert_tangPtr, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(GC.vert_tangPtr);

	gl.bindBuffer(gl.ARRAY_BUFFER, GC.vert_bitang);
	gl.vertexAttribPointer(GC.vert_bitangPtr, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(GC.vert_bitangPtr);

	gl.bindBuffer(gl.ARRAY_BUFFER, GC.vert_uv);
	gl.vertexAttribPointer(GC.vert_uvPtr, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(GC.vert_uvPtr);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, GC.tex_norm);
	var uni = gl.getUniformLocation(GC.shaderProgram2, "tex_norm");
	gl.uniform1i(uni, 0);

	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, GC.tex_diffuse);
	uni = gl.getUniformLocation(GC.shaderProgram2, "tex_diffuse");
	gl.uniform1i(uni, 1);

	gl.activeTexture(gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D, GC.tex_depth);
	uni = gl.getUniformLocation(GC.shaderProgram2, "tex_depth");
	gl.uniform1i(uni, 2);

	gl.uniform1i(GC.uSampler, 0);
	
	var scale = 0.01 * 1.0;
	uni = gl.getUniformLocation(GC.shaderProgram2, "depth_scale");
	gl.uniform1f(uni, scale);

	var steps = 1.0;
	uni = gl.getUniformLocation(GC.shaderProgram2, "num_layers");
	gl.uniform1f(uni, steps);

	var show_tex = true;
	uni = gl.getUniformLocation(GC.shaderProgram2, "show_tex");
	gl.uniform1i(uni, show_tex);
	//draw everything
	gl.drawArrays(gl.TRIANGLES,0,m1.indices.length);
	gl.disableVertexAttribArray(GC.vertexPositionAttribute2);
	gl.disableVertexAttribArray(GC.barycentricAttribute2);
	gl.disableVertexAttribArray(GC.vtextureCoordAttribute);
	gl.disableVertexAttribArray(GC.vert_tangPtr);
	gl.disableVertexAttribArray(GC.vert_bitangPtr);
	gl.disableVertexAttribArray(GC.vert_uvPtr);

	
	gl.useProgram(GC.shaderProgram3);
	mvTranslate([(m2.minX+m1.maxX)/2.0,(m2.minY+m2.maxY)/2.0,(m2.minZ+m2.maxZ)/2.0],GC);

	mvMultMatrix(camera.Transform,GC);//multiply by the transformation

	//translate back to original origin
	mvTranslate([-(m2.minX+m2.maxX)/2.0,-(m2.minY+m2.maxY)/2.0,-(m2.minZ+m2.maxZ)/2.0],GC);
	//---------
	
	//passes modelview and projection matrices to the vertex shader
	setMatrixUniforms(GC, GC.shaderProgram3);

	gl.uniform4fv(GC.fogColorLocation3, fogColor);
	gl.uniform1f(GC.fogAmountLocation3, settings.fogAmount);

	//pass the vertex buffer to the shader
	gl.bindBuffer(gl.ARRAY_BUFFER, m2.vertexBuffer);
	gl.vertexAttribPointer(GC.vertexPositionAttribute3, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(GC.vertexPositionAttribute3);

	//pass the barycentric coords to the shader for edge detection
	gl.bindBuffer(gl.ARRAY_BUFFER, GC.barycentricBuffer);
	gl.vertexAttribPointer(GC.barycentricAttribute3, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(GC.barycentricAttribute3);

	gl.bindBuffer(gl.ARRAY_BUFFER, GC.normalBuffer);
	gl.vertexAttribPointer(GC.normalAttribute3, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(GC.normalAttribute3);

	gl.bindBuffer(gl.ARRAY_BUFFER, GC.textureCoordBuffer);
	gl.vertexAttribPointer(GC.textureCoordAttribute2, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(GC.vertexPositionAttribute2);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, GC.cubetex);
	uni = gl.getUniformLocation(GC.shaderProgram3, "uSampler");
	gl.uniform1i(uni, 0);

	//draw everything
	gl.drawArrays(gl.TRIANGLES,0,m1.indices.length);
	gl.disableVertexAttribArray(GC.vertexPositionAttribute3);
	gl.disableVertexAttribArray(GC.barycentricAttribute3);
	gl.disableVertexAttribArray(GC.normalAttribute3);
	gl.disableVertexAttribArray(GC.textureCoordAttribute2);

}

function drawScene(){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	var m = GC.mesh.model

		//setup perspective and lookat matrices
	GC.perspectiveMatrix = makePerspective(45, GC.width/GC.height, 0.1, Math.max(2000.0,m.maxZ));
	var lookAtMatrix = makeLookAt(camera.position[0],camera.position[1],camera.position[2],
			camera.lookAt[0],camera.lookAt[1],camera.lookAt[2],
			0,1,0);

	//set initial camera lookat matrix
	mvLoadIdentity(GC);

	//multiply by our lookAt matrix
	mvMultMatrix(lookAtMatrix,GC);

	//--------- camera rotation matrix multiplicaton
	//translate to origin of model for rotation
	mvTranslate([(m.minX+m.maxX)/2.0,(m.minY+m.maxY)/2.0,(m.minZ+m.maxZ)/2.0],GC);

	mvMultMatrix(camera.Transform,GC);//multiply by the transformation */

	drawModel(m);
	drawModel(m1);
	drawModel(m2);
}
//initialize webgl
demo.prototype.initWebGL = function(){
	gl = null;

	try {
		gl = this.canvas.getContext("experimental-webgl");
	}
	catch(e) {
		//pass through
	}

	// If we don't have a GL context, give up now
	if (!gl) {
		alert("Unable to initialize WebGL. Your browser may not support it.");
	}
}

//compile shader located within a script tag
demo.prototype.getShader = function(id){
	var shaderScript, theSource, currentChild, shader;

	shaderScript = document.getElementById(id);
	if(!shaderScript){
		return null;
	}

	//init the source code variable
	theSource = "";

	//begin reading the shader source from the beginning
	currentChild = shaderScript.firstChild;

	//read the shader source as text
	while(currentChild){
		if(currentChild.nodeType == currentChild.TEXT_NODE){
			theSource += currentChild.textContent;
		}
		currentChild = currentChild.nextSibling;
	}

	//check type of shader to give openGL the correct hint
	if(shaderScript.type == "x-shader/x-fragment"){
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if(shaderScript.type == "x-shader/x-vertex"){
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	//add the shader source code to the created shader object
	gl.shaderSource(shader, theSource);

	//compile the shader
	gl.compileShader(shader);

	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
		console.log("error compiling shaders -- " + gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}


//handle mousedown
demo.prototype.mouseDown = function(event){
	GC.mouseDown = true;

	//update the base rotation so model doesn't jerk around upon new clicks
	camera.LastRot = camera.ThisRot;
	camera.click(event.clientX,event.clientY);

	return false;
}

//handle mouseup
demo.prototype.mouseUp = function(event){
	GC.mouseDown = false;
	return false;
}

//handle mouse movement
demo.prototype.mouseMove = function(event){
	if(GC.mouseDown == true){
		X = event.clientX;
		Y = event.clientY;

		//call camera function for handling mouse movement
		camera.move(X,Y)
		drawModel();
	}
	return false;
}

//handle mouse scroll event
demo.prototype.mouseWheel = function(event){
	camera.zoomScale -= event.wheelDeltaY*0.0005;
	camera.Transform.elements[3][3] = camera.zoomScale;

    drawModel();
	return false;
}


//--------- handle keyboard events
demo.prototype.keyDown = function(e){
	camera.LastRot = camera.ThisRot;
	var center = {x: GC.width/2, y:GC.height/2}; 
	var delta = 8;

	switch(e.keyCode){
		case 37: //Left arrow
			camera.click(center.x, center.y);
			camera.move(center.x - delta, center.y);
			break;
		case 38: //Up arrow
			camera.click(center.x, center.y);
			camera.move(center.x, center.y - delta);
			break;
		case 39: //Right arrow
			camera.click(center.x, center.y);
			camera.move(center.x + delta, center.y);
			break;
		case 40: //Down arrow
			camera.click(center.x, center.y);
			camera.move(center.x, center.y + delta);
			break;
	}

	//redraw
	drawModel();
}


// --------- handle touch events
demo.prototype.touchDown = function(event){
	GC.mouseDown = true;

	//update the base rotation so model doesn't jerk around upon new clicks
	camera.LastRot = camera.ThisRot;

	//tell the camera where the touch event happened
	camera.click(event.changedTouches[0].pageX,event.changedTouches[0].pageY);

	return false;
}

//handle touchEnd
demo.prototype.touchUp = function(event){
	GC.mouseDown = false;
	return false;
}

//handle touch movement
demo.prototype.touchMove = function(event){
	if(GC.mouseDown == true){
		X = event.changedTouches[0].pageX;
		Y = event.changedTouches[0].pageY;

		//call camera function for handling mouse movement
		camera.move(X,Y)

		drawModel();
	}
	return false;
}
// --------- end handle touch events

$(document).ready(function() {
		
	function rangechange3() {
		var temp = $("#cube3").val();
		$("#val3").remove();
		settings.fogAmount = temp;
		temp = "<span id='val3'>" + temp + "</span>";
		$("#range3").append(temp);
	}
	function rangechange() {
		var temp = $("#cube1").val();
		$("#val1").remove();
		settings.fogAmount2 = temp;
		temp = "<span id='val1'>" + temp + "</span>";
		$("#range1").append(temp);
	}

	function rangechange2() {
		var temp = $("#cube2").val();
		$("#val2").remove();
		settings.fogAmount3 = temp;
		temp = "<span id='val2'>" + temp + "</span>";
		$("#range2").append(temp);
	}

	rangechange();
	rangechange2();
	rangechange3();

	$("#cube1").on('change', rangechange);
	$("#cube2").on('change', rangechange2);
	$("#cube3").on('change', rangechange3);
});
