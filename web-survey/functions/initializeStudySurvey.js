function initializeStudySurvey(control, publication_idx, study_idx) {
    study_data = control.publication_info[publication_idx].study_info[study_idx].data;
    studyName = control.publication_info[publication_idx].study_info[study_idx].study_name;

    document.getElementById("content").innerHTML = `
        <h2>${studyName}</h2>
        <form id="studySurvey">
            <label for="statementset">What statementset did you use in this study?</label>
            <input type="text" id="statementset" name="statementset" value="${study_data.statementset || ''}" required><br>

            <label for="numRepetitions">How many repetitions were done in this study?</label>
            <input type="number" id="numRepetitions" name="numRepetitions" value="${study_data.num_repetitions || ''}" required><br>

            <button type="submit">Submit</button>
        </form>
    `;

    // Add event listener to the form's submit button
    document.getElementById('studySurvey').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        updateStudySurvey(control, publication_idx, study_idx);
    });
}