function NullCreation(_position, _rotation, _scale)
{
	return Creation(_position, _rotation, _scale, "Empty", null, null, null, null)
}

function Creation(_position, _rotation, _scale, _name, _modelTag, _textureTag, _shaderVertex, _shaderFragment, _vertexDataTypes)
{
	this.name= _name;
	this.mesh= [];//= Object
	this.material= [];//= Object
	this.material.textures = [];//= Object
	this.transform = [];//= Object
	
	this.gameLogic = [];//= Object
	
	this.Ready = false;
		
	//console.log(_position[1]);
	
	this.transform.position = _position;	
	this.transform.scale = _scale;
	this.transform.rotation = _rotation;
	
	this.transform.Matrix = mat4.create();
	mat4.identity(this.transform.Matrix);
	mat4.translate(this.transform.Matrix, this.transform.position);
	mat4.rotateX(this.transform.Matrix, DegToRad(_rotation[0]));
	mat4.rotateY(this.transform.Matrix, DegToRad(_rotation[1]));
	mat4.rotateZ(this.transform.Matrix, DegToRad(_rotation[2]));
	mat4.scale(this.transform.Matrix, this.transform.scale);
	
	this.transform.Gparent = null;
	this.transform.Gchilds = [];
	
	this.mesh.Tag = _modelTag;

	this.NullObject = (_modelTag == null);
	console.log("gameobject is null Trandform " + this.NullObject);

	
	this.material.textures.MainTexture = null;
	this.material.textures.Tag = _textureTag;
	
	if(this.NullObject == false)
	{
		this.mesh.dataTypes = [];
		this.mesh.dataTypes.requireVPos = true;
		this.mesh.dataTypes.requireUVs = true;
		this.mesh.dataTypes.requireNormals = false;

		for(let i =0; i < _vertexDataTypes.length; i++)
		{
			if(_vertexDataTypes[i] == 'vn')
				this.mesh.dataTypes.requireNormals = true;
		}

		this.material.uniforms = ["Ambient", "LightPos", "LightCol"];
		
		this.material.shaderVertex = _shaderVertex;
		this.material.shaderFragment = _shaderFragment;
		this.material.shaderProgram = initShaders(this);
		
		//LoadModelG(this, _textureData, _shaderVertex, _shaderFragment, _vertexDataTypes);
	}
	else
	{
		this.Ready = true;
	}
		
	_gameObjects.push(this);
	return this;
}

Creation.prototype.AddModel = function(_model)
{
	SetModel(_model, this);
}

Creation.prototype.AddTexture = function(_texture)
{
	this.material.textures.MainTexture = _texture;
}

Creation.prototype.sayHi = function() {
  console.log(this.name + " Says HI");
 // this.transform.rotation[1] = timePassed * 45;
  //this.transform.rotation[2] = timePassed * 9;
}

Creation.prototype.RotateY = function()
{
	mat4.rotateY(this.transform.Matrix, timeDelta * 0.4);
}

Creation.prototype.SetParent = function(_gParent)
{
	if(this.transform.Gparent != null)
	{
		this.transform.Gparent.RemoveChild(this);
	}
	
	this.transform.Gparent = _gParent;
	
	if(_gParent != null)
	{
		_gParent.transform.Gchilds.push(this);
	}
}

Creation.prototype.RemoveChild = function(_gChild)
{
	for(let i = this.transform.Gchilds.length -1; i > -1; i--)
	{
		if(this.transform.Gchilds[i] == _gChild)
			this.transform.Gchilds.splice(i, 1);
	}
}

function SetGraphics(_gameObject, _modelData, _textureData, _shaderVertex, _shaderFragment, _vertexDataTypes)
{
	SetModel(LoadModelDirect(_modelData), gameObject);

	LoadTexture(_textureData, _gameObject);
	
	_gameObject.material.shaderVertex = _shaderVertex;
	_gameObject.material.shaderFragment = _shaderFragment;
	_gameObject.material.shaderProgram = initShaders(_gameObject);
	
	_gameObject.mesh.loaded = true;
}


function LoadModelG(_gameObject, _textureData, _shaderVertex, _shaderFragment, _vertexDataTypes) 
{
	var request = new XMLHttpRequest();
	request.open("GET", _gameObject.name);
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			
			SetGraphics(_gameObject, request.responseText, _textureData, _shaderVertex, _shaderFragment, _vertexDataTypes);
		}
	}
	request.send();
}



   function initShaders(gameObject) 
   {		
        var fragmentShader = getShader(gl, gameObject.material.shaderFragment);
        var vertexShader = getShader(gl, gameObject.material.shaderVertex);
        var  shaderProgram = gl.createProgram(); // a WEBGL Program, its holds the vertex + fragmnet shader
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }
		
		//think of WEBGL as a state machine
		// refer to this shaderprogram right now to use / make changes to
        gl.useProgram(shaderProgram);
        
		
		if(gameObject.mesh.dataTypes.requireVPos)
		{
		// hook shader attributes to program, as in Jvascript allows for extra data
		//gl.enableVertexAttribArray to tell WebGL that we will want to provide values for the attribute using an array.
			shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
			gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
        }
		if(gameObject.mesh.dataTypes.requireUVs)
		{
			shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
			gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
		}
		
		if(gameObject.mesh.dataTypes.requireNormals)
		{
			shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
			gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
		}
		
        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
		shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
        shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
		shaderProgram.time = gl.getUniformLocation(shaderProgram, "gTime");
		shaderProgram.time2 = gl.getUniformLocation(shaderProgram, "gTime2");

		shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
        shaderProgram.pointLightingLocationUniform = gl.getUniformLocation(shaderProgram, "uPointLightingLocation");
        shaderProgram.pointLightingColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingColor");
		
		shaderProgram.uniforms = [];
		shaderProgram.uniforms[0] = shaderProgram.ambientColorUniform;
		shaderProgram.uniforms[1] = shaderProgram.pointLightingLocationUniform;
		shaderProgram.uniforms[2] = shaderProgram.pointLightingColorUniform;
		
		return shaderProgram;
    }
	



 