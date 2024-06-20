import express from 'express';
import { createUser, deleteUser, editUser, fetchAllUsers, fetchOneUser, loginUser, userToAdmin } from '../controllers/UserController.js';
import { getUserProfile, protect } from '../controllers/authController.js';
import { SingleAppointment, allAppointments, createAppointment, deleteAppointment, editAppointment } from '../controllers/appointmentController.js';

export const userRouter = express.Router();
export const authRouter = express.Router();
export const appointRouter = express.Router();

userRouter.get('/all_users', fetchAllUsers);
userRouter.get('/one_user/:id', fetchOneUser);
userRouter.post('/create_user', createUser);
userRouter.patch('/edit_user/:id', editUser);
userRouter.patch('/user_to_admin/:id', userToAdmin);
userRouter.delete('/delete_user/:id', deleteUser);
userRouter.post('/login', loginUser);

appointRouter.get('/all_appointments', allAppointments)
appointRouter.get('/single_appointment/:id', SingleAppointment)
appointRouter.post('/create_appointment', createAppointment)
appointRouter.patch('/edit_appointment/:id', editAppointment)
appointRouter.delete('/delete_appointment/:id', deleteAppointment)


authRouter.use(protect)
authRouter.get('/my-profile', getUserProfile)