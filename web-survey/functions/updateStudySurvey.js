function updateStudySurvey(control, publication_idx, study_idx) {
    // Get values from the input fields
    const statementset = document.getElementById('statementset').value;
    const num_repetitions = document.getElementById('numRepetitions').value;

    // Store the values in the control object
    control.publication_info[publication_idx].study_info[study_idx].data = {
        statementset: statementset,
        num_repetitions: num_repetitions,
    }

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');
}