const taskForm = document.getElementById('taskForm');
const titleInput = document.getElementById('title');
const descInput = document.getElementById('description');
const tasksList = document.getElementById('tasks');

// Carrega tarefas ao abrir
fetchTasks();

// Adicionar tarefa
taskForm.addEventListener('submit', async e => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const description = descInput.value.trim();

  if (!title) return;

  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description })
  });
  const newTask = await res.json();
  titleInput.value = '';
  descInput.value = '';
  addTaskToDOM(newTask);
});

// Buscar tarefas
async function fetchTasks() {
  const res = await fetch('/api/tasks');
  const tasks = await res.json();
  tasksList.innerHTML = '';
  tasks.forEach(addTaskToDOM);
}

// Adiciona tarefa ao DOM
function addTaskToDOM(task) {
  const li = document.createElement('li');
  li.className = task.completed ? 'completed' : '';
  li.innerHTML = `
    <span>${task.title} ${task.description ? '- ' + task.description : ''}</span>
    <div>
      <button class="toggleBtn">${task.completed ? 'Desmarcar' : 'Concluir'}</button>
      <button class="deleteBtn">Excluir</button>
    </div>
  `;
  // Toggle completo
  li.querySelector('.toggleBtn').addEventListener('click', async () => {
    await fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed })
    });
    li.classList.toggle('completed');
    li.querySelector('.toggleBtn').textContent = li.classList.contains('completed') ? 'Desmarcar' : 'Concluir';
    task.completed = !task.completed;
  });

  // Excluir
  li.querySelector('.deleteBtn').addEventListener('click', async () => {
    await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' });
    li.remove();
  });

  tasksList.appendChild(li);
}
