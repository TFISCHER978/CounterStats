$(document).ready(function() {

    var teamId = null;

    $.getJSON( "/session", function( data ) {
        $.each( data, function( key, val ) {
            if (key === "teamId" && val != null) teamId = val;

            // $("#" + key).text(key + " : " + val);
        });

        if (teamId == null) {
            // add message + button create Team + button join team
            drawOption();
        } else {
            $.getJSON('/teamInfo', function (data) {
                drawTable(data);
            });
        }
    });



    function drawOption() {
        var main = document.getElementsByTagName('main')[0];

        // Info no team
        var pInfo = document.createElement('h2');
        pInfo.setAttribute("id", "pInfo");
        pInfo.innerHTML = "Looks like you don’t have a team yet.";

        // Button create Team
        var link = document.createElement('a');
        var button = document.createElement('button');

        link.setAttribute('href', 'createteam');       
        button.innerHTML = "Create your team";
        button.setAttribute("class", "btn btn-success csFont");
        button.setAttribute('id', 'buttonCTeam')
        link.append(button)
   
        // Form join team

        var form = document.createElement('form');
        form.setAttribute('class', 'form-inline');
        form.setAttribute('id', 'joinTeam')

        var div = document.createElement('div');
        div.setAttribute('class', 'input-group mb-2 mr-sm-2')

        var input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('class', 'form-control');
        input.setAttribute('id', 'codeInput');
        input.setAttribute('placeholder', 'Team Code');

        div.appendChild(input);

        var button = document.createElement('button');
        button.setAttribute('id', 'submitCode');
        button.setAttribute('type', 'button');
        button.setAttribute('class', 'btn btn-primary mb-2 csFont');
        button.addEventListener('click', function() {
            submitCode();
        });
        button.innerHTML = "Join Team";

        form.appendChild(div);
        form.appendChild(button);
        

        // push in the html
        main.appendChild(pInfo);
        main.appendChild(link);
        main.append(form);
    }

    function drawTable(data) {
        var tbl = document.createElement('table');
        tbl.setAttribute("id", "personDataTable");
        document.getElementsByTagName('main')[0].appendChild(tbl);
        var row = "<tr id='tableHeader'><th>Status</th><th>Pseudo</th><th>Email</th></tr>";
        $("#personDataTable").append(row);

        for (var i = 0; i < data.length; i++) {
            drawRow(data[i]);
        }
        
        //ajout invitation team
        if (data.length < 6) {
            for (var i = 0; i < (6-data.length); i++) {
                var inputRow = "<tr><td>Void</td><td>Void</td><td>Void</td></tr>"
                $("#personDataTable").append(inputRow);
            }

            var form = document.createElement('form');
            form.setAttribute('class', 'form-inline');
            form.setAttribute('id', 'joinTeam')

            var div = document.createElement('div');
            div.setAttribute('class', 'input-group mb-2 mr-sm-2')

            var div2 = document.createElement('div');
            div2.setAttribute('class', 'input-group-prepend');

            var div3 = document.createElement('div');
            div3.setAttribute('class', 'input-group-text');
            div3.innerHTML = "Add member"

            div2.append(div3)
            div.append(div2)

            var input = document.createElement('input');
            input.setAttribute('type', 'email');
            input.setAttribute('class', 'form-control');
            input.setAttribute('id', 'newMemberEmail');
            input.setAttribute('placeholder', 'Email');

            div.appendChild(input);

            var button = document.createElement('button');
            button.setAttribute('id', 'submitInvit');
            button.setAttribute('type', 'button');
            button.setAttribute('class', 'btn btn-primary mb-2');
            button.addEventListener('click', function() {
                addMember();
            });
            button.innerHTML = "Invit";

            form.appendChild(div);
            form.appendChild(button);

            document.getElementsByTagName('main')[0].appendChild(form);
        }
    }
    
    function drawRow(rowData) {
        var row;
       
        if (rowData.isManager) {
            row = "<tr id='manager'><td>Manager</td><td>" + rowData.pseudo + "</td><td>" + rowData.email + "</td></tr>";
            $("#tableHeader").after(row);
        } else {
            row = "<tr class='player'><td>Player</td><td>" + rowData.pseudo + "</td><td>" + rowData.email + "</td></tr>";
            $("#personDataTable").append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it
        }
    }


    // utiliser un code invitation
    function submitCode() {
        var data = {
            code: $("#codeInput").val()
        };
        fetch("/joinTeam", {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
        .then(response => {
            if (response.status === 200) window.location.href = response.url;

            if (response.status === 401) {
                $("#error").css("visibility","visible");
                $("#pError").text("Incorrect username or password.");
            }
            if (response.status === 402) {
                $("#error").css("visibility","visible");
                $("#pError").text("Email not known.");
            }     
        })
    };

    // envoyer un code à un email
    function addMember() {
        console.log("qfsefsef");

        var data = {
            email: $("#newMemberEmail").val(),
        };
        fetch("/addMember", {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
            .then(response => {
                if (response.status === 200) alert("Invit send to : " + $("#newMemberEmail").val());

                $("#newMemberEmail").val('');

                if (response.status === 401) {
                    // $("#error").css("visibility","visible");
                    // $("#pError").text("Email not known.");
                    alert("Email not known.")
                }     
            })
    };

});