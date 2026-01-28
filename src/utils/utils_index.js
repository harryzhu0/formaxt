// Utility to generate random IDs
function generateId(length=8) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for(let i=0;i<length;i++) result += chars[Math.floor(Math.random()*chars.length)];
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

    if(Object.keys(projects).length === 0) {
        display.innerHTML = '<p>No projects yet. Click "New Project" to create one.</p>';
    }

    Object.keys(projects).forEach(id => {
        const div = document.createElement('div');
        div.className = 'doc';
        div.innerHTML = `
        <a href="display.html?id=${id}">${projects[id].name || id}</a>
        `;
        display.appendChild(div);
    });
}

// Create a new project
document.getElementById('new-project').addEventListener('click', () => {
    const projects = loadProjects();
    const id = generateId();
    projects[id] = { name: "Untitled Project", content: "" };
    saveProjects(projects);
    renderProjects();
    window.location.href = `display.html?id=${id}`;
});

// Initial render
renderProjects();
