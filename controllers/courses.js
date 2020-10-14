const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler')
const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamp')

// @desc    Get all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  PUBLIC
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId })
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description'
    })
  }

  const courses = await query

  res.status(200).json({
    success: true,
    size: courses.length,
    data: courses,
  })
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
// @route   GET /api/v1/bootcamps/:bootcampId/courses
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
// @route   GET /api/v1/bootcamps/:bootcampId/courses/:id
// @access  PRIVATE
exports.updateCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId

  const bootcamp = await Bootcamp.findById(req.params.bootcampId)

  if (!bootcamp) {
    return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`), 404)
  }

  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: course
  })
})