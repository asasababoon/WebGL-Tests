function NullCreation(_position, _rotation, _scale)
{
	return Creation(_position, _rotation, _scale, "Empty", null, null, null, null)
}

function Creation(_position, _rotation, _scale, _name, _modelTag, _textureTags, _shaderFragment, _shaderVertex, _vertexDataTypes, _extraUniformsF3, _extraUniformsF1)
{
	this.name= _name;
	this.mesh= [];//= Object
	this.material= [];//= Object
	this.material.textureSettings = [];//= Object
	this.transform = [];//= Object
	
	this.gameLogic = [];//= Object
	
	this.Ready = false;
		
	//console.log(_position[1]);
	
	this.transform.position = _position;	
	this.transform.scale = _scale;
	this.transform.rotation = _rotation;
	
	this.transform.MatrixPos = mat4.create();
	this.transform.MatrixRot = mat4.create();
	this.transform.MatrixScale = mat4.create();
	this.transform.MatrixFull = mat4.create();
	
	mat4.identity(this.transform.MatrixPos);
	mat4.identity(this.transform.MatrixRot);
	mat4.identity(this.transform.MatrixScale);
	mat4.identity(this.transform.MatrixFull);

	mat4.translate(this.transform.MatrixPos, this.transform.position);
	mat4.rotateX(this.transform.MatrixRot, DegToRad(_rotation[0]));
	mat4.rotateY(this.transform.MatrixRot, DegToRad(_rotation[1]));
	mat4.rotateZ(this.transform.MatrixRot, DegToRad(_rotation[2]));
	mat4.scale(this.transform.MatrixScale, this.transform.scale);
	
	this.CalculateFullTransform();
	
	this.transform.Gparent = null;
	this.transform.Gchilds = [];
	
	this.mesh.Tag = _modelTag;

	this.NullObject = (_modelTag == null);
	console.log("gameobject is null Trandform " + this.NullObject);

	
	this.material.textureSettings.Textures = [];
	this.material.textureSettings.Tags = _textureTags;
	
	if(this.NullObject == false)
	{
		this.mesh.dataTypes = [];
		this.mesh.dataTypes.requireVPos = true;
		this.mesh.dataTypes.requireUVs = true;
		this.mesh.dataTypes.requireNormals = false;

		if(_vertexDataTypes != null)
		{
			for(let i =0; i < _vertexDataTypes.length; i++)
			{
				if(_vertexDataTypes[i] == 'vn')
					this.mesh.dataTypes.requireNormals = true;
			}
		}
		
		this.material.shaderVertex = _shaderVertex;
		this.material.shaderFragment = _shaderFragment;
		this.material.shaderProgram = initShaders(this, _extraUniformsF3, _extraUniformsF1);	
	}
	else
	{
		this.Ready = true;
	}
		
	return this;
}

Creation.prototype.AddModel = function(_model)
{
	SetModel(_model, this);
}

Creation.prototype.AddTextures = function(_textures)
{
	this.material.textureSettings.Textures = _textures;
}

Creation.prototype.sayHi = function() 
{
  console.log(this.name + " Says HI");
}

Creation.prototype.RotateY = function()
{
	mat4.rotateY(this.transform.MatrixRot, timeDelta * 0.4);
	this.CalculateFullTransform();
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

Creation.prototype.CalculateFullTransform = function()
{
	mat4.identity(this.transform.MatrixFull);
	mat4.multiply(this.transform.MatrixFull, this.transform.MatrixPos);
	mat4.multiply(this.transform.MatrixFull, this.transform.MatrixRot);
	mat4.multiply(this.transform.MatrixFull, this.transform.MatrixScale);
}




   function initShaders(gameObject, _extraUniformsF3, _extraUniformsF1, _extraUniformsSampler) 
   {		
        var fragmentShader = getShader(gl, gameObject.material.shaderFragment);
        var vertexShader = getShader(gl, gameObject.material.shaderVertex);
        var  shaderProgram = gl.createProgram(); // a WEBGL Program, its holds the vertex + fragmnet shader
		gl.attachShader(shaderProgram, fragmentShader);
        gl.attachShader(shaderProgram, vertexShader);
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
		
		/*
		shaderProgram.uniformsSamplers = [];
		AddUniform(shaderProgram.uniformsSamplers, "uSampler", gl.getUniformLocation(shaderProgram, "uSampler"));
		if(_extraUniformsSampler != null)
		{
			for(var i =0; i < _extraUniformsSampler.length; i++)
			{
				AddUniform(shaderProgram.uniformsSamplers, _extraUniformsSampler[i], gl.getUniformLocation(shaderProgram, _extraUniformsSampler[i]));
			}
		}
		*/
      
		shaderProgram.samplerUniform2 = gl.getUniformLocation(shaderProgram, "uSampler");
		shaderProgram.samplerUniform2 = gl.getUniformLocation(shaderProgram, "uSampler2");
		
		shaderProgram.uniformsF3 = [];
		AddUniform(shaderProgram.uniformsF3, "Ambient", gl.getUniformLocation(shaderProgram, "uAmbientColor"));
		AddUniform(shaderProgram.uniformsF3, "LightPos", gl.getUniformLocation(shaderProgram, "uPointLightingLocation"));
		AddUniform(shaderProgram.uniformsF3, "LightCol", gl.getUniformLocation(shaderProgram, "uPointLightingColor"));
		if(_extraUniformsF3 != null)
		{
			for(var i =0; i < _extraUniformsF3.length; i++)
			{
				AddUniform(shaderProgram.uniformsF3, _extraUniformsF3[i], gl.getUniformLocation(shaderProgram, _extraUniformsF3[i]));
			}
		}
		
		
		shaderProgram.uniformsF1 = [];
		AddUniform(shaderProgram.uniformsF1, "gTime", gl.getUniformLocation(shaderProgram, "gTime"));
		AddUniform(shaderProgram.uniformsF1, "gTime", gl.getUniformLocation(shaderProgram, "gTime2"));
		if(_extraUniformsF1 != null)
		{
			for(var i =0; i < _extraUniformsF1.length; i++)
			{
				console.log("uniform name:" +  _extraUniformsF1[i]);
				AddUniform(shaderProgram.uniformsF1, _extraUniformsF1[i], gl.getUniformLocation(shaderProgram, _extraUniformsF1[i]));
			}
		}
		
		return shaderProgram;
    }
	
function AddUniform(_array, _name, _location) 
{
	var bla = [];
	bla.uName = _name;
	bla.uLocation = _location;
	_array.push(bla);
}
	
function AddUniform_ID(_array, _name, _location, _ID) 
{
	var bla = [];
	bla.uName = _name;
	bla.uLocation = _location;
	_array.push(bla);
}

	
	
	
	
	
	
	
	
	


 