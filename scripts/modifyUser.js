/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/javascript.js to edit this template
 */
let userData;
let addOrUpdate;

window.onload = function () {
    document.querySelector("#btnAdd").addEventListener("click", handleAdd);
    document.querySelector("#btnDelete").addEventListener("click", handleDelete);
    document.querySelector("#btnUpdate").addEventListener("click", handleUpdate);
    document.querySelector("#btnSubmit").addEventListener("click", processForm);
    document.querySelector("#btnCancel").addEventListener("click", handleCancel);


    // add event handler for selections on the table
    document.querySelector("table").addEventListener("click", handleRowClick);
    hideInputPanel();
    fetchUserData();
};

async function fetchUserData() {
    let url = "quizapp/users"; // file name or server-side process name
    const response = await fetch(url);
    if (!response.ok) {
        alert("Error fetching users. \n\n" + "Status code: " + response.status);
    } else {
        const data = await response.json();
        //If there is an exception, the backend returns text with an ERROR field
        if (data.ERROR) {
            alert("Error fetching users. \n\n" + data.ERROR);
        } else {
            //Build our user table
            buildUserTable(data);
        }
    }
    // toggle Buttons to default state
    disableDelUpdate(true);
    disableAdd(false);

}

function buildUserTable(data) {
    let table = document.querySelector("tbody");
    let html = "";

    userData = data;

    for (let user of userData) {
        html += "<tr>";
        html += `<td>${user.username}</td>`;
        html += `<td>${user.permissionLevel}</td>`;
        html += `<td class="hidden">${user.password}</td>`;
        html += "</tr>";
    }
    table.innerHTML = html;
}

async function handleDelete() {
    const row = document.querySelector(".highlighted");
    const username = row.querySelectorAll("td")[0].innerHTML;
    const resp = await fetch('quizapp/users', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            username: username,
            password: "dummyPass",
            permissionLevel: "DUMPERM"
        })
    });

    const msg = await resp.text();
    if (msg === "1") {
        alert("User deleted.");
    } else if (msg === "0") {
        alert("User was not deleted.");
    } else {
        alert("Server-side error. \n\n" + msg);
    }
    hideInputPanel();
    fetchUserData();

}

function handleAdd() {
    showInputPanel();
    addOrUpdate = "add";
    clearForm();
    disableAdd(true);
}

/**
 * Click handler for Update button - shows the input panel and
 * populates the textboxes with data from the selected row. 
 * Sets addOrUpdate to 'update'.
 * 
 */
function handleUpdate() {
    addOrUpdate = "update";
    let row = document.querySelector(".highlighted");
    let data = row.querySelectorAll("td");
    clearForm();
    document.querySelector("#txtUsername").value = data[0].innerHTML;
    document.querySelector("#cmbPermissionLevel").value = data[1].innerHTML;
    document.querySelector("#txtPassword").value = data[2].innerHTML;
    //Since this is an update, we can't change username
    document.querySelector("#txtUsername").disabled = true;
    disableDelUpdate(true);
    showInputPanel();

}

async function processForm() {
    //Check for empty inputs    
    let inputs = document.querySelectorAll(".formData");
    for (let input of inputs) {
        if (input.value === "") {
            alert("One or more input fields is empty. Please try again.");
            return;
        }
    }
    
    // Get data from the form and build an object.
    const name = document.querySelector("#txtUsername").value;
    const pass = document.querySelector("#txtPassword").value;
    const perm = document.querySelector("#cmbPermissionLevel").value;
    
    const obj ={
        username: name,
        password: pass,
        permissionLevel: perm
    };
    
    const url = "quizapp/users";
    const httpMethod = addOrUpdate === "add" ? "POST" : "PUT";
    const resp = await fetch(url, {
        method: httpMethod,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(obj)
    });
    
    const msg = await resp.text();
    if (msg === "1") {
        alert("User " + (addOrUpdate === "add" ? "added." : "updated."));
    } else if (msg === "0") {
        alert("User NOT " + (addOrUpdate === "add" ? "added." : "updated."));
        return;
    } else {        
        alert("Server-side error. \n\n" + msg);
    }
    
    hideInputPanel();
    fetchUserData();
}



/**
 *****************************GUI FUNCTIONS**********************************
 */

/**
 * Called when a part of the table is clicked to highlight rows
 * @param {Event} e The element that is clicked
 */
/**
 * Click handler for Cancel button - Clears the form and resets app
 * to default state.
 */
function handleCancel() {
    clearSelections();
    hideInputPanel();
    disableDelUpdate(true);
    disableAdd(false);
}

function handleRowClick(e) {
    //Ensure that TBODY doesn't get clicked, as this highlights the whole table
    if (e.target.tagName !== "TD")
        return;

    clearSelections();
    e.target.parentElement.classList.add("highlighted");
    hideInputPanel();
    disableDelUpdate(false);
    disableAdd(true);
}

function clearSelections() {
    let trs = document.querySelectorAll("tr");
    for (let i = 0; i < trs.length; i++) {
        trs[i].classList.remove("highlighted");
    }
}

function hideInputPanel() {
    document.querySelector(".inputPanel").classList.add("hidden");
    document.querySelector("#txtUsername").disabled = false;
}

function showInputPanel() {
    document.querySelector(".inputPanel").classList.remove("hidden");
}

//Make sure to change these to match the textbox
function clearForm() {
    document.querySelector("#txtUsername").value = "";
    document.querySelector("#cmbPermissionLevel").value = "";
    document.querySelector("#txtPassword").value = "";


}

//These 2 functions are used with a boolean to easily toggle buttons
function disableAdd(bool) {
    document.querySelector("#btnAdd").disabled = bool;
}
function disableDelUpdate(bool) {
    document.querySelector("#btnDelete").disabled = bool;
    document.querySelector("#btnUpdate").disabled = bool;
}