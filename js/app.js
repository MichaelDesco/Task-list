import { mockTasks } from "./mock-tasks.js";
import { TaskList } from "./task-list.js";
import { Task } from "./task.js";

const taskList = new TaskList();

// Fonction pour jouer une animation Lottie
const playLottieAnimation = (animationPath) => {
  const lottieContainer = document.getElementById("lottie-container");
  lottieContainer.innerHTML = ""; // Effacer toute animation précédente
  lottie.loadAnimation({
    container: lottieContainer, // Conteneur de l'animation
    renderer: "svg",
    loop: false,
    autoplay: true,
    path: animationPath, // Chemin vers l'animation JSON
  });
};

const addTaskToDOM = (task) => {
  const taskItem = document.createElement("li");
  taskItem.classList.add(
    "list-group-item",
    "d-flex",
    "justify-content-between",
    "align-items-center"
  );

  const taskTitle = document.createElement("span");
  taskTitle.innerHTML = `<strong>${task.getTitleUpperCase()}</strong>`; // Titre en gras
  taskTitle.classList.add("me-2");

  const taskDate = document.createElement("span");
  taskDate.textContent = task.getFormattedDate();
  taskDate.classList.add("text-muted", "ms-2"); // Date en gris

  const taskPriority = document.createElement("span");
  taskPriority.textContent = task.getPriorityLabel();
  taskPriority.classList.add(
    "badge",
    "rounded-pill",
    getPriorityBadgeClass(task.priority),
    "me-2",
    "task-priority-width"
  );

  const taskStatus = document.createElement("span");
  taskStatus.classList.add(
    "badge",
    task.completed ? "badge-completed" : "badge-not-completed",
    "me-2",
    "task-status-width"
  );
  taskStatus.textContent = task.completed ? "Terminée" : "Non Terminée";

  const taskContent = document.createElement("div");
  taskContent.classList.add("d-flex", "align-items-center", "flex-grow-1");
  taskContent.append(taskTitle, taskDate); // Ajout du titre et de la date

  const rightContent = document.createElement("div");
  rightContent.classList.add("d-flex", "align-items-center");
  rightContent.append(taskPriority, taskStatus);

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
  deleteButton.classList.add("btn", "btn-sm", "ms-1");

  deleteButton.addEventListener("click", () => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous ne pourrez pas annuler cela !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        taskList.removeTask(task.title);
        taskItem.remove();
        updateUncompletedCount();
        Swal.fire("Supprimée!", "Votre tâche a été supprimée.", "success");
      }
    });
  });

  taskItem.append(taskContent, rightContent, deleteButton);
  document.getElementById("taskList").appendChild(taskItem);
};

// Fonction pour obtenir la classe CSS de la pastille de priorité
const getPriorityBadgeClass = (priority) => {
  if (priority === 3) return "badge-high"; // Haute
  if (priority === 2) return "badge-medium"; // Moyenne
  return "badge-low"; // Basse
};

// Fonction pour initialiser la liste des tâches avec les mocks
const loadMockTasks = () => {
  mockTasks.forEach((taskData) => {
    const task = new Task(
      taskData.title,
      taskData.priority,
      taskData.completed
    );
    taskList.addTask(task);
    addTaskToDOM(task);
  });
};

// Fonction pour trier les tâches
const sortTasks = () => {
  const sortButton = document.getElementById("sortButton");
  const isSortingByPriority = sortButton.dataset.sort === "priority";

  taskList.tasks.sort((a, b) => {
    if (isSortingByPriority) {
      return b.priority - a.priority;
    } else {
      return new Date(b.dateAdded) - new Date(a.dateAdded);
    }
  });

  document.getElementById("taskList").innerHTML = ""; // Réinitialiser la liste des tâches
  taskList.tasks.forEach(addTaskToDOM);

  sortButton.dataset.sort = isSortingByPriority ? "date" : "priority";
  sortButton.textContent = isSortingByPriority
    ? "Trier par Date d'Ajout"
    : "Trier par Priorité";
};

// Fonction pour mettre à jour le nombre de tâches non terminées
const updateUncompletedCount = () => {
  document.getElementById(
    "uncompletedCount"
  ).textContent = `Nombre de tâches non terminées : ${taskList.countUncompletedTasks()}`;
};

document.getElementById("taskForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.getElementById("taskTitle").value;
  const priority = parseInt(document.getElementById("taskPriority").value);
  // Afficher une alerte de validation
  Swal.fire({
    title: "Tâche ajoutée !",
    text: `Titre: ${title} - Priorité: ${
      priority === 3 ? "Haute" : priority === 2 ? "Moyenne" : "Basse"
    }`,
    icon: "success",
    confirmButtonText: "OK",
    confirmButtonColor: "#3085d6",
  }).then(() => {
    // Ajouter la tâche après validation
    const task = new Task(title, priority);
    // Ajouter la tâche à la liste et au DOM
    taskList.addTask(task);
    addTaskToDOM(task);
    // Mettre à jour le nombre de tâches non terminées
    updateUncompletedCount();
    // Jouer l'animation d'ajout
    playLottieAnimation("../animations/add-task.json");
    // Réinitialiser le formulaire
    document.getElementById("taskForm").reset();
  });
});

document.getElementById("sortButton").addEventListener("click", sortTasks);
document.getElementById("showCompletedButton").addEventListener("click", () => {
  const completedTasks = taskList.tasks.filter((task) => task.completed);
  document.getElementById("taskList").innerHTML = "";
  completedTasks.forEach(addTaskToDOM);
});

document.addEventListener("DOMContentLoaded", () => {
  loadMockTasks();
  updateUncompletedCount();
});
