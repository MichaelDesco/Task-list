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
  // Sélectionner le template et cloner son contenu
  const template = document.getElementById("task-template");
  const taskItem = document.importNode(template.content, true);

  // Remplir les informations dynamiques de la tâche
  taskItem.querySelector(".task-title").textContent = task.getTitleUpperCase();
  taskItem.querySelector(".task-date").textContent = task.getFormattedDate();

  // Initialiser la valeur du <select> pour la priorité
  const taskPrioritySelect = taskItem.querySelector(".task-priority-select");
  taskPrioritySelect.value = task.priority; // Mettre la priorité actuelle

  // Gérer le changement de priorité
  taskPrioritySelect.addEventListener("change", (event) => {
    const newPriority = parseInt(event.target.value);
    task.priority = newPriority; // Mettre à jour la priorité de la tâche
  });

  // Statut de la tâche (terminée ou non)
  taskItem.querySelector(".task-status").textContent = task.completed
    ? "Terminée"
    : "Non Terminée";
  taskItem
    .querySelector(".task-status")
    .classList.add(task.completed ? "badge-completed" : "badge-not-completed");

  // Gestion du bouton de suppression
  taskItem.querySelector(".delete-task").addEventListener("click", async () => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous ne pourrez pas annuler cela !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      taskList.removeTask(task.title);
      taskItem.remove();
      updateUncompletedCount();
      Swal.fire("Supprimée!", "Votre tâche a été supprimée.", "success");
    }
  });

  // Ajouter la tâche à la liste
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
  const priority = 1; // Priorité par défaut
  // Afficher une alerte de validation
  Swal.fire({
    title: "Tâche ajoutée !",
    text: `${title} a été ajoutée avec succès.`,
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
