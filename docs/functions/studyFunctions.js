function addStudy(parentElement, control, publication_idx) {
    const study_idx = getNewId(control.publication_info[publication_idx].study_info);
    const studyName = "Study " + (study_idx + 1);
    control.publication_info[publication_idx].study_info[study_idx] = setupStudyInfo(studyName);

    // Create a new list item for the study
    const listItem = document.createElement("li");
    listItem.className = "collapsible";
    listItem.dataset.index = "study-" + publication_idx + "-" + study_idx;
    listItem.id = "study-" + publication_idx + "-" + study_idx;


    // Create a span for the study name
    const span = document.createElement("span");
    span.textContent = studyName;

    // Create action buttons
    const actions = document.createElement("div");
    actions.className = "actions";

    const removeButton = document.createElement("button");
    removeButton.innerHTML = '&times;'; // Red X
    removeButton.classList.add('delete-button');
    removeButton.onclick = function(event) {
        event.stopPropagation();
        removeItem(listItem, control);
    };
    actions.appendChild(removeButton);

    // Append the span and actions to the list item
    listItem.appendChild(span);
    listItem.appendChild(actions);

    // Create a nested list for datasets
    const nestedList = document.createElement("ul");
    nestedList.className = "nested";

    // Append the nested list to the study item
    listItem.appendChild(nestedList);

    // Append the new list item to the parent element
    parentElement.appendChild(listItem);

    // Add collapsible functionality
    listItem.addEventListener("click", function(event) {
        if (event.target === this) {
            this.classList.toggle("active");
        }
    });
    // Toggle the collapsible on by default
    listItem.classList.add("active");

    // Update content area
    span.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevent the collapsible toggle
        initializeStudySurvey(control, publication_idx, study_idx);
    });

    // Add measurement survey
    addMeasurement(nestedList, control, publication_idx, study_idx);

    // Add condition survey
    addConditions(nestedList, control, publication_idx, study_idx);

    // Add repetition survey
    addRepetition(nestedList, control, publication_idx, study_idx);

    // Add raw data survey
    addRawData(nestedList, control, publication_idx, study_idx);

}

