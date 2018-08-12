function DrawGameObject(gameObject, transformOriginal, seconds)
{
	//let transform = 4;
	let transform = transformOriginal;// CopyMat4(transformOriginal);
	
	//let transform = Object.assign({}, transformOriginal);
	//let transform = JSON.parse(JSON.stringify(transformOriginal));

	
	//console.log("draw gameObject " + gameObject.name);
	if(gameObject.nullObject == false)
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
	}
	

	
	transform = Translate(gameObject, transform);
	transform = Rotate(gameObject, transform);
	transform = Scale(gameObject, transform);
	//transform = LookAt(gameObject, transform, [4400.0, -4400.0, -4400.0]);
	
	
	if(gameObject.nullObject == false)
	{
		setMatrixUniforms(gameObject);
		gl.drawArrays(gl.TRIANGLES, 0, gameObject.mesh.totalVertexCount);
	}
	for(let i =0; i < gameObject.transform.Gchilds.length; i++)
	{
		DrawGameObject(gameObject.transform.Gchilds[i], transform, seconds);
	}
}

function Translate(gameObject, transform)
{
	var rotationMatrix = mat4.create();
	rotationMatrix[0] = 1;
	rotationMatrix[1] = 0;
	rotationMatrix[2] = 0;
	rotationMatrix[3] = 0;
	
	rotationMatrix[4] = 0;
	rotationMatrix[5] = 1;
	rotationMatrix[6] = 0;
	rotationMatrix[7] = 0;
	
	rotationMatrix[8] = 0;
	rotationMatrix[9] = 0;
	rotationMatrix[10] = 1;
	rotationMatrix[11] = 0;
	
	rotationMatrix[12] = gameObject.transform.position[0];
	rotationMatrix[13] = gameObject.transform.position[1];
	rotationMatrix[14] = gameObject.transform.position[2];
	rotationMatrix[15] = 1;
	return mat4.multiply(transform, rotationMatrix);
}


function Rotate(gameObject, transform)
{
	return mat4.multiply(transform, gameObject.transform.rotationMatrix);
}

function Scale(gameObject, transform)
{
	var rotationMatrix = mat4.create();
	rotationMatrix[0] = gameObject.transform.scale[0];
	rotationMatrix[1] = 0;
	rotationMatrix[2] = 0;
	rotationMatrix[3] = 0;
	
	rotationMatrix[4] = 0;
	rotationMatrix[5] = gameObject.transform.scale[1];
	rotationMatrix[6] = 0;
	rotationMatrix[7] = 0;
	
	rotationMatrix[8] = 0;
	rotationMatrix[9] = 0;
	rotationMatrix[10] = gameObject.transform.scale[2];
	rotationMatrix[11] = 0;
	
	rotationMatrix[12] = 0;
	rotationMatrix[13] = 0;
	rotationMatrix[14] = 0;
	rotationMatrix[15] = 1;
	return mat4.multiply(transform, rotationMatrix);
}

function LookAt(gameObject, transform, target)
{
	var fromPos = gameObject.transform.position;
	//vec3.cross   
	//var forward = vec3.normalize(fromPos - target);
	//var forward = vec3.normalize(vec3.subtract(fromPos,target));
	
	var xDiff  = fromPos[0] - target[0];
	
	var direction = vec3.create();
	direction[0] = fromPos[0] - target[0];
	direction[1] = fromPos[1] - target[1];
	direction[2] = fromPos[2] - target[2];
	
	//console.log(direction[0]);
	//[xDiff, fromPos[1] - target[1], fromPos[2] - target[2]]);
	var forward = vec3.normalize( direction);// [xDiff, fromPos[1] - target[1], fromPos[2] - target[2]]);
	
	
	
	var temp = vec3.create();
	temp[0] = 0;
	temp[1] = 1.0;
	temp[2] = 0.0;
	//console.log(forward[0]);
	var right = vec3.create();
	right = vec3.normalize(vec3.cross(temp, forward));
	//console.log(direction[0]);
	
	var gghh= vec3.create();;
	gghh[0] = forward[0];
	gghh[1] = forward[1];
	gghh[2] = forward[2];
	
	var up = vec3.create();
	up = vec3.normalize(vec3.cross(gghh, right));
	//console.log(forward[0]);
	
	//console.log(up[1]);
	
	var f = vec3.create();
	f[0] = 1.0;
	f[1] = 0.0;
	f[2] = 0.0;
	var bla = vec3.normalize( f );
	
	var rotationMatrix = mat4.create();
	
	
	rotationMatrix[0] = right[0];
	rotationMatrix[1] = right[1];
	rotationMatrix[2] = right[2];
	rotationMatrix[3] = 0;
	
	rotationMatrix[4] = up[0];
	rotationMatrix[5] = up[1];
	rotationMatrix[6] = up[2];
	rotationMatrix[7] = 0;
	
	rotationMatrix[8] = forward[0];
	rotationMatrix[9] = forward[1];
	rotationMatrix[10] = forward[2];
	rotationMatrix[11] =0;
	
	rotationMatrix[12] = fromPos[0];
	rotationMatrix[13] = fromPos[1];
	rotationMatrix[14] = fromPos[2];
	rotationMatrix[15] = 1;
	
	
	/*
	rotationMatrix[0] = right[0];
	rotationMatrix[1] = up[0];
	rotationMatrix[2] = forward[0];
	rotationMatrix[3] = fromPos[0];
	
	rotationMatrix[4] = right[1];
	rotationMatrix[5] = up[1];
	rotationMatrix[6] = forward[1];
	rotationMatrix[7] = fromPos[1];
	
	rotationMatrix[8] = right[2];
	rotationMatrix[9] = up[12];
	rotationMatrix[10] = forward[2];
	rotationMatrix[11] = fromPos[2];
	
	rotationMatrix[12] = 0;
	rotationMatrix[13] = 0;
	rotationMatrix[14] = 0;
	rotationMatrix[15] = 1;
	
	
	
	
	
	*/
	
	//var rotationMatrix = mat4.create();
	//rotationMatrix[0] = 0;
	//rotationMatrix[1] = 0;
	//rotationMatrix[2] = 1;
	//rotationMatrix[3] = 0;
	
	//rotationMatrix[4] = 0;
	//rotationMatrix[5] = 1;
	//rotationMatrix[6] = 0;
	//rotationMatrix[7] = 0;
	
	//rotationMatrix[8] = 1;
	//rotationMatrix[9] = 0;
	//rotationMatrix[10] = 0;
	//rotationMatrix[11] =0;
	
	
	
	
	
	
	//rotationMatrix[12] = 0;
	//rotationMatrix[13] = 0;
	//rotationMatrix[14] = 0;
	//rotationMatrix[15] = 1;
	return mat4.multiply(transform, rotationMatrix);
	
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
	
	function GetRandomVec3()
	{
		var pos = vec3.create();
		pos[0] = (Math.random() - 0.5) * 2;
		pos[1] = 0;// (Math.random() - 0.5) * 2;
		pos[2] = 0;//(Math.random() - 0.5) * 2;
		
		pos = vec3.normalize(pos);
		return pos;
		
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
	
	
	
function CopyMat4(A)
{
	var matrix = mat4.create();
	for(let i =0; i < 16; i++)
		matrix[i] = A[i];
	
	return matrix;
}
	













