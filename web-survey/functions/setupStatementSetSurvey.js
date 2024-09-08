function initializeStatementSetSurvey(control, statementset_idx) {
    const statementset_data = control.statementset_info[statementset_idx].data;
    const statementset_name = control.statementset_info[statementset_idx].statementset_name;

    document.getElementById("content").innerHTML = `
    <div class="display-text">
        <h1>${statementset_name}</h1>
        <p>In this section, please provide a file containing the statements used in your study. Including this file allows researchers to more closely replicate your study by reviewing the exact statements that were presented to participants.</p>
        <p>It is important that the statement IDs in this file match exactly with those used in your raw data. This consistency ensures that the statements can be correctly linked to the corresponding data points in your dataset.</p>
        <p>If available, please include columns with the following information:</p>
        <ul>
            <li><strong>statement_id:</strong> A unique identifier for each statement.</li>
            <li><strong>statement_text:</strong> The text of the statement as it was presented to participants.</li>
            <li><strong>statement_accuracy:</strong> The accuracy of the statement, indicating whether it is true or false.</li>
            <li><strong>statement_category:</strong> The category or type of the statement, if applicable.</li>
            <li><strong>proportion of people who rated it as true:</strong> The percentage of participants who rated the statement as true.</li>
        </ul>
        <p><i> HERE SHOULD GO AN EXAMPLE OF A CSV FILE</i></p>
        <p>Including these details will enhance the reproducibility of your study and provide valuable context for those analyzing your data.</p>
        <p>Once you have prepared your statement file according to these specifications, you can upload it using the form provided below. Thank you for your contribution!</p>

        <form id="statementSetSurvey" class="survey-form">
            <label for="statement_publication_file" class="survey-label">Please upload a .csv file where the statements you used are listed.</label>
            <input type="file" id="statement_publication_file" name="statement_publication_file" accept=".csv" required><br>
            <span id="file-name-display">${statementset_data.statement_publication_file ? `File: ${statementset_data.statement_publication_file.name}` : ''}</span><br>

            <label for="statement_publication" class="survey-label">If available, provide the original publication where this set of statements originates from.</label>
            <input type="text" id="statement_publication" name="statement_publication" value="${statementset_data.statement_publication || ''}"><br>

            <button type="submit" class="survey-button">Submit</button>
        </form>
    </div>
    `;

    // Add event listener to the file input to display the selected file name
    document.getElementById('statement_publication_file').addEventListener('change', function(event) {
        const fileNameDisplay = document.getElementById('file-name-display');
        if (event.target.files.length > 0) {
            fileNameDisplay.textContent = `File: ${event.target.files[0].name}`;
        } else {
            fileNameDisplay.textContent = '';
        }
    });

    // Add event listener to the form's submit button
    document.getElementById('statementSetSurvey').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        if (validateStatementSetData(collectStatementSetData())) {
            updateStatementSetSurvey(control, statementset_idx);
        }
    });

}

function collectStatementSetData(){
    const statementPublicationFile = document.getElementById('statement_publication_file').files[0];
    const statementPublication = document.getElementById('statement_publication').value;


    const statementset_data = {
        statementPublicationFile: statementPublicationFile,
        statementPublication: statementPublication,
        // So we can have updates on validation status
        validated: true,
    }

    // Display the updated file name in the submission box
    const fileNameDisplay = document.getElementById('file-name-display');
    if (statementPublicationFile) {
        fileNameDisplay.textContent = `File: ${statementPublicationFile.name}`;
    } else {
        fileNameDisplay.textContent = '';
    }

    return statementset_data;
}

function validateStatementSetData(statementset_data){
    if (!statementset_data.statementPublicationFile) {
        alert('Please upload a file containing the statements used in your study.');
        return false;
    }

    return true;
}

function updateStatementSetSurvey(control, statementset_idx) {
    const statementset_data = collectStatementSetData();

    control.statementset_info[statementset_idx].data = statementset_data;

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');

    // Add a checkmark to the currently selected sidebar item
    const item_id =  "statementset-" + statementset_idx;
    addGreenCheckmarkById(item_id);
}