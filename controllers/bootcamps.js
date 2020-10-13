const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler')
const geocoder = require('../utils/geocoder')
const Bootcamp = require('../models/Bootcamp')

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  PUBLIC
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query

  const reqQuery = { ...req.query }

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit']

  removeFields.forEach((param) => {
    delete reqQuery[param]
  })

  let queryString = JSON.stringify(reqQuery)

  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  )

  query = Bootcamp.find(JSON.parse(queryString)).populate('courses')

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.select.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Bootcamp.countDocuments()

  query = query.skip(startIndex).limit(limit)

  const bootcamps = await query

  // Pagination Result
  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

  res.status(200).json({
    success: true,
    size: bootcamps.length,
    data: bootcamps,
    pagination,
  })
})

// @desc    Get a bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  PRIVATE
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found witrh id of ${req.params.id}`, 404)
    )
  }

  res.status(200).json({
    success: true,
    data: bootcamp,
  })
})

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  PRIVATE
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body)

  res.status(200).json({
    success: true,
    data: bootcamp,
  })
})

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  PRIVATE
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found witrh id of ${req.params.id}`, 404)
    )
  }

  res.status(200).json({
    success: true,
    data: bootcamp,
  })
})

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  PRIVATE
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found witrh id of ${req.params.id}`, 404)
    )
  }

  bootcamp.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})

// @desc    Get bootcamps within a radius
// @route   DELETE /api/v1/bootcamps/radius/:zipcode/:distance
// @access  PRIVATE
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params

  // Get lat / lng from geocoder
  const location = await geocoder.geocode(zipcode)
  const lat = location[0].latitude
  const lng = location[0].longitude

  // Calculate radius using radians
  // Divide distance by radius of Earth
  // Earth Radius = 3950 miles / KM 6378km
  const radius = distance / 6378

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  })

  res.status(200).json({
    success: true,
    size: bootcamps.length,
    data: bootcamps,
  })
})
