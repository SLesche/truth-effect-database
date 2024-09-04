function initializeDatasetSurvey(control, publication_idx, study_idx, dataset_idx) {
    const dataset_data = control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx].data;
    const dataset_name = control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx].dataset_name;

    document.getElementById("content").innerHTML = `
        <h2>${dataset_name}</h2>
        <form id="datasetSurvey" class="survey-form">
            <label for="n_participants" class="survey-label">How many participants are contained in this data?</label>
            <input type="number" id="n_participants" name="n_participants" value="${dataset_data.n_participants || ''}" required><br>

            <label for="has_within_conditions" class="survey-label">Does this data contain any within conditions?</label>
            <div class="form-item">
                <label><input type="radio" name="has_within_conditions" value="1" ${dataset_data.has_within_conditions == 1 ? 'checked' : ''}/>Yes</label>
                <label><input type="radio" name="has_within_conditions" value="0" ${dataset_data.has_within_conditions == 0 ? 'checked' : ''}/>No</label>
            </div>

            <fieldset id="withinConditionsFieldset" ${dataset_data.has_within_conditions == 1 ? '' : 'disabled'}>
                <label for="within_condition_name" class="survey-label">Add a description of the condition:</label>
                <input type="text" id="within_condition_name" name="within_condition_name"><br>

                <label for="within_condition_identifier" class="survey-label">How is that condition identified in the raw data?</label>
                <input type="text" id="within_condition_identifier" name="within_condition_identifier"><br>

                <button type="button" onclick="addWithinCondition()" class="survey-button">Add Condition</button><br><br>

                <label class="survey-label">List of Conditions</label>
                <ul id="withinConditionsList"></ul>
            </fieldset>

            <label for="has_between_conditions" class="survey-label">Does this data contain any between conditions?</label>
            <div class="form-item">
                <label><input type="radio" name="has_between_conditions" value="1" ${dataset_data.has_between_conditions == 1 ? 'checked' : ''}/>Yes</label>
                <label><input type="radio" name="has_between_conditions" value="0" ${dataset_data.has_between_conditions == 0 ? 'checked' : ''}/>No</label>
            </div>

            <fieldset id="betweenConditionsFieldset" ${dataset_data.has_between_conditions == 1 ? '' : 'disabled'}>
                <label for="between_condition_name" class="survey-label">Add a description of the condition:</label>
                <input type="text" id="between_condition_name" name="between_condition_name"><br>

                <label for="between_condition_identifier" class="survey-label">How is that condition identified in the raw data?</label>
                <input type="text" id="between_condition_identifier" name="between_condition_identifier"><br>

                <button type="button" onclick="addBetweenCondition()" class="survey-button">Add Condition</button><br><br>

                <label class="survey-label">List of Conditions</label>
                <ul id="betweenConditionsList"></ul>
            </fieldset>

            <button type="submit" class="survey-button">Submit</button>
        </form>
    `;

    // Display previous submission if available
    if (dataset_data && dataset_data.has_within_conditions == 1) {
        var withinConditionsList = document.getElementById("withinConditionsList");
        dataset_data.within_condition_details.forEach(function(condition) {
            var li = document.createElement("li");
            li.textContent = `Condition: ${condition.name}, Identifier: ${condition.identifier}`;

            var removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.onclick = function() {
                this.parentElement.remove();
            };

            li.appendChild(removeButton);
            withinConditionsList.appendChild(li);
        });
    }

    if (dataset_data && dataset_data.has_between_conditions == 1) {
        var betweenConditionsList = document.getElementById("betweenConditionsList");
        dataset_data.between_condition_details.forEach(function(condition) {
            var li = document.createElement("li");
            li.textContent = `Condition: ${condition.name}, Identifier: ${condition.identifier}`;

            var removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.onclick = function() {
                this.parentElement.remove();
            };

            li.appendChild(removeButton);
            betweenConditionsList.appendChild(li);
        });
    }

    // Add event listener to the form's submit button
    document.getElementById('datasetSurvey').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        updateDatasetSurvey(control, publication_idx, study_idx, dataset_idx);
    });

    // Add event listener to the within conditions radio buttons
    document.querySelectorAll('input[name="has_within_conditions"]').forEach((elem) => {
        elem.addEventListener("change", function(event) {
            const fieldset = document.getElementById("withinConditionsFieldset");
            if (event.target.value == "1") {
                fieldset.disabled = false;
            } else {
                fieldset.disabled = true;
            }
        });
    });

    // Add event listener to the within conditions radio buttons
    document.querySelectorAll('input[name="has_between_conditions"]').forEach((elem) => {
        elem.addEventListener("change", function(event) {
            const fieldset = document.getElementById("betweenConditionsFieldset");
            if (event.target.value == "1") {
                fieldset.disabled = false;
            } else {
                fieldset.disabled = true;
            }
        });
    });
}

