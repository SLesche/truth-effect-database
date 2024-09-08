add_delete_button_to_list_item = function(listItem) {
    // Add delete button
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '&times;'; // Red X
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => {
        listItem.remove();
    });
    listItem.appendChild(deleteButton);

    return(listItem)
}

function toggleFieldset(fieldsetId) {
    const fieldset = document.getElementById(fieldsetId);
    if (fieldset.disabled) {
        fieldset.disabled = false;
        fieldset.style.display = 'block';
    } else {
        fieldset.disabled = true;
        fieldset.style.display = 'none';
    }
}

function getNewId(info_object){
    const id = Object.keys(info_object).length > 0 ? Math.max(...Object.keys(info_object).map(key => parseInt(key))) + 1 : 0;
    return id
}