var BASE_URL = "http://itlab.fis.ulima.edu.pe/axis/services/admin/api/";

//function to obtain parameters in URL
$.urlParam = function (parameter) {
    var results = new RegExp('[\?&]' + parameter + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
        console.log("null");
    } else {
        return results[1] || 0;
    }
};

$(document).ready(function () {
    $("#createUserAlert").hide();    
    $("#extraDiv").hide();
    $("#anotherArchive").val("");

    //obtaining idUser sended as parameter
    var idUser = $.urlParam("idUser");
    $.ajax({
        type: 'POST',
        url: BASE_URL + "users",
        data: "",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success: function (data) {
            var i = 1;
            console.log("despues de success");
            console.log(data);
            for (var key in data) {
                if (key == idUser) {
                    //obtaining and writing code, description & environment
                    $("#code").val(key);
                    document.getElementById("code").disabled = true;
                    $("#description").val(data[key].description);

                    if (data[key].environment == "Lab") {
                        document.getElementById("idEnviro").options.selectedIndex = 1;

                        //obtaining and writing service and archives values to choose                     



                    } else if (data[key].environment == "Producción") {
                        document.getElementById("idEnviro").options.selectedIndex = 2;
                    } else {
                        document.getElementById("idEnviro").options.selectedIndex = 3;
                    }

                    //obtaining and writing XML Table
                    for (var eachBaseXml in data[key].baseXml) {
                        var rpta = "<tr class='ui-state-default ui-sortable-handle' style='cursor:move'>" +
                                "<td class='mdl-data-table__cell--non-numeric' style='padding-top: 12px;' style='padding-top: 12px;'>" + eachBaseXml + "</td>" +
                                "<td class='mdl-data-table__cell--non-numeric' style='padding-top: 12px;' style='padding-top: 12px;'>" + data[key].baseXml[eachBaseXml] + "</td>" +
                                "<td class='mdl-data-table__cell--non-numeric'><button class='mdl-button \n\
                                     mdl-js-button mdl-button--primary' id='remove'>\n\
                                     Eliminar</button></td>" +
                                "</tr>";
                        $("#xmlTable tbody").append(rpta);
                    }

                    //obtaining and writing List Inherit
                    for (var eachInherit in data[key].inherit) {
                        var rpta = "<tr class='ui-state-default ui-sortable-handle' style='cursor:move'>" +
                                "<td class='mdl-data-table__cell--non-numeric' style='padding-top: 5px; padding-bottom: 5px;'>" + data[key].inherit[eachInherit] + "</td>" +
                                "<td class='mdl-data-table__cell--non-numeric' style='padding-top: 5px; padding-bottom: 5px;'><button class='mdl-button \n\
                                        mdl-js-button mdl-button--primary' id='remove'>\n\
                                        Eliminar</button></td>" +
                                "</tr>";
                        $("#listInherit tbody").append(rpta);
                    }
                }

                //obtaining and writing Inherit values to choose
                var archive = "<option value=" + i + ">" + key + "</option>";
                i = i + 1;
                $("#idPadre").append(archive);





            }
        }
    });
});


//Obtaining and writing Service and Archive values to choose
$(document).ready(function () {

    $.ajax({
        type: 'POST',
        url: BASE_URL + "services",
        data: "",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success: function (data) {

            var numServices = [];
            var i = 2;
            console.log("probando services");
            console.log(JSON.stringify(data));

            for (var j in data) { //each item in jsonArray
                var object = data[j];
                for (var key in object) { //each jsonObject
                    var webServiceName = "<option value=" + i + ">" + key + "</option>"; //each ServiceName
                    $("#idService").append(webServiceName);

                    for (var k in object[key]) { //each item in jsonArray on key                        
                        if (numServices.includes(object[key][k]) == false) {
                            numServices.push(object[key][k]);
                        }
                    }
                }
                i = i + 1;
            }

            //if environment is Lab, show numServices, if not shows an empty input
            function checkEnviromentState() {
                var selectedItem = $("#idEnviro option:selected").html();
                console.log(selectedItem);
                if (selectedItem == "Lab") {
                    $("#anotherArchive").val("");
                    $("#extraDiv").hide();
                    $("#idArchive").show();
                    var z = 1;
                    for (var index in numServices) {
                        //load archive
                        var webServiceNumber = "<option value=" + z + ">" + numServices[index] + "</option>";
                        z = z + 1;
                        $("#idArchive").append(webServiceNumber);
                    }
                } else {
                    $("#idArchive").empty();
                    $("#idArchive").append("<option value=''>Seleccionar</option>");
                    $("#idArchive").hide();

                    $("#anotherArchive").val("");
                    $("#extraDiv").show();
                }
            }

            $(".environment").change(checkEnviromentState);

        }
    });
});

//Add Inherit selected value to table
$(document).on("click", "#addInherit", function () {
    //obtaining selected text value
    var selected = $("#idPadre option:selected").text();

    var rpta = "<tr class='ui-state-default ui-sortable-handle' style='cursor:move'>" +
            "<td class='mdl-data-table__cell--non-numeric' style='padding-top: 5px; padding-bottom: 5px;'>" + selected + "</td>" +
            "<td class='mdl-data-table__cell--non-numeric' style='padding-top: 5px; padding-bottom: 5px;'><button class='mdl-button \n\
                 mdl-js-button mdl-button--primary' id='remove'>\n\
                 Eliminar</button></td>" +          
            "</tr>";

    $("#listInherit tbody").append(rpta);

});

