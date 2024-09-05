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

            <button type="button" onclick="toggleFieldset('repetitionsFieldset')" class="toggle-fieldset-button"><h3>Repetitions<h3></button>   
            <p>Repetitions are multiple sessions of the same study. Please provide information about each repetition.</p>  
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
                <div class="radio-buttons">
                    <label><input type="radio" name="time_pressure" value="1"/>Yes</label>
                    <label><input type="radio" name="time_pressure" value="0"/>No</label>
                </div>

                <label for="truth_instructions" class="survey-label">Were the participants instructed that some of these statements may be false?</label>
                <div class="radio-buttons">
                    <label><input type="radio" name="truth_instructions" value="1"/>Yes</label>
                    <label><input type="radio" name="truth_instructions" value="0"/>No</label>
                </div>

                <label for="repetition_instructions" class="survey-label">Were the participants instructed that some of the statements may be repeated?</label>
                <div class="radio-buttons">
                    <label><input type="radio" name="repetition_instructions" value="1"/>Yes</label>
                    <label><input type="radio" name="repetition_instructions" value="0"/>No</label>
                </div>

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
                <div id="repetitionTableContainer" style = "display: none;">
                    <table id="repetitionsTable">
                        <thead>
                            <!-- Header will be populated by JavaScript -->
                        </thead>
                        <tbody>
                            <!-- Body will be populated by JavaScript -->
                        </tbody>
                    </table>
                </div>
            </fieldset>

            <button type="button" onclick="toggleFieldset('rawDataFieldset')" class="toggle-fieldset-button"><h3>Raw Data<h3></button>   
            <p>Here, please provide some information about raw data</p>
            <fieldset id="rawDataFieldset">
                <label for="raw_data_file" class="survey-label">Please upload a .csv file with the raw data in the correct format.</label>
                <input type="file" id="raw_data_file" name="raw_data_file" accept=".csv" required><br>
                <span id="file-name-display">${dataset_data.raw_data_file ? `File: ${dataset_data.raw_data_file.name}` : ''}</span><br>
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

            add_delete_button_to_list_item(li);
            withinConditionsList.appendChild(li);
        });
    }

    // Add event listener to the file input to display the selected file name
    document.getElementById('raw_data_file').addEventListener('change', function(event) {
        const fileNameDisplay = document.getElementById('file-name-display');
        if (event.target.files.length > 0) {
            fileNameDisplay.textContent = `File: ${event.target.files[0].name}`;
        } else {
            fileNameDisplay.textContent = '';
        }
    });

    if (dataset_data && dataset_data.has_between_conditions == 1) {
        var betweenConditionsList = document.getElementById("betweenConditionsList");
        dataset_data.between_condition_details.forEach(function(condition) {
            var li = document.createElement("li");
            li.textContent = `Condition: ${condition.name}, Identifier: ${condition.identifier}`;

            add_delete_button_to_list_item(li);

            betweenConditionsList.appendChild(li);
        });
    }

    if (dataset_data && dataset_data.repetitions) {
        displayRepetitionSummary(dataset_data.repetitions);
        document.getElementById('repetitionTableContainer').style.display = 'block';
    }

    document.getElementById('datasetSurvey').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        const hasRows = repetitionsTable.getElementsByTagName('tr').length > 0;
        if (!hasRows) {
            alert("Submit at least one repetition.");
            return; 
        }
        updateDatasetSurvey(control, publication_idx, study_idx, dataset_idx);
    });

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
}

function validateRepetitionFields() {
    const fields = [
        document.getElementById('repetition_time').value,
        document.getElementById('repetition_location').value,
        document.getElementById('repetition_type').value,
        document.getElementById('n_repetitions').value,
        document.getElementById('n_statements').value,
        document.querySelector('input[name="time_pressure"]:checked'),
        document.querySelector('input[name="truth_instructions"]:checked'),
        document.getElementById('presentation_time_s').value,
        document.getElementById('percent_repeated').value,
        document.getElementById('presentation_type').value,
        document.getElementById('phase').value,
        document.getElementById('secondary_task').value,
        document.querySelector('input[name="repetition_instructions"]:checked')
    ];

    // Check if any field is empty or not selected
    for (const field of fields) {
        if (!field || field === '') {
            return false;
        }
    }
    return true;
}

