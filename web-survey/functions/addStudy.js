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

    // Create a list item for the "Add Dataset" button
    const addDatasetListItem = document.createElement("li");
    const addDatasetButton = document.createElement("button");
    addDatasetButton.className = "menu-button";
    addDatasetButton.textContent = "+ Add Dataset";
    addDatasetButton.onclick = function() {
        addDataset(nestedList, control, publication_idx, study_idx);
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

    // Add measurement survey
    addMeasurement(nestedList, control, publication_idx, study_idx);
}