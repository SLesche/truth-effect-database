function addStatementSet(parentElement, control) {
    // Determine the number of entries in dataset_info
    const statementset_idx = getNewId(control.statementset_info);
    const statementset_name = "Statementset " + (statementset_idx + 1);

    control.statementset_info[statementset_idx] = setupStatementSetInfo(statementset_name);

    // Create a new list item for the dataset
    const listItem = document.createElement("li");
    listItem.className = "collapsible collapsible-nocontent";
    listItem.dataset.index = "statementset-" + statementset_idx;
    listItem.id = "statementset-" + statementset_idx;


    // Create a span for the dataset name
    const span = document.createElement("span");
    span.textContent = statementset_name;

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

    // Create a nested list for raw data
    const nestedList = document.createElement("ul");

    // Append the nested list to the dataset item
    listItem.appendChild(nestedList);

    // Append the new list item to the parent element
    parentElement.appendChild(listItem);

    // Update content area
    span.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevent the collapsible toggle
        initializeStatementSetSurvey(control, statementset_idx);
    });
}

function addStatementOverview(control) {
    // Create a new list item for the publication
    const listItem = document.createElement("li");
    listItem.className = "collapsible";
    listItem.dataset.index = "statementset-overview";
    listItem.id = "statementset-overview";

    // Create a span for the publication name
    const span = document.createElement("span");
    span.textContent = "Sets of Statements";

    // Append the span and actions to the list item
    listItem.appendChild(span);

    // Create a nested list for studies
    const nestedList = document.createElement("ul");
    nestedList.className = "nested";

    // Create a list item for the "Add Statement" button
    const addStatementListItem = document.createElement("li");
    const addStatementButton = document.createElement("button");
    addStatementButton.className = "menu-button";
    addStatementButton.textContent = "+ Add Statement Set";
    addStatementButton.onclick = function() {
        addStatementSet(nestedList, control);
    };
    addStatementListItem.appendChild(addStatementButton);
    nestedList.appendChild(addStatementListItem);

    // Append the nested list to the publication item
    listItem.appendChild(nestedList);

    // Append the new list item to the sidebar list
    document.getElementById("sidebarList").appendChild(listItem);

    // Add collapsible functionality
    listItem.addEventListener("click", function(event) {
        if (event.target === this) {
            this.classList.toggle("active");
        }
    });

    // Toggle the collapsible on by default
    listItem.classList.add("active");

    // Open one new Statement
    //addStatementSet(nestedList, control);
}

