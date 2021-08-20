function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);

        /*Change way to read object instead of a array */
        for(let key in arr){
            if (arr[key].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[key].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[key].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[key] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
        } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
        } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
        }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

function submitCountryZipCode(evt){
    var img = document.getElementById("myImageCountry");
    var text = document.getElementById("myInput").value.toUpperCase();
    var code = "";
    var zip = document.getElementById("myInputZip").value; 
    var client = new XMLHttpRequest();
    var url = "";

    code = getKeyByValue(countries, text);
    if(text === "USA"){
        img.src="states/USA.svg";
    }else{
        img.src="states/"+code+".svg";
    }   

    url = "http://api.zippopotam.us/"+code+"/"+zip;
    
    client.open("GET", url, true);
    client.onreadystatechange = function() {
        if(client.readyState == 4) {
            while (div.firstChild) div.removeChild(div.firstChild);

            if(client.responseText === "{}"){
                alert("No data with ZipCode: " + zip);
            }else{
                createInfoTable(JSON.parse(client.responseText));
            }
        };
    };

    client.send();
    evt.preventDefault();
}

const createInfoTable = (data) =>{
    var places = data.places;

    var boardTable = document.createElement("table");
    boardTable.className = "tableInfo";

    var tableHeader = document.createElement("thead");
    tableHeader.className = "tableInfoHeader";

    var tableHeaderRows = document.createElement("tr");
    tableHeaderRows.className = "tableInfoHeaderRow";

    tableHeaders.forEach(header =>{
        var cellHeader = document.createElement("th");
        cellHeader.innerText = header;
        tableHeaderRows.append(cellHeader);
    });

    tableHeader.append(tableHeaderRows);
    boardTable.append(tableHeader);

    var tableBody = document.createElement("tbody");
    tableBody.className = "tableBody";
    boardTable.append(tableBody);

    places.forEach(data=>{
        var tableBodyRow = document.createElement("tr");
        tableBodyRow.className = "tableBodyRow";

        var tableDataPlaceName = document.createElement("td");
        tableDataPlaceName.innerText = data["place name"];

        var tableDataLongitude = document.createElement("td");
        tableDataLongitude.innerText = data["longitude"];

        var tableDataLatitude = document.createElement("td");
        tableDataLatitude.innerText = data["latitude"];

        var tableDataState = document.createElement("td");
        tableDataState.innerText = data["state"];

        var tableDataStateAbbreviation = document.createElement("td");
        tableDataStateAbbreviation.innerText = data["state abbreviation"];

        tableBodyRow.append(tableDataPlaceName, tableDataLongitude, tableDataLatitude, tableDataState, tableDataStateAbbreviation);
        tableBody.append(tableBodyRow);
    });

    div.append(boardTable);
}

const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key].toUpperCase() === value);
}

const div = document.querySelector("div.infoZipCode");
var countries = {
    "us":"Usa",
    "ca":"Canada",
    "ar":"Argentina"
};
var tableHeaders = ["Place Name","Longitude","Latitude","State","State abbreviation"]

document.getElementById("form").addEventListener('submit', submitCountryZipCode);

autocomplete(document.getElementById("myInput"), countries);