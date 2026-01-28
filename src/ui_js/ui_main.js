console.log("ui_main.js has connected to the program!")

// Toolbar buttons
document.getElementById('bold').addEventListener('click', () => {
    document.execCommand('bold');
});

document.getElementById('italics').addEventListener('click', () => {
    document.execCommand('italic');
});

document.getElementById('underline').addEventListener('click', () => {
    document.execCommand('underline');
});

// Modal handling
const modal = document.querySelector('.modal');
const optionsBtn = document.getElementById('options');
const closeModal = document.getElementById('close');

optionsBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Optional: click outside modal closes it
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});
