function addRawData(parentElement, control, publication_idx, study_idx) {
    // Create a new list item for the dataset
    const listItem = document.createElement("li");
    listItem.className = "collapsible collapsible-nocontent";
    listItem.dataset.index = "rawdata-" + publication_idx + "-" + study_idx;
    listItem.id = "rawdata-" + publication_idx + "-" + study_idx;


    // Create a span for the dataset name
    const span = document.createElement("span");
    span.textContent = "Raw Data";

    // // Create action buttons
    // const actions = document.createElement("div");
    // actions.className = "actions";

    // const removeButton = document.createElement("button");
    // removeButton.innerHTML = '&times;'; // Red X
    // removeButton.classList.add('delete-button');
    // removeButton.onclick = function(event) {
    //     event.stopPropagation();
    //     removeItem(listItem, control);
    // };
    // actions.appendChild(removeButton);

    // Append the span and actions to the list item
    listItem.appendChild(span);
    // listItem.appendChild(actions);

    // Create a nested list for raw data
    const nestedList = document.createElement("ul");

    // Append the nested list to the dataset item
    listItem.appendChild(nestedList);

    // Append the new list item to the parent element
    parentElement.appendChild(listItem);

    // Update content area
    listItem.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevent any default action
        initializeRawDataSurvey(control, publication_idx, study_idx);
    });
}

