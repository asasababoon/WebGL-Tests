function LoadTexture(data, gameObject) 
{
	gameObject.material.MainTexture = gl.createTexture();
	gameObject.material.MainTexture.image = new Image();
	gameObject.material.MainTexture.image.onload = function () {
		handleLoadedTexture(gameObject.material.MainTexture)
	}

	
	
	gameObject.material.MainTexture.image.src = data;
	// cubeTexture.image.src = "mud.gif";
}
	
function handleLoadedTexture(texture) {
	
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
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	