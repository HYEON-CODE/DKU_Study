var canvas;
var gl;

var maxNumTriangles = 200;  
var maxNumVertices  = 3 * maxNumTriangles; //값을 받을 수 있는 개수 설정
var index = 0;
var cIndex = 0; //네모 색상의 대한 값

var colors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];
//onload : 모든 코드가 로드된 후 실행이 시작할 위치 지정한다.
window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    //mymenu을 클릭한 값을 cINdex에 대입한다.
    document.getElementById("mymenu").onclick = function(event){
        cIndex = event.srcElement.value;
    }
    
    //컨버스를 클릭하면 네모가 나온다. 초기 설정값은 검정
    canvas.addEventListener("mousedown", function(event){
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
        var t = vec2(2*event.clientX/canvas.width-1, 
           2*(canvas.height-event.clientY)/canvas.height-1);
        gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t));
        
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        t = vec4(colors[cIndex]);
        gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(t));
        index++;
    } );

    //web GL을 구성한다.
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 0.5, 0.5, 1.0 ); // backgroundColor

    //shader 를 load 하고 버퍼를 초기화한다.
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    //위치에 대한 버퍼 생성
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW );
    
    //shader 변수들에 데이터 버퍼를 연결한다.
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    //색상에 대한 버퍼 생성
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );
    
    //shader 변수들에 데이터 버퍼를 연결한다.
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    render();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, index );

    window.requestAnimFrame(render);
}