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
                <label for="repetition_time" class="survey-label">Repetition Time:</label>
                <input type="number" id="repetition_time" name="repetition_time" step="0.01"><br>

                <label for="repetition_location" class="survey-label">Repetition Location:</label>
                <input type="text" id="repetition_location" name="repetition_location"><br>

                <label for="repetition_type" class="survey-label">Repetition Type:</label>
                <input type="text" id="repetition_type" name="repetition_type"><br>

                <label for="n_repetitions" class="survey-label">Number of Repetitions:</label>
                <input type="number" id="n_repetitions" name="n_repetitions"><br>

                <label for="n_statements" class="survey-label">Number of Statements:</label>
                <input type="number" id="n_statements" name="n_statements"><br>

                <label for="time_pressure" class="survey-label">Time Pressure (1 for Yes, 0 for No):</label>
                <input type="number" id="time_pressure" name="time_pressure" min="0" max="1"><br>

                <label for="truth_instructions" class="survey-label">Truth Instructions (1 for Yes, 0 for No):</label>
                <input type="number" id="truth_instructions" name="truth_instructions" min="0" max="1"><br>

                <label for="presentation_time_s" class="survey-label">Presentation Time (seconds):</label>
                <input type="number" id="presentation_time_s" name="presentation_time_s" step="0.01"><br>

                <label for="percent_repeated" class="survey-label">Percent Repeated:</label>
                <input type="number" id="percent_repeated" name="percent_repeated" step="0.01"><br>

                <label for="presentation_type" class="survey-label">Presentation Type:</label>
                <input type="text" id="presentation_type" name="presentation_type"><br>

                <label for="phase" class="survey-label">Phase:</label>
                <input type="text" id="phase" name="phase"><br>

                <label for="secondary_task" class="survey-label">Secondary Task:</label>
                <input type="text" id="secondary_task" name="secondary_task"><br>

                <label for="repetition_instructions" class="survey-label">Repetition Instructions (1 for Yes, 0 for No):</label>
                <input type="number" id="repetition_instructions" name="repetition_instructions" min="0" max="1"><br>

                <button type="button" onclick="addRepetition()" class="survey-button">Add Repetition</button><br><br>

                <label class="survey-label">List of Repetitions</label>
                <div id="repetitionTableContainer" style = "display: none;">
                    <table id="repetitionsTable" border="1">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Location</th>
                                <th>Type</th>
                                <th>Repetitions</th>
                                <th>Statements</th>
                                <th>Time Pressure</th>
                                <th>Truth Instructions</th>
                                <th>Presentation Time</th>
                                <th>Percent Repeated</th>
                                <th>Presentation Type</th>
                                <th>Phase</th>
                                <th>Secondary Task</th>
                                <th>Repetition Instructions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Repetition rows will be dynamically added here -->
                        </tbody>
                    </table>
                </div>
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

    if (dataset_data && dataset_data.repetitions) {
        displayRepetitionSummary(dataset_data.repetitions);
        document.getElementById('repetitionTableContainer').style.display = 'block';
    }

    document.getElementById('datasetSurvey').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
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
        document.getElementById('time_pressure').value = '';
        document.getElementById('truth_instructions').value = '';
        document.getElementById('presentation_time_s').value = '';
        document.getElementById('percent_repeated').value = '';
        document.getElementById('presentation_type').value = '';
        document.getElementById('phase').value = '';
        document.getElementById('secondary_task').value = '';
        document.getElementById('repetition_instructions').value = '';

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

    for (var i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
        var cells = rows[i].getElementsByTagName("td");
        var repetition = {
            repetition_time: cells[0].textContent.trim(),
            repetition_location: cells[1].textContent.trim(),
            repetition_type: cells[2].textContent.trim(),
            n_repetitions: cells[3].textContent.trim(),
            n_statements: cells[4].textContent.trim(),
            time_pressure: cells[5].textContent.trim(),
            truth_instructions: cells[6].textContent.trim(),
            presentation_time_s: cells[7].textContent.trim(),
            percent_repeated: cells[8].textContent.trim(),
            presentation_type: cells[9].textContent.trim(),
            phase: cells[10].textContent.trim(),
            secondary_task: cells[11].textContent.trim(),
            repetition_instructions: cells[12].textContent.trim()
        };
        repetitions.push(repetition);
    }
    return repetitions;
}
function updateDatasetSurvey(control, publication_idx, study_idx, dataset_idx) {
    // Get values from the input fields
    const n_participants = document.getElementById('n_participants').value;
    const has_within_conditions = document.querySelector('input[name="has_within_conditions"]:checked').value === "1" ? 1 : 0;
    const within_condition_details = document.querySelector('input[name="has_within_conditions"]:checked').value === "1" ? collectWithinConditions() : [];
    const has_between_conditions = document.querySelector('input[name="has_between_conditions"]:checked').value === "1" ? 1 : 0;
    const between_condition_details = document.querySelector('input[name="has_between_conditions"]:checked').value === "1" ? collectBetweenConditions() : [];
    const repetitions = collectRepetitions();

    // Store the values in the control object
    control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx].data = {
        n_participants: n_participants,
        has_within_conditions: has_within_conditions,
        within_condition_details: has_within_conditions ? within_condition_details : [],
        has_between_conditions: has_between_conditions,
        between_condition_details: has_between_conditions ? between_condition_details : [],
        repetitions: repetitions,
    };

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');
}

function displayRepetitionSummary(repetitions) {
    const repetitionsTable = document.getElementById('repetitionsTable').getElementsByTagName('tbody')[0];
    repetitionsTable.innerHTML = ''; // Clear existing entries

    // Create rows for each repetition
    repetitions.forEach(repetition => {
        const row = document.createElement('tr');
        Object.values(repetition).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            row.appendChild(td);
        });
        repetitionsTable.appendChild(row);
    });
}