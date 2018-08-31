
var textureLoadingStarted = false;
var texturesAllReady = false;
var texturesToLoad = [];
var texturesReady = [];

function AddTexture(_texture, _tag)
{
	console.log("AddTexture " + _tag);

	texturesReady[_tag] = _texture;
}

function PrepareLoadTexture(_path, _tag)
{
	texturesToLoad.push(_path);
	texturesToLoad.push(_tag);
}

function LoadTextures()
{
	textureLoadingStarted = true;
	LoadNextTexture();
}

function LoadNextTexture()
{
	if(texturesToLoad.length == 0)
	{
		texturesAllReady = true;
		return;
	}
	
	var path = JSON.parse(JSON.stringify( texturesToLoad[0] ));
	var tag = JSON.parse(JSON.stringify( texturesToLoad[1] ));
	
	
	var texture = gl.createTexture();
	texture.image = new Image();
	texture.image.onload = function () 
	{
		console.log("Texture Loaded " + tag);

		handleLoadedTexture(texture)
		TextureLoaded(texture, tag);
	}

	texture.image.src = path;
	
	texturesToLoad.shift(); // Removes the first element
	texturesToLoad.shift();
}


function TextureLoaded(_texture, _tag)
{
	AddTexture(_texture, _tag);
	LoadNextTexture();
}





	
function handleLoadedTexture(texture) 
{
	
	//unpacking method??
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	
	// bind for use
	gl.bindTexture(gl.TEXTURE_2D, texture);
	
	// settings??
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	
	// textture filtering methods Nearest, liniear mipmapping
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	
	
	
	/* mipmap example
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
	*/
	
	//release binding??
	gl.bindTexture(gl.TEXTURE_2D, null);
}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	