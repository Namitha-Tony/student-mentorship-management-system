const express = require('express');
const { param, body } = require('express-validator');
const protect = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { getStudent, updateStudent, getStudentMentor, assignMentor } = require('../controllers/studentController');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();
const id = (name) => param(name).isMongoId().withMessage(`${name} must be a valid ID`);

router.use(protect);
router.get('/:id', id('id'), validate, getStudent);
router.put('/:id', [id('id'), body('semester').optional().isInt({ min: 1, max: 12 })], validate, authorizeRoles('student'), updateStudent);
router.get('/:id/mentor', id('id'), validate, getStudentMentor);
router.put('/:studentId/mentor', [id('studentId'), body('mentorId').isMongoId().withMessage('mentorId must be a valid ID')], validate, authorizeRoles('mentor'), assignMentor);

module.exports = router;
