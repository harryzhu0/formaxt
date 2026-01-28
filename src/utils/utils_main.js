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
    const title = document.querySelector('.title-bar h4').innerText;
    const content = document.getElementById('editor').innerText;

    // Example: save to localStorage (you can change to IndexedDB or server)
    let projects = JSON.parse(localStorage.getItem('projects') || '{}');
    const projectId = new URLSearchParams(window.location.search).get('id') || Date.now();
    projects[projectId] = { title, content };
    localStorage.setItem('projects', JSON.stringify(projects));

    alert('Saved!');
});
