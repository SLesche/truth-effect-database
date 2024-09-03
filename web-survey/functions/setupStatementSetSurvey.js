function initializeStatementSetSurvey(control, statementset_idx) {
    const statementset_data = control.statementset_info[statementset_idx].data;
    const statementset_name = control.statementset_info[statementset_idx].statementset_name;

    document.getElementById("content").innerHTML = `
    <h2>${statementset_name}</h2>
    <p>How many studies are part of this publication? (Add studies)</p>
    <p>Provide the additional measures you collected in this study.</p>
    <p>Checklist:</p>
    <ul>
        <li>Dataset provided and checked</li>
        <li>Additional measures provided</li>
    </ul>
    <form id="statementSetSurvey" class="survey-form">
        <label for="statement_publication_file" class="survey-label">Please upload a .csv file where the statements you used are listed.</label>
        <input type="file" id="statement_publication_file" name="statement_publication_file" accept=".csv" required><br>
        <span id="file-name-display">${statementset_data.statement_publication_file ? `File: ${statementset_data.statement_publication_file.name}` : ''}</span><br>

        <label for="statement_publication" class="survey-label">If available, provide the original publication where this set of statements originates from.</label>
        <input type="text" id="statement_publication" name="statement_publication" value="${statementset_data.statement_publication || ''}"><br>

        <button type="submit" class="survey-button">${statementset_data.statement_publication_file ? 'New Upload' : 'Upload'}</button>
    </form>
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
        updateStatementSetSurvey(control, statementset_idx);
    });

}

function updateStatementSetSurvey(control, statementset_idx) {
    // Get values from the input fields
    const statementPublicationFile = document.getElementById('statement_publication_file').files[0];
    const statementPublication = document.getElementById('statement_publication').value;

    console.log(statementPublicationFile);
    // Update the control object with the new data
    // Store the values in the control object
    control.statementset_info[statementset_idx].data = {
        statement_publication_file: statementPublicationFile,
        statement_publication: statementPublication,
    }    

    // Display the updated file name in the submission box
    const fileNameDisplay = document.getElementById('file-name-display');
    if (statementPublicationFile) {
        fileNameDisplay.textContent = `File: ${statementPublicationFile.name}`;
    } else {
        fileNameDisplay.textContent = '';
    }
    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');
}