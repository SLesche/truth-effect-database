function addMeasurement(parentElement, control, publication_idx, study_idx) {
    const measurement_name = "Additional Measurements";

    control.publication_info[publication_idx].study_info[study_idx].measurement_info = setupMeasurementInfo()

    // Create a new list item for the dataset
    const listItem = document.createElement("li");
    listItem.className = "collapsible";

    // Create a span for the dataset name
    const span = document.createElement("span");
    span.textContent = measurement_name;

    // Create action buttons
    const actions = document.createElement("div");
    actions.className = "actions";
    const renameButton = document.createElement("button");
    renameButton.textContent = "Rename";
    renameButton.onclick = function(event) {
        event.stopPropagation();
        renameItem(span, publication_idx);
    };
    actions.appendChild(renameButton);

    const removeButton = document.createElement("button");
    removeButton.innerHTML = '&times;'; // Red X
    removeButton.classList.add('delete-button');
    removeButton.onclick = function(event) {
        event.stopPropagation();
        removeItem(listItem);
    };
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

    // Toggle the collapsible on by default
    listItem.classList.add("active");

    // Update content area
    span.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevent the collapsible toggle
        initializeMeasurementSurvey(control, publication_idx, study_idx)
    });
}
