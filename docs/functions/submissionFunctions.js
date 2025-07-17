function cleanDataForSubmission(control) {
    var cleaned_control = {
        publication_data: {},
        study_info: {},
        statementset_info: {},
    };

    // Copy publication data, exclude the validated field 
    const { validated, ...publication_data } = control.publication_info[0].publication_data;
    cleaned_control.publication_data = publication_data;
    
    // Iterate over statementsets
    for (let statementset_idx in control.statementset_info) {
        const statementset_data = control.statementset_info[statementset_idx].statementset_data.statement_publication_data;
        const statementset_publication = control.statementset_info[statementset_idx].statementset_data.statement_publication;
        cleaned_control.statementset_info[statementset_idx] = { 
            statementset_data,
            statementset_publication
        };
    }

    // Iterate over studies
    for (let study_idx in control.publication_info[0].study_info) {
        const study_info = control.publication_info[0].study_info[study_idx];
        const { validated: study_validated, ...study_data } = study_info.study_data;
        const { validated: repetition_validated, ...repetition_data } = study_info.repetition_data;
        const { validated: conditions_validated, ...condition_data } = study_info.condition_data;
        const { validated: measurement_validated, ...measurement_data } = study_info.measurement_data;
        const raw_data = study_info.raw_data.data;

        cleaned_control.study_info[study_idx] = {
            study_data,
            repetition_data,
            condition_data,
            measurement_data,
            raw_data
        };
    }
    
    return cleaned_control
}

function showSubmissionSuccessModal() {
    // Initialize Bootstrap modal instance for the modal element
    const modalEl = document.getElementById('confirmModalSubmission');
    const modal = new bootstrap.Modal(modalEl);
    
    const user = 'sven.lesche';
    const domain = 'psychologie.uni-heidelberg.de';
    const email = `${user}@${domain}`;
    const link = document.getElementById('email-success1');
    link.href = `mailto:${email}`;
    link.textContent = email;

    // Show the modal
    modal.show();
  
    // Optional: handle "Got it!" button click to close the modal
    const confirmBtn = document.getElementById('confirmEmailBtn');
    confirmBtn.onclick = () => modal.hide();
  }
  

function submitData(control) {
    if (!validate_submission(control)) {
        return;
    }

    //console.log(control);
    const version_number = "1.0.1"; // Replace with the actual version number

    // clean the control data
    const cleaned_control = cleanDataForSubmission(control);

    console.log(cleaned_control);

    control.version_number = version_number;
    cleaned_control.version_number = version_number;

    // Write the data into a json file
    const submission_data = JSON.stringify(cleaned_control);

    // Download the data locally
    const blob = new Blob([submission_data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submission_${cleaned_control.publication_data.first_author}_${cleaned_control.publication_data.conducted}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    saveProgress(control);

    showSubmissionSuccessModal();
}

function validate_submission(control) {
    clearValidationMessages();
    
    var alert_messages = [];

    // Validate publication data
    if (!control.publication_info[0].publication_data.validated) {
        alert_messages.push("Please validate the publication data before submitting.");
    }

    // Validate study data
    for (let study_idx in control.publication_info[0].study_info) {
        let study = control.publication_info[0].study_info[study_idx];

        if (!study.study_data.validated) {
            alert_messages.push(`Please validate the study data of Study ${parseInt(study_idx) + 1} before submitting.`);
        }

        if (!study.repetition_validated) {
            alert_messages.push(`Please validate the procedure data of Study ${parseInt(study_idx) + 1} before submitting.`);
        }

        if (!study.measurement_data.validated) {
            alert_messages.push(`Please validate the measure data of Study ${parseInt(study_idx) + 1} before submitting.`);
        }

        if (!study.raw_data.validated) {
            alert_messages.push(`Please validate the raw data of Study ${parseInt(study_idx) + 1} before submitting.`);
        }

        if (!study.condition_data.validated) {
            alert_messages.push(`Please validate the condition data of Study ${parseInt(study_idx) + 1} before submitting.`);
        }
    }

    // Validate statement set data
    for (let statementset_idx in control.statementset_info) {
        if (!control.statementset_info[statementset_idx].statementset_data.validated) {
            alert_messages.push(`Please validate the statement set data of statementset ${parseInt(statementset_idx) + 1} before submitting.`);
        }
    }

    if (alert_messages.length > 0) {
        displayValidationError('final-submit-button', `❌ There were ${alert_messages.length} errors:<br>` + alert_messages.join('<br>'));
        return false;
    }

    return true;
}

function saveProgress(control){
    control.progress_file = true;
    // Write the data into a json file
    const submission_data = JSON.stringify(control);

    // Download the data locally
    const blob = new Blob([submission_data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progress_${control.publication_info[0].publication_data.first_author}_${control.publication_info[0].publication_data.conducted}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    showAlert("Progress file downloaded successfully!", 'success');
}

function addCheckmarksFromProgress(control) {
    const num_total_publications = Object.keys(control.publication_info).length;
    const num_statement_sets = Object.keys(control.statementset_info).length;

    for (let publication_idx in control.publication_info) {
        let publication = control.publication_info[publication_idx];
        if (publication.publication_data.validated) {
            // Add a checkmark to the currently selected sidebar item
            const item_id =  "publication-" + publication_idx;
            addGreenCheckmarkById(item_id);
        }

        for (let study_idx in control.publication_info[publication_idx].study_info) {
            let study = control.publication_info[publication_idx].study_info[study_idx];
            
            // Add checkmark for the study
            if (study.study_data.validated) {
                // Add a checkmark to the currently selected sidebar item
                const item_id =  "study-" + publication_idx + "-" + study_idx;
                addGreenCheckmarkById(item_id);
            }

            // Add checkmarks for repetition data
            if (study.repetition_validated) {
                addGreenCheckmarkById(`repetitions-${publication_idx}-${study_idx}`);
            }

            if (study.measurement_data.validated) {
                addGreenCheckmarkById(`measures-${publication_idx}-${study_idx}`);
            }

            if (study.raw_data.validated) {
                addGreenCheckmarkById(`rawdata-${publication_idx}-${study_idx}`);
            }

            if (study.condition_data.validated) {
                addGreenCheckmarkById(`conditions-${publication_idx}-${study_idx}`);
            }
        }
    }

    // Iterate over statement sets
    for (let statementset_idx = 0; statementset_idx < num_statement_sets; statementset_idx++) {
        if (control.statementset_info[statementset_idx].statementset_data.validated) {
            addGreenCheckmarkById(`statementset-${statementset_idx}`);
        }
    }
}

function initializeNavbarFromProgress(progress) {
    const num_statement_sets = Object.keys(progress.statementset_info).length;

    for (let publication_idx in progress.publication_info) {

        for (let study_idx in progress.publication_info[publication_idx].study_info) {
            // Create the study element if it doesn't exist
            const studyItemId = "study-" + publication_idx + "-" + study_idx;
            if (!document.getElementById(studyItemId)) {
                const addStudyButton = document.getElementById("addStudyButton-" + publication_idx);
                if (addStudyButton) {
                    addStudyButton.click();
                }
            }
        }
    }

    // Iterate over statement sets
    for (let statementset_idx = 0; statementset_idx < num_statement_sets; statementset_idx++) {
        const statementSetId = "statementset-" + statementset_idx;
        if (!document.getElementById(statementSetId)) {
            const addStatementButton = document.getElementById("addStatementButton");
            if (addStatementButton) {
                addStatementButton.click();
            }
        }
    }
}