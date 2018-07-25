function DrawGameObject(gameObject, transform, seconds)
{
	gl.useProgram(gameObject.material.shaderProgram);
			
	for(let i =0; i < gameObject.material.uniforms.length; i++)
	{
		gl.uniform3f(
			gameObject.material.shaderProgram.ambientColorUniform,
			uniformsArray[gameObject.material.uniforms[i]][0],
			uniformsArray[gameObject.material.uniforms[i]][1],
			uniformsArray[gameObject.material.uniforms[i]][2]
			);
	}	
		  
	gl.uniform1f(gameObject.material.shaderProgram.time, timePassed);
	

	// bind the array with values to WEBGL	
	//
	// send data to the correct shaderprogram + which attribute, which was bound to a shader attribute earlier
	//using the itemSize property we set on the buffer to tell WebGL that each item in the buffer is three numbers long.
	
	if(gameObject.mesh.dataTypes.requireVPos)
	{
	
		gl.bindBuffer(gl.ARRAY_BUFFER, gameObject.mesh.cubeVertexPositionBuffer);
		gl.vertexAttribPointer(gameObject.material.shaderProgram.vertexPositionAttribute, gameObject.mesh.cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	}
	if(gameObject.mesh.dataTypes.requireUVs)
	{
		
		gl.bindBuffer(gl.ARRAY_BUFFER, gameObject.mesh.cubeVertexTextureCoordBuffer);
		gl.vertexAttribPointer(gameObject.material.shaderProgram.textureCoordAttribute, gameObject.mesh.cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	}
	if(gameObject.mesh.dataTypes.requireNormals)
	{
		gl.bindBuffer(gl.ARRAY_BUFFER, gameObject.mesh.cubeVertexNormalBuffer);
		gl.vertexAttribPointer(gameObject.material.shaderProgram.vertexNormalAttribute, gameObject.mesh.cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
	}
	
	/*
	What’s happening here is somewhat complex. 
	WebGL can deal with up to 32 textures during any given call to 
	functions like gl.drawElements, and they’re numbered from TEXTURE0 to TEXTURE31. 
	What we’re doing is saying in the first two lines that texture zero is the one we loaded earlier,
	and then in the third line we’re passing the value zero up to a shader uniform 
	(which, like the other uniforms that we use for the matrices, 
	we extract from the shader program in initShaders); 
	this tells the shader that we’re using texture zero. 
	*/
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, gameObject.material.MainTexture);
	
	
	// set uniform??	
	gl.uniform1i(gameObject.material.shaderProgram.samplerUniform, 0);

	
	
	mat4.translate(transform, gameObject.transform.position);	
	mat4.scale(transform, gameObject.transform.scale);
	
	
	
	//mat4.rotate(transform, degToRad(gameObject.transform.rotation[0]), [1, 0, 0],);
	//mat4.rotate(transform, degToRad(gameObject.transform.rotation[1]), [0, 1, 0]);
	
	mat4.rotateY(transform, degToRad(gameObject.transform.rotation[1]));
	mat4.rotateX(transform, degToRad(gameObject.transform.rotation[0]));
	mat4.rotateZ(transform, degToRad(gameObject.transform.rotation[2]));
	
	//var angle = anglePerSecond * seconds;
	//mat4.rotate(transform, degToRad(angle), [0.0, -1.0, 0.0]);
	
	setMatrixUniforms(gameObject);
	gl.drawArrays(gl.TRIANGLES, 0, gameObject.mesh.totalVertexCount);
	
	for(let i =0; i < gameObject.transform.Gchilds.length; i++)
	{
		DrawGameObject(gameObject.transform.Gchilds[i],  transform, seconds);
	}
}


function setMatrixUniforms(gameObject)
{
	gl.uniformMatrix4fv(gameObject.material.shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(gameObject.material.shaderProgram.mvMatrixUniform, false, mvMatrix);
	
	var normalMatrix = mat3.create();
	mat4.toInverseMat3(mvMatrix, normalMatrix);
	mat3.transpose(normalMatrix);
	gl.uniformMatrix3fv(gameObject.material.shaderProgram.nMatrixUniform, false, normalMatrix);
}


    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }
	
	
	
	var mvMatrix = mat4.create();
    var mvMatrixStack = [];
    var pMatrix = mat4.create();
    function mvPushMatrix() {
        var copy = mat4.create();
        mat4.set(mvMatrix, copy);
        mvMatrixStack.push(copy);
    }
    function mvPopMatrix() {
        if (mvMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        mvMatrix = mvMatrixStack.pop();
    }


	
	function replaceAll(str, find, replace) 
	{
		return str.replace(new RegExp(find, 'g'), replace);
	}
	
	













