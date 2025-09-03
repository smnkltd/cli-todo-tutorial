const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let todos = [];


// ----------------- START APP -----------------
loadTasks();
showMenu();

// ✅ Load tasks from file (if exists)
function loadTasks() {
  if (fs.existsSync("tasks.json")) {
    todos = JSON.parse(fs.readFileSync("tasks.json"));
  }
}

// ✅ Save tasks to file
function saveTasks() {
  const text = JSON.stringify(todos, null, 2);
  fs.writeFileSync("tasks.json", text);
}

// ----------------- OPERATIONS -----------------

// 1. Add Task
function addTask() {
  rl.question("\n🆕 Enter new task: ", (task) => {
    if (task.trim() === "") {
      console.log("⚠️ Task cannot be empty.");
      return showMenu();
    }

    rl.question("📂 Enter category (Work/Personal/Study): ", (category) => {
      rl.question("📅 Enter deadline (YYYY-MM-DD): ", (deadline) => {
        todos.push({
          text: task,
          done: false,
          category: category || "General",
          deadline: deadline || "No deadline"
        });

        saveTasks();
        console.log("✅ Task added successfully!");
        showMenu();
      });
    });
  });
}

// 2. View Tasks
function viewTasks() {
  console.log("\n📋 Your To-Do List:");
  if (todos.length === 0) {
    console.log("⚠️ No tasks yet.");
  } else {
    todos.forEach((t, i) => {
      console.log(
        `${i + 1}. ${t.done ? "✔" : "✖"} ${t.text} 
        (Category: ${t.category}, Deadline: ${t.deadline})`
      );
    });
  }
  showMenu();
}

// 3. Toggle Done/Undone
function toggleTask() {
  rl.question("\n🔄 Enter task number to toggle: ", (num) => {
    const index = parseInt(num) - 1;
    if (isNaN(index) || index < 0 || index >= todos.length) {
      console.log("❌ Invalid task number.");
      return showMenu();
    }
    todos[index].done = !todos[index].done;
    saveTasks();
    console.log("✅ Task status updated!");
    showMenu();
  });
}

// 4. Edit Task
function editTask() {
  rl.question("\n✏️ Enter task number to edit: ", (num) => {
    const index = parseInt(num) - 1;
    if (isNaN(index) || index < 0 || index >= todos.length) {
      console.log("❌ Invalid task number.");
      return showMenu();
    }

    rl.question("📝 Enter new task text (leave blank to keep same): ", (newText) => {
      rl.question("📂 Enter new category (leave blank to keep same): ", (newCat) => {
        rl.question("📅 Enter new deadline (YYYY-MM-DD, leave blank to keep same): ", (newDeadline) => {
          if (newText.trim() !== "") todos[index].text = newText;
          if (newCat.trim() !== "") todos[index].category = newCat;
          if (newDeadline.trim() !== "") todos[index].deadline = newDeadline;

          saveTasks();
          console.log("✅ Task updated!");
          showMenu();
        });
      });
    });
  });
}

// 5. Delete Task
function deleteTask() {
  rl.question("\n🗑️ Enter task number to delete: ", (num) => {
    const index = parseInt(num) - 1;
    if (isNaN(index) || index < 0 || index >= todos.length) {
      console.log("❌ Invalid task number.");
      return showMenu();
    }
    todos.splice(index, 1);
    saveTasks();
    console.log("✅ Task deleted!");
    showMenu();
  });
}

// 6. Filter by Category
function filterByCategory() {
  rl.question("\n📂 Enter category to filter: ", (cat) => {
    const filtered = todos.filter(t => t.category.toLowerCase() === cat.toLowerCase());
    if (filtered.length === 0) {
      console.log(`⚠️ No tasks found in category: ${cat}`);
    } else {
      filtered.forEach((t, i) => {
        console.log(
          `${i + 1}. ${t.done ? "✔" : "✖"} ${t.text} ` +
          `(Category: ${t.category}, Deadline: ${t.deadline})`
        );
      });
    }
    showMenu();
  });
}

// 7. Filter by Deadline
function filterByDeadline() {
  rl.question("\n📅 Enter deadline (YYYY-MM-DD): ", (date) => {
    const filtered = todos.filter(t => new Date(t.deadline) <= new Date(date));
    if (filtered.length === 0) {
      console.log(`⚠️ No tasks due on/before ${date}`);
    } else {
      filtered.forEach((t, i) => {
        console.log(
          `${i + 1}. ${t.done ? "✔" : "✖"} ${t.text} ` +
          `(Category: ${t.category}, Deadline: ${t.deadline})`
        );
      });
    }
    showMenu();
  });
}

// ----------------- MENU SYSTEM -----------------
function showMenu() {
  console.log(`
==========================
  📌 TO-DO LIST (CLI APP)
==========================
1. Add Task
2. View Tasks
3. Toggle Task Done/Undone
4. Edit Task
5. Delete Task
6. Filter by Category
7. Filter by Deadline
0. Exit
--------------------------
  `);

  rl.question("👉 Choose an option: ", (choice) => {
    switch (choice) {
      case "1": addTask(); break;
      case "2": viewTasks(); break;
      case "3": toggleTask(); break;
      case "4": editTask(); break;
      case "5": deleteTask(); break;
      case "6": filterByCategory(); break;
      case "7": filterByDeadline(); break;
      case "0":
        console.log("👋 Goodbye!");
        rl.close();
        break;
      default:
        console.log("❌ Invalid option. Try again.");
        showMenu();
    }
  });
}




