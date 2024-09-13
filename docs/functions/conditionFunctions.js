function addConditions(parentElement, control, publication_idx, study_idx) {
    // Create a new list item for the dataset
    const listItem = document.createElement("li");
    listItem.className = "collapsible collapsible-nocontent";
    listItem.dataset.index = "conditions-" + publication_idx + "-" + study_idx;
    listItem.id = "conditions-" + publication_idx + "-" + study_idx;


    // Create a span for the dataset name
    const span = document.createElement("span");
    span.textContent = "Experimental Conditions";

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
        initializeConditionSurvey(control, publication_idx, study_idx);
    });
}

function initializeConditionSurvey(control, publication_idx, study_idx){
    const condition_data = control.publication_info[publication_idx].study_info[study_idx].condition_data;
    const study_name = control.publication_info[publication_idx].study_info[study_idx].study_name;

    document.getElementById("content").innerHTML = `
    <div class="display-text">
        <h1>${study_name}: Experimental Conditions</h1>
        <p>This section focuses on gathering detailed information about a specific dataset. Your answers here should pertain to the same sample of participants throughout, ensuring consistency in your responses.</p>
        <p>We’ll also ask about any experimental manipulations you conducted within the dataset. This is important so you can provide context if anything unusual occurred during the study, helping others understand potential variations in the data.</p>
        <p>Additionally, you’ll be asked about the measurement occasions and how you administered the statements to participants. This will help clarify the timing, format, and procedure used during data collection.</p>
        <p>Lastly, we will guide you through the process of uploading your raw data, ensuring that your dataset is accurately and fully represented in our database. This step is crucial for allowing others to reanalyze or build upon your work.</p>
        
        <form id="conditionSurvey" class="survey-form">
            <label for="has_within_conditions" class="survey-label">Does this data contain any within conditions?</label>
            <div class="form-item">
                <label><input type="radio" name="has_within_conditions" value="1" ${condition_data.has_within_conditions == 1 ? 'checked' : ''}/>Yes</label>
                <label><input type="radio" name="has_within_conditions" value="0" ${condition_data.has_within_conditions == 0 ? 'checked' : ''}/>No</label>
            </div>

            
            <fieldset id="withinConditionsFieldset" ${condition_data.has_within_conditions == 1 ? '' : 'disabled'}>
                <label for="within_condition_name" class="survey-label">Add a description of the condition:</label>
                <input type="text" id="within_condition_name" name="within_condition_name"><br>

                <label for="within_condition_identifier" class="survey-label">How is that condition identified in the raw data?</label>
                <input type="text" id="within_condition_identifier" name="within_condition_identifier"><br>

                <button type="button" onclick="addWithinCondition()" class="add-button">Add Condition</button><br><br>

                <label class="survey-label">List of Conditions:</label>
                <ul id="withinConditionsList" class = "list-of-entries"></ul>
            </fieldset>

            <label for="has_between_conditions" class="survey-label">Does this data contain any between conditions?</label>
            <div class="form-item">
                <label><input type="radio" name="has_between_conditions" value="1" ${condition_data.has_between_conditions == 1 ? 'checked' : ''}/>Yes</label>
                <label><input type="radio" name="has_between_conditions" value="0" ${condition_data.has_between_conditions == 0 ? 'checked' : ''}/>No</label>
            </div>

            <fieldset id="betweenConditionsFieldset" ${condition_data.has_between_conditions == 1 ? '' : 'disabled'}>
                <label for="between_condition_name" class="survey-label">Add a description of the condition:</label>
                <input type="text" id="between_condition_name" name="between_condition_name"><br>

                <label for="between_condition_identifier" class="survey-label">How is that condition identified in the raw data?</label>
                <input type="text" id="between_condition_identifier" name="between_condition_identifier"><br>

                <button type="button" onclick="addBetweenCondition()" class="add-button">Add Condition</button><br><br>

                <label class="survey-label">List of Conditions:</label>
                <ul id="betweenConditionsList" class = "list-of-entries"></ul>
            </fieldset>
            <button type="submit" class="survey-button">Submit</button>
        </form>
    </div>
    `;

    // Display previous submission if available
    if (condition_data && condition_data.has_within_conditions == 1) {
        var withinConditionsList = document.getElementById("withinConditionsList");
        condition_data.within_condition_details.forEach(function(condition) {
            var li = document.createElement("li");
            li.textContent = `Condition: ${condition.name}, Identifier: ${condition.identifier}`;

            add_delete_button_to_list_item(li);
            withinConditionsList.appendChild(li);
        });
    }

    if (condition_data && condition_data.has_between_conditions == 1) {
        var betweenConditionsList = document.getElementById("betweenConditionsList");
        condition_data.between_condition_details.forEach(function(condition) {
            var li = document.createElement("li");
            li.textContent = `Condition: ${condition.name}, Identifier: ${condition.identifier}`;

            add_delete_button_to_list_item(li);

            betweenConditionsList.appendChild(li);
        });
    }

    
    document.querySelectorAll('input[name="has_within_conditions"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('withinConditionsFieldset').disabled = this.value == '0';
        });
    });

    document.querySelectorAll('input[name="has_between_conditions"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('betweenConditionsFieldset').disabled = this.value == '0';
        });
    });

    document.getElementById('conditionSurvey').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission
        if (validateConditionData(collectConditionData()) || control.testing){
            updateConditionSurvey(control, publication_idx, study_idx);
        }
    });
}


