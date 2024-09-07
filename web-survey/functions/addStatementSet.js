function addStatementSet(control) {
    // Determine the number of entries in dataset_info
    const statementset_idx = Object.keys(control.statementset_info).length;
    const statementset_name = "Statementset " + (statementset_idx + 1);

    control.statementset_info[statementset_idx] = setupStatementSetInfo(statementset_name);

    // Create a new list item for the dataset
    const listItem = document.createElement("li");
    listItem.className = "collapsible collapsible-nocontent";
    listItem.dataset.index = "statementset-" + statementset_idx;


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

    // Append the new list item to the sidebar
    document.getElementById("sidebarList").appendChild(listItem);

    // Update content area
    span.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevent the collapsible toggle
        initializeStatementSetSurvey(control, statementset_idx);
    });
}
