
/*****
/*
/* Beispielprogramm für die Lehrveranstaltung Computergraphik
/* HS RheinMain
/* Prof. Dr. Ralf Dörner
/*
/* basierend auf einem Programm von Edward Angel
/* http://www.cs.unm.edu/~angel/WebGL/
/*
/****/


/***   Deklaration globaler Variablen */

//eigene variablen
var running = true;
var prevAxis = 0;
var fps = 0;
var fps_pre = 2;

// Referenz auf Bereich, in den gezeichnet wird
var canvas;

// Referenz auf WebGL-Kontext, über die OpenGL Befehle ausgeführt werden
var gl;

// Referenz auf die Shaderprogramme
var program;

// Matrix für die Umrechnung Objektkoordinaten -> Weltkoordinaten
var model;

// Matrix für die Umrechnung Weltkoordinaten -> Kamerakoordinaten
var view; 

// Matrix für die Umrechnung Kamerakoordinaten -> Clippingkoordinaten
var projection;

// Matrix für die Umrechnung von Normalen aus Objektkoordinaten -> Viewkoordinaten
var normalMat;

// Flag, das angibt, ob eine Beleuchtungsrechnung durchgeführt wird (true)
// oder ob einfach die übergebenen Eckpunktfarben übernommen werden (false)
var lighting = true;

// Anzahl der Eckpunkte der zu zeichenden Objekte 
var numVertices  = 0;

// Array, in dem die Koordinaten der Eckpunkte der zu zeichnenden Objekte eingetragen werden
var vertices = [];

// Array, in dem die Farben der Eckpunkte der zu zeichnenden Objekte eingetragen werden
var vertices = [];

// Array, in dem die Eckpunktkoordinaten der zu zeichnenden Objekte eingetragen werden
var pointsArray = [];

// Array, in dem die Normale je Eckpunkt der zu zeichnenden Objekte eingetragen werden
var normalsArray = [];

// Array, in dem die Farbwerte je Eckpunkt der zu zeichnenden Objekte eingetragen werden
var colorsArray = [];

// Variablen für die Drehung des Würfels
var axis = 0;
var theta =[0, 0, 0];

// Variablen, um die Anzahl der Frames pro Sekunde zu ermitteln
var then = Date.now() / 1000;
var counter = 0;

// OpenGL-Speicherobjekt f�r Farben
var nBuffer;

// OpenGL-Speicherobjekt f�r Vertices
var vBuffer;

// OpenGL-Speicherobjekt f�r Normalen
var nBuffer;

/*** Hilfsfunktionen zum Zeichnen von Objekten */
var ambientIntensity = 0.0;
var shininess = 100;
//
// Funktion, die ein Quadrat in das pointsArray, colorsArray und normalsArray einträgt
// Das Quadrat wird dabei in zwei Dreiecke trianguliert, da OpenGL keine Vierecke 
// nativ zeichnen kann.
//
// Übergeben werden für Indices auf die vier Eckpunkte des Vierecks
//
// Variablen für die Drehung des Würfels
var axis = 0;
var theta = [0, 0, 0];
var cubeZ = 0.0;
var isRotating = false;
// Teekanne
var teapotNormalData = [];
var teapotVertexData = [];
var teapotIndexData = [];
var teapotVertexIndexBuffer;

function triangle(a, b, c) {
    var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[a]);
     var normal = cross(t1, t2);
     normal = vec3(normal);

     pointsArray.push(vertices[a]); 
     normalsArray.push(normal);
	   colorsArray.push(colors[a]);
    
     pointsArray.push(vertices[b]); 
     normalsArray.push(normal);
	   colorsArray.push(colors[a]);
    
     pointsArray.push(vertices[c]); 
     normalsArray.push(normal);
	   colorsArray.push(colors[a]);

       numVertices += 3;

}



