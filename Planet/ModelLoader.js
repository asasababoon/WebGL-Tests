function Model(_positions, _uvs, _normals)
{	
	this.vertexPositions = _positions;
	this.vertexTextureCoords = _uvs;
	this.vertexNormals = _normals;
	this.totalVertexCount = _positions.length / 3;
}

var modelsAllReady = false;
var modelsToLoad = [];
var modelsReady = [];

function AddModel(_model, _tag)
{
	modelsReady[_tag] = _model;
}

function PrepareLoadModel(_path, _tag)
{
	modelsToLoad.push(_path);
	modelsToLoad.push(_tag);
}

function LoadModels()
{
	LoadNextModel();
}

function LoadNextModel()
{
	if(modelsToLoad.length == 0)
	{
		modelsAllReady = true;
		return;
	}
	
	var path = JSON.parse(JSON.stringify( modelsToLoad[0] ));
	var tag = JSON.parse(JSON.stringify( modelsToLoad[1] ));
	
	var request = new XMLHttpRequest();
	request.open("GET", path);
	request.onreadystatechange = function () 
	{
		if (request.readyState == 4)
		{	
			ModelLoaded(LoadModelDirect(request.responseText), tag);
			//SetGraphics(_gameObject, request.responseText, _textureData, _shaderVertex, _shaderFragment, _vertexDataTypes);
		}
	}
	request.send();
	
	modelsToLoad.shift(); // Removes the first element
	modelsToLoad.shift();
}


function ModelLoaded(_model, _tag)
{
	AddModel(_model, _tag);
	LoadNextModel();
}
	
	
function LoadModelOBJ(_gameObject, _textureData, _shaderVertex, _shaderFragment, _vertexDataTypes) 
{
	var request = new XMLHttpRequest();
	request.open("GET", _gameObject.name);
	request.onreadystatechange = function () {
		if (request.readyState == 4)
		{	
			LoadModelDirect(request.responseText);
			//SetGraphics(_gameObject, request.responseText, _textureData, _shaderVertex, _shaderFragment, _vertexDataTypes);
		}
	}
	request.send();
}


function LoadModelDirect(_data) 
{
	var lines = (_data + '').split("\n");
	var vertexCount = 0;
	
	var vertexPositionsRef = [];
	var vertexNormalsRef = [];
	var vertexTextureCoordsRef = [];
	
	var vertexPositions = [];
	var vertexNormals = [];
	var vertexTextureCoords = [];

	 
	for(let i = 0; i < lines.length; ++i)
	{
		var vals = lines[i].replace(/^\s+/, "").split(/\s+/);
		if (vals[0] != "//") 
		{
			if(vals[0] == "v")
			{
				// It is a line describing a vertex; get X, Y and Z first
				vertexPositionsRef.push(parseFloat(vals[1]));
				vertexPositionsRef.push(parseFloat(vals[2]));
				vertexPositionsRef.push(parseFloat(vals[3]));		
			}
			
			if(vals[0] == "vt")
			{	
				// And then the texture coords
				vertexTextureCoordsRef.push(parseFloat(vals[1]));
				vertexTextureCoordsRef.push(parseFloat(vals[2]));				
			}
			
			if(vals[0] == "vn")
			{	
				// And then the normals
				vertexNormalsRef.push(parseFloat(vals[1]));
				vertexNormalsRef.push(parseFloat(vals[2]));
				vertexNormalsRef.push(parseFloat(vals[3]));					
			}
			
			
			if(vals[0] == "f")
			{	
				LoadFaces(replaceAll(lines[i], "/", " ").split(" "),
				vertexPositionsRef, vertexNormalsRef, vertexTextureCoordsRef,
				vertexPositions, vertexTextureCoords, vertexNormals);
			}
		}
	}

	var model = new Model(vertexPositions, vertexTextureCoords, vertexNormals);
	return model;
}

function SetModel(_model, gameObject)
{	
	var cubeVertexPositionBuffer = null;
	var cubeVertexNormalBuffer = null;
	var cubeVertexTextureCoordBuffer = null;
		
	if(gameObject.mesh.dataTypes.requireVPos)
	{
		console.log('hey A');
		//vertexes
		cubeVertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_model.vertexPositions), gl.STATIC_DRAW);
		
		gameObject.mesh.cubeVertexPositionBuffer = cubeVertexPositionBuffer;	
		gameObject.mesh.cubeVertexPositionBuffer.itemSize = 3;
	}
	
	if(gameObject.mesh.dataTypes.requireUVs)
	{
		console.log('hey B');
		//uvs
		cubeVertexTextureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_model.vertexTextureCoords), gl.STATIC_DRAW);
		
		gameObject.mesh.cubeVertexTextureCoordBuffer = cubeVertexTextureCoordBuffer;	
		gameObject.mesh.cubeVertexTextureCoordBuffer.itemSize = 2;			
	}
	
	if(gameObject.mesh.dataTypes.requireNormals)
	{
		console.log('hey C');
		// normals
		cubeVertexNormalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_model.vertexNormals), gl.STATIC_DRAW);
		
		gameObject.mesh.cubeVertexNormalBuffer = cubeVertexNormalBuffer;	
		gameObject.mesh.cubeVertexNormalBuffer.itemSize = 3;
	}
	

	gameObject.mesh.totalVertexCount = _model.totalVertexCount;	
}
	