function initializeStudySurvey(control, publication_idx, study_idx) {
    study_data = control.publication_info[publication_idx].study_info[study_idx].study_data;
    studyName = control.publication_info[publication_idx].study_info[study_idx].study_name;

    document.getElementById("content").innerHTML = `
    <div class="display-text">
        <h1>${studyName}</h1>
        <p>This section is designed to collect key details about the study you conducted. The information you provide here will help us better understand the scope and methodology of your research. You'll be asked about how you measured truth ratings, what other measures were included in your study, the types of analysis you performed, and the specific statements or stimuli used in your research.</p>
        <p>If your study is available on an open-source platform, you’ll also have the option to share a link, ensuring that others can access the full study for further exploration.</p>
        <p>This information is crucial for ensuring that your study is well-documented and can be effectively integrated into our database. Thank you for taking the time to provide these details.</p>

        <form id="studySurvey" class="survey-form">
            <label for="truth_rating_scale" class="survey-label">With what scale did you measure the truth rating of a statement?</label>
            <div class="radio-buttons">
                <input type="radio" id="dichotomous" name="truth_rating_scale" value="dichotomous" ${study_data.truth_rating_scale === 'dichotomous' ? 'checked' : ''} required>
                <label for="dichotomous">Dichotomous</label>
                <input type="radio" id="likert" name="truth_rating_scale" value="likert" ${study_data.truth_rating_scale === 'likert' ? 'checked' : ''} required>
                <label for="likert">Likert</label>
                <input type="radio" id="range" name="truth_rating_scale" value="range" ${study_data.truth_rating_scale === 'range' ? 'checked' : ''} required>
                <label for="range">Range</label>
                <input type="radio" id="other" name="truth_rating_scale" value="other" ${study_data.truth_rating_scale === 'other' ? 'checked' : ''} required>
                <label for="other">Other</label><br>
            </div>
            <fieldset id="other_rating_scale_fieldset" ${study_data.truth_rating_scale === 'other' ? '' : 'disabled'}>
                <div class="form-item">
                    <label for="truth_rating_scale_details" class="survey-label">Please provide further details:</label>
                    <input type="text" id="truth_rating_scale_details" name="truth_rating_scale_details" value="${study_data.truth_rating_scale_details || ''}" required/>
                </div>
            </fieldset>

            <label for="truth_rating_steps" class="survey-label">How many steps did your rating scale have?</label>
            <input type="number" id="truth_rating_steps" name="truth_rating_steps" value="${study_data.truth_rating_steps || ''}" required><br>
            <p class="survey-label-additional-info">For example, a 7-point Likert Scale would have 7 steps.</p>

            <label for="statement_set_select" class="survey-label">Select the statement set used:</label>
            <select id="statement_set_select" name="statement_set_select" required>
                <option value="">Select a statement set</option>
                <!-- Options will be populated dynamically -->
            </select><br>

            <label for="subjective_certainty" class="survey-label">Was subjective certainty measured?</label>
            <div class="radio-buttons">
                <label><input type="radio" name="subjective_certainty" value="1" ${study_data.subjective_certainty == 1 ? 'checked' : ''} required/>Yes</label>
                <label><input type="radio" name="subjective_certainty" value="0" ${study_data.subjective_certainty == 0 ? 'checked' : ''} required/>No</label>
            </div>

            <label for="rt_measured" class="survey-label">Did you measure response time?</label>
            <div class="radio-buttons">
                <label><input type="radio" name="rt_measured" value="1" ${study_data.rt_measured == 1 ? 'checked' : ''} required/>Yes</label>
                <label><input type="radio" name="rt_measured" value="0" ${study_data.rt_measured == 0 ? 'checked' : ''} required/>No</label>
            </div>

            <fieldset id="rtMeasuredFieldset" ${study_data.rt_measured == 1 ? '' : 'disabled'}>
                <label for="rt_onset" class="survey-label">What event marked the onset of response time measurement?</label>
                <input type="text" id="rt_onset" name="rt_onset" value="${study_data.rt_onset || ''}"><br>
            </fieldset>

            <label for="n_groups" class="survey-label">How many between conditions did you have in the study?</label>
            <input type="number" id="n_groups" name="n_groups" value="${study_data.n_groups || ''}" required><br>

            <label for="participant_age" class="survey-label">Was was the average age of your participants?</label>
            <input type="number" step="0.01" id="participant_age" name="participant_age" value="${study_data.participant_age || ''}" required><br>

            <label for="percentage_female" class="survey-label">Which percentage of your participants was female?</label>
            <input type="number" step="0.01" id="percentage_female" name="percentage_female" value="${study_data.percentage_female || ''}" required><br>

            <label for "secondary_tasks" class="survey-label">Did your participants complete any secondary (distracting) tasks between exposure and test sessions?</label>
            <div class="radio-buttons">
                <label><input type="radio" name="secondary_tasks" value="1" ${study_data.has_secondary_tasks == 1 ? 'checked' : ''} required/>Yes</label>
                <label><input type="radio" name="secondary_tasks" value="0" ${study_data.has_secondary_tasks == 0 ? 'checked' : ''} required/>No</label>
            </div>

            <fieldset id="secondaryTaskFieldset" ${study_data.has_secondary_tasks == 1 ? '' : 'disabled'}>
                <label for="secondary_task_type" class="survey-label">What type of secondary task did the participants complete (verbal/numeric/figural)?</label>
                <input type="text" id="secondary_task_type" name="secondary_task_type" value="${study_data.secondary_task_type || ''}"><br>

                <label for="secondary_task_name" class="survey-label">What was the name of the secondary task employed?</label>
                <input type="text" id="secondary_task_name" name="secondary_task_name" value="${study_data.secondary_task_name || ''}"><br>
                <p class="survey-label-additional-info">If you employed multiple secondary tasks, list the names separated by commas, i.e. "Stroop Task, Simon Task"</p>
            </fieldset>

            <label for="physiological_measures" class="survey-label">Did you collect any physiological data?</label>
            <div class="radio-buttons">
                <label><input type="radio" name="physiological_measures" value="1" ${study_data.physiological_measures == 1 ? 'checked' : ''} required/>Yes</label>
                <label><input type="radio" name="physiological_measures" value="0" ${study_data.physiological_measures == 0 ? 'checked' : ''} required/>No</label>
            </div>

            <label for="cognitive_models" class="survey-label">Did you employ any cognitive models in your analysis?</label>
            <div class="radio-buttons">
                <label><input type="radio" name="cognitive_models" value="1" ${study_data.cognitive_models == 1 ? 'checked' : ''} required/>Yes</label>
                <label><input type="radio" name="cognitive_models" value="0" ${study_data.cognitive_models == 0 ? 'checked' : ''} required/>No</label>
            </div>

            <label for="open_data_link" class="survey-label">If available, provide the link to the data on an open access resource sharing platform.</label>
            <input type="text" id="open_data_link" name="open_data_link" value="${study_data.open_data_link || ''}" required><br>

            <label for="study_comment" class="survey-label">Would you like to provide any additional information?</label>
            <textarea id="study_comment" name="study_comment" rows="4" cols="50">${study_data.study_comment || ''}</textarea><br>

            <button type="submit" class="survey-button">Submit</button>
        </form>
    </div>
    `;

    populateStatementSets(control);

    // Add event listener to the within conditions radio buttons
    document.querySelectorAll('input[name="truth_rating_scale"]').forEach((elem) => {
        elem.addEventListener("change", function(event) {
            const fieldset = document.getElementById("other_rating_scale_fieldset");
            if (event.target.value == "other") {
                fieldset.disabled = false;
            } else {
                fieldset.disabled = true;
            }
        });
    });

    document.querySelectorAll('input[name="rt_measured"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('rtMeasuredFieldset').disabled = this.value == '0';
        });
    });

    document.querySelectorAll('input[name="secondary_tasks"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('secondaryTaskFieldset').disabled = this.value == '0';
        });
    });

    // Add event listener to the form's submit button
    document.getElementById('studySurvey').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        if (validateStudyData(collectStudyData()) || control.testing){
            updateStudySurvey(control, publication_idx, study_idx);
        }
    });
}

