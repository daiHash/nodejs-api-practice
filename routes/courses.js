const express = require('express')

const {
  getCourse,
  getCourses,
  addCourse,
  updateCourse
} = require('../controllers/courses')

const router = express.Router({ mergeParams: true })

router.route('/').get(getCourses).post(addCourse)
router.route('/:id').get(getCourse).put(updateCourse)
// .delete(deleteBootcamp)

module.exports = router
