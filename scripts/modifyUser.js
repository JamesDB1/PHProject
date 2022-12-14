/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/javascript.js to edit this template
 */


window.onload = function () {
    fetchUserData();


}

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

}

function buildUserTable(data) {
    let table = document.querySelector("tbody");
    let html = "";
    
    for(let user of data){
        html += "<tr>";
        html += `<td>${user.username}</td>`;
        html += `<td>${user.permissionLevel}</td>`;
        html += "<button id='btnDelete'>Delete</button>";
        html += "<button id='btnUpdate'>Update</button>";
        html += "</tr>";
    }
    table.innerHTML = html;



}