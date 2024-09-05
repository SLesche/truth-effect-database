function addOverview(control) {
    // Create a new list item for the dataset
    const listItem = document.createElement("li");
    listItem.className = "collapsible collapsible-nocontent";

    // Create a span for the dataset name
    const span = document.createElement("span");
    span.textContent = "Overview";

    // Append the span and actions to the list item
    listItem.appendChild(span);

    // Create a nested list for raw data
    const nestedList = document.createElement("ul");

    // Append the nested list to the dataset item
    listItem.appendChild(nestedList);

    // Append the new list item to the sidebar
    document.getElementById("sidebarList").appendChild(listItem);

    // Update content area
    span.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevent the collapsible toggle
        generateOverviewPage(control);
    });
}

function generateOverviewPage(control) {
    document.getElementById("content").innerHTML = `
        <div class = "display-text">
            <h1>Welcome to the Truth Effect Data Entry Page</h1>
            <p>Thank you for contributing to our growing database of truth effect research. By entering your data here, you help make research more accessible and reusable for everyone.</p>
            <p>You can explore and use the dataset under this link: <a href="https://example.com/dataset" target="_blank">Dataset Link</a></p>
            <p>On the side, you have the option to add publications. Within each publication, you can also add several studies.</p>
            <p>After submission, our team will review your data and add it to the database as soon as possible.</p>
            <p>Here, you will see a progress report on your submission once it's been submitted.</p>

            <h2>Progress Report</h2>

            <h2>Contact Information</h2>
            <p>If you have any questions or need assistance, feel free to contact us at: <br>
                <a href="mailto:sven.lesche@psychologie.uni-heidelberg.de">sven.lesche@psychologie.uni-heidelberg.de</a><br>
                <a href="mailto:annika.stump@psychologie.uni-freiburg.de">annika.stump@psychologie.uni-freiburg.de</a>
            </p>
        </div>
    `;
}