function initializeRawDataSurvey(control, publication_idx, study_idx) {
    const raw_data = control.publication_info[publication_idx].study_info[study_idx].raw_data;
    const study_name = control.publication_info[publication_idx].study_info[study_idx].study_name;

    document.getElementById("content").innerHTML = `
    <div class="display-text">
        <h1>${study_name}: Raw Data</h1> 
            <p>Here, please provide information about your raw data by uploading it through the interface below. Your data should adhere to the following guidelines:</p>
            <ul class = "list-of-entries">
                <li>Ensure that your dataset includes all columns as specified in the guidelines. If certain measurements (e.g., reaction times) were not collected, you may leave those columns out.</li>
                <li>It is crucial that the columns you do include have the exact names we specified. This consistency is essential for accurate integration and analysis.</li>
                <li>Make sure that your experimental conditions and statements used are using exactly the same identifiers as indicated in the "Experimental Conditions" and "Statementset" surveys. This ensures that your data can be correctly interpreted in the context of the study.</li>
                <li>For any missing values, please encode them as <i>NA</i>. For example, accuracy can only take the values "0", "1" or "<i>NA</i>". If you chose any other encodings to mark missing or incomplete values, please recode these to <i>NA</i>.</li>
            </ul>
            
            <p>Below, you can find an example of how your data should be formatted. Please follow this format to ensure compatibility and ease of use:</p>
            <ul class = "list-of-entries">
                <li><strong>subject:</strong> A unique identifier for each subject.</li>
                <li><strong>presentation_identifier:</strong> A unique identifier for each presentation condition. This must be one of the identifiers encoded in "Statement Presentations".</li>
                <li><strong>trial:</strong> A unique identifier for each trial for a given subject.</li>
                <li><strong>within_identifier:</strong> A unique identifier for a within subject conditions. This must be one of the identifiers encoded in "Experimental Conditions".</li>
                <li><strong>between_identifier:</strong> A unique identifier for a between subject conditions. This must be one of the identifiers encoded in "Experimental Conditions".</li>
                <li><strong>statement_identifier:</strong> A unique identifier for each statement used. This must be one of the identifiers encoded in the "Statementset" data you uploaded.</li>
                <li><strong>response:</strong> The value of the truth rating. <b>Larger values must indicate higher truth ratings.</b></li>
                <li><strong>repeated:</strong> The value indicating whether a statement was repeated "1" or not "0" or repeated with contradicting information "-1".</li>
                <li><strong>certainty:</strong> (if measured) The value indicating the subjective certainty with which a participant gave their truth rating.</li>
                <li><strong>rt:</strong> (if measured) The value indicating the response time <b>in seconds</b>.</li>
            </ul>
            <div class = "table-container" id = "tableContainerExample">
                <table>
                    <tr>
                        <th>subject</th>
                        <th>presentation_identifier</th>
                        <th>trial</th>
                        <th>within_identifier</th>
                        <th>between_identifier</th>
                        <th>statement_identifier</th>
                        <th>rt</th>
                        <th>response</th>
                        <th>repeated</th>
                        <th>certainty</th>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>0.64</td>
                        <td><i>NA</i></td>
                        <td>0</td>
                        <td>2</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>1</td>
                        <td>2</td>
                        <td>2</td>
                        <td>1</td>
                        <td>2</td>
                        <td>0.75</td>
                        <td>7</td>
                        <td>1</td>
                        <td>7</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>2</td>
                        <td>1</td>
                        <td>0.75</td>
                        <td>1</td>
                        <td>1</td>
                        <td>3</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>1</td>
                        <td>2</td>
                        <td>2</td>
                        <td>2</td>
                        <td>2</td>
                        <td>0.76</td>
                        <td>5</td>
                        <td>1</td>
                        <td>6</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>2</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>0.64</td>
                        <td>3</td>
                        <td>0</td>
                        <td>2</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>2</td>
                        <td>2</td>
                        <td>2</td>
                        <td>1</td>
                        <td>2</td>
                        <td>0.75</td>
                        <td>7</td>
                        <td>1</td>
                        <td>7</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>2</td>
                        <td>1</td>
                        <td>1</td>
                        <td>2</td>
                        <td>1</td>
                        <td>0.75</td>
                        <td>1</td>
                        <td>1</td>
                        <td>3</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>2</td>
                        <td>2</td>
                        <td>2</td>
                        <td>2</td>
                        <td>2</td>
                        <td>0.76</td>
                        <td>5</td>
                        <td>1</td>
                        <td>6</td>
                    </tr>
                </table>
            </div>         
            <p>Once you’ve prepared your data according to these specifications, you can upload it using the form provided below. Thank you for your cooperation!</p>
            <form id="rawDataSurvey" class="survey-form">
                <label for="raw_data_file" class="survey-label">Please upload a .csv file with the raw data in the correct format.</label>
                <input type="file" id="raw_data_file" name="raw_data_file" accept=".csv" required><br>
                <span id="file-name-display">${raw_data.raw_data_file ? `File: ${raw_data.raw_data_file.name}` : ''}</span><br>
                <p id = "textUploadPreview" style = "display: none;">Uploaded file preview:</p>
                <div id="tableContainerUploaded" class = "table-container" style = "display: none;">
                </div>

                <button type="submit" class="survey-button">Submit</button>
            </form>

        </form>
    </div>
    `;

    if (raw_data.validated) {
        const rows_to_display = 6;
        const html_table = createTableFromCSV(raw_data.data, rows_to_display);
    
        // Inject table into the table container
        document.getElementById('tableContainerUploaded').innerHTML = html_table;
        document.getElementById('tableContainerUploaded').style.display = 'block';
        document.getElementById('textUploadPreview').style.display = 'block';
    }

    // Add event listener to the file input to display the selected file name
    document.getElementById('raw_data_file').addEventListener('change', async function(event) {
        const fileNameDisplay = document.getElementById('file-name-display');
        if (event.target.files.length > 0) {
            fileNameDisplay.textContent = `File: ${event.target.files[0].name}`;
        } else {
            fileNameDisplay.textContent = '';
        }

        const raw_data = await collectRawData();
        const rows_to_display = 6;
        const html_table = createTableFromCSV(raw_data.data, rows_to_display);
        
        // Inject table into the table container
        document.getElementById('tableContainerUploaded').innerHTML = html_table;
        document.getElementById('tableContainerUploaded').style.display = 'block';
        document.getElementById('textUploadPreview').style.display = 'block';
    });

    document.getElementById('rawDataSurvey').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission
        const allow_submission = checkOtherSubmissions(control, publication_idx, study_idx);
        if (allow_submission) {
            const collected_data = await collectRawData();
            if (validateRawData(collected_data, control, publication_idx, study_idx) || control.testing){
                updateRawDataSurvey(control, publication_idx, study_idx);
            }
        }
    });
}

