function initializeMeasurementSurvey(control, publication_idx, study_idx){
    measurement_data = control.publication_info[publication_idx].study_info[study_idx].measurement_info.data;

    document.getElementById("content").innerHTML = `
    <div class = "display-text">
        <h1>Additional Measurements</h1>
        <p>In this section, we want to know if you collected any additional measurements beyond the primary variables of your study. This information is valuable for helping others identify datasets that include external variables they may be interested in.</p>
        <p>To make the data more searchable and easier to navigate, we encourage you to use broad construct terms, such as "extraversion," "intelligence," or "anxiety," rather than specific test batteries or questionnaires. This ensures that others can quickly find relevant data based on common constructs rather than being limited by specific measurement tools.</p>
        <p>By providing this information, you contribute to a more comprehensive and accessible dataset, enabling others to explore connections between truth ratings and various other factors.</p>

        <form id="measurementSurvey">
            <label for="measureInput" class="survey-label">Add any additional variables you measured in the study:</label>
            <input type="text" id="measureInput" name="measureInput"><br>

            <button type="button" onclick="addMeasureToList()" class="survey-button">Add Measure</button><br><br>

            <label class="survey-label">List of Measures:</label>
            <ul id="measuresList"></ul>

            <button type="submit" class="survey-button">Submit</button>
        </form>
    </div>
    `;

    // Display previous submission if available
    if (measurement_data && measurement_data.measures) {
        var measuresList = document.getElementById("measuresList");
        measurement_data.measures.forEach(function(measure) {
            var li = document.createElement("li");
            li.textContent = measure;

            var removeButton = document.createElement("button");
            removeButton.innerHTML = '&times;'; // Red X
            removeButton.classList.add('delete-button');
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
        if (validateMeasurementData(collectMeasurementData())) {
            updateMeasurementSurvey(control, publication_idx, study_idx);
        }
    });
}

function collectMeasurementData(){
    // Get the measure list items
    var listItems = document.getElementById("measuresList").getElementsByTagName("li");
    var measures = [];
    for (var i = 0; i < listItems.length; i++) {
        measures.push(listItems[i].childNodes[0].nodeValue);
    }

    const measurement_data = {
        measures: measures,
        // So we can have updates on validation status
        validated: true,
    };

    return measurement_data
}

function validateMeasurementData(measurement_data){
    // Check if the list of measures is empty
    if (measurement_data.measures.length === 0) {
        alert('Please add at least one measure.');
        return false;
    }

    return true;
}

function updateMeasurementSurvey(control, publication_idx, study_idx){
    const measurement_data = collectMeasurementData();
    // Store the values in the control object
    control.publication_info[publication_idx].study_info[study_idx].measurement_info.data = measurement_data;

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');

    // Add a checkmark to the currently selected sidebar item
    const item_id =  "measures-" + publication_idx + "-" + study_idx;
    addGreenCheckmarkById(item_id);
}

function addMeasureToList() {
    // Get the measure input value
    var measureInput = document.getElementById("measureInput").value;

    if (measureInput !== "") {
        // Create a new list item
        var li = document.createElement("li");
        li.textContent = measureInput;

        add_delete_button_to_list_item(li);

        // Append the list item to the measures list
        document.getElementById("measuresList").appendChild(li);

        // Clear the input field after adding the measure
        document.getElementById("measureInput").value = "";
    } else {
        alert("Please enter a measure.");
    }
}
