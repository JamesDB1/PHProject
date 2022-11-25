<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Database Demo 4</title>
        <link rel="stylesheet" href="dbDemoStyles.css">
        <script src="dbDemoMain.js"></script>
    </head>
    <body>
        <h1>Menu Items</h1>

        <button id="GetButton">Get Data</button>
        <br>
        <button id="AddButton">Add</button>
        <button id="DeleteButton" disabled>Delete</button>
        <button id="UpdateButton" disabled>Update</button>

        <div id="AddUpdatePanel">

            <div>
                <div class="formLabel">ID</div><input id="itemIDInput" type="numeric">
            </div>
            <div>
                <div class="formLabel">Category</div>
                <select id="categorySelect">
                    
                </select>
            </div>
            <div>
                <div class="formLabel">Description</div><input id="descriptionInput" type="text">
            </div>
            <div>
                <div class="formLabel">Price</div><input id="priceInput" type="numeric">
            </div>
            <div>
                <div class="formLabel">Vegetarian</div><input id="vegetarianInput" type="checkbox">
            </div>
            <div>
                <button id="DoneButton">Done</button>
                <button id="CancelButton">Cancel</button>
            </div>
        </div>

        <table>
            <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Description</th>
                <th>Price</th>
                <th>Veg?</th>
            </tr>
        </table>

    </body>
</html>
