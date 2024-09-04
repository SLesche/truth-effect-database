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

            <fieldset id="repetitionsFieldset">
                <label for="repetition_time" class="survey-label">When was this session conducted relative to the first sessions? Enter the amount of hours since the first session. (0 if it is the first session)</label>
                <input type="number" id="repetition_time" name="repetition_time" step="1"><br>

                <label for="repetition_location" class="survey-label">Where was this session conducted? (Lab / Online)</label>
                <input type="text" id="repetition_location" name="repetition_location"><br>

                <label for="phase" class="survey-label">What phase was this repetition (i.e. exposure / test)?</label>
                <input type="text" id="phase" name="phase"><br>

                <label for="repetition_type" class="survey-label">What type was the repetition (exact / semantic)?</label>
                <input type="text" id="repetition_type" name="repetition_type"><br>

                <label for="n_repetitions" class="survey-label">How many times was each statement presented?</label>
                <input type="number" id="n_repetitions" name="n_repetitions"><br>

                <label for="n_statements" class="survey-label">How many statements were presented?</label>
                <input type="number" id="n_statements" name="n_statements"><br>

                <label for="time_pressure" class="survey-label">Did the the truth judgement occur under time pressure?</label>
                <input type="number" id="time_pressure" name="time_pressure" min="0" max="1"><br>

                <label for="truth_instructions" class="survey-label">Were the participants instructed that some of these statements may be false?</label>
                <input type="number" id="truth_instructions" name="truth_instructions" min="0" max="1"><br>

                <label for="repetition_instructions" class="survey-label">Were the participants instructed that some of the statements may be repeated?</label>
                <input type="number" id="repetition_instructions" name="repetition_instructions" min="0" max="1"><br>

                <label for="presentation_time_s" class="survey-label">For how long (in seconds) was each statement presented?</label>
                <input type="number" id="presentation_time_s" name="presentation_time_s" step="0.5"><br>

                <label for="percent_repeated" class="survey-label">What percentage of the statements was repeated?</label>
                <input type="number" id="percent_repeated" name="percent_repeated" step="0.01"><br>

                <label for="presentation_type" class="survey-label">How were the statements presented (visual / auditory)?</label>
                <input type="text" id="presentation_type" name="presentation_type"><br>

                <label for="secondary_task" class="survey-label">What secondary task were the participants instructed to complete (can be "none")?</label>
                <input type="text" id="secondary_task" name="secondary_task"><br>

                <button type="button" onclick="addRepetition()" class="survey-button">Add Repetition</button><br><br>

                <label class="survey-label">List of Repetitions</label>
                <ul id="repetitionsList"></ul>
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
    const repetition_info = collectRepetitions();

    // Store the values in the control object
    control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx].data = {
        n_participants: n_participants,
        has_within_conditions: has_within_conditions,
        within_condition_details: has_within_conditions == "1" ? within_condition_details : '',
        has_between_conditions: has_between_conditions,
        between_condition_details: has_between_conditions == "1" ? between_condition_details : '',
        repetition_info: repetition_info,
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
function addRepetition() {
    const repetitionTime = document.getElementById('repetition_time').value;
    const repetitionLocation = document.getElementById('repetition_location').value;
    const repetitionType = document.getElementById('repetition_type').value;
    const nRepetitions = document.getElementById('n_repetitions').value;
    const nStatements = document.getElementById('n_statements').value;
    const timePressure = document.getElementById('time_pressure').value;
    const truthInstructions = document.getElementById('truth_instructions').value;
    const presentationTime = document.getElementById('presentation_time_s').value;
    const percentRepeated = document.getElementById('percent_repeated').value;
    const presentationType = document.getElementById('presentation_type').value;
    const phase = document.getElementById('phase').value;
    const secondaryTask = document.getElementById('secondary_task').value;
    const repetitionInstructions = document.getElementById('repetition_instructions').value;

    if (repetitionTime && repetitionLocation && repetitionType && nRepetitions && nStatements && timePressure !== '' && truthInstructions !== '' && presentationTime && percentRepeated && presentationType && phase && secondaryTask && repetitionInstructions !== '') {
        const repetitionsList = document.getElementById('repetitionsList');

        if (repetitionsList) {
            // Create a new list item for the repetition
            const listItem = document.createElement('li');
            listItem.textContent = `Time: ${repetitionTime}, Location: ${repetitionLocation}, Type: ${repetitionType}, Repetitions: ${nRepetitions}, Statements: ${nStatements}, Time Pressure: ${timePressure}, Truth Instructions: ${truthInstructions}, Presentation Time: ${presentationTime}, Percent Repeated: ${percentRepeated}, Presentation Type: ${presentationType}, Phase: ${phase}, Secondary Task: ${secondaryTask}, Repetition Instructions: ${repetitionInstructions}`;

            // Append the new list item to the repetitions list
            repetitionsList.appendChild(listItem);

            // Clear the input fields
            document.getElementById('repetition_time').value = '';
            document.getElementById('repetition_location').value = '';
            document.getElementById('repetition_type').value = '';
            document.getElementById('n_repetitions').value = '';
            document.getElementById('n_statements').value = '';
            document.getElementById('time_pressure').value = '';
            document.getElementById('truth_instructions').value = '';
            document.getElementById('presentation_time_s').value = '';
            document.getElementById('percent_repeated').value = '';
            document.getElementById('presentation_type').value = '';
            document.getElementById('phase').value = '';
            document.getElementById('secondary_task').value = '';
            document.getElementById('repetition_instructions').value = '';
        } else {
            console.error('repetitionsList element not found');
        }
    } else {
        alert('Please fill out all repetition fields.');
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

// Function to collect repetitions
function collectRepetitions() {
    var repetitions = [];
    var listItems = document.getElementById("repetitionsList").getElementsByTagName("li");
    for (var i = 0; i < listItems.length; i++) {
        var repetitionText = listItems[i].childNodes[0].nodeValue;
        var repetitionParts = repetitionText.split(", ");
        var repetitionTime = repetitionParts[0].replace("Time: ", "").trim();
        var repetitionLocation = repetitionParts[1].replace("Location: ", "").trim();
        var repetitionType = repetitionParts[2].replace("Type: ", "").trim();
        var nRepetitions = repetitionParts[3].replace("Repetitions: ", "").trim();
        var nStatements = repetitionParts[4].replace("Statements: ", "").trim();
        var timePressure = repetitionParts[5].replace("Time Pressure: ", "").trim();
        var truthInstructions = repetitionParts[6].replace("Truth Instructions: ", "").trim();
        var presentationTime = repetitionParts[7].replace("Presentation Time: ", "").trim();
        var percentRepeated = repetitionParts[8].replace("Percent Repeated: ", "").trim();
        var presentationType = repetitionParts[9].replace("Presentation Type: ", "").trim();
        var phase = repetitionParts[10].replace("Phase: ", "").trim();
        var secondaryTask = repetitionParts[11].replace("Secondary Task: ", "").trim();
        var repetitionInstructions = repetitionParts[12].replace("Repetition Instructions: ", "").trim();
        repetitions.push({
            time: repetitionTime,
            location: repetitionLocation,
            type: repetitionType,
            n_repetitions: nRepetitions,
            n_statements: nStatements,
            time_pressure: timePressure,
            truth_instructions: truthInstructions,
            presentation_time_s: presentationTime,
            percent_repeated: percentRepeated,
            presentation_type: presentationType,
            phase: phase,
            secondary_task: secondaryTask,
            repetition_instructions: repetitionInstructions
        });
    }
    return repetitions;
}