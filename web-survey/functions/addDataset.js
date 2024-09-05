function addDataset(parentElement, control, publication_idx, study_idx) {
    const dataset_info = control.publication_info[publication_idx].study_info[study_idx].dataset_info;
    // Determine the number of entries in dataset_info
    const dataset_idx = Object.keys(dataset_info).length;
    const dataset_name = "Dataset " + (dataset_idx + 1);

    control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx] = setupDatasetInfo(dataset_name);

    // Create a new list item for the dataset
    const listItem = document.createElement("li");
    listItem.className = "collapsible collapsible-nocontent";

    // Create a span for the dataset name
    const span = document.createElement("span");
    span.textContent = dataset_name;

    // Create action buttons
    const actions = document.createElement("div");
    actions.className = "actions";

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

    // Append the nested list to the dataset item
    listItem.appendChild(nestedList);

    // Append the new list item to the parent element
    parentElement.appendChild(listItem);

    // Update content area
    listItem.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevent any default action
        initializeDatasetSurvey(control, publication_idx, study_idx, dataset_idx);
    });
}
