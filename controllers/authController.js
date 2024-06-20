import { pool } from '../database/dbConnection.js';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';

export const protect = async(req, res, _next) => {

    const authorization = req.get('Authorization');

    console.log(`Resquest Authorization  ${authorization}`);

    if(!authorization?.startsWith('Bearer'))
        return _next(
    res.status(400).json({
        status: 'error',
        message: 'You needed to be logged in to access this feature'
    })
    );
    const token = authorization.split(' ')[1];
    try{
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        console.log(`DECODED TOKEN: ${JSON.stringify(decoded)}`);

        const [user] = await pool.query(`select * from users where user_id = ${decoded.user_id}`);
        if(!user.length)
            return _next(
        res.status(404).json({
            status: 'error',
            message: 'This token is no longer valid or an error has occurred'
        })
        );

        const data = user[0];
        data.password = undefined;
        req.user = data;
        _next();
        }catch(error){
            if(error.message == 'JWT expired')
                return _next(
                    res.status(400).json({
                        status: 'error',
                        message: 'Token expired'
                    })
                );
                _next();
        }

}


export const getUserProfile = async(req, res, _next) => {

    if(!req.user)
        return _next();
    const [user] = await pool.query(`select * from users where user_id = ${req.user.user_id}`)

    if(!user.length)
        return res.status(404).json({
        status: 'error',
        message: 'Invalid request'
        })
        user[0].password = undefined;
        res.status(200).json({
            status: 'success',
            data: {
                user: user[0]
            }
        })
}