async function collectRawData() {
    // Get values from the input fields
    const raw_data_file = document.getElementById('raw_data_file').files[0];

    if (raw_data_file) {
        try {
            const csv_data = await csvFileToObject(raw_data_file);

            raw_data = {
                raw_data_file: raw_data_file,
                data: csv_data,
            };

            // Display the updated file name in the submission box
            const fileNameDisplay = document.getElementById('file-name-display');
            if (raw_data_file) {
                fileNameDisplay.textContent = `File: ${raw_data_file.name}`;
            } else {
                fileNameDisplay.textContent = '';
            }

            return raw_data;
        } catch (error) {
            console.error('Error parsing CSV file:', error);
            // Handle error appropriately, e.g., show an error message to the user
        }
    }
}

function validateRawData(raw_data, control, publication_idx, study_idx) {
    var warningMessages = [];
    var errorMessages = [];

    alert_message = '';

    if (!raw_data.raw_data_file) {
        alert_message = 'Please upload a file containing the raw data.';
        displayValidationError('raw_data_file', alert_message);
        return false;
    }
 
    var required_headers = ['subject', 'presentation_identifier', 'trial', 'response', 'repeated'];

    // if there were experimental conditions, add those to required headers
    const study_info = control.publication_info[publication_idx].study_info[study_idx];

    if (study_info.condition_data.has_within_conditions == 1) {
        required_headers.push('within_identifier');
    }
    if (study_info.condition_data.has_between_conditions == 1) {
        required_headers.push('between_identifier');
    }

    // If there is information on statements, add that identifier to the required headers
    if (study_info.study_data.statementset_name !== "No information") {
        required_headers.push('statement_identifier');
    }

    // If there was response time collected, add that to required headers
    if (study_info.study_data.rt_measured == 1) {
        required_headers.push('rt');
    }

    // if certainty measured, add that
    if (study_info.study_data.subjective_certainty == 1) {
        required_headers.push('certainty');
    }

    // Check if all required headers are present
    const data_columns = Object.keys(raw_data.data[0]);

    const missing_headers = required_headers.filter(header => !data_columns.includes(header));
    if (missing_headers.length > 0) {
        errorMessages.push(`The following columns are missing from the uploaded file: ${missing_headers.join(', ')}.`);
    }

    // check for unknown columns
    const unknown_columns = data_columns.filter(header => !required_headers.includes(header));
    if (unknown_columns.length > 0) {
        warningMessages.push(`The uploaded file contains unknown columns: ${unknown_columns.join(', ')}`);
    }

    // Filter presentation_identifiers to exclude test phase
    const data_available_identifiers = study_info.repetition_data
        .filter(data => data.data_available == 1)
        .map(data => data.presentation_identifier);

    // Extract unique session identifiers from raw data, excluding 'NA'
    const unique_sessions = [...new Set(
        raw_data.data
            .map(row => row.presentation_identifier)
            .filter(presentation_identifier => presentation_identifier !== 'NA')
        )].map(String);

    // Check for missing identifiers
    const missing_presentation_identifiers = data_available_identifiers.filter(identifier => !unique_sessions.includes(identifier));

    // Check for extra presentation identifiers
    const extra_presentation_identifiers = unique_sessions.filter(identifier => !data_available_identifiers.includes(identifier));

    if (missing_presentation_identifiers.length > 0) {
        errorMessages.push(`The following presentation identifiers marked as "data available" are missing from the uploaded file: ${missing_presentation_identifiers.join(', ')}.`);
    }

    if (extra_presentation_identifiers.length > 0) {
        errorMessages.push(`The following presentation identifiers in the uploaded file were not previously added as "data available" to the experimental conditions: ${extra_presentation_identifiers.join(', ')}.`);
    }

    // if there were experimental conditions, check that all identifiers are present in the experimental conditions
    if (study_info.condition_data.has_within_conditions == 1) {
        const within_identifiers = [...new Set(raw_data.data.map(row => row.within_identifier).filter(identifier => identifier !== 'NA'))].map(String);

        // Check for missing within-subject condition identifiers
        const reported_within_identifiers = study_info.condition_data.within_condition_details.map(detail => detail.identifier);
        const missing_within_identifiers = reported_within_identifiers.filter(identifier => !within_identifiers.includes(identifier));
        
        // Check for extra within-subject condition identifiers
        const extra_within_identifiers = within_identifiers.filter(identifier => !reported_within_identifiers.includes(identifier));

        if (missing_within_identifiers.length > 0) {
            errorMessages.push(`The following within-subject condition identifiers are missing from the uploaded file: ${missing_within_identifiers.join(', ')}.`);
        }

        if (extra_within_identifiers.length > 0) {
            errorMessages.push(`The following within-subject condition identifiers in the uploaded file were not previously added to the experimental conditions: ${extra_within_identifiers.join(', ')}.`);
        }
    }

    if (study_info.condition_data.has_between_conditions == 1) {
        const between_identifiers = [...new Set(raw_data.data.map(row => row.between_identifier).filter(identifier => identifier !== 'NA'))].map(String);

        // Check for missing between-subject condition identifiers
        const reported_between_identifiers = study_info.condition_data.between_condition_details.map(detail => detail.identifier);
        const missing_between_identifiers = reported_between_identifiers.filter(identifier => !between_identifiers.includes(identifier));

        // Check for extra between-subject condition identifiers
        const extra_between_identifiers = between_identifiers.filter(identifier => !reported_between_identifiers.includes(identifier));

        if (missing_between_identifiers.length > 0) {
            errorMessages.push(`The following between-subject condition identifiers are missing from the uploaded file: ${missing_between_identifiers.join(', ')}.`);
        }

        if (extra_between_identifiers.length > 0) {
            errorMessages.push(`The following between-subject condition identifiers in the uploaded file were not previously added to the experimental conditions: ${extra_between_identifiers.join(', ')}.`);
        }
    }

    // If there is information on the statement, same thing with statement identifiers
    if (study_info.study_data.statementset_name !== "no information") {
        const statement_identifiers = [...new Set(raw_data.data.map(row => row.statement_identifier).filter(identifier => identifier !== 'NA'))].map(String);

        const statementset_name = study_info.study_data.statementset_name;
        const statementset_index = getStatementSetIndex(statementset_name);
        const statementset_data = control.statementset_info[statementset_index].statementset_data;

        // Check for missing statement identifiers
        const reported_statement_identifiers = statementset_data.statement_publication_data.map(row => row.statement_identifier).map(String);
        const missing_statement_identifiers = reported_statement_identifiers.filter(identifier => !statement_identifiers.includes(identifier));
        
        // Check for extra statement identifiers
        const extra_statement_identifiers = statement_identifiers.filter(identifier => !reported_statement_identifiers.includes(identifier));

        if (missing_statement_identifiers.length > 0) {
            errorMessages.push(`The following statement identifiers are missing from the uploaded file: ${missing_statement_identifiers.join(', ')}.`);
        }

        if (extra_statement_identifiers.length > 0) {
            errorMessages.push(`The following statement identifiers in the uploaded file were not previously added to the statements: ${extra_statement_identifiers.join(', ')}.`);
        }
    }

    // if rt is present, check that the average value is below 100, otherwise say that it is likely that the data is not in seconds
    if (study_info.study_data.rt_measured == 1) {
        const rts = raw_data.data.map(row => row.rt).filter(rt => rt !== 'NA');
        const average_rt = rts.reduce((a, b) => a + b) / rts.length;

        if (average_rt > 100) {
            warningMessages.push('The average response time in the uploaded file is above 100. Please check if the data is in seconds.');
        }
    }

    // Check that accuracy is only 0, 1 or NA
    const repeated_vals = raw_data.data.map(row => row.repeated);
    const invalid_repeated_vals = repeated_vals.filter(val => val != '0' && val != '1' && val != '-1' && val !== 'NA');
    if (invalid_repeated_vals.length > 0) {
        errorMessages.push(`The "repeated" column contains invalid values: ${invalid_repeated_vals.slice(0, 5).join(', ')}. It should only contain "-1", "0", "1", or "NA".`);
    }

    // Check that response has a value maximum to that of the steps indicated by the study question and minimum of 0 or Na
    const response_vals = raw_data.data.map(row => row.response);
    const scale_steps = study_info.study_data.truth_rating_steps;
    const invalid_response_vals = response_vals.filter(val => val !== 'NA' && (val < 0 || val > scale_steps));
    if (invalid_response_vals.length > 0) {
        errorMessages.push(`The "response" column contains invalid values: ${invalid_response_vals.slice(0, 5).join(', ')}. It should only contain values between 0 and ${scale_steps}, or "NA".`);
    }

    // Now, check the mean response value for repeated statements vs. non-repeated statements. 
    // repeated statements should have higher mean response, otherwise display warning that no truth effect present
    const repeated_responses = raw_data.data
        .filter(row => row.repeated == '1' && row.response !== 'NA')
        .map(row => parseFloat(row.response));
    const non_repeated_responses = raw_data.data
        .filter(row => row.repeated == '0' && row.response !== 'NA')
        .map(row => parseFloat(row.response));

    const meanRepeatedResponse = repeated_responses.reduce((a, b) => a + b, 0) / repeated_responses.length;
    const meanNonRepeatedResponse = non_repeated_responses.reduce((a, b) => a + b, 0) / non_repeated_responses.length;

    if (meanRepeatedResponse <= meanNonRepeatedResponse) {
        warningMessages.push('The mean response value for repeated statements is not higher than for non-repeated statements. This suggests that there may be no truth effect present.');
    }

    // console.log(errorMessages)
    // console.log(warningMessages)
    if (errorMessages.length > 0) {
        displayValidationError('raw_data_file', `❌ There were ${errorMessages.length} errors:<br>` + errorMessages.join('<br>'));
        return false;
    }
    
    if (warningMessages.length > 0) {
        displayWarningMessage('raw_data_file', `⚠️ There were ${warningMessages.length} warnings:<br>` + warningMessages.join('<br>'));
    }
    
    return true;
}

