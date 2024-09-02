function addDataset(parentElement, publication_idx, study_idx) {
    const dataset_idx = control.publication_info[publication_idx].study_info[study_idx].num_datasets;
    const dataset_name = "Dataset " + (dataset_idx + 1);
    control.publication_info[publication_idx].study_info[study_idx].dataset_info = {
        dataset_name: dataset_name,
        data: {},
    };
    // Create a new list item for the dataset
    const listItem = document.createElement("li");
    listItem.className = "collapsible";

    // Create a span for the dataset name
    const span = document.createElement("span");
    span.textContent = dataset_name;

    // Create action buttons
    const actions = document.createElement("div");
    actions.className = "actions";
    const renameButton = document.createElement("button");
    renameButton.textContent = "Rename";
    renameButton.onclick = function(event) {
        event.stopPropagation();
        renameItem(span, dataset_name);
    };
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.onclick = function(event) {
        event.stopPropagation();
        removeItem(listItem);
    };
    actions.appendChild(renameButton);
    actions.appendChild(removeButton);

    // Append the span and actions to the list item
    listItem.appendChild(span);
    listItem.appendChild(actions);

    // Create a nested list for raw data
    const nestedList = document.createElement("ul");
    nestedList.className = "nested";

    // Append the nested list to the dataset item
    listItem.appendChild(nestedList);

    // Append the new list item to the parent element
    parentElement.appendChild(listItem);

    // Add collapsible functionality
    listItem.addEventListener("click", function(event) {
        if (event.target === this) {
            this.classList.toggle("active");
        }
    });

    // Update content area
    span.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevent the collapsible toggle
        document.getElementById("content").innerHTML = `
            <h2>${dataset_name}</h2>
            <p>Checklist:</p>
            <ul>
                <li>Statementset (plus questions)</li>
                <li>Repetitions done</li>
                <li>Within conditions done</li>
                <li>Raw data uploaded</li>
            </ul>
            <p>What statementset did you use in this study?</p>
            <p>How were the repetitions done in this study?</p>
            <p>What within conditions?</p>
            <form id="publicationSurvey">
                <label for="authors">Authors:</label>
                <input type="text" id="authors" name="authors" required><br>

                <label for="date">Date Conducted:</label>
                <input type="date" id="date" name="date" required><br>

                <label for="title">Title of Publication:</label>
                <input type="text" id="title" name="title" required><br>

                <button type="submit">Submit</button>
            </form>
        `;

        // Add event listener to the form's submit button
        document.getElementById('publicationSurvey').addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            // Get values from the input fields
            const authors = document.getElementById('authors').value;
            const date = document.getElementById('date').value;
            const title = document.getElementById('title').value;

            // Store the values in the control object
            control.publication_info[publication_idx].authors = authors;
            control.publication_info[publication_idx].date_conducted = date;
            control.publication_info[publication_idx].title = title;

            // Optionally, display a confirmation message
            alert('Survey submitted successfully!');
        });
    });

    control.publication_info[publication_idx].study_info[study_idx].num_datasets++;
    control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx] = {
        dataset_name: dataset_name,
        data: {},
    };
}