function quad(a, b, c, d) {

     // zunächst wird die Normale des Vierecks berechnet. t1 ist der Vektor von Eckpunkt a zu Eckpunkt b
     // t2 ist der Vektor von Eckpunkt von Eckpunkt a zu Eckpunkt c. Die Normale ist dann das 
     // Kreuzprodukt von t1 und t2
     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[a]);
     var normal = cross(t1, t2);
     normal = vec3(normal);

     // und hier kommt die Eintragung der Infos für jeden Eckpunkt (Koordinaten, Normale, Farbe) in die globalen Arrays
     // allen Eckpunkten wird die gleiche Farbe zugeordnet, dabei 
    
     // erstes Dreieck
     pointsArray.push(vertices[a]); 
     normalsArray.push(normal);
	   colorsArray.push(colors[a]);
    
     pointsArray.push(vertices[b]); 
     normalsArray.push(normal);
	   colorsArray.push(colors[a]);
    
     pointsArray.push(vertices[c]); 
     normalsArray.push(normal);
	   colorsArray.push(colors[a]);
     
     // zweites Dreieck
     pointsArray.push(vertices[a]);  
     normalsArray.push(normal); 
	   colorsArray.push(colors[a]);
     
     pointsArray.push(vertices[c]); 
     normalsArray.push(normal); 
	   colorsArray.push(colors[a]);
     
     pointsArray.push(vertices[d]); 
     normalsArray.push(normal);
	   colorsArray.push(colors[a]);
	
     // durch die beiden Dreiecke wurden 6 Eckpunkte in die Array eingetragen
     numVertices += 6;    
}


//
// Funktion, die einen Würfel zeichnet (Mittelpunkt liegt im Ursprung, Kantenlänge beträgt 1)
//


function drawPyramid() {
    vertices = [
        vec4(2.0, 0.0, 1.0, 1.0),
        vec4(2.0, 0.0, -1.0, 1.0),
        vec4(-2.0, 0.0, -1.0, 1.0),
        vec4(-2.0, 0.0, 1.0, 1.0),
        vec4(0.0, 4.0, 0.0, 1.0)
    ]

    colors = [
        vec4(1.0, 0.0, 0.0, 1.0),
        vec4(1.0, 1.0, 0.0, 1.0),
        vec4(0.0, 1.0, 0.0, 1.0),
        vec4(0.0, 1.0, 1.0, 1.0),
        vec4(0.0, 0.0, 1.0, 1.0)
    ]

    quad(3, 2, 1, 0);
    triangle(0, 1, 4);
    triangle(1, 2, 4);
    triangle(2, 3, 4);
    triangle(3, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

    var cPosition = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(cPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(cPosition);
}


function drawCube()
{

    // zunächst werden die Koordinaten der 8 Eckpunkte des Würfels definiert
    vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ), // 0
        vec4( -0.5,  0.5,  0.5, 1.0 ), // 1
        vec4( 0.5,  0.5,  0.5, 1.0 ),  // 2 
        vec4( 0.5, -0.5,  0.5, 1.0 ),  // 3
        vec4( -0.5, -0.5, -0.5, 1.0 ), // 4
        vec4( -0.5,  0.5, -0.5, 1.0 ), // 5
        vec4( 0.5,  0.5, -0.5, 1.0 ),  // 6
        vec4( 0.5, -0.5, -0.5, 1.0 )   // 7
    ];

    // hier werden verschiedene Farben definiert (je eine pro Eckpunkt)
    colors = [
        vec4(1.0, 0.0, 0.0, 1.0),
        vec4(1.0, 0.0, 0.0, 1.0),
        vec4(1.0, 0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 0.0, 1.0),
        vec4(1.0, 0.0, 0.0, 1.0),
        vec4(1.0, 0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 0.0, 1.0)
    ];

    // und hier werden die Daten der 6 Seiten des Würfels in die globalen Arrays eingetragen
    // jede Würfelseite erhält eine andere Farbe
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
    
    
    // die eingetragenen Werte werden an den Shader übergeben
    
        gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
	  gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    
    var cPosition = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(cPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(cPosition);
    
}


/*** Funktionen zum Aufbau der Szene */

//
// Funktion zum setzen der inneren und äußeren Parameter der Kamera
//

function setCamera()
{
  
    // es wird ermittelt, welches Element aus der Kameraauswahlliste aktiv ist
    var camIndex = document.getElementById("Cameralist").selectedIndex;

    // Punkt, an dem die Kamera steht  
	  var eye;
  
    // Punkt, auf den die Kamera schaut
    var vrp;
  
    // Vektor, der nach oben zeigt  
    var upv;
	
    switch (camIndex) {
        case 0:
            eye = vec3(12.0, 12.0, 4.0);
            vrp = vec3(0.0, 0.0, 0.0);
            upv = vec3(0.0, 1.0, 0.0);
            break;
        case 1:
            eye = vec3(10.0, 0.0, 0.0);
            vrp = vec3(0.0, 0.0, 0.0);
            upv = vec3(0.0, 1.0, 0.0);
            break;
        case 2:
            eye = vec3(0.0, 10.0, 0.0);
            vrp = vec3(0.0, 0.0, 0.0);
            upv = vec3(0.0, 0.0, 1.0);
            break;
        case 3:
            eye = vec3(0.0, 0.0, 10.0);
            vrp = vec3(0.0, 0.0, 0.0);
            upv = vec3(0.0, 1.0, 0.0);
            break;
        case 4:
            eye = vec3(12.0, 12.0, 4.0);
            vrp = vec3(0.0, 4.0, 0.0);
            upv = vec3(0.0, 1.0, 0.0);
            break;
        default: ;
    }

    // hier wird die Viewmatrix unter Verwendung einer Hilfsfunktion berechnet,
    // die in einem externen Javascript (MV.js) definiert wird
    view = lookAt(eye, vrp, upv);  
    
    // die errechnete Viewmatrix wird an die Shader übergeben
    // die Funktion flatten löst dabei die eigentlichen Daten aus dem Javascript-Array-Objekt
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "viewMatrix"), false, flatten(view) );

    // nachdem die inneren Parameter gesetzt wurden, werden nun die äußeren Parameter gesetzt
    // dazu wird die Projektionmatrix mit einer Hilfsfunktion aus einem externen Javascript (MV.js)
    // definiert
    // der Field-of-View wird auf 60° gesetzt, das Seitenverhältnis ist 1:1 (d.h. das Bild ist quadratisch),
    // die near-Plane hat den Abstand 0.01 von der Kamera und die far-Plane den Abstand 100
    projection = perspective(60.0, 1.0, 0.01, 100.0);
    
    // die errechnete Viewmatrix wird an die Shader übergeben
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projection));
    
}


