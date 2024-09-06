function initializePublicationSurvey(control, publication_idx) {
    const publication = control.publication_info[publication_idx].data;
    const publication_name = control.publication_info[publication_idx].publication_name;
    document.getElementById("content").innerHTML = `
    <div class = "display-text">
        <h1>${publication_name}</h1>
        <p>Before you begin entering your data, please start by providing details about the publication. This refers to the overall paper or article to which your data is associated.</p>
        <p>In this section, you'll be asked to provide key information about the publication, such as the title, authors, and publication date. This helps us organize and connect your data to the correct sources, making it easier for others to reference and understand the context of your research.</p>
        <p>After completing the publication details, you will have the opportunity to add one or more studies associated with this publication. Each study represents a distinct experiment or analysis conducted within the scope of the publication.</p>
        <p>Within each study, you can further break down your data by adding multiple datasets. This allows you to organize your data effectively, especially if your study contains several experiments or data collections.</p>
        <p>By following this structure, you help ensure that your data is accurately represented and easily accessible for future use.</p>
        <p>Feel free to add as many studies and datasets as needed.</p>        
        
        <form id="publicationSurvey" class = "survey-form">
            <label for="authors" class = "survey-label">Who are the authors of the publication?</label>
            <input type="text" id="authors" name="authors" value="${publication.authors || ''}" required><br>

            <label for="apa_reference" class = "survey-label">Please provide an APA7 style reference for the publication:</label>
            <input type="text" id="apa_reference" name="apa_reference" value="${publication.apa_reference || ''}" required><br>

            <label for="conducted" class = "survey-label">In what year was the study conducted?</label>
            <input type="number" id="conducted" name="conducted" value="${publication.conducted || ''}" required><br>

            <label for="country" class = "survey-label">In what country was the study conducted?</label>
            <input type="text" id="country" name="country" value="${publication.country || ''}" required><br>

            <label for="keywords" class = "survey-label">What are the keywords associated with the publication? Separate the keywords by commas.</label>
            <input type="text" id="keywords" name="keywords" value="${publication.keywords || ''}" required><br>
            
            <label for="contact" class = "survey-label">Provide contact information for further questions.</label>
            <input type="text" id="contact" name="contact" value="${publication.contact || ''}" required><br>

            <button type="submit" class = "survey-button">Submit</button>
        </form>
    </div>
    `;

    // Add event listener to the form's submit button
    document.getElementById('publicationSurvey').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        if (validatePublicationData(collectPublicationData())) {
            updatePublicationSurvey(control, publication_idx);
        }
    });
}

function collectPublicationData(){
    // Get values from the input fields
    const authors = document.getElementById('authors').value;
    const apa_reference = document.getElementById('apa_reference').value;
    const conducted = document.getElementById('conducted').value;
    const country = document.getElementById('country').value;
    const keywords = document.getElementById('keywords').value;
    const contact = document.getElementById('contact').value;

    // Store the values in the control object
    const publication_data = {
        authors: authors,
        apa_reference: apa_reference,
        conducted: conducted,
        country: country,
        keywords: keywords,
        contact: contact,
    }

    return publication_data;
}

function validatePublicationData(publication_data){
    // Check if any of the fields are empty
    for (const key in publication_data) {
        if (!publication_data[key]) {
            alert('Please fill out all fields before submitting the form.');
            return false;
        }
    }

    if (publication_data.conducted < 1900 || publication_data.conducted > new Date().getFullYear()) {
        alert('Please enter a valid year for the study.');
        return false;
    }

    return true;
}

function updatePublicationSurvey(control, publication_idx) {
    // Store the values in the control object
    const publication_data = collectPublicationData();
    control.publication_info[publication_idx].data = publication_data;

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');
}