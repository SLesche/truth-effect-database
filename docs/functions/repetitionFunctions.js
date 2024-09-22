function addRepetition(parentElement, control, publication_idx, study_idx) {
    // Create a new list item for the dataset
    const listItem = document.createElement("li");
    listItem.className = "collapsible collapsible-nocontent";
    listItem.dataset.index = "repetitions-" + publication_idx + "-" + study_idx;
    listItem.id = "repetitions-" + publication_idx + "-" + study_idx;


    // Create a span for the dataset name
    const span = document.createElement("span");
    span.textContent = "Measurement Sessions";

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
        initializeRepetitionSurvey(control, publication_idx, study_idx);
    });
}

function initializeRepetitionSurvey(control, publication_idx, study_idx) {
    const repetition_data = control.publication_info[publication_idx].study_info[study_idx].repetition_data;
    const study_name = control.publication_info[publication_idx].study_info[study_idx].study_name;

    document.getElementById("content").innerHTML = `
    <div class="display-text">
        <h1>${study_name}: Measurement Sessions</h1>
        <p>This section focuses on gathering detailed information about the separate times statements were presented to participants, which we refer to as measurement sessions. A measurement session refers to any distinct occasion when participants were exposed to statements. For example, if participants had an exposure phase at 9:00 AM followed by a test phase at 9:30 AM, these would count as two separate measurement sessions.</p>
        <p>Throughout this section, it’s important that your answers remain consistent and refer to the same sample of participants for all sessions. You’ll be asked to provide details on the timing, context, and procedures used during each session to help clarify how data was collected.</p>
        <form id="repetitionSurvey" class="survey-form">
            <label for="repetition_time" class="survey-label">When was this session conducted relative to the first sessions? Enter the amount of minutes since the first session.</label>
            <input type="number" id="repetition_time" name="repetition_time" step="1"><br>
            <p class="survey-label-additional-info">This should be "0", if it is the first session. It would be "60", if the session was conducted one hour after the first session.</p>

            <label for="repetition_location" class="survey-label">Where was this session conducted? (Lab / Online)</label>
            <input type="text" id="repetition_location" name="repetition_location"><br>

            <label for="phase" class="survey-label">What phase was this session (i.e. exposure / test)?</label>
            <input type="text" id="phase" name="phase"><br>

            <label for="repetition_type" class="survey-label">What type was the session (exact / semantic)?</label>
            <input type="text" id="repetition_type" name="repetition_type"><br>

            <label for="max_n_repetitions" class="survey-label">What was the maximum number of times a statement was presented during this session? Enter 1, if statements were only presented once.</label>
            <input type="number" id="max_n_repetitions" name="max_n_repetitions"><br>

            <label for="n_statements" class="survey-label">How many statements were presented?</label>
            <input type="number" id="n_statements" name="n_statements"><br>

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

            <label for="presented_until_response" class="survey-label">Were the statements presented until response?</label>
            <div class="radio-buttons">
                <label><input type="radio" name="presented_until_response" value="1"/>Yes</label>
                <label><input type="radio" name="presented_until_response" value="0"/>No</label>
            </div>

            <fieldset id="presentationTimeFieldset" ${repetition_data.presented_until_response == 0 ? '' : 'disabled'}>
                <label for="presentation_time_s" class="survey-label">For how long (in seconds) was each statement presented?</label>
                <input type="number" id="presentation_time_s" name="presentation_time_s" step="0.5"><br>
            </fieldset>

            <label for="response_deadline" class="survey-label">Was there a response deadline?</label>
            <div class="radio-buttons">
                <label><input type="radio" name="response_deadline" value="1"/>Yes</label>
                <label><input type="radio" name="response_deadline" value="0"/>No</label>
            </div>

            <fieldset id="responseDeadlineFieldset" ${repetition_data.response_deadline == 1 ? '' : 'disabled'}>
                <label for="response_deadline_s" class="survey-label">How long (in seconds) did participants have to respond?</label>
                <input type="number" id="response_deadline_s" name="response_deadline_s" step="0.5"><br>
            </fieldset>

            <label for="percent_repeated" class="survey-label">What percentage of the statements was repeated?</label>
            <input type="number" id="percent_repeated" name="percent_repeated" step="0.01"><br>

            <label for="presentation_type" class="survey-label">How were the statements presented (visual / auditory)?</label>
            <input type="text" id="presentation_type" name="presentation_type"><br>

            <button type="button" onclick="addRepetitionEntry()" class="add-button">Add Session</button><br><br>
            <label class="survey-label" id = "listOfRepetitions" style = "display: none;">List of Sessions</label>
            <div id="repetitionTableContainer" class = "table-container" style = "display: none;">
                <table id="repetitionsTable">
                    <thead>
                        <!-- Header will be populated by JavaScript -->
                    </thead>
                    <tbody>
                        <!-- Body will be populated by JavaScript -->
                    </tbody>
                </table>
            </div>
            
            <button type="submit" class="survey-button">Submit</button>
        </form>
    </div>
    `;

    // Display previous submission if available
    if (repetition_data.validated) {
        displayRepetitionSummary(repetition_data);
        document.getElementById('repetitionTableContainer').style.display = 'block';
        document.getElementById('listOfRepetitions').style.display = 'block';
    }

    document.querySelectorAll('input[name="presented_until_response"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('presentationTimeFieldset').disabled = this.value == '1';
        });
    });

    document.querySelectorAll('input[name="response_deadline"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('responseDeadlineFieldset').disabled = this.value == '0';
        });
    });

    document.getElementById('repetitionSurvey').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        const collected_data = collectRepetitionData();
        if (validateRepetitionData(collected_data) || control.testing){
            updateRepetitionSurvey(control, publication_idx, study_idx);
        }
    });
}