//
// die Funktion spezifiziert die Lichtquellen, führt schon einen Teil der Beleuchtungsrechnung durch
// und übergibt die Werte an den Shader
// 
// der Parameter materialDiffuse ist ein vec4 und gibt die Materialfarbe für die diffuse Reflektion an
//

function calculateLights(materialDiffuse, specularColor) {
    // zunächst werden die Lichtquellen spezifiziert (bei uns gibt es eine Punktlichtquelle)

    // die Position der Lichtquelle (in Weltkoordinaten)
    var lightPosition = vec4(7.0, 7.0, 3.5, 1.0);
    // die Farbe der Lichtquelle im diffusen Licht
    var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);

    // dann wird schon ein Teil der Beleuchtungsrechnung ausgeführt - das könnte man auch im Shader machen
    // aber dort würde diese Rechnung für jeden Eckpunkt (unnötigerweise) wiederholt werden. Hier rechnen wir
    // das Produkt aus lightDiffuse und materialDiffuse einmal aus und übergeben das Resultat. Zur Multiplikation
    // der beiden Vektoren nutzen wir die Funktion mult aus einem externen Javascript (MV.js)
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);

    //var ambientProduct = mult(scale(ambientIntensity, lightDiffuse), materialDiffuse);
    var ambientProduct = scale(ambientIntensity, lightDiffuse);

    // SpecularColor
    var specularProduct = mult(lightDiffuse, specularColor);
    // die Werte für die Beleuchtungsrechnung werden an die Shader übergeben

    // Übergabe der Position der Lichtquelle
    // flatten ist eine Hilfsfunktion, welche die Daten aus dem Javascript - Objekt herauslöst
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));

    // Übergabe des diffuseProduct, ambientProduct, specualrProduct und shininess
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), shininess);

    /*if (hasTexture) {
        drawTexture(2);
    }
    gl.uniform1i(gl.getUniformLocation(program, "hasTexture"), hasTexture);
   * /
    /**GL 4
     * 
     * e) Umso kleiner die Shininesss, desto stärker wird die specularColor
     * 
     * f) Die Objekte sind deutlich weißer
     * 
     */

}
function displayCube() {
    //
    // Zeichnen des ersten Objekts (Würfel)

    // zunächst werden die Daten für die globalen Arrays gelöscht
    // dies ist auch schon beim ersten Objekt zu tun, denn aus den
    // Berechnungen eines früheren Frames könnten hier schon Werte in den Arrays stehen
    // auch die Anzahl der Eckpunkte des zu zeichnenden Objekts wird auf 0 zurückgesetzt

    numVertices = 0;
    pointsArray.length = 0;
    colorsArray.length = 0;
    normalsArray.length = 0;

    // jetzt werden die Arrays mit der entsprechenden Zeichenfunktion mit Daten gefüllt
    drawCube();

    // es wird festgelegt, ob eine Beleuchtungsrechnung für das Objekt durchgeführt wird oder nicht
    var lighting = false; // Beleuchtungsrechnung wird NICHT durchgeführt

    // die Information über die Beleuchtungsrechnung wird an die Shader weitergegeben
    gl.uniform1i(gl.getUniformLocation(program, "lighting"), lighting);

    if (lighting) {
        // es soll also eine Beleuchtungsrechnung durchgeführt werden

        // die Materialfarbe für diffuse Reflektion wird spezifiziert
        var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
        // die Beleuchtung wird durchgeführt und das Ergebnis an den Shader übergeben
        calculateLights(materialDiffuse);

    } else {

        // es gibt keine Beleuchtungsrechnung, die vordefinierten Farben wurden bereits
        // in der Draw-Funktion übergeben
        ;

    };


    // es muss noch festgelegt werden, wo das Objekt sich in Weltkoordinaten befindet,
    // d.h. die Model-Matrix muss errechnet werden. Dazu werden wieder Hilfsfunktionen
    // für die Matrizenrechnung aus dem externen Javascript MV.js verwendet

    // Initialisierung mit der Einheitsmatrix 
    model = mat4();

    // Das Objekt wird am Ende noch um die x-Achse rotiert 
    model = mult(model, rotate(theta[0], [1, 0, 0]));

    // Zuvor wird das Objekt um die y-Achse rotiert
    model = mult(model, rotate(theta[1], [0, 1, 0]));

    // Als erstes wird das Objekt um die z-Achse rotiert 
    model = mult(model, rotate(theta[2], [0, 0, 1]));

    // Translation aus dem Ursprung
    model = mult(model, translate(5, 0, 1));

    // Rotation um eigene z-Achse
    model = mult(model, rotate(cubeZ, [0, 0, 1]));

    // die Model-Matrix ist fertig berechnet und wird an die Shader übergeben 
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelMatrix"), false, flatten(model));

    // jetzt wird noch die Matrix errechnet, welche die Normalen transformiert
    normalMat = mat4();
    normalMat = mult(view, model);
    normalMat = inverse(normalMat);
    normalMat = transpose(normalMat);

    // die Normal-Matrix ist fertig berechnet und wird an die Shader übergeben 
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "normalMatrix"), false, flatten(normalMat));

    // schließlich wird alles gezeichnet. Dabei wird der Vertex-Shader numVertices mal aufgerufen
    // und dabei die jeweiligen attribute - Variablen für jeden einzelnen Vertex gesetzt
    // außerdem wird OpenGL mitgeteilt, dass immer drei Vertices zu einem Dreieck im Rasterisierungsschritt
    // zusammengesetzt werden sollen
    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function displayCube2() {
    numVertices = 0;
    pointsArray.length = 0;
    colorsArray.length = 0;
    normalsArray.length = 0;

    drawCube();

    var lighting = true; // Beleuchtungsrechnung wird durchgeführt
    gl.uniform1i(gl.getUniformLocation(program, "lighting"), lighting);

    if (lighting) {
        var materialDiffuse = vec4(0.0, 1.0, 0.0, 1.0);
        var specularColor = vec4(1.0, 1.0, 1.0, 1.0);

        calculateLights(materialDiffuse, specularColor, true);

    }

    // Transformationen
    model = mat4();

    model = mult(model, rotate(theta[0], [1, 0, 0]));
    model = mult(model, rotate(theta[1], [0, 1, 0]));
    model = mult(model, rotate(theta[2], [0, 0, 1]));

    model = mult(model, translate(5, 0, -3));
    model = mult(model, rotate(cubeZ * 2, [1, 0, 0]));
    model = mult(model, scalem(2, 2, 2));

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelMatrix"), false, flatten(model));

    // jetzt wird noch die Matrix errechnet, welche die Normalen transformiert
    normalMat = mat4();
    normalMat = mult(view, model);
    normalMat = inverse(normalMat);
    normalMat = transpose(normalMat);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "normalMatrix"), false, flatten(normalMat));
    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function displayPyramid() {
    numVertices = 0;
    pointsArray.length = 0;
    colorsArray.length = 0;
    normalsArray.length = 0;

    drawPyramid();

    var lighting = true; // Beleuchtungsrechnung wird durchgeführt
    gl.uniform1i(gl.getUniformLocation(program, "lighting"), lighting);

    if (lighting) {
        var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
        var specularColor = vec4(1.0, 1.0, 1.0, 1.0);

        calculateLights(materialDiffuse, specularColor);
    }

    // Transformationen
    model = mat4();

    model = mult(model, rotate(theta[0], [1, 0, 0]));
    model = mult(model, rotate(theta[1], [0, 1, 0]));
    model = mult(model, rotate(theta[2], [0, 0, 1]));

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelMatrix"), false, flatten(model));

    // jetzt wird noch die Matrix errechnet, welche die Normalen transformiert
    normalMat = mat4();
    normalMat = mult(view, model);
    normalMat = inverse(normalMat);
    normalMat = transpose(normalMat);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "normalMatrix"), false, flatten(normalMat));
    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function displayPyramid2() {
    numVertices = 0;
    pointsArray.length = 0;
    colorsArray.length = 0;
    normalsArray.length = 0;

    drawPyramid();

    var lighting = true; // Beleuchtungsrechnung wird durchgeführt
    gl.uniform1i(gl.getUniformLocation(program, "lighting"), lighting);

    if (lighting) {
        var materialDiffuse = vec4(1.0, 0.0, 0.0, 1.0);
        var specularColor = vec4(1.0, 1.0, 1.0, 1.0);

        calculateLights(materialDiffuse, specularColor);

    }

    // Transformationen
    model = mat4();

    model = mult(model, rotate(theta[0], [1, 0, 0]));
    model = mult(model, rotate(theta[1], [0, 1, 0]));
    model = mult(model, rotate(theta[2], [0, 0, 1]));

    model = mult(model, translate(0, 8, 0));
    model = mult(model, rotate(180, [1, 0, 0]));

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelMatrix"), false, flatten(model));

    // jetzt wird noch die Matrix errechnet, welche die Normalen transformiert
    normalMat = mat4();
    normalMat = mult(view, model);
    normalMat = inverse(normalMat);
    normalMat = transpose(normalMat);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "normalMatrix"), false, flatten(normalMat));
    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function displayPyramid3() {
    //
    // Zeichnen des vierten Objekts (pyramide)

    numVertices = 0;
    pointsArray.length = 0;
    colorsArray.length = 0;
    normalsArray.length = 0;

    drawPyramid();

    var lighting = true;
    gl.uniform1i(gl.getUniformLocation(program, "lighting"), lighting);

    if (lighting) {
        var materialDiffuse = vec4(0.0, 0.0, 1.0, 1.0);
        var specularColor = vec4(1.0, 1.0, 1.0, 1.0);

        calculateLights(materialDiffuse, specularColor);
    }

    // Transformationen
    model = mat4();

    model = mult(model, rotate(theta[0], [1, 0, 0]));
    model = mult(model, rotate(theta[1], [0, 1, 0]));
    model = mult(model, rotate(theta[2], [0, 0, 1]));

    model = mult(model, translate(0, 6.4, 0.5));
    model = mult(model, rotate(100, [1, 0, 0]));
    model = mult(model, scalem(0.4, 0.4, 0.4));

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelMatrix"), false, flatten(model));

    // jetzt wird noch die Matrix errechnet, welche die Normalen transformiert
    normalMat = mat4();
    normalMat = mult(view, model);
    normalMat = inverse(normalMat);
    normalMat = transpose(normalMat);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "normalMatrix"), false, flatten(normalMat));

    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}
