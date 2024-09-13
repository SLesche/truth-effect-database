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
        <h1>${study_name}: Additional Measurments</h1> 
        <p>In this section, we want to know if you collected any additional measurements beyond the primary variables of your study. This information is valuable for helping others identify datasets that include external variables they may be interested in.</p>
        <p>To make the data more searchable and easier to navigate, we encourage you to use broad construct terms, such as "extraversion," "intelligence," or "anxiety," rather than specific test batteries or questionnaires. This ensures that others can quickly find relevant data based on common constructs rather than being limited by specific measurement tools.</p>
        <p>By providing this information, you contribute to a more comprehensive and accessible dataset, enabling others to explore connections between truth ratings and various other factors.</p>

        <form id="measurementSurvey">                    
            <label for="measureInputDetails" class="survey-label">Add any additional variables you measured in the study:</label>
            <input type="text" id="measureInputDetails" name="measureInputDetails"><br>

            <label for="measureInputConstruct" class="survey-label">Add the name of the construct</label>
            <input type="text" id="measureInputConstruct" name="measureInputConstruct"><br>

            <button type="button" onclick="addMeasureToList()" class="add-button">Add Measure</button><br><br>

            <label class="survey-label">List of Measures:</label>
            <ul id="measuresList" class = "list-of-entries"></ul>
            <button type="submit" class="survey-button">Submit</button>
        </form>
    </div>
    `;

    // Display previous submission if available
    if (measurement_data && measurement_data.measures) {
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
    document.getElementById('measurementSurvey').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        if (validateMeasurementData(collectMeasurementData())) {
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
    var measureInputDetails = document.getElementById("measureInputDetails").value;
    var measureInputConstruct = document.getElementById("measureInputConstruct").value;

    if (measureInputDetails !== "" && measureInputConstruct !== "") {
        // Create a new list item
        var li = document.createElement("li");
        li.textContent = `Construct: ${measureInputConstruct}, Details: ${measureInputDetails}`;

        add_delete_button_to_list_item(li);

        // Append the list item to the measures list
        document.getElementById("measuresList").appendChild(li);

        // Clear the input field after adding the measure
        document.getElementById("measureInputConstruct").value = "";
        document.getElementById("measureInputDetails").value = "";
    } else {
        alert("Please enter a measure.");
    }
}
