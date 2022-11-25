let addOrUpdate; // need this because the same panel is used for adds and updates

window.onload = function () {

    // add event handlers for buttons
    document.querySelector("#GetButton").addEventListener("click", getAllItems);
    document.querySelector("#DeleteButton").addEventListener("click", deleteItem);
    document.querySelector("#AddButton").addEventListener("click", addItem);
    document.querySelector("#UpdateButton").addEventListener("click", updateItem);
    document.querySelector("#DoneButton").addEventListener("click", processForm);
    document.querySelector("#CancelButton").addEventListener("click", cancelAddUpdate);

    // add event handler for selections on the table
    document.querySelector("table").addEventListener("click", handleRowClick);

    loadMenuItemCategories();
    hideUpdatePanel();
};

// "Get Data" button
function getAllItems() {
    // let url = "api/getAllItems.php";
    let url = "menuService/items"; // REST-style: URL refers to an entity or collection, not an action
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            console.log(resp);
            if (resp.search("ERROR") >= 0) {
                alert("oh no... see console for error");
                console.log(resp);
            } else {
                buildTable(xmlhttp.responseText);
                clearSelections();
                resetUpdatePanel();
                hideUpdatePanel();
            }
        }
    };
    xmlhttp.open("GET", url, true); // HTTP verb says what action to take; URL says which item(s) to act upon
    xmlhttp.send();

    // disable Delete and Update buttons
    document.querySelector("#DeleteButton").setAttribute("disabled", "disabled");
    document.querySelector("#UpdateButton").setAttribute("disabled", "disabled");
}

// "Delete" button
function deleteItem() {
    let id = document.querySelector(".highlighted").querySelector("td").innerHTML;
    //let url = "api/deleteItem.php";
    let url = "menuService/items/" + id; // entity, not action
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            if (resp.search("ERROR") >= 0 || resp != 1) {
                alert("could not complete request");
                console.log(resp);
            } else {
                getAllItems();
            }
        }
    };
    xmlhttp.open("DELETE", url, true); // "DELETE" is the action, "url" is the entity
    xmlhttp.send();
}

// "Add" button
function addItem() {
    // Show panel, panel handler takes care of the rest
    addOrUpdate = "add";
    resetUpdatePanel();
    showUpdatePanel();
}

// "Update" button
function updateItem() {
    addOrUpdate = "update";
    resetUpdatePanel();
    populateUpdatePanelWithSelectedItem();
    showUpdatePanel();
}

// "Done" button (on the input panel)
function processForm() {
    // We need to send the data to the server. 
    // We will create a JSON string and pass it to the "send" method
    // of the HttpRequest object. Then if we send the request with POST or PUT,
    // the JSON string will be included as part of the message body 
    // (not a form parameter).
    let itemID = document.querySelector("#itemIDInput").value;
    let itemCategoryID = document.querySelector("#categorySelect").value;
    let description = document.querySelector("#descriptionInput").value;
    let price = document.querySelector("#priceInput").value;
    let vegetarian = document.querySelector("#vegetarianInput").checked;

    let obj = {
        "itemID": itemID,
        "itemCategoryID": itemCategoryID,
        "description": description,
        "price": price,
        "vegetarian": vegetarian
    };

    let url = "menuService/items/" + itemID;
    let method = (addOrUpdate === "add") ? "POST" : "PUT";
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            if (resp.search("ERROR") >= 0 || resp != 1) {
                alert("could not complete request");
                console.log(resp);
            } else {
                getAllItems();
            }
        }
    };
    xmlhttp.open(method, url, true); // method is either POST or PUT
    xmlhttp.send(JSON.stringify(obj));
}

// "Cancel" button (on the input panel)
function cancelAddUpdate() {
    hideUpdatePanel();
}

function clearSelections() {
    let trs = document.querySelectorAll("tr");
    for (let i = 0; i < trs.length; i++) {
        trs[i].classList.remove("highlighted");
    }
}

function handleRowClick(e) {
    //add style to parent of clicked cell
    clearSelections();
    e.target.parentElement.classList.add("highlighted");

    // enable Delete and Update buttons
    document.querySelector("#DeleteButton").removeAttribute("disabled");
    document.querySelector("#UpdateButton").removeAttribute("disabled");
}

function showUpdatePanel() {
    document.getElementById("AddUpdatePanel").classList.remove("hidden");
}

function hideUpdatePanel() {
    document.getElementById("AddUpdatePanel").classList.add("hidden");
}

function loadMenuItemCategories() {
    let url = "menuService/categories";
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = xmlhttp.responseText;
            //console.log(resp);
            if (resp.search("ERROR") >= 0) {
                alert("oh no...");
                //console.log(resp);
            } else {
                initUpdatePanel(resp);
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function initUpdatePanel(text) {
    console.log("initUpdatePanel");
    console.log(text);
    let cats = JSON.parse(text);
    let html = "";
    for (let i = 0; i < cats.length; i++) {
        let id = cats[i].itemCategoryID;
        let desc = cats[i].itemCategoryDescription;
        html += "<option value='" + id + "'>" + desc + "</option>";
    }
    document.querySelector("#categorySelect").innerHTML = html;
    resetUpdatePanel();
}

function resetUpdatePanel() {
    document.querySelector("#itemIDInput").value = "";
    document.querySelectorAll("option")[0].selected = true; // select first one
    document.querySelector("#descriptionInput").value = "";
    document.querySelector("#priceInput").value = 0;
    document.querySelector("#vegetarianInput").checked = false;
}

function populateUpdatePanelWithSelectedItem() {
    let tds = document.querySelector(".highlighted").querySelectorAll("td");
    document.querySelector("#itemIDInput").value = tds[0].innerHTML;
    let options = document.querySelectorAll("option");
    for (let i = 0; i < options.length; i++) {
        options[i].selected = options[i].value === tds[1].innerHTML;
    }
    document.querySelector("#descriptionInput").value = tds[2].innerHTML;
    document.querySelector("#priceInput").value = +tds[3].innerHTML;
    document.querySelector("#vegetarianInput").checked = 1 === +tds[4].innerHTML;
}

function buildTable(text) {
    let data = JSON.parse(text);
    let theTable = document.querySelector("table");
    let html = theTable.querySelector("tr").innerHTML;
    for (let i = 0; i < data.length; i++) {
        let temp = data[i];
        html += "<tr>";
        html += "<td>" + temp.itemID + "</td>";
        html += "<td>" + temp.itemCategoryID + "</td>";
        html += "<td>" + temp.description + "</td>";
        html += "<td>" + temp.price + "</td>";
        html += "<td>" + temp.vegetarian + "</td>";
        html += "</tr>";
    }
    theTable.innerHTML = html;
}