function checkOtherSubmissions(control, publication_idx, study_idx) {
    const study_info = control.publication_info[publication_idx].study_info[study_idx];
    const statementset_name = study_info.study_data.statementset_name;

    // Example usage:
    const statementset_index = getStatementSetIndex(statementset_name);

    // if index is null, return false
    if (statementset_index === null && statementset_name !== "no information") {
        var statementset_validated = false;
    } else if (statementset_name === "no information") {
        var statementset_validated = true;
    } else {
        var statementset_validated = control.statementset_info[statementset_index].statementset_data.validated;
    }
    
    if (!statementset_validated || !study_info.condition_data.validated || !study_info.repetition_data.validated || !study_info.study_data.validated) {
        // Display which sections are missing
        if (!study_info.study_data.validated) {
            alert('Please enter information about the overall study before submitting the raw data.')
            return false;
        }
        if (!study_info.condition_data.validated) {
            alert('Please enter information about the experimental conditions before submitting the raw data.');
            return false;
        }
        if (!study_info.repetition_validated) {
            alert('Please enter information about the statement presentations before submitting the raw data.')
            return false;
        }
        if (!statementset_validated) {
            alert('Please enter information about the statement set before submitting the raw data.');
            return false;
        }
    }

    return true;
}
async function updateRawDataSurvey(control, publication_idx, study_idx) {
    raw_data = await collectRawData();

    raw_data.validated = true;

    // Store the values in the control object
    control.publication_info[publication_idx].study_info[study_idx].raw_data = raw_data

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');

    // Add a checkmark to the currently selected sidebar item
    const item_id =  "rawdata-" + publication_idx + "-" + study_idx;
    addGreenCheckmarkById(item_id);

    const rows_to_display = 6;
    const html_table = createTableFromCSV(raw_data.data, rows_to_display);
    
    // Inject table into the table container
    document.getElementById('tableContainerUploaded').innerHTML = html_table;
    document.getElementById('tableContainerUploaded').style.display = 'block';
    document.getElementById('textUploadPreview').style.display = 'block';
}
