function addMeasurement(parentElement, control, publication_idx, study_idx) {
    const measurement_name = "Additional Measurements";

    // Create a new list item for the dataset
    const listItem = document.createElement("li");
    listItem.className = "collapsible collapsible-nocontent";
    listItem.dataset.index = "measures-" + publication_idx + "-" + study_idx;
    listItem.id = "measures-" + publication_idx + "-" + study_idx;


    // Create a span for the dataset name
    const span = document.createElement("span");
    span.textContent = measurement_name;

    // // Create action buttons
    // const actions = document.createElement("div");
    // actions.className = "actions";

    // const removeButton = document.createElement("button");
    // removeButton.innerHTML = '&times;'; // Red X
    // removeButton.classList.add('delete-button');
    // removeButton.onclick = function(event) {
    //     event.stopPropagation();
    //     removeItem(listItem, control);
    // };
    // actions.appendChild(removeButton);
    
    // Append the span and actions to the list item
    listItem.appendChild(span);
    // listItem.appendChild(actions);
    
    // Create a nested list for raw data
    const nestedList = document.createElement("ul");
    
    // Append the nested list to the dataset item
    listItem.appendChild(nestedList);
    
    // Append the new list item to the parent element
    parentElement.appendChild(listItem);
    
    // Update content area
    listItem.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevent any default action
        initializeMeasurementSurvey(control, publication_idx, study_idx);
    });
}