function validateRepetitionSubmission() {
    clearValidationMessages();

    const fields = {
        repetition_time: document.getElementById('repetition_time').value,
        repetition_location: document.getElementById('repetition_location').value,
        repetition_type: document.getElementById('repetition_type').value,
        max_n_repetitions: document.getElementById('max_n_repetitions').value,
        n_statements: document.getElementById('n_statements').value,
        truth_instructions: getRadioButtonSelection('truth_instructions'),
        presented_until_response: getRadioButtonSelection('presented_until_response'),
        presentation_time_s: document.getElementById('presentation_time_s').value,
        response_deadline: getRadioButtonSelection('response_deadline'),
        response_deadline_s: document.getElementById('response_deadline_s').value,
        percent_repeated: document.getElementById('percent_repeated').value,
        presentation_type: document.getElementById('presentation_type').value,
        phase: document.getElementById('phase').value,
        repetition_instructions: getRadioButtonSelection('repetition_instructions')
    };

    var required_fields = ['repetition_time', 'repetition_location', 'repetition_type', 'max_n_repetitions', 'n_statements', 'truth_instructions', 'presented_until_response', 'response_deadline', 'percent_repeated', 'presentation_type', 'phase', 'repetition_instructions'];
    
    if (fields.presented_until_response == 0) {
        required_fields.push('presentation_time_s');
    }
    
    if (fields.response_deadline == 1) {
        required_fields.push('response_deadline_s');
    }

    for (const field of required_fields) {
        if (!fields[field]) {
            displayValidationError(field, 'This field is required.');
            return false;
        }
    }

    return true;
}
function validateRepetitionData(repetition_data) {
    clearValidationMessages();

    var alert_message = 'This field does not match validation criteria.';
    // Make sure it has at least one entry
    if (repetition_data.length === 0) {
        alert_message = 'Please add at least one session.';
        displayValidationError('listOfRepetitions', alert_message);
        document.getElementById('listOfRepetitions').style.display = 'block';

        return false;
    }

    // Check that the first entry of repetition time is 0
    if (parseInt(repetition_data[0].repetition_time) !== 0) {
        alert_message = 'The first session time must be 0.';
        displayValidationError('listOfRepetitions', alert_message);
        return false;
    }

    // Check that the repetition time increases steadily over sessions
    for (let i = 1; i < repetition_data.length; i++) {
        if (parseInt(repetition_data[i].repetition_time) <= parseInt(repetition_data[i - 1].repetition_time)) {
            alert_message = 'Session times must increase over sessions.';
            displayValidationError('listOfRepetitions', alert_message);
            return false;
        }
    }
    return true
}

