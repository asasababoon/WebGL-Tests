function CreateQuad()
{
	var vertexPositions = [];
	var vertexNormals = [];
	var vertexTextureCoords = [];
	
	AddPoint([-0.5, 0.5, 0], [0, 1.0], [0.0, 0.0, 1],vertexPositions, vertexNormals, vertexTextureCoords);
	AddPoint([0.5, 0.5, 0], [1, 1], [0.0, 0.0, 1], vertexPositions, vertexNormals, vertexTextureCoords);	
	AddPoint([0.5, -0.5, 0], [1, 0], [0.0, 0.0, 1], vertexPositions, vertexNormals, vertexTextureCoords);

	AddPoint([-0.5, 0.5, 0], [0, 1], [0.0, 0.0, 1], vertexPositions, vertexNormals, vertexTextureCoords);
	AddPoint([0.5, -0.5, 0], [1, 0], [0.0, 0.0, 1], vertexPositions, vertexNormals, vertexTextureCoords);	
	AddPoint([-0.5, -0.5, 0], [0, 0], [0.0, 0.0, 1], vertexPositions, vertexNormals, vertexTextureCoords);
	
	var model = new Model(vertexPositions, vertexTextureCoords, vertexNormals);
	return model;
}


function CreateQuadScreen()
{
	var vertexPositions = [];
	var vertexNormals = [];
	var vertexTextureCoords = [];
	
	AddPoint([-1.0, 1.0, 0.0], [0.0, 1.0], [0.0, 0.0, 1.0],vertexPositions, vertexTextureCoords, vertexNormals);
	AddPoint([1.0, 1.0, 0.0], [1.0, 1.0], [0.0, 0.0, 1.0], vertexPositions, vertexTextureCoords, vertexNormals);	
	AddPoint([1.0, -1.0, 0.0], [1.0, 0.0], [0.0, 0.0, 1.0], vertexPositions, vertexTextureCoords, vertexNormals);

	AddPoint([-1.0, 1.0, 0.0], [0.0, 1.0], [0.0, 0.0, 1.0],vertexPositions, vertexTextureCoords, vertexNormals);
	AddPoint([1.0, -1.0, 0.0], [1.0, 0.0], [0.0, 0.0, 1.0], vertexPositions, vertexTextureCoords, vertexNormals);	
	AddPoint([-1.0, -1.0, 0.0], [0.0, 0.0], [0.0, 0.0, 1.0], vertexPositions, vertexTextureCoords, vertexNormals);
	
	var model = new Model(vertexPositions, vertexTextureCoords, vertexNormals);
	return model;
}


function CreateShpere(resolution, radius)
{
	resolution = resolution + 1;
	
	var vertexPositions = [];
	var vertexNormals = [];
	var vertexTextureCoords = [];
	
	var ringsY = resolution;
	var ringsX = resolution;
	
	// top to bottom
	for(var y = 0; y < resolution - 1; y++)
	{
		for(var x = 0; x < resolution - 1; x++)
		{				
			AddPointShpere(x, y, resolution,radius,vertexPositions, vertexTextureCoords, vertexNormals);
			AddPointShpere(x, y+1, resolution,radius, vertexPositions, vertexTextureCoords, vertexNormals);
			AddPointShpere(x+1, y, resolution,radius, vertexPositions, vertexTextureCoords, vertexNormals);
			
			AddPointShpere(x + 1, y, resolution,radius,vertexPositions, vertexTextureCoords, vertexNormals);
			AddPointShpere(x, y + 1, resolution,radius, vertexPositions, vertexTextureCoords, vertexNormals);
			AddPointShpere(x+1, y + 1, resolution,radius, vertexPositions, vertexTextureCoords, vertexNormals);
		}
	}
	
	
	var model = new Model(vertexPositions, vertexTextureCoords, vertexNormals);
	return model;
}

function AddPointShpere(x, y, resolution, radius, vertexPositions, vertexTextureCoords, vertexNormals)
{
	var progressX = x / (resolution - 1);
	var progressY = y / (resolution - 1);
	var progressXRadians = progressX * Math.PI;
	var progressYRadians = progressY * Math.PI;
			
	var posX = Math.cos(progressXRadians * 2) * Math.sin(progressYRadians) * radius;
	var posY = -Math.cos(progressYRadians) * radius;
	var posZ = Math.sin(progressXRadians * 2) * Math.sin(progressYRadians) * radius;
	
	
	vertexPositions.push(posX);
	vertexPositions.push(posY);
	vertexPositions.push(posZ);
	
	var normal = vec3.create([posX, posY, posZ]);
	normal = vec3.normalize(normal);
	vertexNormals.push(normal[0]);
	vertexNormals.push(normal[1]);
	vertexNormals.push(normal[2]);
	
	vertexTextureCoords.push(progressX);
	vertexTextureCoords.push(progressY);
}

function AddPoint(_pos, _uv, _normal, vertexPositions, vertexTextureCoords, vertexNormals)
{
	vertexPositions.push(_pos[0]);
	vertexPositions.push(_pos[1]);
	vertexPositions.push(_pos[2]);
	
	var normal = vec3.create(_normal);
	normal = vec3.normalize(normal);
	vertexNormals.push(normal[0]);
	vertexNormals.push(normal[1]);
	vertexNormals.push(normal[2]);
	
	vertexTextureCoords.push(_uv[0]);
	vertexTextureCoords.push(_uv[1]);
}

function AddPoint_1(_pos, _uv, _normal, _uv1, vertexPositions, vertexTextureCoords, vertexNormals, vertexUVs_1)
{
	AddPoint(_pos, _uv, _normal, vertexPositions, vertexTextureCoords, vertexNormals);
	
	vertexUVs_1.push(_uv1[0]);
	vertexUVs_1.push(_uv1[1]);
}

