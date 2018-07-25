 var appel = 0.5;

function BLAB()
{
	return banaan;
}	

function NEWhandleLoadedWorld2(data) 
{
	var lines = data.split("\n");
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
				var values = replaceAll(lines[i], "/", " ").split(" ");
				
				if(values.length == 10) // has normals
				{
					let valueSpacing = 3;
					for(let v = 1; v < values.length; v += valueSpacing)
					{
						let index = values[v] -1;
						vertexPositions.push(vertexPositionsRef[index* 3 + 0]);
						vertexPositions.push(vertexPositionsRef[index* 3 + 1]);
						vertexPositions.push(vertexPositionsRef[index* 3 + 2]);
						
						totalVertexCount += 1;
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
						
						totalVertexCount += 1;
					}
					
					for(let vt = 2; vt < values.length; vt += valueSpacing)
					{
						let index = values[vt] -1;
						vertexTextureCoords.push(vertexTextureCoordsRef[index * 2 + 0]);
						vertexTextureCoords.push(vertexTextureCoordsRef[index * 2 + 1]);
					}
				}		
			}
		}
	}
		
	return [vertexPositions, vertexNormals, vertexTextureCoords]
}

function SetModel(data)
{
	//vertexes
	cubeVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data[0]), gl.STATIC_DRAW);
	cubeVertexPositionBuffer.itemSize = 3;
	
	// normals
	cubeVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data[1]), gl.STATIC_DRAW);
	cubeVertexNormalBuffer.itemSize = 3;
	
	//uvs
	cubeVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data[2]), gl.STATIC_DRAW);
	cubeVertexTextureCoordBuffer.itemSize = 2;				
}
	
	
	
	
	
	