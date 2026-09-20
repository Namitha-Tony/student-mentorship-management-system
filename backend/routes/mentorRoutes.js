
const express = require('express');

const { param } = require('express-validator');

const protect = require('../middleware/authMiddleware');

const {
  getMyMentor,
  getMentor,
  getMentorStudents
} = require('../controllers/mentorController');

const validate = require('../middleware/validateMiddleware');

const router = express.Router();


router.use(protect);


router.get('/me', getMyMentor);


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

