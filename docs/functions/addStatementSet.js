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
    addStatementSet(nestedList, control);
}