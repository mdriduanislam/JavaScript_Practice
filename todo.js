// Todo.js

class TodoApp {
  constructor() {
    // stores tasks
    this.todos = [];
  }

  /**
   * addTodo(name, timeNeeded, category)
   * - name: string (task name)
   * - timeNeeded: number (time in whatever unit you prefer)
   * - category: string (Study, Entertainment, Personal, Health, Learning, etc.)
   *
   * Task object structure:
   * { id, name, category, time, completed, createdAt }
   */
  addTodo(name, timeNeeded, category) {
    if (!name || name.toString().trim() === "") {
      console.log("❌ Task name is required.");
      return false;
    }
    const time = Number(timeNeeded);
    if (Number.isNaN(time) || time < 0) {
      console.log("❌ Invalid time value.");
      return false;
    }

    const newTask = {
      id: this.todos.length + 1,
      name: name.toString().trim(),
      category: category ? category.toString().trim() : "Uncategorized",
      time: time,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    this.todos.push(newTask);
    console.log(`✅ Added task: "${newTask.name}" (ID: ${newTask.id})`);
    return newTask;
  }

  /**
   * completeTodo(taskName)
   * - finds task by name (first match)
   * - if found, sets completed = true and returns true
   * - else returns false
   */
  completeTodo(taskName) {
    if (!taskName) return false;
    const task = this.todos.find((t) => t.name === taskName);
    if (!task) return false;
    if (task.completed) {
      // already completed
      return true;
    }
    task.completed = true;
    return true;
  }

  /**
   * removeTodo(taskName)
   * - finds task index by name and removes it from todos
   * - returns removed task or null if not found
   */
  removeTodo(taskName) {
    const index = this.todos.findIndex((t) => t.name === taskName);
    if (index === -1) {
      console.log(`❌ Task "${taskName}" not found.`);
      return null;
    }
    const [removed] = this.todos.splice(index, 1);
    console.log(`🗑️ Removed task: "${removed.name}" (ID: ${removed.id})`);
    return removed;
  }

  /**
   * displayTodoList(category?)
   * - if no category passed: log all tasks (id, name, category, time, completed)
   * - if category passed: log only tasks in that category
   */
  displayTodoList(category) {
    const list =
      typeof category === "undefined"
        ? this.todos
        : this.todos.filter((t) => t.category === category);

    if (list.length === 0) {
      if (typeof category === "undefined") {
        console.log("📭 No tasks available.");
      } else {
        console.log(`ℹ️ No tasks found in category "${category}".`);
      }
      return;
    }

    console.log("\n📝 Todo List:");
    list.forEach((t) => {
      console.log(
        `ID: ${t.id} | ${t.name} | Category: ${t.category} | Time: ${t.time} | Completed: ${t.completed}`
      );
    });
    console.log("");
  }

  /**
   * hoursWorked()
   * - total time for completed tasks
   * - implemented with reduce
   */
  hoursWorked() {
    return this.todos
      .filter((t) => t.completed)
      .reduce((sum, t) => sum + Number(t.time || 0), 0);
  }

  /**
   * timeNeeded()
   * - total time for tasks not completed yet
   * - implemented with reduce
   */
  timeNeeded() {
    return this.todos
      .filter((t) => !t.completed)
      .reduce((sum, t) => sum + Number(t.time || 0), 0);
  }

  /**
   * editTodo(taskName, updates)
   * - updates: object with optional properties: name, category, time
   * - returns true if task found and at least one property updated, else false
   */
  editTodo(taskName, updates = {}) {
    const task = this.todos.find((t) => t.name === taskName);
    if (!task) return false;

    let updated = false;

    if (updates.name && updates.name.toString().trim() !== "" && updates.name !== task.name) {
      task.name = updates.name.toString().trim();
      updated = true;
    }

    if (
      updates.category &&
      updates.category.toString().trim() !== "" &&
      updates.category !== task.category
    ) {
      task.category = updates.category.toString().trim();
      updated = true;
    }

    if (typeof updates.time !== "undefined") {
      const newTime = Number(updates.time);
      if (!Number.isNaN(newTime) && newTime >= 0 && newTime !== task.time) {
        task.time = newTime;
        updated = true;
      }
    }

    return updated;
  }

  /**
   * getTodo(query)
   * - query can be a task name or a category name
   * - returns first matching task or undefined
   */
  getTodo(query) {
    if (!query) return undefined;
    // first try name match
    const byName = this.todos.find((t) => t.name === query);
    if (byName) return byName;
    // then category
    const byCategory = this.todos.find((t) => t.category === query);
    return byCategory;
  }

  /**
   * largestTodo()
   * - among incomplete tasks, return the task with the largest time
   * - if none, returns undefined
   */
  largestTodo() {
    const pending = this.todos.filter((t) => !t.completed);
    if (pending.length === 0) return undefined;
    return pending.reduce((max, t) => (t.time > max.time ? t : max), pending[0]);
  }

  /**
   * smallestTodo()
   * - among incomplete tasks, return task with smallest time
   */
  smallestTodo() {
    const pending = this.todos.filter((t) => !t.completed);
    if (pending.length === 0) return undefined;
    return pending.reduce((min, t) => (t.time < min.time ? t : min), pending[0]);
  }

  /**
   * sortTodos()
   * - reorder this.todos such that incomplete tasks are sorted by time desc (largest to smallest)
   * - completed tasks follow (their relative order preserved)
   */
  sortTodos() {
    const incomplete = this.todos.filter((t) => !t.completed).sort((a, b) => b.time - a.time);
    const complete = this.todos.filter((t) => t.completed);
    this.todos = [...incomplete, ...complete];
    console.log("🔀 Todos sorted: incomplete tasks ordered by time (high → low).");
    return this.todos;
  }

  /**
   * undoTodo(taskName)
   * - if task exists and completed === true, set to false and return true
   * - else return false
   */
  undoTodo(taskName) {
    const task = this.todos.find((t) => t.name === taskName);
    if (!task) return false;
    if (!task.completed) return false;
    task.completed = false;
    return true;
  }

  /**
   * completedPercentage()
   * - returns percent completed (0 - 100)
   */
  completedPercentage() {
    const total = this.todos.length;
    if (total === 0) return "0%";
    const completedCount = this.todos.filter((t) => t.completed).length;
    const percent = (completedCount / total) * 100;
    return `${parseFloat(percent.toFixed(2))}%`;
  }

  /**
   * importTodos(jsonString)
   * - accepts a JSON string representing an array of task-like objects
   * - each object may have: name, time, category, completed (optional)
   * - returns number of tasks successfully imported
   */
  importTodos(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        console.log("❌ JSON must be an array of tasks.");
        return 0;
      }
      let count = 0;
      for (const item of parsed) {
        if (!item || !item.name) continue;
        const name = item.name.toString().trim();
        const time = Number(item.time ?? 0);
        const category = item.category ? item.category.toString().trim() : "Uncategorized";
        const completed = !!item.completed;
        if (name === "" || Number.isNaN(time) || time < 0) continue;

        const newTask = {
          id: this.todos.length + 1,
          name,
          category,
          time,
          completed,
          createdAt: new Date().toISOString(),
        };
        this.todos.push(newTask);
        count++;
      }
      console.log(`📥 Imported ${count} task(s).`);
      return count;
    } catch (err) {
      console.log("❌ Invalid JSON:", err.message);
      return 0;
    }
  }

  /**
   * clearAllTodos()
   * - empties the todos list
   */
  clearAllTodos() {
    const len = this.todos.length;
    this.todos = [];
    console.log(`🧹 Cleared all todos (${len} removed).`);
  }
}

