const express = require('express')
const router = express.Router()
const {authAdmin} = require('../auth/auth')
const { adminDashboared, getEditUser, editUser, deleteUser, searrchUser } = require('../controllers/adminController')


router.get('/',authAdmin,adminDashboared)

router.get('/edit/:userid',authAdmin, getEditUser)

router.put('/edit/:userid',authAdmin, editUser)

router.delete('/delete-user/:userid', deleteUser)

router.get('/search',authAdmin, searrchUser)

module.exports = router