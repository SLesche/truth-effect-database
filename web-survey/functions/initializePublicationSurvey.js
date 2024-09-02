function initializePublicationSurvey(publication_idx) {
    const publication = control.publication_info[publication_idx].data;
    const publication_name = control.publication_info[publication_idx].publication_name;
    document.getElementById("content").innerHTML = `
        <h2>${publication_name}</h2>
        <p>How many studies are part of this publication? (Add studies)</p>
        <p>Provide the additional measures you collected in this study.</p>
        <p>Checklist:</p>
        <ul>
            <li>Dataset provided and checked</li>
            <li>Additional measures provided</li>
        </ul>
        <form id="publicationSurvey">
            <label for="authors">Authors:</label>
            <input type="text" id="authors" name="authors" value="${publication.authors || ''}" required><br>

            <label for="date">Date Conducted:</label>
            <input type="date" id="date" name="date" value="${publication.date_conducted || ''}" required><br>

            <label for="title">Title of Publication:</label>
            <input type="text" id="title" name="title" value="${publication.title || ''}" required><br>

            <button type="submit">Submit</button>
        </form>
    `;

    // Add event listener to the form's submit button
    document.getElementById('publicationSurvey').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        updatePublicationSurvey(publication_idx);
    });
}