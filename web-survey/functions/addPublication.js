function addPublication(control) {
    // Determine the number of entries in dataset_info
    const publication_idx = getNewId(control.publication_info);
    const publication_name = "Publication " + (publication_idx + 1);

    control.publication_info[publication_idx] = setupPublicationInfo(publication_name);
    
    if (!publication_name) return;
    // Create a new list item for the publication
    const listItem = document.createElement("li");
    listItem.className = "collapsible";
    listItem.dataset.index = "publication-" + publication_idx;

    // Create a span for the publication name
    const span = document.createElement("span");
    span.textContent = publication_name;

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

    // Create a nested list for studies
    const nestedList = document.createElement("ul");
    nestedList.className = "nested";

    // Create a list item for the "Add Study" button
    const addStudyListItem = document.createElement("li");
    const addStudyButton = document.createElement("button");
    addStudyButton.className = "menu-button";
    addStudyButton.textContent = "+ Add Study";
    addStudyButton.onclick = function() {
        addStudy(nestedList, control, publication_idx);
    };
    addStudyListItem.appendChild(addStudyButton);
    nestedList.appendChild(addStudyListItem);

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

    // Update content area
    span.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevent the collapsible toggle
        initializePublicationSurvey(control, publication_idx);
    });
}