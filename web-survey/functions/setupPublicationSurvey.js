function initializePublicationSurvey(control, publication_idx) {
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
        <label for="authors">Who are the authors of the publication?</label>
        <input type="text" id="authors" name="authors" value="${publication.authors || ''}" required><br>

        <label for="apa_reference">Please provide an APA7 style reference for the publication:</label>
        <input type="text" id="apa_reference" name="apa_reference" value="${publication.apa_reference || ''}" required><br>

        <label for="conducted">In what year was the study conducted?</label>
        <input type="number" id="conducted" name="conducted" value="${publication.conducted || ''}" required><br>

        <label for="country">In what country was the study conducted?</label>
        <input type="text" id="country" name="country" value="${publication.country || ''}" required><br>

        <label for="keywords">What are the keywords associated with the publication?</label>
        <input type="text" id="keywords" name="keywords" value="${publication.keywords || ''}" required><br>
        
        <label for="contact">Provide contact information for further questions.</label>
        <input type="text" id="contact" name="contact" value="${publication.contact || ''}" required><br>

        <button type="submit">Submit</button>
    </form>

    `;

    // Add event listener to the form's submit button
    document.getElementById('publicationSurvey').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        updatePublicationSurvey(control, publication_idx);
    });
}

function updatePublicationSurvey(control, publication_idx) {
    // Get values from the input fields
    const authors = document.getElementById('authors').value;
    const apa_reference = document.getElementById('apa_reference').value;
    const conducted = document.getElementById('conducted').value;
    const country = document.getElementById('country').value;
    const keywords = document.getElementById('keywords').value;
    const contact = document.getElementById('contact').value;

    // Store the values in the control object
    control.publication_info[publication_idx].data = {
        authors: authors,
        apa_reference: apa_reference,
        conducted: conducted,
        country: country,
        keywords: keywords,
        contact: contact,
    }

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');
}