const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler')
const User = require('../models/User')

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  PUBLIC
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body

  //* Craete User
  const user = await User.create({ name, email, password, role })
  res.status(200).json({ success: true })
})