function initializeMeasurementSurvey(control, publication_idx, study_idx){
    const measurement_data = control.publication_info[publication_idx].study_info[study_idx].measurement_data;
    const study_name = control.publication_info[publication_idx].study_info[study_idx].study_name;

    document.getElementById("content").innerHTML = `
    <div class="display-text">
        <h1>${study_name}: Additional Measurements</h1> 
        <p>In this section, we want to know if you collected any additional measurements beyond the primary variables of your study. This information is valuable for helping others identify datasets that include external variables they may be interested in.</p>
        <p>To make the data more searchable and easier to navigate, we encourage you to use broad construct terms, such as "extraversion," "intelligence," or "anxiety," rather than specific test batteries or questionnaires. This ensures that others can quickly find relevant data based on common constructs rather than being limited by specific measurement tools.</p>
        <p>By providing this information, you contribute to a more comprehensive and accessible dataset, enabling others to explore connections between truth ratings and various other factors.</p>

        <label for="additional_measures" class="survey-label" id = "additional_measures">Did you collect any additional measures?</label>
        <form class="radio-buttons" id = "additional_measures">
            <label for="additional_measures_yes"><input type="radio" id="additional_measures_yes" name="additional_measures" value="1" ${measurement_data.additional_measures == 1 ? 'checked' : ''}>Yes</label>
            <label for="additional_measures_no"><input type="radio" id="additional_measures_no" name="additional_measures"value="0" ${measurement_data.additional_measures == 0 ? 'checked' : ''}>No</label>
        </form>

        <form id="measures_form" class = "survey-form" style="display: none;">
            <label for="measure_input_details" class="survey-label">Add any additional variables you measured in the study:</label>
            <input type="text" id="measure_input_details" name="measure_input_details"><br>
            <p class="survey-label-additional-info">This can be detailed and may include the scale used to measure the variable: "APM Performance" or "BFI-2-XS".</p>

            <label for="measure_input_construct" class="survey-label">Add the name of the construct:</label>
            <input type="text" id="measure_input_construct" name="measure_input_construct"><br>
            <p class="survey-label-additional-info">This should be the broad constructs: "intelligence" or "extraversion".</p>

            <button type="button" onclick="addMeasureToList()" class="add-button">Add Measure</button><br><br>

            <label class="survey-label" id="measures_list" style="display: none;">List of Measures:</label>
            <ul id="measuresList" class="list-of-entries"></ul>
        </form>

        <button type="submit" class="survey-button" id="submit-button">Submit</button>
    </div>
    `;

    // Function to toggle the measures form
    document.querySelectorAll('input[name="additional_measures"]').forEach((elem) => {
        elem.addEventListener('change', function() {
            const measuresForm = document.getElementById('measures_form');
            if (this.value == 1) {
                measuresForm.style.display = 'block';
            } else {
                measuresForm.style.display = 'none';
            }
        });
    });

    // Display the measures list if previously selected that additional measures were collected
    if (measurement_data.additional_measures == 0) {
        document.getElementById("measures_list").style.display = "none";
    } else if (measurement_data.validated == 1 && measurement_data.measures.length > 0) {
        document.getElementById("measures_form").style.display = "block";
        document.getElementById("measures_list").style.display = "block";

        var measuresList = document.getElementById("measuresList");
        measurement_data.measures.forEach(function(measure) {
            var li = document.createElement("li");
            li.textContent = `Construct: ${measure.construct}, Details: ${measure.details}`;

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
    document.getElementById('submit-button').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default form submission
        if (validateMeasurementData(collectMeasurementData()) || control.testing) {
            updateMeasurementSurvey(control, publication_idx, study_idx);
        }
    });
}

function collectMeasurementData(){
    var measures = [];
    // Get the measure list items
    var listItems = document.getElementById("measuresList").getElementsByTagName("li");
    var measures = [];
    for (var i = 0; i < listItems.length; i++) {
        var measureText = listItems[i].childNodes[0].nodeValue;
        var measureParts = measureText.split(", Details: ");
        var measureConstruct = measureParts[0].replace("Construct: ", "").trim();
        var measureDetails = measureParts[1].trim();
        measures.push({ construct: measureConstruct, details: measureDetails });
    }

    const measurement_data = {
        measures: measures,
        additional_measures: getRadioButtonSelection("additional_measures")
    };

    return measurement_data
}

function validateMeasurementData(measurement_data){
    clearValidationMessages();
    var alert_message = 'This field does not match validation criteria.';

    // Check if the user selected whether they collected additional measures
    if (measurement_data.additional_measures === null) {
        alert_message = 'Please select whether you collected any additional measures.';
        displayValidationError("additional_measures", alert_message);
        return false;
    }

    if (measurement_data.additional_measures == 0) {
        // Check if the list of measures is empty
        if (measurement_data.measures.length != 0) {
            alert_message = 'Remove all measures if you did not collect any additional measures.'

            document.getElementById("measures_form").style.display = "block";
            document.getElementById("measures_list").style.display = "block";
            displayValidationError("measuresList", alert_message);
            return false;
        }
        return true
    }

    // Check if the list of measures is empty
    if (measurement_data.measures.length === 0) {
        alert_message = 'Please add at least one measure.'
        displayValidationError("measure_input_details", alert_message);
        displayValidationError("measure_input_construct", alert_message);
        return false;
    }

    return true;
}

function updateMeasurementSurvey(control, publication_idx, study_idx){
    const measurement_data = collectMeasurementData();
    measurement_data.validated = true;

    // Store the values in the control object
    control.publication_info[publication_idx].study_info[study_idx].measurement_data = measurement_data;

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');

    // Add a checkmark to the currently selected sidebar item
    const item_id =  "measures-" + publication_idx + "-" + study_idx;
    addGreenCheckmarkById(item_id);
}

function addMeasureToList() {
    // Get the measure input value
    var measureInputDetails = document.getElementById("measure_input_details").value;
    var measureInputConstruct = document.getElementById("measure_input_construct").value;

    if (measureInputDetails !== "" && measureInputConstruct !== "") {
        // Create a new list item
        var li = document.createElement("li");
        li.textContent = `Construct: ${measureInputConstruct}, Details: ${measureInputDetails}`;

        add_delete_button_to_list_item(li);

        // Append the list item to the measures list
        document.getElementById("measuresList").appendChild(li);

        // Clear the input field after adding the measure
        document.getElementById("measure_input_construct").value = "";
        document.getElementById("measure_input_details").value = "";

        document.getElementById("measures_list").style.display = "block";

    } else {
        alert("Please enter a measure.");
    }

}
