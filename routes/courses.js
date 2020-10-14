const express = require('express')

const {
  getCourse,
  getCourses
} = require('../controllers/courses')

const router = express.Router({ mergeParams: true })

router.route('/').get(getCourses)
router.route('/:id').get(getCourse)
// .put(updateBootcamp).delete(deleteBootcamp)

module.exports = router
