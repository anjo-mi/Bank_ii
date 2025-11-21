import express from "express";
import homeController from "../controllers/home.js";

// protect all practice routes from unauthorized access
import auth from '../middleware/auth.js';
const {ensureAuth} = auth;

const router = express.Router();

router.get('/', homeController.getHome);
router.get('/dashboard', ensureAuth, homeController.getUserDash);
router.post('/saveResource', ensureAuth, homeController.saveResource);
router.post('/getSession', ensureAuth, homeController.getSession);
router.patch('/deleteResource', ensureAuth, homeController.deleteResource);
router.patch('/updateUser', ensureAuth, homeController.updateUser);

export default router;