function addRepetition() {
    if (!validateRepetitionFields()) {
        alert('Please fill out all fields before submitting.');
        return;
    }
    const repetitionTime = document.getElementById('repetition_time').value;
    const repetitionLocation = document.getElementById('repetition_location').value;
    const repetitionType = document.getElementById('repetition_type').value;
    const nRepetitions = document.getElementById('n_repetitions').value;
    const nStatements = document.getElementById('n_statements').value;
    const timePressure = document.querySelector('input[name="time_pressure"]:checked').value === "1" ? 1 : 0;;
    const truthInstructions = document.querySelector('input[name="truth_instructions"]:checked').value === "1" ? 1 : 0;
    const presentationTime = document.getElementById('presentation_time_s').value;
    const percentRepeated = document.getElementById('percent_repeated').value;
    const presentationType = document.getElementById('presentation_type').value;
    const phase = document.getElementById('phase').value;
    const secondaryTask = document.getElementById('secondary_task').value;
    const repetitionInstructions = document.querySelector('input[name="repetition_instructions"]:checked').value === "1" ? 1 : 0;

    if (repetitionTime && repetitionLocation && repetitionType && nRepetitions && nStatements && timePressure !== '' && truthInstructions !== '' && presentationTime && percentRepeated && presentationType && phase && secondaryTask && repetitionInstructions !== '') {
        const repetitionsTable = document.getElementById('repetitionsTable').getElementsByTagName('tbody')[0];

        // Collect existing repetitions
        const repetitions = collectRepetitions();

        // Add the new repetition
        repetitions.push({
            repetition_time: repetitionTime,
            repetition_location: repetitionLocation,
            repetition_type: repetitionType,
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

        // Clear the input fields
        document.getElementById('repetition_time').value = '';
        document.getElementById('repetition_location').value = '';
        document.getElementById('repetition_type').value = '';
        document.getElementById('n_repetitions').value = '';
        document.getElementById('n_statements').value = '';
        document.querySelector('input[name="time_pressure"]:checked').checked = false;
        document.querySelector('input[name="truth_instructions"]:checked').checked = false;
        document.getElementById('presentation_time_s').value = '';
        document.getElementById('percent_repeated').value = '';
        document.getElementById('presentation_type').value = '';
        document.getElementById('phase').value = '';
        document.getElementById('secondary_task').value = '';
        document.querySelector('input[name="repetition_instructions"]:checked').checked = false;

        // Display the updated summary
        displayRepetitionSummary(repetitions);

        // Show the table if it's hidden
        document.getElementById('repetitionTableContainer').style.display = 'block';
    } else {
        alert('Please fill out all repetition fields.');
    }
}

function collectRepetitions() {
    var repetitions = [];
    var table = document.getElementById("repetitionsTable");
    var rows = table.getElementsByTagName("tr");

    if (rows.length < 2) return repetitions; // Ensure there are at least two rows (header + data)

    var keys = [];
    for (var i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
        keys.push(rows[i].getElementsByTagName("th")[0].textContent.trim());
    }

    var columns = rows[0].getElementsByTagName("th").length - 1; // Number of repetitions (columns) excluding the first empty header cell

    for (var col = 1; col <= columns; col++) {
        var repetition = {};
        for (var row = 1; row < rows.length; row++) { // Start from 1 to skip the header row
            var cells = rows[row].getElementsByTagName("td");
            repetition[keys[row - 1]] = cells[col - 1].textContent.trim();
        }
        repetitions.push(repetition);
    }

    return repetitions;
}

function addWithinCondition() {
    const conditionName = document.getElementById('within_condition_name').value;
    const conditionIdentifier = document.getElementById('within_condition_identifier').value;

    if (conditionName && conditionIdentifier) {
        const conditionsList = document.getElementById('withinConditionsList');

        // Create a new list item for the condition
        const listItem = document.createElement('li');
        listItem.textContent = `Condition: ${conditionName}, Identifier: ${conditionIdentifier}`;

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
    const conditionName = document.getElementById('between_condition_name').value;
    const conditionIdentifier = document.getElementById('between_condition_identifier').value;

    if (conditionName && conditionIdentifier) {
        const conditionsList = document.getElementById('betweenConditionsList');

        // Create a new list item for the condition
        const listItem = document.createElement('li');
        listItem.textContent = `Condition: ${conditionName}, Identifier: ${conditionIdentifier}`;

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

function updateDatasetSurvey(control, publication_idx, study_idx, dataset_idx) {
    // Get values from the input fields
    const n_participants = document.getElementById('n_participants').value;
    const has_within_conditions = document.querySelector('input[name="has_within_conditions"]:checked').value === "1" ? 1 : 0;
    const within_condition_details = document.querySelector('input[name="has_within_conditions"]:checked').value === "1" ? collectWithinConditions() : [];
    const has_between_conditions = document.querySelector('input[name="has_between_conditions"]:checked').value === "1" ? 1 : 0;
    const between_condition_details = document.querySelector('input[name="has_between_conditions"]:checked').value === "1" ? collectBetweenConditions() : [];
    const repetitionsTable = document.getElementById('repetitionsTable');
    const hasRows = repetitionsTable.getElementsByTagName('tr').length > 0;
    const repetitions = hasRows ? collectRepetitions() : alert("Submit at least one repetition.");

    // Get values from the input fields
    const rawDataFile = document.getElementById('raw_data_file').files[0];


    // Store the values in the control object
    control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx].data = {
        n_participants: n_participants,
        has_within_conditions: has_within_conditions,
        within_condition_details: has_within_conditions ? within_condition_details : [],
        has_between_conditions: has_between_conditions,
        between_condition_details: has_between_conditions ? between_condition_details : [],
        repetitions: repetitions,
        raw_data_file: rawDataFile
    };

    // Display the updated file name in the submission box
    const fileNameDisplay = document.getElementById('file-name-display');
    if (rawDataFile) {
        fileNameDisplay.textContent = `File: ${rawDataFile.name}`;
    } else {
        fileNameDisplay.textContent = '';
    }

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');
}

function displayRepetitionSummary(repetitions) {
    //repetitions = modifyRepetitions(repetitions);
    const repetitionsTable = document.getElementById('repetitionsTable').getElementsByTagName('tbody')[0];
    repetitionsTable.innerHTML = ''; // Clear existing entries

    if (repetitions.length === 0) return;
    
    // Get the keys from the first repetition object
    const keys = Object.keys(repetitions[0]);

    // Create header row
    const headerRow = document.createElement('tr');
    const emptyHeaderCell = document.createElement('th');
    headerRow.appendChild(emptyHeaderCell); // Empty cell for the corner
    repetitions.forEach((_, index) => {
        const th = document.createElement('th');
        th.textContent = `Session ${index + 1}`;

        // Add delete button
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '&times;'; // Red X
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => {
            // Remove the column
            for (let row of repetitionsTable.rows) {
                row.deleteCell(index + 1);
            }
            // Optionally, update the repetitions array if needed
            repetitions.splice(index, 1);
            // Re-render the table to update the session numbers
            displayRepetitionSummary(repetitions);
        });
        th.appendChild(deleteButton);

        headerRow.appendChild(th);
    });
    repetitionsTable.appendChild(headerRow);

    // Create rows for each key
    keys.forEach(key => {
        const row = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = key;
        row.appendChild(th);
        repetitions.forEach(repetition => {
            const td = document.createElement('td');
            td.textContent = repetition[key];
            row.appendChild(td);
        });
        repetitionsTable.appendChild(row);
    });
}

function modifyRepetitions(repetitions) {
    const rowNames = {
        repetition_time: 'Session Time',
        repetition_location: 'Location',
        repetition_type: 'Repetition Type',
        n_repetitions: 'N Repetitions',
        n_statements: 'N Statements',
        time_pressure: 'Time Pressure?',
        truth_instructions: 'Truth Instructions?',
        presentation_time_s: 'Presentation Time (s)',
        percent_repeated: 'Percent Repeated',
        presentation_type: 'Presentation Type',
        phase: 'Phase',
        secondary_task: 'Secondary Task',
        repetition_instructions: 'Repetition Instructions?'
    };

    const modifiedRepetitions = repetitions.map(repetition => {
        const modifiedRepetition = {};
        Object.keys(rowNames).forEach(key => {
            modifiedRepetition[rowNames[key]] = repetition[key];
        });
        return modifiedRepetition;
    });

    return modifiedRepetitions;
}