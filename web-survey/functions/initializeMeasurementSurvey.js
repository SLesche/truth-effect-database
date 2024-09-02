function initializeMeasurementSurvey(control, publication_idx, study_idx){
    measurement_data = control.publication_info[publication_idx].study_info[study_idx].measurement_info.data;
    measurement_name = "Additional Measures"

    document.getElementById("content").innerHTML = `
        <h2>${measurement_name}</h2>
        <form id="measurementSurvey">
            <label for="measures">What additional measures did you use?</label>
            <input type="text" id="measures" name="measures" value="${measurement_data.measures || ''}" required><br>
            <button type="submit">Submit</button>
        </form>
    `;

    // Add event listener to the form's submit button
    document.getElementById('measurementSurvey').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        updateMeasurementSurvey(control, publication_idx, study_idx);
    });
}