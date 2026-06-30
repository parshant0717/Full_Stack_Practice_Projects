const { Command } = require("commander");
const fs = require("fs/promises");

const program = new Command();

program
  .name("Task Management CLI")
  .description("This is a CLI app to create,read,update and deleted tasks")
  .version("0.0.1");

//It validate file.
const validateSchema = (taskData) => {
  const isArray = Array.isArray(taskData);
  if (!isArray) return false;
  let isValid = taskData.every((data) => {
    const hasProperty =
      Object.hasOwn(data, "id") &&
      typeof data.id === "number" &&
      Object.hasOwn(data, "taskName") &&
      typeof data.taskName === "string" &&
      Object.hasOwn(data, "isCompleted") &&
      typeof data.isCompleted === "boolean";
    return hasProperty;
  });
  return isValid;
};

//It read data from the file.
const readTasks = async function (file) {
  let data = await fs.readFile(file, "utf-8");
  if (data.length === 0) return [];
  if (data.trim() === "") return [];

  data = JSON.parse(data);
  const isSchemaValid = validateSchema(data);
  if (!isSchemaValid)
    throw new Error("File does not follow our schema rule, Please update!");
  return data;
};

//It write the file.
const saveTask = async function (file, data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2));
};

//It get the task index
const findTaskIndex = (taskArr, id) => {
  for (let i = 0; i < taskArr.length; i++) {
    if (taskArr[i].id === Number(id)) return i;
  }
  return -1;
};

//Write Task
program
  .command("create")
  .description("It create task.")
  .argument("<string>", "Task Name to add.")
  .argument("<file>", "JSON file to create Task")
  .action(async function (str, file) {
    try {
      const taskData = await readTasks(file);

      const newTask = {
        id: taskData.length == 0 ? 1 : taskData[taskData.length - 1].id + 1,
        taskName: str,
        isCompleted: false,
      };
      taskData.push(newTask);

      await saveTask(file, taskData);
      console.log("Task created successfully!");
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  });

// Read Tasks
program
  .command("read")
  .description("It read tasks.")
  .argument("<file>", "JSON file to read Task")
  .action(async function (file) {
    try {
      const taskData = await readTasks(file);
      if (taskData.length === 0) throw new Error("Please add a task first!");

      taskData.forEach((tasks) => {
        console.log(
          `${tasks.id}=> ${tasks.taskName} => ${tasks.isCompleted ? "Completed" : "Pending"}`,
        );
      });
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  });

// Update Task
program
  .command("update")
  .description("This command will update the existing task.")
  .argument("<id>", "Task id to be updated.")
  .argument("<string>", "Task details.")
  .argument("<file>", "File path to write.")
  .action(async function (id, str, file) {
    try {
      const taskData = await readTasks(file);
      if (taskData.length === 0) throw new Error("Please add a task first!");

      const task = findTaskIndex(taskData, id);

      if (task === -1) throw new Error("Task not found!");
      taskData[task].taskName = str;

      await saveTask(file, taskData);
      console.log("Task updated successfully!");
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  });

//complete Task
program
  .command("complete")
  .description("It complete the existing task.")
  .argument("<id>", "Task id to be completed.")
  .argument("<file>", "File to write.")
  .action(async function (id, file) {
    try {
      const taskData = await readTasks(file);
      if (taskData.length === 0) throw new Error("Please add a task first!");

      const task = findTaskIndex(taskData, id);
      if (task === -1) throw new Error("Task not found!");
      taskData[task].isCompleted = true;

      await saveTask(file, taskData);
      console.log("Task completed successfully!");
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  });

// Delete Task
program
  .command("delete")
  .description("This command is for delete a task.")
  .argument("<id>", "Task id to be deleted.")
  .argument("<file>", "File to write.")
  .action(async function (id, file) {
    try {
      const taskData = await readTasks(file);
      if (taskData.length === 0) throw new Error("Please add a task first!");

      const task = findTaskIndex(taskData, id);
      if (task === -1) throw new Error("Task not found!");
      taskData.splice(task, 1);

      await saveTask(file, taskData);
      console.log("Task deleted successfully!");
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  });

program.parse();