/* -------------------------
   Example usage (you can remove when using in production)
   ------------------------- */

if (typeof window === "undefined" || typeof module !== "undefined") {
  // Node/console testing example
  const app = new TodoApp();

  app.addTodo("পড়াশোনা কর", 3, "Study");
  app.addTodo("বই পড়", 2, "Learning");
  app.addTodo("ফুটবল খেল", 1.5, "Entertainment");
  app.addTodo("ডাক্তারের কাছে যাও", 0.5, "Health");
  app.displayTodoList();

  app.completeTodo("পড়াশোনা কর");
  console.log("Hours worked (completed):", app.hoursWorked());
  console.log("Time needed (pending):", app.timeNeeded());

  // edit
  console.log("Edit result:", app.editTodo("বই পড়", { name: "বই অধ্যয়ন", time: 2.5 }));
  app.displayTodoList();

  // getTodo
  console.log("getTodo by name:", app.getTodo("ফুটবল খেল"));
  console.log("getTodo by category:", app.getTodo("Study"));

  // largest & smallest pending
  console.log("Largest pending:", app.largestTodo());
  console.log("Smallest pending:", app.smallestTodo());

  // sort pending tasks
  app.sortTodos();
  app.displayTodoList();

  // undo completed
  console.log("Undo:", app.undoTodo("পড়াশোনা কর"));
  console.log("Completed percentage:", app.completedPercentage());

  // import example
  const jsonData = JSON.stringify([
    { name: "নতুন কাজ ১", time: 4, category: "Personal" },
    { name: "নতুন কাজ ২", time: 1, category: "Study", completed: true },
  ]);
  app.importTodos(jsonData);
  app.displayTodoList();

  // clear all
  // app.clearAllTodos();
  // app.displayTodoList();
}

// Export for Node if needed
if (typeof module !== "undefined") {
  module.exports = TodoApp;
}
