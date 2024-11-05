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

function submitData(control) {
    console.log(control);

    // clean the control data
    const cleaned_control = cleanDataForSubmission(control);

    console.log(cleaned_control);
    // Write the data into a json file
    const submission_data = JSON.stringify(cleaned_control);

    // Download the data locally
    const blob = new Blob([submission_data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "submission.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    alert("Data submitted successfully!");
}

function saveProgress(control){
    // Write the data into a json file
    const submission_data = JSON.stringify(control);

    // Download the data locally
    const blob = new Blob([submission_data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "submission_progress.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    alert("Progress file downloaded successfully!");
}

function uploadProgress(progressData){
    console.log(progressData); 
    control = progressData;
    addCheckmarksFromProgress(control);
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
            if (study.repetition_data.validated) {
                addGreenCheckmarkById(`repetition-${publication_idx}-${study_idx}`);
            }

            if (study.measurement_data.validated) {
                addGreenCheckmarkById(`measurement-${publication_idx}-${study_idx}`);
            }

            if (study.raw_data.validated) {
                addGreenCheckmarkById(`rawdata-${publication_idx}-${study_idx}`);
            }

            if (study.condition_data.validated) {
                addGreenCheckmarkById(`condition-${publication_idx}-${study_idx}`);
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