function addWithinCondition() {
    const condition_name = document.getElementById('within_condition_name').value;
    const condition_identifier = document.getElementById('within_condition_identifier').value;

    if (condition_name && condition_identifier) {
        const conditionsList = document.getElementById('withinConditionsList');

        // Create a new list item for the condition
        const listItem = document.createElement('li');
        listItem.textContent = `Condition: ${condition_name}, Identifier: ${condition_identifier}`;

        add_delete_button_to_list_item(listItem);

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
    const condition_name = document.getElementById('between_condition_name').value;
    const condition_identifier = document.getElementById('between_condition_identifier').value;

    if (condition_name && condition_identifier) {
        const conditionsList = document.getElementById('betweenConditionsList');

        // Create a new list item for the condition
        const listItem = document.createElement('li');
        listItem.textContent = `Condition: ${condition_name}, Identifier: ${condition_identifier}`;

        add_delete_button_to_list_item(listItem);

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

function collectConditionData() {
    // Get values from the input fields
    const has_within_conditions = document.querySelector('input[name="has_within_conditions"]:checked').value === "1" ? 1 : 0;
    const within_condition_details = document.querySelector('input[name="has_within_conditions"]:checked').value === "1" ? collectWithinConditions() : [];
    const has_between_conditions = document.querySelector('input[name="has_between_conditions"]:checked').value === "1" ? 1 : 0;
    const between_condition_details = document.querySelector('input[name="has_between_conditions"]:checked').value === "1" ? collectBetweenConditions() : [];
   
    // Store the values in the control object
    condition_data = {
        has_within_conditions: has_within_conditions,
        within_condition_details: has_within_conditions ? within_condition_details : [],
        has_between_conditions: has_between_conditions,
        between_condition_details: has_between_conditions ? between_condition_details : [],
    };

    return condition_data
}

function validateConditionData(condition_data){
    // if has_within_conditions is true, check if there are any conditions
    if (condition_data.has_within_conditions == 1 && condition_data.within_condition_details.length < 2) {
        alert('Please add at least one two within conditions.');
        return false;
    }
    //same for between conditions
    if (condition_data.has_between_conditions == 1 && condition_data.between_condition_details.length < 2) {
        alert('Please add at least one two between conditions.');
        return false;
    }

    return true
}

function updateConditionSurvey(control, publication_idx, study_idx) {
    condition_data = collectConditionData();

    condition_data.validated = validateConditionData(condition_data);

    // Store the values in the control object
    control.publication_info[publication_idx].study_info[study_idx].condition_data = condition_data

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');

    // Add a checkmark to the currently selected sidebar item
    const item_id =  "conditions-" + publication_idx + "-" + study_idx;
    addGreenCheckmarkById(item_id);
}