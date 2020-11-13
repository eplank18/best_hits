<?php
?>
<html>
<head>
<meta charset="utf-8">
<title>Emily's Final Project</title>
<link href="index.css" rel="stylesheet">
<!-- include all javascript source files -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script type="text/javascript" src="js/sylvester.js"></script>
<script type="text/javascript" src="js/math.js"></script>
<script type="text/javascript" src="js/glUtils.js"></script>
<script type="text/javascript" src="js/meshLoader.js"></script>
<script type="text/javascript" src="js/arcball.js"></script>
<script type="text/javascript" src="js/demo.js"></script>
<script type="text/javascript" src="js/main.js"></script>
</head>
<body>
<canvas id="glcanvas">canvas not supported</canvas>

<div id="meshSelect-wrapper">
    <span>Select object from this directory (.obj files only)</span>
    <select id="meshSelect">
    <?php //----- php code to create html selection with local files

        $files = glob("*.obj"); //find all .obj files in current directory
        $beginFile = "";
        foreach ($files as $filename) {
            if($filename == end($files)){
                $beginFile = $filename;
                echo "<option selected=\"selected\">$filename</option>";
            } else {
                echo "<option>$filename</option>";
            }
        }
    ?>
    </select>
    <br />
    <span>Or upload a local file here:</span>
    <input type="file" id="files" name="files[]"/> <br><hr>
	Note: New fog values will not take effect until the canvas is nudged. The objects start offscreen, but they're there.<br>
	<div id="range1">
		Choose how much fog cube #1(Toon Shaded) has:
		<input type="range" id="cube1" name="vol" min="0" max="1" step = ".001" value = ".75">
	</div>
	<div id="range2">
		Choose how much fog cube #2(Bump Mapped) has:
		<input type="range" id="cube2" name="vol" min="0" max="1" step = ".001" value = ".25">
	</div>
	<div id="range3">
		Choose how much fog cube #3(Shaded by Normals) has:
		<input type="range" id="cube3" name="vol" min="0" max="1" step = ".001" value = ".5">
	</div>
</div>


<!-- Fragment Shader -->
<script id="FragmentShader1" type="x-shader/x-fragment">
    #ifdef GL_OES_standard_derivatives
        #extension GL_OES_standard_derivatives : enable
    #endif

    precision highp float;
	uniform sampler2D tex_norm;
	uniform sampler2D tex_diffuse;
	uniform sampler2D tex_depth;

	uniform int show_tex;
	uniform float depth_scale;
	uniform float num_layers;

	varying vec2 frag_uv;
	varying vec3 ts_light_pos;
	varying vec3 ts_view_pos;
	varying vec3 ts_frag_pos;
    varying vec3 interpBary;
	varying highp vec2 vTextureCoord;
	uniform vec4 u_fogColor;
	uniform float u_fogAmount;

	uniform sampler2D uSampler;

	vec3 parallax_uv(vec2 uv, vec3 view_dir)
	{
		float layer_depth = 1.0/num_layers;
		float cur_layer_depth = 0.0;
		vec2 delta_uv = view_dir.xy * depth_scale / (view_dir.z * num_layers);
		vec2 cur_uv = uv;

		float depth_from_tex = texture2D(tex_depth, cur_uv).r;

		for(int i = 0; i < 32; i++) {
			cur_layer_depth += layer_depth;
			cur_uv -= delta_uv;
			depth_from_tex = texture2D(tex_depth, cur_uv).r;
			if (depth_from_tex < cur_layer_depth) {
				break;
			}
		}

		vec2 prev_uv = cur_uv + delta_uv;
		float next = depth_from_tex - cur_layer_depth;
		float prev = texture2D(tex_depth, prev_uv).r - cur_layer_depth + layer_depth;
		float weight = next / (next - prev);
		vec2 retval =  mix(cur_uv, prev_uv, weight);
		return vec3(retval, 1.0);
	}

    void main(void){
		vec4 color;
		//highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

		//gl_FragColor = vec4(texelColor.rgb, texelColor.a);
	//	gl_FragColor = vec4(vTextureCoord.rg, 0, 1);
	vec3 light_dir = normalize(ts_light_pos - ts_frag_pos);
	vec3 view_dir = normalize(ts_view_pos - ts_frag_pos);

	vec2 uv = frag_uv;
	
	vec3 albedo = texture2D(tex_diffuse, uv).rgb;
	if (show_tex == 0) { albedo = vec3(1, 1, 1);}
	vec3 ambient = 0.3 * albedo;

	vec3 norm = normalize(texture2D(tex_norm, uv).rgb * 2.0 - 1.0);
	float diffuse = max(dot(light_dir, norm), 0.0);
	color = vec4(diffuse * albedo + ambient, 1.0);
	color = color + (u_fogColor - color) * u_fogAmount;
	gl_FragColor = color;
        }

</script>