function updateDatasetSurvey(control, publication_idx, study_idx, dataset_idx) {
    // Get values from the input fields
    const n_participants = document.getElementById('n_participants').value;
    const has_within_conditions = document.querySelector('input[name="has_within_conditions"]:checked').value === "1" ? 1 : 0;
    const within_condition_details = document.querySelector('input[name="has_within_conditions"]:checked').value === "1" ? collectWithinConditions(): 0;
    const has_between_conditions = document.querySelector('input[name="has_between_conditions"]:checked').value === "1" ? 1 : 0;
    const between_condition_details = document.querySelector('input[name="has_between_conditions"]:checked').value === "1" ? collectBetweenConditions() : 0;

    // Store the values in the control object
    control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx].data = {
        n_participants: n_participants,
        has_within_conditions: has_within_conditions,
        within_condition_details: has_within_conditions == "1" ? within_condition_details : '',
        has_between_conditions: has_between_conditions,
        between_condition_details: has_between_conditions == "1" ? between_condition_details : '',
    };

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');
}

function addWithinCondition() {
    const conditionName = document.getElementById('within_condition_name').value;
    const conditionIdentifier = document.getElementById('within_condition_identifier').value;

    if (conditionName && conditionIdentifier) {
        const conditionsList = document.getElementById('withinConditionsList');

        // Create a new list item for the condition
        const listItem = document.createElement('li');
        listItem.textContent = `Condition: ${conditionName}, Identifier: ${conditionIdentifier}`;

        // Append the new list item to the conditions list
        conditionsList.appendChild(listItem);

        // Clear the input fields
        document.getElementById('within_condition_name').value = '';
        document.getElementById('within_condition_identifier').value = '';
    } else {
        alert('Please enter both a condition name and an identifier.');
    }
}

function addBetweenCondition() {
    const conditionName = document.getElementById('between_condition_name').value;
    const conditionIdentifier = document.getElementById('between_condition_identifier').value;

    if (conditionName && conditionIdentifier) {
        const conditionsList = document.getElementById('betweenConditionsList');

        // Create a new list item for the condition
        const listItem = document.createElement('li');
        listItem.textContent = `Condition: ${conditionName}, Identifier: ${conditionIdentifier}`;

        // Append the new list item to the conditions list
        conditionsList.appendChild(listItem);

        // Clear the input fields
        document.getElementById('between_condition_name').value = '';
        document.getElementById('between_condition_identifier').value = '';
    } else {
        alert('Please enter both a condition name and an identifier.');
    }
}

// Function to collect within conditions
function collectWithinConditions() {
    var withinConditions = [];
    var listItems = document.getElementById("withinConditionsList").getElementsByTagName("li");
    for (var i = 0; i < listItems.length; i++) {
        var conditionText = listItems[i].childNodes[0].nodeValue;
        var conditionParts = conditionText.split(", Identifier: ");
        var conditionName = conditionParts[0].replace("Condition: ", "").trim();
        var conditionIdentifier = conditionParts[1].trim();
        withinConditions.push({ name: conditionName, identifier: conditionIdentifier });
    }
    return withinConditions;
}

// Function to collect between conditions
function collectBetweenConditions() {
    var betweenConditions = [];
    var listItems = document.getElementById("betweenConditionsList").getElementsByTagName("li");
    for (var i = 0; i < listItems.length; i++) {
        var conditionText = listItems[i].childNodes[0].nodeValue;
        var conditionParts = conditionText.split(", Identifier: ");
        var conditionName = conditionParts[0].replace("Condition: ", "").trim();
        var conditionIdentifier = conditionParts[1].trim();
        betweenConditions.push({ name: conditionName, identifier: conditionIdentifier });
    }
    return betweenConditions;
}