//Delete selected row
$(document).on("click", "#remove", function () {
    console.log("entro al click");

    $(this).closest("tr").remove(); // o $(this).parent().parent().remove(); 
});

//Create sortable function for Inherit Table
function dragInheritList() {

    $("#sortableInherit").sortable({
        cursor: "move"
    });
    $("#sortableInherit").disableSelection();
}
window.onload = dragInheritList();

//Add service and archive values selected to table
//var j = 1;
$(document).on("click", "#addXMLBase", function () {
    //obtaining selected text value
    var service = $("#idService option:selected").text();
    var archive;

    if ($("#anotherArchive").val() == "") {
        archive = $("#idArchive option:selected").text();
        console.log("del primero");
        console.log(archive);
    } else {
        archive = $("#anotherArchive").val();
        console.log("del segundo");
        console.log(archive);
    }

    var rpta = "<tr class='ui-state-default ui-sortable-handle' style='cursor:move'>" +
            "<td class='mdl-data-table__cell--non-numeric' style='padding-top: 12px;'>" + service + "</td>" +
            "<td class='mdl-data-table__cell--non-numeric' style='padding-top: 12px;'>" + archive + "</td>" +
            "<td class='mdl-data-table__cell--non-numeric'><button class='mdl-button \n\
                 mdl-js-button mdl-button--primary' id='remove'>\n\
                 Eliminar</button></td>" +
            "</tr>";
    //j = j + 1;
    $("#xmlTable tbody").append(rpta);
});

//Create sortable function for XML Table
function dragXMLList() {

    $("#sortableXML").sortable({
        cursor: "move"
    });
    $("#sortableXML").disableSelection();
}
window.onload = dragXMLList();

//Obtaining each cell in table 
function getCellsinTable(objectname) {
    var xmlObject = {};
    var array = [];
    var valxCell = [];
    //gets table
    var oTable1 = document.getElementById(objectname);
    //gets number of rows
    var rowLength = oTable1.rows.length;
    //loops through rows    
    for (var i = 0; i < rowLength; i++) {
        //gets cells of current row  
        var oCells = oTable1.rows.item(i).cells;
        //gets amount of cells of current row
        var cellLength = oCells.length;
        //loops through each cell in current row
        for (var j = 0; j < cellLength; j++) {
            // get cell info
            if (oCells.item(j).innerHTML == "Todos") {
                valxCell[j] = "*";
            } else {
                valxCell[j] = oCells.item(j).innerHTML;
            }
        }

        if (cellLength < 3) {
            array.push(valxCell[0]);
        } else {
            xmlObject[valxCell[0]] = valxCell[1];
        }

    }

    if (cellLength < 3) {
        return array;
    } else {
        return xmlObject;
    }

}

//** Functions to use at validation
$(document).on("click", "#description", function () {
    var label = document.getElementById("descriptionErrorLabel");
    if (label !== null) {
        label.remove();
    }
});

$(document).on("click", "#idEnviro", function () {
    var label = document.getElementById("environmentErrorLabel");
    if (label !== null) {
        label.remove();
    }
});
//**


//Save changes of edited user
$(document).on("click", "#saveChanges", function () {

    //obtaining selected text value
    var cod = $("#code").val();
    console.log(cod);

    var desc = $("#description").val();
    var enviro = $("#idEnviro option:selected").text();

    //Obtaining cells info of XML Table
    var xmlObject = getCellsinTable('sortableXML');
    console.log("llamada a tabla xml");
    console.log(JSON.stringify(xmlObject));

    //Obtaining cells info of Inherit Table
    var inheritArray = getCellsinTable('listInherit');
    console.log("llamada a tabla inherit");
    console.log(JSON.stringify(inheritArray));

    //**Validation
    if (desc == "") {
        var node = document.createElement('label');
        node.innerHTML = "Es necesario ingresar una descripción.";
        node.className = "errorLabels";
        node.id = "descriptionErrorLabel";
        $("#parentDescription").append(node);
    }


    if ($("#idEnviro option:selected").html() == "Seleccionar") {
        var node = document.createElement('label');
        node.innerHTML = "Es necesario seleccionar un ambiente.";
        node.className = "errorLabels";
        node.id = "environmentErrorLabel";
        $("#parentEnvironment").append(node);
    }
    //**

    if (desc != "" && enviro != "Seleccionar") {
        
        var attr = {};
        attr["description"] = desc;
        attr["environment"] = enviro;
        attr["baseXml"] = xmlObject;
        attr["inherit"] = inheritArray;
        attr["changes"] = {};
        console.log(JSON.stringify(attr));

        //Get Users Json
        var users = "";
        $.ajax({
            type: 'POST',
            url: BASE_URL + "users",
            data: "",
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: false,
            success: function (data) {
                users = data;
                console.log("probando users");
                console.log(users);
            }
        });

        //Save modified user
        users[cod] = attr;
        console.log(users[cod]);
        console.log(JSON.stringify(users));

        //Upload altered Json
        $.ajax({
            type: "POST",
            url: BASE_URL + "upload",
            data: JSON.stringify(users),
            async: false,
            success: function (data) {
                console.log("hizo upload");
            },
            error: function (jqXmlHttpRequest, textStatus, errorThrown) {
                alert("Error uploading.");
            }
        });

        $("#createUserAlert").html("Usuario modificado exitosamente.");
        $("#createUserAlert").show("fade", 800, function () {
            $("#createUserAlert").hide("fade", 4000);
        });       
        
    }
});