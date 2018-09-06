function CreateTrail(length)
{
	var vertexPositions = [];
	var vertexNormals = [];
	var vertexTextureCoords = [];
	
	for(var x = 0; x < length - 1; x++)
	{
		var xProgress = x / (length - 1);
		var xNextProgress = (x + 1) / (length - 1);
		var nextX = x + 1;

		AddPoint([x, -1.0, 0], 		[xProgress, 0.0], 		[0.0, 0.0, 1], vertexPositions, vertexTextureCoords, vertexNormals);
		AddPoint([x, 1.0, 0], 		[xProgress, 1.0], 		[0.0, 0.0, 1], vertexPositions, vertexTextureCoords, vertexNormals);
		AddPoint([nextX, -1.0, 0], 	[xNextProgress, 0.0], 	[0.0, 0.0, 1], vertexPositions, vertexTextureCoords, vertexNormals);
		
		AddPoint([x, 1.0, 0], 		[xProgress, 1.0], 		[0.0, 0.0, 1], vertexPositions, vertexTextureCoords, vertexNormals);
		AddPoint([nextX, 1.0, 0], 	[xNextProgress, 1.0], 	[0.0, 0.0, 1], vertexPositions, vertexTextureCoords, vertexNormals);
		AddPoint([nextX, -1.0, 0], 	[xNextProgress, 0.0], 	[0.0, 0.0, 1], vertexPositions, vertexTextureCoords, vertexNormals);
	}
		
	var model = new Model(vertexPositions, vertexTextureCoords, vertexNormals);
	return model;
}

function CreateTrailsFollowing(length, amount)
{
	var vertexPositions = [];
	var vertexNormals = [];
	var vertexTextureCoords = [];
	var vertexUVs_1 = [];
	
	for(var i=0; i < amount; i++)
	{
		CreateTrailFollowing(length, amount, i, vertexPositions, vertexTextureCoords, vertexNormals, vertexUVs_1);
	}
		
	var model = new Model(vertexPositions, vertexTextureCoords, vertexNormals, vertexUVs_1);
	return model;
}

function CreateTrailFollowing(length, totalAmount, index, vertexPositions, vertexTextureCoords, vertexNormals, vertexUVs_1)
{
	var uv_1PixelOffsetX = 0.5 / length;
	var uv_1PixelOffsetY = 0.5 / totalAmount;
	var y_uv_1 = (index / totalAmount) + uv_1PixelOffsetY;
	
	for(var x = 0; x < length - 1; x++)
	{
		var x_uv_1 = (x / length) + uv_1PixelOffsetX;
		var xNext_uv_1 = ((x + 1) / length) + uv_1PixelOffsetX;
		
		var xProgress = x / (length - 1);
		var xNextProgress = (x + 1) / (length - 1);
		var nextX = x + 1;

		AddPoint_1([x, -1.0, 0], 		[xProgress, 0.0], 		[0.0, 0.0, 1], [x_uv_1, y_uv_1],		vertexPositions, vertexTextureCoords, vertexNormals, vertexUVs_1);
		AddPoint_1([x, 1.0, 0], 		[xProgress, 1.0], 		[0.0, 0.0, 1], [x_uv_1, y_uv_1], 		vertexPositions, vertexTextureCoords, vertexNormals, vertexUVs_1);
		AddPoint_1([nextX, -1.0, 0], 	[xNextProgress, 0.0], 	[0.0, 0.0, 1], [xNext_uv_1, y_uv_1], 	vertexPositions, vertexTextureCoords, vertexNormals, vertexUVs_1);
		
		AddPoint_1([x, 1.0, 0], 		[xProgress, 1.0], 		[0.0, 0.0, 1], [x_uv_1, y_uv_1], 		vertexPositions, vertexTextureCoords, vertexNormals, vertexUVs_1);
		AddPoint_1([nextX, 1.0, 0], 	[xNextProgress, 1.0], 	[0.0, 0.0, 1], [xNext_uv_1, y_uv_1], 	vertexPositions, vertexTextureCoords, vertexNormals, vertexUVs_1);
		AddPoint_1([nextX, -1.0, 0], 	[xNextProgress, 0.0], 	[0.0, 0.0, 1], [xNext_uv_1, y_uv_1], 	vertexPositions, vertexTextureCoords, vertexNormals, vertexUVs_1);
	}
}


