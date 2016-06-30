$(document).ready(function () {
    //var Punto = {"x":null, "y":null, "nombre":null, "notas":null};
    var Puntos = [];
    var Datos = {
        "imagen": null,
        "puntos": Puntos
    };

    $('#datos').hide();

    $('#btn_nuevo').on('click', function(ev){
        $('#start').hide();
        $('#input_add_image').show(200, function(){
            console.log('change');
            document.getElementById('input_add_image').addEventListener('change', handleFileSelect, false);
        });

    });

    $('#btn_importar').on('click', function(ev){
        $('#start').hide();
        $('#importar').show(200, function(){
            //document.getElementById('import').addEventListener('change', handleFileSelect, false);
        });
    });

    $('#btn_ejemplo').on('click', function(ev){
        $('#start').hide();
        //////////////////////////////////////////////////////////////


            //parse from contido and draw
            $.getJSON( "ejemplo.json", function( data ) {
                //console.log(data);
                Puntos = data.puntos;
                Datos.imagen = data.imagen;
                Datos.puntos = Puntos;

                //append map
                $("#current_map").append(['<img id="map" src="', data.imagen, '" title="Ejemplo" style="width:600px;"/>'].join(''));

                //append points
                $.each(data.puntos, function(indice, valor){
                    $("#current_map").append('<img class="point" id="'+valor.x+'point'+valor.y+'" src="image/point.png" style="position:absolute;z-index: 99; top: '+valor.y+'px; left: '+valor.x+'px">');
                });


                $('#export').show();
            });
             
        /////////////////////////////////////////////////////////////
    });
    

    $('.get_coord').on('click', 'img', function (ev) {

        /* comprobamos si esto é un point ou é novo */
        if ($(this)[0].className == "point") {
            /* esto é un point */

            //recollemos coord
            var x = parseInt($(this).css('left'));
            var y = parseInt($(this).css('top'));
            var coord = x + "," + y;
            //console.log('POINT x: ' + x + ', y: ' + y);
            //console.log(Datos.puntos);
            
            $('#datos').show();
            $('#point_input').val(coord);

            //vaciamos
            $("#nombre").val('');
            $("#notas").val('');

            //buscar
            for (var i = 0; i < Datos.puntos.length; i++) {
                if (Datos.puntos[i].x == x && Datos.puntos[i].y == y) {
                    //console.log("existe");
                    $("#nombre").val(Datos.puntos[i].nombre);
                    $("#notas").val(Datos.puntos[i].notas);
                    break;
                } else {
                    //console.log("no existe");
                    encontrado = false;
                }
            }

        } else {
            /* novo */ 
            $('#datos').hide(); //escondense os input            

            var mapwidth = $("#map").width();
            var x = parseInt(ev.offsetX + 2 );
            var y = parseInt(ev.offsetY - 25);

            console.log('NOVO x: ' + x + ', y: ' + y);                        

            /* agregamos un point */
            $("#current_map").append('<img class="point" id="'+x+'point'+y+'" src="image/point.png" style="position:absolute;z-index: 99; top: '+y+'px; left: '+x+'px">')
        }

    });


    /* Almacenando puntos */
    function guardar_punto() {
        var Punto = {
            "x": null,
            "y": null,
            "nombre": null,
            "notas": null
        };

        var coord = $("#point_input").val();
        var x = coord.split(',')[0];
        var y = coord.split(',')[1];
        var nombre = $("#nombre").val();
        var notas = $("#notas").val();

        Punto.x = x;
        Punto.y = y;
        Punto.nombre = nombre;
        Punto.notas = notas;

        if (Datos.puntos.length == 0) {
            Datos.puntos.push(Punto);
        } else {
            //buscar
            var encontrado = false;
            var posicion;
            for (var i = 0; i < Datos.puntos.length; i++) {
                if (Datos.puntos[i].x == x && Datos.puntos[i].y == y) {
                    //console.log("existe");
                    encontrado = true;
                    posicion = i;
                    break;
                } else {
                    //console.log("no existe");
                    encontrado = false;
                }
            }

            if (encontrado == true) {
                //console.log("update");
                var x = coord.split(',')[0];
                var y = coord.split(',')[1];
                var nombre = $("#nombre").val();
                var notas = $("#notas").val();

                Datos.puntos[posicion].x = x;
                Datos.puntos[posicion].y = y
                Datos.puntos[posicion].nombre = nombre;
                Datos.puntos[posicion].notas = notas;

            } else {
                //console.log("insert");
                Datos.puntos.push(Punto);
            }

        }

        //console.log(Datos);
    };
    $("#nombre").change(function () {
        guardar_punto();
    });

    $("#notas").change(function () {
        guardar_punto();
    });

    /* Borrar punto */
    $('#point_delete').on("click", function(){
        var x = $('#point_input').val().split(',')[0];
        var y = $('#point_input').val().split(',')[1];

        //console.log(Datos.puntos);
            //buscar
            var encontrado = false;
            var posicion;
            for (var i = 0; i < Datos.puntos.length; i++) {
                if (Datos.puntos[i].x == x && Datos.puntos[i].y == y) {
                    //console.log("existe");
                    encontrado = true;
                    posicion = i;
                    break;
                } else {
                    //console.log("no existe");
                    encontrado = false;
                }
            }

            if (encontrado == true) {
                if (posicion > -1) {
                    var coord = $("#point_input").val();
                    var x = coord.split(',')[0];
                    var y = coord.split(',')[1];
                    id = x+'point'+y;
 
                    //console.log(Datos.puntos);
                    Datos.puntos.splice(posicion, 1);
                    $('#'+id).remove();
                    //console.log(Datos.puntos);
                }


            }; 
        $('#datos').hide();

    });


    /* agrega a imaxen en base64 */
    function handleFileSelect(evt) {
        $('#export').show();
        $("#current_map").empty();

        var files = evt.target.files; // FileList object

        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {

            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }

            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    $("#current_map").append(['<img id="map" class="get_coord" src="', e.target.result, '" title="', escape(theFile.name), '" style="position:relative; width:600px;"/>'].join(''));
                    Datos.imagen = e.target.result;
                    //console.log(Datos);
                    $('#input_add_image').hide();
                    $('#importar').css("display", "none"); 
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }
    };

    //document.getElementById('input_add_image').addEventListener('change', handleFileSelect, false); //moveuse para o show arriba de todo


    /* Exportar JSON */
    $(document).on('click touchstart', '.export_btn', function() {
    //$('#export').on("click touchstart", function(){
        //Non funciona en dispositivos móviles :/
        stringy = JSON.stringify(Datos);
        var blob = new Blob([stringy], {
            type: "text/json"
        });
        console.log(blob); //
        // Construese a uri
        var uri = URL.createObjectURL(blob);
        console.log(uri); //
        // Construese o elemento <a>
        var link = document.createElement("a");
        link.download = 'datos.json'; // nome do arquivo
        link.href = uri;
        console.log(link);//
        // Agregase ó DOM e lanzase o evento click
        document.body.appendChild(link);
        //link.click();         
        fireEvent(link, "click"); 

        // Limpase o DOM
        document.body.removeChild(link);

        delete link;
    });

    
    /* Importar datos do arquivo */
    $('#import').change(function(evt){
        files = evt.target.files;
        var reader = new FileReader();
        
        reader.onload = (function (theFile){
            return function (e){
                contido = e.target.result;
                //console.log(contido);
                
                //parse from contido and draw
                Datos = JSON.parse(contido);
                
                //append map
                $("#current_map").append(['<img id="map" src="', Datos.imagen, '" title="', escape(theFile.name), '" style="width:600px;"/>'].join(''));
                
                //append points
                $.each(Datos.puntos, function(indice, valor){                    
                    //$("#current_map").append('<img class="point" id="'+valor.x+'point'+valor.y+'" src="image/point.png" style="z-index: 99; transform: translate(' + valor.x + 'px, ' + valor.y + 'px);">');
                    $("#current_map").append('<img class="point" id="'+valor.x+'point'+valor.y+'" src="image/point.png" style="position:absolute;z-index: 99; top: '+valor.y+'px; left: '+valor.x+'px">');
                });
                
                
                $('#importar').hide();
                $('#export').show();       
                
                
            };
        })(files[0]);
        
        reader.readAsText(files[0]);
    });


    /* Cargar exemplo */


/**
 * Fire an event handler to the specified node. Event handlers can detect that the event was fired programatically
 * by testing for a 'synthetic=true' property on the event object
 * @param {HTMLNode} node The node to fire the event handler on.
 * @param {String} eventName The name of the event without the "on" (e.g., "focus")
 */
function fireEvent(node, eventName) {
    // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
    var doc;
    if (node.ownerDocument) {
        doc = node.ownerDocument;
    } else if (node.nodeType == 9){
        // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
        doc = node;
    } else {
        throw new Error("Invalid node passed to fireEvent: " + node.id);
    }

     if (node.dispatchEvent) {
        // Gecko-style approach (now the standard) takes more work
        var eventClass = "";

        // Different events have different event classes.
        // If this switch statement can't map an eventName to an eventClass,
        // the event firing is going to fail.
        switch (eventName) {
            case "click": // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
            case "mousedown":
            case "mouseup":
                eventClass = "MouseEvents";
                break;

            case "focus":
            case "change":
            case "blur":
            case "select":
                eventClass = "HTMLEvents";
                break;

            default:
                throw "fireEvent: Couldn't find an event class for event '" + eventName + "'.";
                break;
        }
        var event = doc.createEvent(eventClass);
        event.initEvent(eventName, true, true); // All events created as bubbling and cancelable.

        event.synthetic = true; // allow detection of synthetic events
        // The second parameter says go ahead with the default action
        node.dispatchEvent(event, true);
    } else  if (node.fireEvent) {
        // IE-old school style
        var event = doc.createEventObject();
        event.synthetic = true; // allow detection of synthetic events
        node.fireEvent("on" + eventName, event);
    }
};


});
