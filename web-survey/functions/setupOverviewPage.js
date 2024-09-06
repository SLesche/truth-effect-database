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
            ${printProgressReport(getNumberOfSubmissions(control))}

            <h2>Contact Information</h2>
            <p>If you have any questions or need assistance, feel free to contact us at: <br>
                <a href="mailto:sven.lesche@psychologie.uni-heidelberg.de">sven.lesche@psychologie.uni-heidelberg.de</a><br>
                <a href="mailto:annika.stump@psychologie.uni-freiburg.de">annika.stump@psychologie.uni-freiburg.de</a>
            </p>
        </div>
    `;
}

function getNumberOfSubmissions(control) {
    const num_total_publications = Object.keys(control.publication_info).length;
    const num_statement_sets = Object.keys(control.statementset_info).length;
    let num_total_studies = 0;
    let num_total_datasets = 0;

    let num_statement_sets_validated = 0;
    let num_publications_validated = 0;
    let num_studies_validated = 0;
    let num_datasets_validated = 0;

    // Iterate over statement sets
    for (let statementset_idx = 0; statementset_idx < num_statement_sets; statementset_idx++) {
        if (control.statementset_info[statementset_idx].data.validated) {
            num_statement_sets_validated += 1;
        }
    }

    // Iterate over publications
    for (let publication_idx = 0; publication_idx < num_total_publications; publication_idx++) {
        const current_num_studies = Object.keys(control.publication_info[publication_idx].study_info).length;
        num_total_studies += current_num_studies;

        // Iterate over studies within the publication
        for (let study_idx = 0; study_idx < current_num_studies; study_idx++) {
            const current_num_datasets = Object.keys(control.publication_info[publication_idx].study_info[study_idx].dataset_info).length;
            num_total_datasets += current_num_datasets;

            // Check if the study is validated
            if (control.publication_info[publication_idx].study_info[study_idx].data.validated) {
                num_studies_validated += 1;
            }

            // Iterate over datasets within the study
            for (let dataset_idx = 0; dataset_idx < current_num_datasets; dataset_idx++) {
                if (control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx].data.validated) {
                    num_datasets_validated += 1;
                }
            }
        }

        // Check if the publication is validated
        if (control.publication_info[publication_idx].data.validated) {
            num_publications_validated += 1;
        }
    }

    // Compute percentages
    const percent_statement_sets_validated = (num_statement_sets_validated / num_statement_sets) * 100;
    const percent_publication_validated = (num_publications_validated / num_total_publications) * 100;
    const percent_studies_validated = (num_studies_validated / num_total_studies) * 100;
    const percent_datasets_validated = (num_datasets_validated / num_total_datasets) * 100;

    return {
        num_total_publications,
        num_statement_sets,
        num_total_studies,
        num_total_datasets,
        num_statement_sets_validated,
        num_publications_validated,
        num_studies_validated,
        num_datasets_validated,
        percent_statement_sets_validated,
        percent_publication_validated,
        percent_studies_validated,
        percent_datasets_validated
    };
}

function printProgressReport(progress_report){
    html = `
        <div class="progress-report">
            <h2>Progress Report</h2>
            <p>Total Publications: ${progress_report.num_total_publications}</p>
            <p>Total Statement Sets: ${progress_report.num_statement_sets}</p>
            <p>Total Studies: ${progress_report.num_total_studies}</p>
            <p>Total Datasets: ${progress_report.num_total_datasets}</p>
            <p>Publications Validated: ${progress_report.num_publications_validated}</p>
            <p>Studies Validated: ${progress_report.num_studies_validated}</p>
            <p>Datasets Validated: ${progress_report.num_datasets_validated}</p>
            <p>Percentage of Statement Sets Validated: ${progress_report.percent_statement_sets_validated}%</p>
            <p>Percentage of Publications Validated: ${progress_report.percent_publication_validated}%</p>
            <p>Percentage of Studies Validated: ${progress_report.percent_studies_validated}%</p>
            <p>Percentage of Datasets Validated: ${progress_report.percent_datasets_validated}%</p>
        </div>
    `;

    return html;
}