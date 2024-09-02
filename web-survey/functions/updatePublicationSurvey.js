function updatePublicationSurvey(publication_idx) {
    // Get values from the input fields
    const authors = document.getElementById('authors').value;
    const date = document.getElementById('date').value;
    const title = document.getElementById('title').value;

    // Store the values in the control object
    control.publication_info[publication_idx].data = {
        authors: authors,
        date_conducted: date,
        title: title,
    }

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');
}