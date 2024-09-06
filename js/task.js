export class Task {
  constructor(title, priority, completed = false) {
    this.title = title;
    this.priority = priority; // Un entier positif
    this.completed = completed;
    this.dateAdded = new Date(); // Ajouter une date d'ajout
  }

  // Marquer la tâche comme terminée avec une fonction fléchée
  completeTask = () => (this.completed = true);

  // Formater le titre en majuscules avec une fonction fléchée
  getTitleUpperCase = () => this.title.toUpperCase();

  // Formater la priorité en utilisant une fonction fléchée et des backticks pour une meilleure lisibilité
  getPriorityLabel = () =>
    this.priority === 3 ? "Haute" : this.priority === 2 ? "Moyenne" : "Basse";
}
