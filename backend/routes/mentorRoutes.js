
const express = require('express');

const { param } = require('express-validator');

const protect = require('../middleware/authMiddleware');

const {
  getMyMentor,
  getMentor,
  getMentorStudents,
  getAvailableStudents
} = require('../controllers/mentorController');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();


router.use(protect);
router.get('/me', getMyMentor);

router.get('/available-students', getAvailableStudents);

router.get(
  '/:id',
  param('id').isMongoId(),
  validate,
  getMentor
);


router.get(
  '/:id/students',
  param('id').isMongoId(),
  validate,
  getMentorStudents
);


module.exports = router;

