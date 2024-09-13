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
            <ul>
                <li>Ensure that your dataset includes all columns as specified in the guidelines. If certain measurements (e.g., reaction times) were not collected, you may leave those columns out.</li>
                <li>It is crucial that the columns you do include have the exact names we specified. This consistency is essential for accurate integration and analysis.</li>
                <li>Make sure that your conditions are labeled exactly as indicated in the instructions above. This ensures that your data can be correctly interpreted in the context of the study.</li>
            </ul>
            
            <p>Below, you can find an example of how your data should be formatted. Please follow this format to ensure compatibility and ease of use:</p>
            <div class = "table-container" id = "tableContainerExample">
                <table>
                    <tr>
                        <th>subject</th>
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
                        <td>0.64</td>
                        <td>3</td>
                        <td>0</td>
                        <td>2</td>
                    </tr>
                    <tr>
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
    document.getElementById('raw_data_file').addEventListener('change', function(event) {
        const fileNameDisplay = document.getElementById('file-name-display');
        if (event.target.files.length > 0) {
            fileNameDisplay.textContent = `File: ${event.target.files[0].name}`;
        } else {
            fileNameDisplay.textContent = '';
        }
    });

    document.getElementById('rawDataSurvey').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission
        const allow_submission = checkOtherSubmissions(control, publication_idx, study_idx);
        if (allow_submission) {
            const collected_data = await collectRawData();
            if (validateRawData(collected_data)){
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

function validateRawData(raw_data) {
    if (!raw_data.raw_data_file) {
        alert('Please upload a file containing the raw data.');
        return false;
    }

    return true;
}

function checkOtherSubmissions(control, publication_idx, study_idx) {
    const study_info = control.publication_info[publication_idx].study_info[study_idx];
    if (!study_info.condition_data.validated || !study_info.repetition_data.validated) {
        alert('Please enter information about the experimental conditions and repetitions before submitting the raw data.');
        return false;
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