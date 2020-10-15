const express = require('express')

const {
  getBootcamp,
  getBootcamps,
  deleteBootcamp,
  updateBootcamp,
  createBootcamp,
  getBootcampsInRadius,
  uploadBootcampPhoto
} = require('../controllers/bootcamps')

// Include other resoursce routers
const courseRouter = require('./courses')

const router = express.Router()

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)


router.route('/').get(getBootcamps).post(createBootcamp)
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)
router.route('/:id/photo').put(uploadBootcampPhoto)

module.exports = router
