function removeItem(listItem) {
    if (confirm("Are you sure you want to remove this item?")) {
        listItem.remove();
        // Clear content area if the removed item was displayed
        const content = document.getElementById("content");
        if (content.querySelector("h2").textContent === listItem.querySelector("span").textContent) {
            content.innerHTML = `
                <h2>Welcome</h2>
                <p>Select an item from the sidebar to see details.</p>
            `;
        }
    }
}