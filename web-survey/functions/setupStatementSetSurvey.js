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
        <form id="statementSetSurvey" class = "survey-form">
            <label for="authors" class ="survey-label">Authors:</label>
            <input type="text" id="authors" name="authors" value="${statementset_data.authors || ''}" required><br>

            <label for="date" class = "survey-label">Date Conducted:</label>
            <input type="date" id="date" name="date" value="${statementset_data.date_conducted || ''}" required><br>

            <label for="title" class = "survey-label">Title of Publication:</label>
            <input type="text" id="title" name="title" value="${statementset_data.title || ''}" required><br>

            <button type="submit" class = "survey-button">Submit</button>
        </form>
    `;

    // Add event listener to the form's submit button
    document.getElementById('statementSetSurvey').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        updateStatementSetSurvey(control, statementset_idx);
    });
}

function updateStatementSetSurvey(control, statementset_idx) {
    // Get values from the input fields
    const authors = document.getElementById('authors').value;
    const date = document.getElementById('date').value;
    const title = document.getElementById('title').value;

    // Store the values in the control object
    control.statementset_info[statementset_idx].data = {
        authors: authors,
        date_conducted: date,
        title: title,
    }

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');
}