function addRepetitionEntry() {
    if (!validateRepetitionSubmission()) {
        return;
    }
    const repetition_time = document.getElementById('repetition_time').value;
    const repetition_location = document.getElementById('repetition_location').value;
    const repetition_type = document.getElementById('repetition_type').value;
    const max_n_repetitions = document.getElementById('max_n_repetitions').value;
    const n_statements = document.getElementById('n_statements').value;
    const truth_instructions = getRadioButtonSelection('truth_instructions') == 1 ? 1 : 0;
    const presentation_time = document.getElementById('presentation_time_s').value;
    const presented_until_response = getRadioButtonSelection('presented_until_response') == 1 ? 1 : 0;
    const response_deadline = getRadioButtonSelection('response_deadline') == 1 ? 1 : 0;
    const response_deadline_s = document.getElementById('response_deadline_s').value;
    const percent_repeated = document.getElementById('percent_repeated').value;
    const presentation_type = document.getElementById('presentation_type').value;
    const phase = document.getElementById('phase').value;
    const repetition_instructions = getRadioButtonSelection('repetition_instructions') == 1 ? 1 : 0;

    const repetitions_table = document.getElementById('repetitionsTable').getElementsByTagName('tbody')[0];

    // Collect existing repetitions
    const repetitions = collectRepetitionData();

    // Add the new repetition
    repetitions.push({
        repetition_time,
        repetition_location,
        repetition_type,
        max_n_repetitions,
        n_statements,
        truth_instructions,
        presentation_time,
        presented_until_response,
        response_deadline,
        response_deadline_s,
        percent_repeated,
        presentation_type,
        phase,
        repetition_instructions
    });

    // Clear the input fields
    document.getElementById('repetition_time').value = '';
    document.getElementById('repetition_location').value = '';
    document.getElementById('repetition_type').value = '';
    document.getElementById('max_n_repetitions').value = '';
    document.getElementById('n_statements').value = '';
    document.querySelector('input[name="response_deadline"]:checked').checked = false;
    document.querySelector('input[name="truth_instructions"]:checked').checked = false;
    document.getElementById('presentation_time_s').value = '';
    document.querySelector('input[name="presented_until_response"]:checked').checked = false;
    document.getElementById('response_deadline_s').value = '';
    document.getElementById('percent_repeated').value = '';
    document.getElementById('presentation_type').value = '';
    document.getElementById('phase').value = '';
    document.querySelector('input[name="repetition_instructions"]:checked').checked = false;

    // hide the fieldsets
    document.getElementById('presentationTimeFieldset').disabled = true;
    document.getElementById('responseDeadlineFieldset').disabled = true;

    // Display the updated summary
    displayRepetitionSummary(repetitions);

    // Show the table if it's hidden
    document.getElementById('repetitionTableContainer').style.display = 'block';
    document.getElementById('listOfRepetitions').style.display = 'block';

}

function collectRepetitionData() {
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

function updateRepetitionSurvey(control, publication_idx, study_idx) {
    const repetition_data = collectRepetitionData();

    repetition_data.validated = true;
    // Store the values in the control object
    control.publication_info[publication_idx].study_info[study_idx].repetition_data = repetition_data

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');

    // Add a checkmark to the currently selected sidebar item
    const item_id =  "repetitions-" + publication_idx + "-" + study_idx;
    addGreenCheckmarkById(item_id);
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
        max_n_repetitions: 'N Repetitions',
        n_statements: 'N Statements',
        time_pressure: 'Time Pressure?',
        truth_instructions: 'Truth Instructions?',
        presentation_time_s: 'Presentation Time (s)',
        percent_repeated: 'Percent Repeated',
        presentation_type: 'Presentation Type',
        phase: 'Phase',
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