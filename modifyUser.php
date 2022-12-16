<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Home Page</title>
        <script src="scripts/modifyUser.js"></script>
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>
        <h2>Admin - Manage User Accounts</h2>
        <div class="container">
            <div class="buttonArea">        
                <button id="btnAdd">Add</button>
                <button id="btnDelete">Delete</button>
                <button id="btnUpdate">Update</button>
                <button id="btnCancel">Cancel</button>
            </div>
            <div class="inputPanel">
                <div class="inputContainer">
                    <div class="inputLabelUser">Username:</div>
                    <div class="textBoxContainer"><input class="inputField formData" id="txtUsername"></div>
                </div>
                <div class="inputContainer">
                    <div class="inputLabelUser">Permission Level:</div>
                    <div class = "textBoxContainer">
                        <select id="cmbPermissionLevel" class="formData inputField">
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="SUPER">SUPER</option>
                        </select>
                    </div>
                </div>
                <div class="inputContainer">
                    <div class="inputLabelUser">Password:</div>
                    <div class="textBoxContainer"><input class="formData inputField" id="txtPassword" type="password"></div>
                </div>

                <div class="inputContainer">
                    <button id="btnSubmit">Done</button>
                </div>
            </div> 
            <div class="crudTable">
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Permission Level</th>
                            <th class="hidden">Password</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!--  Added in JS-->
                    </tbody>
                </table>
            </div>



        </div>
    </body>
</html>
