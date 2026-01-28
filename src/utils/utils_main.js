// Get project ID from URL
function getProjectId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

const projectId = getProjectId();
if(!projectId) alert("No project ID provided!");

// Load project from localStorage
function loadProject(id) {
    const projects = JSON.parse(localStorage.getItem('projects') || '{}');
    return projects[id] || { name: "Untitled Project", content: "" };
}

// Initialize editor
const project = loadProject(projectId);
const editor = document.getElementById('editor');
editor.innerText = project.content;

const titleInput = document.getElementById('project-title');
titleInput.value = project.name;

// Save button
document.getElementById('save').addEventListener('click', () => {
    // 1. Get the correct data from the page
    const title = document.querySelector('.title-bar h4').innerText;
    const content = document.getElementById('editor').innerText;
    const projectId = getProjectId(); // Use the function you already have

    if (!projectId) {
        alert('Error: No project ID.');
        return;
    }

    // 2. Load all projects, update the current one, and save back
    let projects = JSON.parse(localStorage.getItem('projects') || '{}');
    projects[projectId] = {
        name: title,    // Save under 'name' (matching loadProject)
        content: content,
        updated: new Date().toISOString() // Optional: add a timestamp
    };
    localStorage.setItem('projects', JSON.stringify(projects));

    alert(`Project "${title}" saved!`);
});