function LoadFaces(values, 
					vertexPositionsRef, vertexNormalsRef, vertexTextureCoordsRef,
					vertexPositions, vertexTextureCoords, vertexNormals)
{
	if(values.length == 13) // quads with normals
	{
		let valueSpacing = 3;
		
		let slotIndex = 0;
		let slots = [0,1,2];
		for(let s = 0; s < slots.length; s++)
		{
			let index = values[1 + (valueSpacing * slots[s])] -1;
			vertexPositions.push(vertexPositionsRef[index* 3 + 0]);
			vertexPositions.push(vertexPositionsRef[index* 3 + 1]);
			vertexPositions.push(vertexPositionsRef[index* 3 + 2]);
			
			index = values[2 + (valueSpacing * slots[s])] -1;
			vertexTextureCoords.push(vertexTextureCoordsRef[index * 2 + 0]);
			vertexTextureCoords.push(vertexTextureCoordsRef[index * 2 + 1]);
			
			index = values[3 + (valueSpacing * slots[s])] -1;
			vertexNormals.push(vertexNormalsRef[index * 3 + 0]);
			vertexNormals.push(vertexNormalsRef[index * 3 + 1]);
			vertexNormals.push(vertexNormalsRef[index * 3 + 2]);		
		}
		
		slots = [0,2,3];
		for(let s = 0; s < slots.length; s++)
		{
			let index = values[1 + (valueSpacing * slots[s])] -1;
			vertexPositions.push(vertexPositionsRef[index* 3 + 0]);
			vertexPositions.push(vertexPositionsRef[index* 3 + 1]);
			vertexPositions.push(vertexPositionsRef[index* 3 + 2]);
			
			index = values[2 + (valueSpacing * slots[s])] -1;
			vertexTextureCoords.push(vertexTextureCoordsRef[index * 2 + 0]);
			vertexTextureCoords.push(vertexTextureCoordsRef[index * 2 + 1]);
			
			index = values[3 + (valueSpacing * slots[s])] -1;
			vertexNormals.push(vertexNormalsRef[index * 3 + 0]);
			vertexNormals.push(vertexNormalsRef[index * 3 + 1]);
			vertexNormals.push(vertexNormalsRef[index * 3 + 2]);		
		}
	}
	
	
	if(values.length == 10) // has normals
	{
		let valueSpacing = 3;
		for(let v = 1; v < values.length; v += valueSpacing)
		{
			let index = values[v] -1;
			vertexPositions.push(vertexPositionsRef[index* 3 + 0]);
			vertexPositions.push(vertexPositionsRef[index* 3 + 1]);
			vertexPositions.push(vertexPositionsRef[index* 3 + 2]);
		}
		
		for(let vt = 2; vt < values.length; vt += valueSpacing)
		{
			let index = values[vt] -1;
			vertexTextureCoords.push(vertexTextureCoordsRef[index * 2 + 0]);
			vertexTextureCoords.push(vertexTextureCoordsRef[index * 2 + 1]);
		}
		
		for(let vn = 3; vn < values.length; vn += valueSpacing)
		{
			let index = values[vn] -1;
			vertexNormals.push(vertexNormalsRef[index * 3 + 0]);
			vertexNormals.push(vertexNormalsRef[index * 3 + 1]);
			vertexNormals.push(vertexNormalsRef[index * 3 + 2]);
		}
	}

	if(values.length == 7) // no normals
	{
		let valueSpacing = 2;
		for(let v = 1; v < values.length; v += valueSpacing)
		{
			let index = values[v] -1;
			vertexPositions.push(vertexPositionsRef[index* 3 + 0]);
			vertexPositions.push(vertexPositionsRef[index* 3 + 1]);
			vertexPositions.push(vertexPositionsRef[index* 3 + 2]);
		}
		
		for(let vt = 2; vt < values.length; vt += valueSpacing)
		{
			let index = values[vt] -1;
			vertexTextureCoords.push(vertexTextureCoordsRef[index * 2 + 0]);
			vertexTextureCoords.push(vertexTextureCoordsRef[index * 2 + 1]);
		}
	}
	
}
	
	
	
	