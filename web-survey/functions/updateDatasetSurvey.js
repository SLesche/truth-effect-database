function updateDatasetSurvey(control, publication_idx, study_idx, dataset_idx) {
    // Get values from the input fields
    const authors = document.getElementById('authors').value;
    const date = document.getElementById('date').value;
    const title = document.getElementById('title').value;

    // Store the values in the control object
    control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx].data = {
        authors: authors,
        date: date,
        title: title,
    }

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');
}