/**
 * 
 * @param {number} i Faktor für die Skalierung der Textur
 */
 function drawTexture(i) {
    var tcPosition = gl.getAttribLocation(program, "vTexCoord");
    gl.bindBuffer(gl.ARRAY_BUFFER, tcBuffer);
    gl.enableVertexAttribArray(tcPosition);
    gl.vertexAttribPointer(tcPosition, 2, gl.FLOAT, false, 0, 0);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            0, 0,
            0, i,
            i, i,
            0, 0,
            i, i,
            i, 0,
            0, 0,
            0, i,
            i, i,
            0, 0,
            i, i,
            i, 0,
            0, 0,
            0, i,
            i, i,
            0, 0,
            i, i,
            i, 0,
            0, 0,
            0, i,
            i, i,
            0, 0,
            i, i,
            i, 0,
            0, 0,
            0, i,
            i, i,
            0, 0,
            i, i,
            i, 0,
            0, 0,
            0, i,
            i, i,
            0, 0,
            i, i,
            i, 0
        ]),
        gl.STATIC_DRAW
    );
}

function drawTeapot() {
    var teapotVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotNormalData), gl.STATIC_DRAW);
    teapotVertexNormalBuffer.itemSize = 3;
    teapotVertexNormalBuffer.numItems = teapotNormalData.length / 3;

    var teapotVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotVertexData), gl.STATIC_DRAW);
    teapotVertexPositionBuffer.itemSize = 3;
    teapotVertexPositionBuffer.numItems = teapotVertexData.length / 3;

    teapotVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(teapotIndexData), gl.STATIC_DRAW);
    teapotVertexIndexBuffer.itemSize = 1;
    teapotVertexIndexBuffer.numItems = teapotIndexData.length;

    gl.enableVertexAttribArray(gl.getAttribLocation(program, "vPosition"));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "vNormal"));


    gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexPositionBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), teapotVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexNormalBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(program, "vNormal"), teapotVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotVertexIndexBuffer);

    gl.disableVertexAttribArray(gl.getAttribLocation(program, "vColor"));
    gl.disableVertexAttribArray(gl.getAttribLocation(program, "vTexCoord"));
}
function displayTeapot() {
    numVertices = 0;
    pointsArray.length = 0;
    colorsArray.length = 0;
    normalsArray.length = 0;

    gl.uniform1i(gl.getUniformLocation(program, "cartoonObj"), true);

    drawTeapot();

    var lighting = true;
    gl.uniform1i(gl.getUniformLocation(program, "lighting"), lighting);

    if (lighting) {

        var materialDiffuse = vec4(0.0, 0.0, 1.0, 1.0);
        var specularColor = vec4(1.0, 1.0, 1.0, 1.0);

        calculateLights(materialDiffuse, specularColor);

    }

    //Transformationen
    model = mat4();

    model = mult(model, rotate(theta[0], [1, 0, 0]));
    model = mult(model, rotate(theta[1], [0, 1, 0]));
    model = mult(model, rotate(theta[2], [0, 0, 1]));

    model = mult(model, translate(-5, 0, 6));
    model = mult(model, rotate(cubeZ, [0, 1, 0]));
    model = mult(model, scalem(0.3, 0.3, 0.3));

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelMatrix"), false, flatten(model));

    normalMat = mat4();
    normalMat = mult(view, model);
    normalMat = inverse(normalMat);
    normalMat = transpose(normalMat);

    gl.uniformMatrix4fv( gl.getUniformLocation(program, "normalMatrix"), false, flatten(normalMat) );

    gl.drawElements(gl.TRIANGLES, teapotVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    gl.uniform1i(gl.getUniformLocation(program, "cartoonObj"), false);
}

function displayScene() {


    //
    // Die Kamera für das Bild wird gesetzt

    // View-Matrix und Projection-Matrix zur Kamera berechnen
    setCamera();

    displayCube();
    displayCube2();
    displayPyramid();
    displayPyramid2();
    displayPyramid3();
    displayTeapot();
} 

function loadTexture() {
    var texture = gl.createTexture();
    var image = document.getElementById("texImage");
    //init
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

function loadTeapot() {
    var request = new XMLHttpRequest();

    request.open("GET", "Teapot.json");

    request.overrideMimeType("application/json");

    request.onreadystatechange = function () {

        if (request.readyState == 4) {

            var teapotData = JSON.parse(request.responseText);

            var i = 0;

            while (i < teapotData.vertexNormals.length) {
                teapotNormalData.push(teapotData.vertexNormals[i]);
                i++;
            }

            i = 0;

            while (i < teapotData.vertexPositions.length) {
                teapotVertexData.push(teapotData.vertexPositions[i]);
                i++;
            }

            i = 0;

            while (i < teapotData.indices.length) {
                teapotIndexData.push(teapotData.indices[i]);
                i++;
            }
        }
    }
    request.send();
}

//
// hier wird eine namenslose Funktion definiert, die durch die Variable render zugegriffen werden kann.
// diese Funktion wird für jeden Frame aufgerufen

/*** Funktionen zur Ausführung von WebGL  */


//
// Diese Funktion wird beim Laden der HTML-Seite ausgeführt. Sie ist so etwas wie die "main"-Funktion
// Ziel ist es, WebGL zu initialisieren
//
var render = function(){
    
    

    counter += 1;
    
    fps = counter/fps_pre;
    //console.log(fps);
    
    if(Date.now() - then >= fps_pre*1000){
        document.getElementById("fps").innerHTML = fps;
        counter =0;
        then=Date.now();
    }
    
    // den Framebuffer (hier wird das Bild hineingeschrieben) und den z-Buffer (wird für Verdeckungsrechnung    benötigt)
    // initialisieren.
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    
    // Durchführung der Animation: der Würfel wird um 2° weiter gedreht und zwar um die aktuell ausgewählte Achse
    theta[axis] += 2.0;
            
    // jetzt kann die Szene gezeichnet werden
    displayScene();
        
    // der Frame fertig gezeichnet ist, wird veranlasst, dass der nächste Frame gezeichnet wird. Dazu wird wieder
    // die die Funktion aufgerufen, welche durch die Variable render spezifiziert wird    
   	
    requestAnimFrame(render);    
    

}
window.onload = function init() {
    
    // die Referenz auf die Canvas, d.h. den Teil des Browserfensters, in den WebGL zeichnet, 
    // wird ermittelt (über den Bezeichner in der HTML-Seite)
    canvas = document.getElementById( "gl-canvas" );
    
    // über die Canvas kann man sich den WebGL-Kontext ermitteln, über den dann die OpenGL-Befehle
    // ausgeführt werden
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // allgemeine Einstellungen für den Viewport (wo genau das Bild in der Canvas zu sehen ist und
    // wie groß das Bild ist)
    gl.viewport( 0, 0, canvas.width, canvas.height );
  


    // die Hintergrundfarbe wird festgelegt
    gl.clearColor( 0.9, 0.9, 1.0, 1.0 );
    
    // die Verdeckungsrechnung wird eingeschaltet: Objekte, die näher an der Kamera sind verdecken
    // Objekte, die weiter von der Kamera entfernt sind
    gl.enable(gl.DEPTH_TEST);

    // der Vertex-Shader und der Fragment-Shader werden initialisiert
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    
    // die über die Refenz "program" zugänglichen Shader werden aktiviert
    gl.useProgram( program );
    loadTeapot();


	// OpenGL Speicherobjekte anlegen
    vBuffer = gl.createBuffer();
    nBuffer = gl.createBuffer();
    cBuffer = gl.createBuffer();
    
    // die Callbacks für das Anklicken der Buttons wird festgelegt
    // je nachdem, ob man den x-Achsen, y-Achsen oder z-Achsen-Button klickt, hat
    // axis einen anderen Wert
    document.getElementById("ButtonX").onclick = function(){axis = 0;};
    document.getElementById("ButtonY").onclick = function(){axis = 1;};
    document.getElementById("ButtonZ").onclick = function(){axis = 2;};
    document.getElementById("ButtonT").onclick = function(){
            if(running){
                prevAxis = axis;
                axis = -1;
                running = false;
            }else{
                axis = prevAxis;
                running = true;
            }
    };

	// jetzt kann mit dem Rendern der Szene begonnen werden  
    render();
}
