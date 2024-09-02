function initializeDatasetSurvey(control, publication_idx, study_idx, dataset_idx){
    dataset_data = control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx].data;
    dataset_name = control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx].dataset_name;

    document.getElementById("content").innerHTML = `
            <h2>${dataset_name}</h2>
            <form id="datasetSurvey">
            <label for="authors">Authors:</label>
            <input type="text" id="authors" name="authors" value="${dataset_data.authors || ''}" required><br>

            <label for="date">Date Conducted:</label>
            <input type="date" id="date" name="date" value="${dataset_data.date_conducted || ''}" required><br>

            <label for="title">Title of Publication:</label>
            <input type="text" id="title" name="title" value="${dataset_data.title || ''}" required><br>

            <button type="submit">Submit</button>
        </form>
        `;


    // Add event listener to the form's submit button
    document.getElementById('datasetSurvey').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        updateDatasetSurvey(control, publication_idx, study_idx, dataset_idx);
    });
}