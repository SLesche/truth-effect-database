function initializeDatasetSurvey(control, publication_idx, study_idx, dataset_idx) {
    const dataset_data = control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx].data;
    const dataset_name = control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx].dataset_name;

    document.getElementById("content").innerHTML = `
        <h2>${dataset_name}</h2>
        <form id="datasetSurvey" class="survey-form">
            <label for="n_participants" class="survey-label">How many participants are contained in this data?</label>
            <input type="number" id="n_participants" name="n_participants" value="${dataset_data.n_participants || ''}" required><br>

            <label for="has_within_conditions" class="survey-label">Does this data contain any within conditions?</label>
            <div class="form-item">
                <label><input type="radio" name="has_within_conditions" value="1" ${dataset_data.has_within_conditions == 1 ? 'checked' : ''}/>Yes</label>
                <label><input type="radio" name="has_within_conditions" value="0" ${dataset_data.has_within_conditions == 0 ? 'checked' : ''}/>No</label>
            </div>

            <fieldset id="withinConditionsFieldset" ${dataset_data.has_within_conditions == 1 ? '' : 'disabled'}>
                <div class="form-item">
                    <label for="within_condition_details" class="survey-label">Please provide details about the within conditions:</label>
                    <input type="text" id="within_condition_details" name="within_condition_details" value="${dataset_data.within_condition_details || ''}" required/>
                </div>
            </fieldset>

            <label for="has_between_conditions" class="survey-label">Does this data contain any between conditions?</label>
            <div class="form-item">
                <label><input type="radio" name="has_between_conditions" value="1" ${dataset_data.has_between_conditions == 1 ? 'checked' : ''}/>Yes</label>
                <label><input type="radio" name="has_between_conditions" value="0" ${dataset_data.has_between_conditions == 0 ? 'checked' : ''}/>No</label>
            </div>

            <fieldset id="betweenConditionsFieldset" ${dataset_data.has_between_conditions == 1 ? '' : 'disabled'}>
                <div class="form-item">
                    <label for="between_condition_details" class="survey-label">Please provide details about the between conditions:</label>
                    <input type="text" id="between_condition_details" name="between_condition_details" value="${dataset_data.between_condition_details || ''}" required/>
                </div>
            </fieldset>

            <button type="submit" class="survey-button">Submit</button>
        </form>
    `;

    // Add event listener to the form's submit button
    document.getElementById('datasetSurvey').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        updateDatasetSurvey(control, publication_idx, study_idx, dataset_idx);
    });

    // Add event listener to the within conditions radio buttons
    document.querySelectorAll('input[name="has_within_conditions"]').forEach((elem) => {
        elem.addEventListener("change", function(event) {
            const fieldset = document.getElementById("withinConditionsFieldset");
            if (event.target.value == "1") {
                fieldset.disabled = false;
            } else {
                fieldset.disabled = true;
            }
        });
    });

    // Add event listener to the within conditions radio buttons
    document.querySelectorAll('input[name="has_between_conditions"]').forEach((elem) => {
        elem.addEventListener("change", function(event) {
            const fieldset = document.getElementById("betweenConditionsFieldset");
            if (event.target.value == "1") {
                fieldset.disabled = false;
            } else {
                fieldset.disabled = true;
            }
        });
    });
}

function updateDatasetSurvey(control, publication_idx, study_idx, dataset_idx) {
    // Get values from the input fields
    const n_participants = document.getElementById('n_participants').value;
    const has_within_conditions = document.querySelector('input[name="has_within_conditions"]:checked').value === "1" ? 1 : 0;
    const within_condition_details = document.getElementById('within_condition_details').value;
    const has_between_conditions = document.querySelector('input[name="has_between_conditions"]:checked').value === "1" ? 1 : 0;

    // Store the values in the control object
    control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx].data = {
        n_participants: n_participants,
        has_within_conditions: has_within_conditions,
        within_condition_details: has_within_conditions == "1" ? within_condition_details : '',
        has_between_conditions: has_between_conditions
    };

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');
}