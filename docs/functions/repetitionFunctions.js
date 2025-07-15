function addRepetition(parentElement, control, publication_idx, study_idx) {
    // Create a new list item for the dataset
    const listItem = document.createElement("li");
    listItem.className = "collapsible collapsible-nocontent";
    listItem.dataset.index = "repetitions-" + publication_idx + "-" + study_idx;
    listItem.id = "repetitions-" + publication_idx + "-" + study_idx;


    // Create a span for the dataset name
    const span = document.createElement("span");
    span.textContent = "Procedure";

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
    <div class="container my-5">
  <h1>${study_name}: Procedure</h1>
  <p>This section focuses on gathering detailed information about the times statements were presented to participants.</p>
  <p>Importantly, this is also where you have to enter multiple conditions if settings of statement presentation <strong>differed</strong> between or within participants. If you had two sessions for all participants - an exposure and a test session - and manipulated any of the settings asked below between participants, e.g. you told half of the participants that some of the statements may be repeated (but only in the test phase), then you should enter a total of 3 distinct conditions of statement presentation. One common exposure condition with identical settings for all participants and two different test conditions encoding the two experimental groups.</p>
  <p>If you manipulated any part of the experiment (between or within participants) and cannot encode this through different conditions here because we did not provide a precise question, you will have the opportunity to add this manipulation in the "Experimental Conditions" tab.</p>

  <h2>Procedure Information:</h2>
  <form id="repetitionSurvey">
    <div class="mb-4">
      <label for="presentation_identifier" class="form-label">How is this statement presentation condition identified in the raw data?</label>
      <input type="text" class="form-control" id="presentation_identifier" name="presentation_identifier" />
      <div class="form-text">This identifier <strong>must</strong> be identical to the value of the column "presentation_identifier" in the raw data. This encodes information about different presentation settings, caused either by repeated measurements or experimental manipulations of the settings entered below.</div>
    </div>

    <div class="mb-4">
      <label for="repetition_time" class="form-label">When was this presentation session conducted relative to the first exposure to the statements? Enter the amount of minutes since the first session.</label>
      <input type="number" class="form-control" id="repetition_time" name="repetition_time" step="0.1" />
      <div class="form-text">This should be "0", if it is the first session. It would be "60", if the session was conducted one hour after the first session.</div>
    </div>

    <div class="mb-4">
      <label for="repetition_location" class="form-label">Where was this session conducted? (Lab / Online)</label>
      <input type="text" class="form-control" id="repetition_location" name="repetition_location" />
    </div>

    ${generateYesNoField("phase", "What phase was this session (i.e. exposure / test)?", null, "Exposure", "Test")}


    ${generateYesNoField("data_available", "Is raw data available for this session?", null)}

    <div class="mb-4">
      <label for="repetition_type" class="form-label">What type was the repetition of statements (exact / semantic)?</label>
      <input type="text" class="form-control" id="repetition_type" name="repetition_type" />
      <div class="form-text">Even if none of the statements presented were repeated in this session, enter the type of repetition that will occur.</div>
    </div>

    <div class="mb-4">
      <label for="presentation_type" class="form-label">How were the statements presented (visual / auditory)?</label>
      <input type="text" class="form-control" id="presentation_type" name="presentation_type" />
    </div>

    <div class="mb-4">
      <label for="max_n_repetitions" class="form-label">What was the maximum number of times a statement was presented during this session? Enter 1, if statements were only presented once.</label>
      <input type="number" class="form-control" id="max_n_repetitions" name="max_n_repetitions" />
    </div>

    <div class="mb-4">
      <label for="n_statements" class="form-label">How many statements were presented to each participant?</label>
      <input type="number" class="form-control" id="n_statements" name="n_statements" />
    </div>

    ${generateYesNoField("truth_instructions", "Were the participants instructed that some of these statements may be false?", null)}

    <fieldset id="truthInstructionsFieldset" ${repetition_data.truth_instructions == 1 ? '' : 'disabled'} class="mb-4">
      <div class="mb-4">
        <label class="form-label">When were the participants instructed that some of these statements may be false?</label>
        <div id=truth_instruction_timing>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="truth_instruction_timing" id="truth_instruction_timing_exposure">
                <label class="form-check-label" for="truth_instruction_timing_exposure">Before the exposure session</label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="truth_instruction_timing" id="truth_instruction_timing_test">
                <label class="form-check-label" for="truth_instruction_timing_test">Before the test session</label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="truth_instruction_timing" id="truth_instruction_timing_both">
                <label class="form-check-label" for="truth_instruction_timing_both">Before both the exposure and the test session</label>
            </div>
        </div>
      </div>
    </fieldset>

    ${generateYesNoField("repetition_instructions", "Were the participants instructed that some of the statements may be repeated?", null)}

    <fieldset id="repetitionInstructionsFieldset" ${repetition_data.repetition_instructions == 1 ? '' : 'disabled'} class="mb-4">
      <div class="mb-4">
        <label class="form-label">When were the participants instructed that some of these statements may be repeated?</label>
        <div id=repetition_instruction_timing>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="repetition_instruction_timing" id="repetition_instruction_timing_exposure">
                <label class="form-check-label" for="repetition_instruction_timing_exposure">Before the exposure session</label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="repetition_instruction_timing" id="repetition_instruction_timing_test">
                <label class="form-check-label" for="repetition_instruction_timing_test">Before the test session</label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="repetition_instruction_timing" id="repetition_instruction_timing_both">
                <label class="form-check-label" for="repetition_instruction_timing_both">Before both the exposure and the test session</label>
            </div>
        </div>
      </div>
    </fieldset>

    ${generateYesNoField("presented_until_response", "Were the statements presented until response?", null)}

    <fieldset id="presentationTimeFieldset" ${repetition_data.presented_until_response == 0 ? '' : 'disabled'} class="mb-4">
      <label for="presentation_time_s" class="form-label">For how long (in seconds) was each statement presented?</label>
      <input type="number" class="form-control" id="presentation_time_s" name="presentation_time_s" step="0.001" />
    </fieldset>

    ${generateYesNoField("response_deadline", "Was there a response deadline?", null)}

    <fieldset id="responseDeadlineFieldset" ${repetition_data.response_deadline == 1 ? '' : 'disabled'} class="mb-4">
      <label for="response_deadline_s" class="form-label">How long (in seconds) did participants have to respond?</label>
      <input type="number" class="form-control" id="response_deadline_s" name="response_deadline_s" step="0.5" />
    </fieldset>

    <div class="mb-4">
      <label for="percent_repeated" class="form-label">What percentage of the statements was repeated?</label>
      <input type="number" class="form-control" id="percent_repeated" name="percent_repeated" step="0.01" />
      <div class="form-text">If 50% of your statements was repeated, enter "50".</div>
    </div>

    <div class="mb-4">
      <button type="button" onclick="addRepetitionEntry()" class="btn btn-primary">Add Presentation Condition</button>
    </div>

    <label id="listOfRepetitions" class="form-label d-none">List of Conditions</label>
    <div id="repetitionTableContainer" class="table-responsive d-none mb-4">
      <table id="repetitionsTable" class="table table-bordered table-striped">
        <thead></thead>
        <tbody></tbody>
      </table>
    </div>

    <button type="submit" class="btn btn-success">Submit</button>
  </form>

</div>

    `;

   // Display previous submission if available
    if (control.publication_info[publication_idx].study_info[study_idx].repetition_validated) {
        displayRepetitionSummary(repetition_data);
        document.getElementById('repetitionTableContainer').classList.remove('d-none');
        document.getElementById('listOfRepetitions').classList.remove('d-none');
    }

    // Toggle disabled states based on radio inputs

    document.querySelectorAll('input[name="presented_until_response"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('presentationTimeFieldset').disabled = this.value === '1';
        });
    });

    document.querySelectorAll('input[name="response_deadline"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('responseDeadlineFieldset').disabled = this.value === '0';
        });
    });

    document.querySelectorAll('input[name="truth_instructions"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('truthInstructionsFieldset').disabled = this.value === '0';
        });
    });

    document.querySelectorAll('input[name="repetition_instructions"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('repetitionInstructionsFieldset').disabled = this.value === '0';
        });
    });

    // Form submission handler
    document.getElementById('repetitionSurvey').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        const collected_data = collectRepetitionData();
        if (validateRepetitionData(collected_data) || control.testing) {
            updateRepetitionSurvey(control, publication_idx, study_idx);
        }
    });

}

function validateRepetitionSubmission() {
    clearValidationMessages();

    const fields = {
        presentation_identifier: document.getElementById('presentation_identifier').value,
        repetition_time: document.getElementById('repetition_time').value,
        repetition_location: document.getElementById('repetition_location').value,
        repetition_type: document.getElementById('repetition_type').value,
        max_n_repetitions: document.getElementById('max_n_repetitions').value,
        n_statements: document.getElementById('n_statements').value,
        truth_instructions: getRadioButtonSelection('truth_instructions'),
        truth_instruction_timing: getRadioButtonSelection('truth_instruction_timing'),
        presented_until_response: getRadioButtonSelection('presented_until_response'),
        presentation_time_s: document.getElementById('presentation_time_s').value,
        response_deadline: getRadioButtonSelection('response_deadline'),
        response_deadline_s: document.getElementById('response_deadline_s').value,
        percent_repeated: document.getElementById('percent_repeated').value,
        presentation_type: document.getElementById('presentation_type').value,
        phase: getRadioButtonSelection('phase'),
        data_available:getRadioButtonSelection('data_available'),
        repetition_instructions: getRadioButtonSelection('repetition_instructions'),
        repetition_instruction_timing: getRadioButtonSelection('repetition_instruction_timing')
    };

    var required_fields = ['presentation_identifier', 'repetition_time', 'repetition_location', 'repetition_type', 'data_available', 'max_n_repetitions', 'n_statements', 'truth_instructions', 'presented_until_response', 'response_deadline', 'percent_repeated', 'presentation_type', 'phase', 'repetition_instructions'];
    
    if (fields.presented_until_response == 0) {
        required_fields.push('presentation_time_s');
    }
    
    if (fields.response_deadline == 1) {
        required_fields.push('response_deadline_s');
    }

    if (fields.truth_instructions == 1) {
        required_fields.push('truth_instruction_timing');
    }

    if (fields.repetition_instructions == 1) {
        required_fields.push('repetition_instruction_timing');
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


    const identifiers = repetition_data.map(sessions => sessions.presentation_identifier);
    if (new Set(identifiers).size !== identifiers.length) {
        alert_message = 'Identifiers for sessions must be unique.';
        displayValidationError("listOfRepetitions", alert_message);
        return false;
    }


    return true
}

function addRepetitionEntry() {
    if (!validateRepetitionSubmission()) {
        return;
    }
    const presentation_identifier = document.getElementById('presentation_identifier').value;
    const repetition_time = document.getElementById('repetition_time').value;
    const repetition_location = document.getElementById('repetition_location').value;
    const repetition_type = document.getElementById('repetition_type').value;
    const max_n_repetitions = document.getElementById('max_n_repetitions').value;
    const n_statements = document.getElementById('n_statements').value;
    const truth_instructions = getRadioButtonSelection('truth_instructions') == 1 ? 1 : 0;
    const truth_instruction_timing = truth_instructions == 1 ? getRadioButtonSelection('truth_instruction_timing'): '';
    const presentation_time_s = document.getElementById('presentation_time_s').value;
    const presented_until_response = getRadioButtonSelection('presented_until_response') == 1 ? 1 : 0;
    const response_deadline = getRadioButtonSelection('response_deadline') == 1 ? 1 : 0;
    const response_deadline_s = document.getElementById('response_deadline_s').value;
    const percent_repeated = document.getElementById('percent_repeated').value;
    const presentation_type = document.getElementById('presentation_type').value;
    const phase = getRadioButtonSelection('phase');
    const data_available = getRadioButtonSelection('data_available') == 1 ? 1 : 0;
    const repetition_instructions = getRadioButtonSelection('repetition_instructions') == 1 ? 1 : 0;
    const repetition_instruction_timing = repetition_instructions == 1 ? getRadioButtonSelection('repetition_instruction_timing') : '';

    // const repetitions_table = document.getElementById('repetitionsTable').getElementsByTagName('tbody')[0];

    // Collect existing repetitions
    const repetitions = collectRepetitionData();

    // Add the new repetition
    repetitions.push({
        presentation_identifier,
        repetition_time,
        repetition_location,
        repetition_type,
        max_n_repetitions,
        n_statements,
        truth_instructions,
        truth_instruction_timing,
        presentation_time_s,
        presented_until_response,
        response_deadline,
        response_deadline_s,
        percent_repeated,
        presentation_type,
        phase,
        data_available,
        repetition_instructions,
        repetition_instruction_timing
    });

    // // Clear the input fields
    // document.getElementById('presentation_identifier').value = '';
    // document.getElementById('repetition_time').value = '';
    // document.getElementById('repetition_location').value = '';
    // document.getElementById('repetition_type').value = '';
    // document.getElementById('max_n_repetitions').value = '';
    // document.getElementById('n_statements').value = '';
    // document.querySelector('input[name="response_deadline"]:checked').checked = false;
    // document.querySelector('input[name="truth_instructions"]:checked').checked = false;
    // document.querySelector('input[name="truth_instruction_timing"]:checked').checked = false;
    // document.getElementById('presentation_time_s').value = '';
    // document.querySelector('input[name="presented_until_response"]:checked').checked = false;
    // document.getElementById('response_deadline_s').value = '';
    // document.getElementById('percent_repeated').value = '';
    // document.getElementById('presentation_type').value = '';
    // document.getElementById('phase').value = '';
    // document.querySelector('input[name="repetition_instructions"]:checked').checked = false;
    // document.querySelector('input[name="repetition_instruction_timing"]:checked').checked = false;


    // // hide the fieldsets
    // document.getElementById('presentationTimeFieldset').disabled = true;
    // document.getElementById('responseDeadlineFieldset').disabled = true;
    // document.getElementById('truthInstructionsFieldset').disabled = true;
    // document.getElementById('repetitionInstructionFieldset').disabled = true;

    // Display the updated summary
    displayRepetitionSummary(repetitions);

    // Show the table if it's hidden
    document.getElementById('repetitionTableContainer').classList.remove('d-none');
    document.getElementById('listOfRepetitions').classList.remove('d-none');

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

    // Store the values in the control object
    control.publication_info[publication_idx].study_info[study_idx].repetition_data = repetition_data
    control.publication_info[publication_idx].study_info[study_idx].repetition_validated = true;
    
    // Optionally, display a confirmation message
    showAlert('Survey submitted successfully!', 'success');

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
    repetitions.forEach((session, index) => {
        const th = document.createElement('th');

        th.textContent = `Condition: ${session.presentation_identifier}`;

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