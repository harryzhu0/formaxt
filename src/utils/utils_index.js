// Utility to generate random IDs
function generateId(length = 8) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

// Load all projects from localStorage
function loadProjects() {
    return JSON.parse(localStorage.getItem('projects') || '{}');
}

// Save all projects
function saveProjects(projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
}

// Render the project list
function renderProjects() {
    const display = document.getElementById('display-area');
    display.innerHTML = '';
    const projects = loadProjects();

    // Optional: Show message if no projects
    if (Object.keys(projects).length === 0) {
        display.innerHTML = '<p class="empty-message">No documents yet. Click "Blank Page" to create one.</p>';
        return;
    }

    // Create a card for each saved project
    Object.keys(projects).forEach(id => {
        const project = projects[id];
        const card = document.createElement('div');
        card.className = 'doc project-card'; // Added 'project-card' class
        card.dataset.id = id; // Store the project ID on the card element

        card.innerHTML = `
        <div class="card-actions">
        <button class="delete-btn" title="Delete document">×</button>
        </div>
        <a href="display.html?id=${id}" class="card-link">
        <div class="placeholder"></div>
        <p>${project.name || 'Untitled Document'}</p>
        </a>
        `;
        display.appendChild(card);
    });
}

// Function to create a new document
function createNewDocument() {
    const projects = loadProjects();
    const id = generateId();

    // Create a new project with default data
    projects[id] = {
        name: 'Untitled Document',
        content: '',
        created: new Date().toISOString()
    };

    saveProjects(projects);

    // Redirect to the editor with the new document's ID
    window.location.href = `display.html?id=${id}`;
}

// Set up the "Blank Page" card to create new documents
document.addEventListener('DOMContentLoaded', function() {
    const newDocCard = document.getElementById('create-new-document');

    if (newDocCard) {
        newDocCard.addEventListener('click', function(event) {
            event.preventDefault(); // Stop the link from navigating normally
            createNewDocument();
        });
    }

    // Initial render of existing projects
    renderProjects();
});

// Function to delete a document
function deleteDocument(documentId) {
    if (!documentId || !confirm('Are you sure you want to delete this document?')) {
        return;
    }

    const projects = loadProjects();

    if (projects[documentId]) {
        delete projects[documentId];
        saveProjects(projects);
        renderProjects(); // Refresh the list
        console.log(`Document ${documentId} deleted.`);
    }
}

// Event delegation for delete buttons
document.addEventListener('click', function(event) {
    // Check if the click was on a delete button or inside one
    const deleteBtn = event.target.closest('.delete-btn');

    if (deleteBtn) {
        event.preventDefault();
        event.stopPropagation(); // Prevent triggering the card link

        // Find the project card that contains this delete button
        const projectCard = deleteBtn.closest('.project-card');
        const documentId = projectCard ? projectCard.dataset.id : null;

        if (documentId) {
            deleteDocument(documentId);
        }
    }
});
