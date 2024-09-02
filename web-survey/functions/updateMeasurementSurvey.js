function updateMeasurementSurvey(control, publication_idx, study_idx){
    // Get values from the input fields
    const measures = document.getElementById('measures').value;

    // Store the values in the control object
    control.publication_info[publication_idx].study_info[study_idx].measurement_info.data = {
        measures: measures,
    }

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');
}