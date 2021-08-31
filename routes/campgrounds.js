//For router to work, you must require router!
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
// multer - for uploading files
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('campground[images]'), validateCampground, catchAsync(campgrounds.createCampground));
// to upload multaple files -> upload.array('image')
// for multiple files <input> tag in html must contain !multiple!
// .post(upload.array('image'), (req, res) => {
//     console.log(req.body, req.files);
//     res.send('IT WORKED')
// })
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('campground[images]'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;