function initializeMeasurementSurvey(control, publication_idx, study_idx){
    measurement_data = control.publication_info[publication_idx].study_info[study_idx].measurement_info.data;
    measurement_name = "Additional Measures"

    document.getElementById("content").innerHTML = `
        <h2>${measurement_name}</h2>
        <form id="measurementSurvey">
            <label for="measureInput" class="survey-label">Add any additional variables you measured in the study:</label>
            <input type="text" id="measureInput" name="measureInput"><br>

            <button type="button" onclick="addMeasureToList()" class="survey-button">Add Measure</button><br><br>

            <label class="survey-label">List of Measures:</label>
            <ul id="measuresList"></ul>

            <button type="submit" class="survey-button">Submit</button>
        </form>
    `;

    // Display previous submission if available
    if (measurement_data && measurement_data.measures) {
        var measuresList = document.getElementById("measuresList");
        measurement_data.measures.forEach(function(measure) {
            var li = document.createElement("li");
            li.textContent = measure;

            var removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.onclick = function() {
                this.parentElement.remove();
            };

            li.appendChild(removeButton);
            measuresList.appendChild(li);
        });
    }

    // Add event listener to the form's submit button
    document.getElementById('measurementSurvey').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        updateMeasurementSurvey(control, publication_idx, study_idx);
    });
}

function updateMeasurementSurvey(control, publication_idx, study_idx){
    // Collect all measures
    var measures = [];
    var listItems = document.getElementById("measuresList").getElementsByTagName("li");
    for (var i = 0; i < listItems.length; i++) {
        measures.push(listItems[i].childNodes[0].nodeValue);
    }

    // Store the values in the control object
    control.publication_info[publication_idx].study_info[study_idx].measurement_info.data = {
        measures: measures,
    }

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');
}

function addMeasureToList() {
    // Get the measure input value
    var measureInput = document.getElementById("measureInput").value;

    if (measureInput !== "") {
        // Create a new list item
        var li = document.createElement("li");
        li.textContent = measureInput;

        // Create a remove button for each measure
        var removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.onclick = function() {
            // Remove the measure from the list
            this.parentElement.remove();
        };

        // Append the remove button to the list item
        li.appendChild(removeButton);

        // Append the list item to the measures list
        document.getElementById("measuresList").appendChild(li);

        // Clear the input field after adding the measure
        document.getElementById("measureInput").value = "";
    } else {
        alert("Please enter a measure.");
    }
}
