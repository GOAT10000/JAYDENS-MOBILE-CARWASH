import { pool } from '../database/dbConnection.js';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';


function signJWTWebtoken(user){
    return JWT.sign({
        user_id: user.user_id,
        user_fullname: user.full_name,
        user_role: user.role,
        user_email: user.email},

        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
        
        )
}

export const fetchAllUsers = async(req, res, _next) => {
    
    const [allusers] = await pool.query(`select * from users`);

    res.status(200).json({
        status: 'success',
        results: allusers.length,
        data: {users:allusers}
    })
}

export const fetchOneUser = async(req, res, _next) => {

const [oneuser] = await pool.query(`select * from users where user_id = ?`, [req.params.id]);

if(oneuser.length <= 0){
    res.status(404).json({
        status: 'error',
        message: 'Record not found'
    })
}else{
    res.status(200).json({
        status: 'success',
        results: oneuser.length,
        data: { oneuser: oneuser[0]}
    })
}
}


export const createUser = async(req, res, _next) =>{

   const role = 'customer';
   req.body.password = await bcrypt.hashSync(req.body.password);
    const [newuser] = await pool.query(`insert into users (full_name, password, email, role) 
    values (?,?,?, ?)`,
     [req.body.name, req.body.password,req.body.email, role])

    if(newuser.insertId > 0){

        const token = signJWTWebtoken({
            user_id: newuser.user_id,
        user_fullname: req.body.full_name,
        user_role: req.body.role,
        user_email: req.body.email
        });

        res.status(201).json({
            status: 'success',
            message: 'record created',
           data: {
            token,
            user: req.body
           }
        })        
    }else{
        res.status(404).json({
            status: 'error',
            message: 'record not created'
        })
    }
}

export const editUser = async(req, res, _next) => {

    req.body.password = await bcrypt.hashSync(req.body.password);

    const [updateuser] = await pool.query(`UPDATE users
    set full_name = '${req.body.name}',
    password = '${req.body.password}',
    email = '${req.body.email}',
    where user_id = '${req.params.id}'`);

    if(updateuser.affectedRows <= 0){
        res.status(404).json({
            status: 'error',
            message: 'record could not be updated'
        })
    }else{
        res.status(200).json({
            status: 'success',
            message: 'record updated',
            results: updateuser.length,
            affectedRows: updateuser.affectedRows
        })
    }
}


export const deleteUser = async(req, res, _next) => {

    const [deletedUser] = await pool.query(`delete from users where user_id = ${req.params.id}`);

    if(deletedUser.affectedRows <= 0){
        res.status(404).json({
            status: 'error',
            message: 'record could not be updated'
        })
    }else{
        res.status(200).json({
            status: 'success',
            message: 'record updated',
            results: deletedUser.length,
            affectedRows: deletedUser.affectedRows
        })
    }

}

export const userToAdmin = async(req, res, _next) => {

    const [updateuser] = await pool.query(`UPDATE users
    set role = 'admin'
    where user_id = '${req.params.id}'`);

    if(updateuser.affectedRows <= 0){
        res.status(404).json({
            status: 'error',
            message: 'record could not be updated'
        })
    }else{
        res.status(200).json({
            status: 'success',
            message: 'record updated',
            results: updateuser.length,
            affectedRows: updateuser.affectedRows
        })
    }

}

export const loginUser = async(req, res, next) => {

    const [user] = await pool.query(`select * from users WHERE email = '${req.body.email}'`)

    if(!user.length){
        return res.status(404).json({
            status: 'error',
            message: 'User not found'
        });
    }

    if(!(await bcrypt.compare(req.body.password, user[0].password)))
        return res.status(400).json({
            status: 'error',
            message: 'Invalid credentials'
        });

        const token = signJWTWebtoken(user[0]);

        user[0].password = undefined;

        res.status(200).json({
            status: 'success',
            data: {
                token,
                user: user[0]
            }
        })
}