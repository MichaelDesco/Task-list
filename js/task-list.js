export class TaskList {
  constructor() {
    this.tasks = [];
  }

  // Ajouter une tâche à la liste (fonction fléchée)
  addTask = (task) => this.tasks.push(task);

  // Retirer une tâche de la liste par son titre (utilisation de filter et fonction fléchée)
  removeTask = (title) =>
    (this.tasks = this.tasks.filter((task) => task.title !== title));

  // Afficher la liste des tâches (utilisation de map et template literals)
  displayTasks = () =>
    this.tasks.map((task) =>
      console.log(
        `${task.getTitleUpperCase()} - Priorité: ${task.getPriorityLabel()} - ${
          task.completed ? "Terminée" : "Non terminée"
        }`
      )
    );

  // Afficher les tâches triées par priorité (utilisation de sort avec une fonction fléchée)
  displayTasksByPriority = () =>
    this.tasks
      .slice() // Crée une copie pour ne pas modifier l'original
      .sort((a, b) => b.priority - a.priority)
      .map((task) =>
        console.log(
          `${task.getTitleUpperCase()} - Priorité: ${task.getPriorityLabel()} - ${
            task.completed ? "Terminée" : "Non terminée"
          }`
        )
      );

  // Afficher uniquement les tâches non terminées (utilisation de filter et map)
  displayUncompletedTasks = () =>
    this.tasks
      .filter((task) => !task.completed)
      .map((task) =>
        console.log(
          `${task.getTitleUpperCase()} - Priorité: ${task.getPriorityLabel()}`
        )
      );

  // Calculer le nombre total de tâches non terminées (utilisation de filter et length)
  countUncompletedTasks = () =>
    this.tasks.filter((task) => !task.completed).length;

  // Marquer une tâche comme terminée (utilisation de find et méthode complète de l'objet Task)
  markTaskAsCompleted = (title) => {
    const task = this.tasks.find((task) => task.title === title);
    if (task) {
      task.completeTask(); // Marquer comme terminée
    }
  };

  // Afficher les tâches triées par priorité avec regroupement
  displayGroupedByPriority = () => {
    const groupedTasks = this.tasks.reduce((acc, task) => {
      const label = task.getPriorityLabel();
      acc[label] = acc[label] || [];
      acc[label].push(task);
      return acc;
    }, {});

    Object.keys(groupedTasks).forEach((priority) => {
      console.log(`\nTâches à ${priority.toLowerCase()} priorité :`);
      groupedTasks[priority].forEach((task) =>
        console.log(
          `${task.getTitleUpperCase()} - ${
            task.completed ? "Terminée" : "Non terminée"
          }`
        )
      );
    });
  };
}
