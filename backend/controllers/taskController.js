const Task = require('../models/Task');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// 1. GET ALL TASKS (With Search & Filter)
exports.getAllTasks = catchAsync(async (req, res, next) => {
  // Extract query parameters for search and filter
  const { search, status } = req.query;
  
  // Base query: only fetch tasks belonging to the logged-in user
  let queryObj = { user: req.user.id };

  // IMPLEMENT SEARCH: Search by title (case-insensitive)
  if (search) {
    queryObj.title = { $regex: search, $options: 'i' };
  }

  // IMPLEMENT FILTER: Filter by status (e.g., pending/completed)
  if (status && status !== 'all') {
    queryObj.status = status;
  }

  const tasks = await Task.find(queryObj).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: { tasks }
  });
});

// 2. CREATE TASK
exports.createTask = catchAsync(async (req, res, next) => {
  // Link the task to the authenticated user from the protect middleware
  const newTask = await Task.create({
    ...req.body,
    user: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: { task: newTask }
  });
});

// 3. GET SINGLE TASK
exports.getTask = catchAsync(async (req, res, next) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

  if (!task) {
    return next(new AppError('No task found with that ID or you do not have permission', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { task }
  });
});

// 4. UPDATE TASK (PATCH)
exports.updateTask = catchAsync(async (req, res, next) => {
  const updatedTask = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedTask) {
    return next(new AppError('No task found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { task: updatedTask }
  });
});

// 5. DELETE TASK
exports.deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });

  if (!task) {
    return next(new AppError('No task found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});