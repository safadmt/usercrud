const expreess = require('express')
const router = expreess.Router()
const {authUser}= require('../auth/auth')
const { loginPage, signupPage, logout, signup, userDashboared, login } = require('../controllers/userController')


// rendering login page 
router.get('/login', loginPage)
// rendering signup page
router.get('/signup', signupPage)
//login validation, if validated redirected to protected page
router.post('/login', login)
//rendering user dashboared
router.get('/',authUser, userDashboared)
//signup validation
router.post('/signup', signup)
//logut 
router.get('/logout', logout)

module.exports = router