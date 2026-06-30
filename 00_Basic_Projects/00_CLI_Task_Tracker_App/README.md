# Task Management CLI

A small Command-Line Task Tracker implemented in Node.js using `commander`.

## Description

This CLI app lets you create, read, update, complete, and delete tasks persisted in a JSON file. It validates the JSON file schema before performing operations and exits with an error message if validation fails.

## Prerequisites

- Node.js (v14+ recommended)
- `npm` available
- <file>.json empty file to store tasks.

## Install

Install dependencies:

```bash
npm install
```

## Run

You can run commands with `node app.js` or via `npm start`:

```bash
node app.js <command> [args]
# or
npm start -- <command> [args]
```

## File Schema

The task storage must be a JSON array of task objects. Each task object must include:

- `id` (number)
- `taskName` (string)
- `isCompleted` (boolean)

Example (`task.json`):

```json
[
  {
    "id": 1,
    "taskName": "This is updated task",
    "isCompleted": false
  }
]
```

The app treats an empty file or a file containing only whitespace as an empty array. If the file does not follow the schema, the app will exit with:

```
File does not follow our schema rule, Please update!
```

## Commands

- `create <taskName> <file>`
  - Adds a new task with the given name to the JSON file.
  - New tasks get an auto-incremented `id` and `isCompleted: false`.
  - Example:
    ```bash
    node app.js create "Buy milk" task.json
    ```

- `read <file>`
  - Prints all tasks in the file in the format: `id=> taskName => Completed|Pending`.
  - Example:
    ```bash
    node app.js read task.json
    ```

- `update <id> <newTaskName> <file>`
  - Updates the `taskName` for the task with the given `id`.
  - Example:
    ```bash
    node app.js update 1 "Buy almond milk" task.json
    ```

- `complete <id> <file>`
  - Marks the task as completed (`isCompleted: true`).
  - Example:
    ```bash
    node app.js complete 1 task.json
    ```

- `delete <id> <file>`
  - Removes the task with the given `id` from the file.
  - Example:
    ```bash
    node app.js delete 1 task.json
    ```

## Behavior & Errors

- If the file is empty (no tasks), some commands will exit with:

```
Please add a task first!
```

- If a command references a non-existent `id`, the app will exit with:

```
Task not found!
```

- On other validation errors the app logs the message and exits with code `1`.

## Notes

- The CLI uses the `commander` package (see `package.json`).
- The project entrypoint is `app.js` and the app uses CommonJS modules.
