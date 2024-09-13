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
        <p>This section focuses on gathering detailed information about a specific dataset. Your answers here should pertain to the same sample of participants throughout, ensuring consistency in your responses.</p>
        <p>We’ll also ask about any experimental manipulations you conducted within the dataset. This is important so you can provide context if anything unusual occurred during the study, helping others understand potential variations in the data.</p>
        <p>Additionally, you’ll be asked about the measurement occasions and how you administered the statements to participants. This will help clarify the timing, format, and procedure used during data collection.</p>
        <p>Lastly, we will guide you through the process of uploading your raw data, ensuring that your dataset is accurately and fully represented in our database. This step is crucial for allowing others to reanalyze or build upon your work.</p>
        
        <form id="repetitionSurvey" class="survey-form">
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

            <button type="button" onclick="addRepetitionEntry()" class="add-button">Add Repetition</button><br><br>
            <label class="survey-label" id = "listOfRepetitions" style = "display: none;">List of Repetitions</label>
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

    document.getElementById('repetitionSurvey').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        const collected_data = collectRepetitionData();
        if (validateRepetitionData(collected_data)){
            updateRepetitionSurvey(control, publication_idx, study_idx);
        }
    });
}

function validateRepetitionSubmission() {
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

    console.log(fields);

    // Check if any field is empty or not selected
    for (const field of fields) {
        if (!field || field === '') {
            console.log('Invalid field:', field);
            return false;
        }
    }
    return true;
}
function validateRepetitionData(repetition_data) {
    //c
    console.log(repetition_data);
    return true
}

function addRepetitionEntry() {
    if (!validateRepetitionSubmission()) {
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
        const repetitions = collectRepetitionData();

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
        document.getElementById('listOfRepetitions').style.display = 'block';
    } else {
        alert('Please fill out all repetition fields.');
    }
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