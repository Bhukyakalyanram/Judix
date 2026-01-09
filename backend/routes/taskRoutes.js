const express = require('express');
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply protection to all routes below this line
router.use(protect);

router
  .route('/')
  .get(taskController.getAllTasks)    // Get all tasks (with search/filter logic)
  .post(taskController.createTask);   // Create new task

router
  .route('/:id')
  .get(taskController.getTask)        // Get single task
  .patch(taskController.updateTask)   // Update task (Partial update)
  .delete(taskController.deleteTask); // Delete task

module.exports = router;