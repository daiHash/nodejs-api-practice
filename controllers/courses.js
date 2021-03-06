const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler')
const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamp')

// @desc    Get all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  PUBLIC
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId })
    return res.status(200).json({ success: true, size: courses.length, data: courses })
  } else {
    return res.status(200).json(res.advancedResults)
  }
})

// @desc    Get single course
// @route   GET /api/v1/courses/:id
// @access  PUBLIC
exports.getCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  const course = await Course.findById(id).populate({ path: 'bootcamp', select: 'name description' })

  if (!course) {
    return next(new ErrorResponse(`No course with the id of ${id}`), 404)
  }

  res.status(200).json({
    success: true,
    data: course
  })
})

// @desc    Add a course for a Bootcamp
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  PRIVATE
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId

  const bootcamp = await Bootcamp.findById(req.params.bootcampId)

  if (!bootcamp) {
    return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`), 404)
  }
  const course = await Course.create(req.body)

  res.status(200).json({
    success: true,
    data: course
  })
})

// @desc    Update a course for a Bootcamp
// @route   PUT /api/v1/bootcamps/:bootcampId/courses/:id
// @access  PRIVATE
exports.updateCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId

  const bootcamp = await Bootcamp.findById(req.params.bootcampId)

  if (!bootcamp) {
    return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`), 404)
  }

  let course = await Course.findById(req.params.id)

  if (!course) {
    return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404)
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: course
  })
})

// @desc    Delete a course for a Bootcamp
// @route   DELETE /api/v1/bootcamps/:bootcampId/courses/:id
// @access  PRIVATE
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.bootcampId)

  if (!bootcamp) {
    return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`), 404)
  }

  const course = await Course.findById(req.params.id)

  if (!course) {
    return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404)
  }

  await course.remove()

  res.status(200).json({
    success: true,
    data: {}
  })
})