<!-- Vertex Shader -->
<script id="VertexShader1" type="x-shader/x-vertex">
    attribute vec3 vPos; //vertex position
    attribute vec3 bary; //barycentric
	attribute vec3 vert_tang;
	attribute vec3 vert_bitang;
	attribute vec2 vert_uv;
	attribute vec2 aTextureCoord;
    varying vec3 interpBary;
    
	varying highp vec2 vTextureCoord;
	varying vec2 frag_uv;
	varying vec3 ts_light_pos;
	varying vec3 ts_view_pos;
	varying vec3 ts_frag_pos;

    uniform mat4 uMVMatrix;//modelviewmatrix
	uniform mat4 model_mtx;
    uniform mat4 uPMatrix;//projectionmatrix
	uniform mat4 norm_mtx;



	mat3 transpose(in mat3 inMatrix)
	{
		vec3 i0 = inMatrix[0];
		vec3 i1 = inMatrix[1];
		vec3 i2 = inMatrix[2];

		mat3 outMatrix = mat3(
		vec3(i0.x, i1.x, i2.x),
		vec3(i0.y, i1.y, i2.y),
		vec3(i0.z, i1.z, i2.z)
		);
		
		return outMatrix;
	}

    void main(void) {
        interpBary = bary;
        gl_Position = uPMatrix * uMVMatrix * vec4(vPos, 1.0)+vec4(0.0, 0.0, 1.0, 1.0);
		ts_frag_pos = vec3(uMVMatrix * vec4(vPos, 1.0));
		vec3 vert_norm = cross(vert_bitang, vert_tang);

		vec3 t = normalize(mat3(norm_mtx) * vert_tang);
		vec3 b = normalize(mat3(norm_mtx) * vert_bitang);
		vec3 n = normalize(mat3(norm_mtx) * vert_norm);
		mat3 tbn = transpose(mat3(t, b, n));

		vec3 light_pos = vec3(1, 2, 0);
		ts_light_pos = tbn * light_pos;
		ts_view_pos = tbn * vec3(0, 0, 0);
		ts_frag_pos = tbn * ts_frag_pos;

		frag_uv = vert_uv;
		vTextureCoord = aTextureCoord;
    }
</script>

<!-- Fragment Shader -->
<script id="FragmentShader2" type="x-shader/x-fragment">
    #ifdef GL_OES_standard_derivatives
        #extension GL_OES_standard_derivatives : enable
    #endif

    precision mediump float;
    varying vec3 interpBary;
	varying vec3 normals;
	varying vec3 lightDir;
	varying vec3 normal;
	uniform vec4 u_fogColor;
	uniform float u_fogAmount;


    void main(void){
		float intensity;
		vec4 color;

		vec3 n = normalize(normal);

		intensity = dot(lightDir, n);
		if(intensity > 0.5)
			color = vec4(1.0, 0.5, 0.5, 1.0);
		else if(intensity > 0.25)
			color = vec4(0.6, 0.3, 0.3, 1.0);
		else 
			color = vec4(0.4, 0.2, 0.2, 1.0);

		color = color + (u_fogColor - color) * u_fogAmount;
		gl_FragColor = color;
    }

</script>

<!-- Vertex Shader -->
<script id="VertexShader2" type="x-shader/x-vertex">
    attribute vec3 vPos; //vertex position
    attribute vec3 bary; //barycentric
	attribute vec3 norm;
    varying vec3 interpBary;
	varying vec3 normals;
	varying vec3 normal;
	varying vec3 lightDir;
    

	const vec3 lightPos = vec3(1.0, 1.0, 1.0);
    uniform mat4 uMVMatrix;//modelviewmatrix
    uniform mat4 uPMatrix;//projectionmatrix
	uniform mat4 normal_mtx;
	vec4 temp;

    void main(void) {
        interpBary = bary;
		normals = norm;
		lightDir = normalize(lightPos);
		temp = normal_mtx * vec4(normals, 1.0);
		normal = vec3(temp[0], temp[1], temp[2]);
        gl_Position = uPMatrix * uMVMatrix * vec4(vPos, 1.0);
    }
</script>

<!-- Fragment Shader -->
<script id="FragmentShader3" type="x-shader/x-fragment">
    #ifdef GL_OES_standard_derivatives
        #extension GL_OES_standard_derivatives : enable
    #endif
	
    precision mediump float;

	varying vec3 interpBary;
	varying vec3 normals;
	varying highp vec2 vTextureCoord;

	uniform sampler2D uSampler;
	uniform vec4 u_fogColor;
	uniform float u_fogAmount;

       void main(void){
	  	   
	   vec4 color = texture2D(uSampler, vTextureCoord);
	   color = vec4(normals, 1.0);
	   color = abs(color);
	   gl_FragColor = color + (u_fogColor - color) * u_fogAmount;
    }

</script>

<!-- Vertex Shader -->
<script id="VertexShader3" type="x-shader/x-vertex">
    attribute vec3 vPos; //vertex position
    attribute vec3 bary; //barycentric
	attribute vec3 norm;
	attribute vec2 aTextureCoord;
    

    uniform mat4 uMVMatrix;//modelviewmatrix
    uniform mat4 uPMatrix;//projectionmatrix
	uniform mat4 normal_mtx;
	varying vec3 interpBary;
	varying vec3 normals;
	varying highp vec2 vTextureCoord;


    void main(void) {
		interpBary = bary;
		normals = norm;
        gl_Position = uPMatrix * uMVMatrix * vec4(vPos, 1.0);
		vTextureCoord = aTextureCoord;
    }
</script>

<script>
    //grab the filename for the .obj we will first open
    var filename = "<? echo $beginFile ?>";

    //register callbacks for mesh loading
    setupLoadingCallbacks();

    //call the main mesh Loading function; main.js
    executeMainLoop(filename); 
</script>

</body>
</html>
