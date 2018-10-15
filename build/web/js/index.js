var BASE_URL = "http://itlab.fis.ulima.edu.pe/axis/services/admin/api/";

$(document).ready(function () {
    //$('#myModal').modal('hide');    
    var users = "";
    $.ajax({
        type: 'POST',
        url: BASE_URL + "users",        
        data: "",        
        contentType: 'application/json; charset=utf-8',        
        dataType: 'json',
        async: false,
        success: function (data) {
            console.log("despues de success");
            console.log(data);

            for (var key in data) {
                var line = "<tr>" +
                        "<td  class='mdl-data-table__cell--non-numeric'>" + key + "</td>" +
                        "<td  class='mdl-data-table__cell--non-numeric'>" + data[key].description + "</td>" +
                        "<td  class='mdl-data-table__cell--non-numeric'><button id='removeUser' data-toggle='modal' data-target= '#centralModalWarning'>Eliminar</button></td>" +
                        "<td  class='mdl-data-table__cell--non-numeric'><a><button id='editUser'>Editar</button></td>" +
                        "</tr>";
                users = users + line;
            }

            $("#cuerpo").empty();
            $("#cuerpo").append(users);
        }
    });
});

$('#centralModalWarning').on('show.bs.modal', function (e) {
    var $row = $(e.relatedTarget).closest("tr");
    $tds = $row.find("td:nth-child(1)"); // Finds the first <td> element 
    var cod = $tds.text();
    console.log("Mostrar codigo");
    console.log(cod);

    $('#removeConfirmed', this).data('userId', cod);

});

$('#centralModalWarning').on('click', '#removeConfirmed', function (e) {
    console.log("entro al nuevo");
    var cod = $(this).data('userId');
    console.log("obtener codigo de modal");
    console.log(cod);

    setTimeout(function () {
        $("#indexTable tr:contains(" + cod + ")").remove();
    }, 500);

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
        }
    });

    //Removing selected user
    for (var key in users) {
        if (key == cod) {
            delete users[key];
        }
    }
    console.log(users);

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
});



$(document).on("click", "#editUser", function () {

    var $row = $(this).closest("tr");
    $tds = $row.find("td:nth-child(1)"); // Finds the first <td> element    
    var cod = $tds.text();
    window.location.href = "editUser.html?idUser=" + cod;
});