function initializeStatementSetSurvey(control, statementset_idx) {
    const statementset_data = control.statementset_info[statementset_idx].statementset_data;
    const statementset_name = control.statementset_info[statementset_idx].statementset_name;

    document.getElementById("content").innerHTML = `
    <div class="display-text">
        <h1>${statementset_name}</h1>
        <p>In this section, please provide a file containing the statements used in your study. Including this file allows researchers to more closely replicate your study by reviewing the exact statements that were presented to participants.</p>
        <p>It is important that the statement IDs in this file match exactly with those used in your raw data. This consistency ensures that the statements can be correctly linked to the corresponding data points in your dataset.</p>
        <p>If available, please include columns with the following information:</p>
        <ul>
            <li><strong>statement_id:</strong> A unique identifier for each statement.</li>
            <li><strong>statement_text:</strong> The text of the statement as it was presented to participants.</li>
            <li><strong>statement_accuracy:</strong> The accuracy of the statement, indicating whether it is true or false.</li>
            <li><strong>statement_category:</strong> The category or type of the statement, if applicable.</li>
            <li><strong>proportion of people who rated it as true:</strong> The percentage of participants who rated the statement as true.</li>
        </ul>

        <p>The file you upload below should look similar to this:</p>
        <div class = "table-container" id = "tableContainerExample">
            <table>
                <tr>
                    <th>statement_id</th>
                    <th>statement_text</th>
                    <th>statement_accuracy</th>
                    <th>statement_category</th>
                    <th>proportion_rated_true</th>
                </tr>
                <tr>
                    <td>1</td>
                    <td>This is a sample statement</td>
                    <td>1</td>
                    <td>category</td>
                    <td>0.6</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>This is a sample statement</td>
                    <td>0</td>
                    <td>category</td>
                    <td>0.53</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>This is a sample statement</td>
                    <td>1</td>
                    <td>category</td>
                    <td>0.46</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>This is a sample statement</td>
                    <td>1</td>
                    <td>category</td>
                    <td>0.35</td>
                </tr>
            </table>
        </div>

        <p>Including these details will enhance the reproducibility of your study and provide valuable context for those analyzing your data.</p>
        <p>Once you have prepared your statement file according to these specifications, you can upload it using the form provided below. Thank you for your contribution!</p>

        <form id="statementSetSurvey" class="survey-form">
            <label for="statement_publication_file" class="survey-label">Please upload a .csv file where the statements you used are listed.</label>
            <input type="file" id="statement_publication_file" name="statement_publication_file" accept=".csv" required><br>
            <span id="file-name-display">${statementset_data.statement_publication_file ? `File: ${statementset_data.statement_publication_file.name}` : ''}</span><br>

            <p id = "textUploadPreview" style = "display: none;">Uploaded file preview:</p>
            <div id="tableContainerUploaded" class = "table-container" style = "display: none;">
            </div>

            <label for="statement_publication" class="survey-label">If available, provide the original publication where this set of statements originates from.</label>
            <input type="text" id="statement_publication" name="statement_publication" value="${statementset_data.statement_publication || ''}"><br>

            <button type="submit" class="survey-button">Submit</button>
        </form>
    </div>
    `;

    if (statementset_data && statementset_data.statement_publication_data) {
        const rows_to_display = 6;
        const html_table = createTableFromCSV(statementset_data.statement_publication_data, rows_to_display);
    
        // Inject table into the table container
        document.getElementById('tableContainerUploaded').innerHTML = html_table;
        document.getElementById('tableContainerUploaded').style.display = 'block';
        document.getElementById('textUploadPreview').style.display = 'block';
    }

    // Add event listener to the file input to display the selected file name
    document.getElementById('statement_publication_file').addEventListener('change', async function(event) {
        const fileNameDisplay = document.getElementById('file-name-display');
        if (event.target.files.length > 0) {
            fileNameDisplay.textContent = `File: ${event.target.files[0].name}`;
        } else {
            fileNameDisplay.textContent = '';
        }

        const statementset_data = await collectStatementSetData();
        const rows_to_display = 6;
        const html_table = createTableFromCSV(statementset_data.statement_publication_data, rows_to_display);
        
        // Inject table into the table container
        document.getElementById('tableContainerUploaded').innerHTML = html_table;
        document.getElementById('tableContainerUploaded').style.display = 'block';
        document.getElementById('textUploadPreview').style.display = 'block';
    });

    // Add event listener to the form's submit button
    document.getElementById('statementSetSurvey').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission
        // Await statement set data
        const statement_data_cur = await collectStatementSetData();
        if (validateStatementSetData(statement_data_cur) || control.testing) {
            updateStatementSetSurvey(control, statementset_idx);
        }
    });

}

async function collectStatementSetData() {
    const statement_publication_file = document.getElementById('statement_publication_file').files[0];
    const statement_publication = document.getElementById('statement_publication').value;

    if (statement_publication_file) {
        try {
            const statement_publication_data = await csvFileToObject(statement_publication_file);
            const statementset_data = {
                statement_publication_file: statement_publication_file,
                statement_publication_data: statement_publication_data,
                statement_publication: statement_publication,
            };
                
            // Display the updated file name in the submission box
            const fileNameDisplay = document.getElementById('file-name-display');
            if (statement_publication_file) {
                fileNameDisplay.textContent = `File: ${statement_publication_file.name}`;
            } else {
                fileNameDisplay.textContent = '';
            }
        
            return statementset_data;
        } catch (error) {
            console.error('Error parsing CSV file:', error);
            // Handle error appropriately, e.g., show an error message to the user
        }
    }
}

function validateStatementSetData(statementset_data){
    clearValidationMessages();
    
    var alert_message = 'This field does not match validation criteria.';

    return true;
}

async function updateStatementSetSurvey(control, statementset_idx) {
    const statementset_data = await collectStatementSetData();

    statementset_data.validated = true;
    control.statementset_info[statementset_idx].statementset_data = statementset_data;

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');

    // Add a checkmark to the currently selected sidebar item
    const item_id =  "statementset-" + statementset_idx;
    addGreenCheckmarkById(item_id);

    const rows_to_display = 6;
    const html_table = createTableFromCSV(statementset_data.statement_publication_data, rows_to_display);
    
    // Inject table into the table container
    document.getElementById('tableContainerUploaded').innerHTML = html_table;
    document.getElementById('tableContainerUploaded').style.display = 'block';
    document.getElementById('textUploadPreview').style.display = 'block';
}