function collectStudyData() {
    // Get values from the input fields
    const truth_rating_scale = document.querySelector('input[name="truth_rating_scale"]:checked').value;
    const truth_rating_scale_details = document.getElementById('truth_rating_scale_details').value;
    const truth_rating_steps = document.getElementById('truth_rating_steps').value;
    const subjective_certainty = document.querySelector('input[name="subjective_certainty"]:checked').value === "1" ? 1 : 0;
    const rt_measured = document.querySelector('input[name="rt_measured"]:checked').value === "1" ? 1 : 0;
    const rt_onset = document.getElementById('rt_onset').value;
    const n_groups = document.getElementById('n_groups').value;
    const participant_age = document.getElementById('participant_age').value;
    const percentage_female = document.getElementById('percentage_female').value;
    const physiological_measures = document.querySelector('input[name="physiological_measures"]:checked').value === "1" ? 1 : 0;
    const cognitive_models = document.querySelector('input[name="cognitive_models"]:checked').value === "1" ? 1 : 0;
    const open_data_link = document.getElementById('open_data_link').value;
    const study_comment = document.getElementById('study_comment').value;
    const statement_set_select = document.getElementById('statement_set_select').value;

    const secondary_tasks = document.querySelector('input[name="secondary_tasks"]:checked').value === "1" ? 1 : 0;
    const secondary_task_type = secondary_tasks ? document.getElementById('secondary_task_type').value : '';
    const secondary_task_name = secondary_tasks ? document.getElementById('secondary_task_name').value : '';

    // Store the values in the control object
    const study_data = {
        truth_rating_scale: truth_rating_scale,
        truth_rating_scale_details: truth_rating_scale_details,
        truth_rating_steps: truth_rating_steps,
        subjective_certainty: subjective_certainty,
        rt_measured: rt_measured,
        rt_onset: rt_onset,
        n_groups: n_groups,
        participant_age: participant_age,
        percentage_female: percentage_female,
        physiological_measures: physiological_measures,
        cognitive_models: cognitive_models,
        open_data_link: open_data_link,
        study_comment: study_comment,
        statement_set_name: statement_set_select,
        has_secondary_tasks: secondary_tasks,
        secondary_task_type: secondary_task_type,
        secondary_task_name: secondary_task_name,
    }

    return study_data;
}

function validateStudyData(study_data) {
    return true;
}

function updateStudySurvey(control, publication_idx, study_idx) {
    const study_data = collectStudyData();
    study_data.validated = true;
    control.publication_info[publication_idx].study_info[study_idx].study_data = study_data;

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');

    // Add a checkmark to the currently selected sidebar item
    const item_id =  "study-" + publication_idx + "-" + study_idx;
    addGreenCheckmarkById(item_id);
}

function populateStatementSets(control) {
    const statementSetSelect = document.getElementById('statement_set_select');
    
    // Clear existing options
    statementSetSelect.innerHTML = '';

    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a statement set';
    statementSetSelect.appendChild(defaultOption);

    // Populate the drop-down with statement sets
    for (const key in control.statementset_info) {
        const option = document.createElement('option');
        option.value = control.statementset_info[key].statementset_name;
        option.textContent = control.statementset_info[key].statementset_name;
        statementSetSelect.appendChild(option);
    }
}