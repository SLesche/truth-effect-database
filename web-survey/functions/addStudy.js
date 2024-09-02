function addStudy(parentElement, control, publication_idx) {
    const study_idx = control.publication_info[publication_idx].num_studies;
    const studyName = "Study " + (study_idx + 1);
    control.publication_info[publication_idx].study_info[study_idx] = {
        study_name: studyName,
        data: {},
        num_datasets: 0,
        dataset_info: {},
    };

    // Create a new list item for the study
    const listItem = document.createElement("li");
    listItem.className = "collapsible";

    // Create a span for the study name
    const span = document.createElement("span");
    span.textContent = studyName;

    // Create action buttons
    const actions = document.createElement("div");
    actions.className = "actions";
    const renameButton = document.createElement("button");
    renameButton.textContent = "Rename";
    renameButton.onclick = function(event) {
        event.stopPropagation();
        renameItem(span, studyName);
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

    // Create a nested list for datasets
    const nestedList = document.createElement("ul");
    nestedList.className = "nested";

    // Create a list item for the "Add Dataset" button
    const addDatasetListItem = document.createElement("li");
    const addDatasetButton = document.createElement("button");
    addDatasetButton.className = "menu-button";
    addDatasetButton.textContent = "Add Dataset";
    addDatasetButton.onclick = function() {
        addDataset(nestedList, publication_idx, study_idx);
    };
    addDatasetListItem.appendChild(addDatasetButton);
    
    nestedList.appendChild(addDatasetListItem);

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

    // Update study counter for this publication
    control.publication_info[publication_idx].num_studies++;
    control.publication_info[publication_idx].study_info[study_idx] = {
        study_name: studyName,
        data: {},
        num_datasets: 0,
        dataset_info: {},
    };

    // Add the measurement survey
    addMeasurement(nestedList, publication_idx, study_idx);
}