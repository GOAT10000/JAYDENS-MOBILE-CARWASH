import { pool } from '../database/dbConnection.js';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';


export const allAppointments = async(req, res, _next) => {

    const [appointments] = await pool.query(`select * from appointment`);

    res.status(200).json({
        status: 'success',
        results: appointments.length,
        data: {appointments:appointments}
    })
}

export const SingleAppointment = async(req, res, _next) => {

    const [appointment] = await pool.query(`select * from appointment where appointment_id = ${req.params.id}`);

    if(appointment.length <= 0){
        res.status(404).json({
            status: 'error',
            message: 'record not found'
        });
    }
    else{
        res.status(200).json({
            status: 'success',
            results: appointment.length,
            data: { appointment: appointment[0]}
        })
    }
}


export const createAppointment = async(req, res, _next) => {

    const [newappointment] = await pool.query(`
    insert into appointment ( service_id,date, user_id) 
    values ( ${req.body.service_id}, '${req.body.date}', (select user_id from users where full_name = '${req.body.full_name}'))
    `)

    if(newappointment.insertId > 0){
        res.status(201).json({
            status: 'success',
            message: 'record created'
        })        
    }else{
        res.status(404).json({
            status: 'error',
            message: 'record not created'
        })
    }
}

export const editAppointment = async(req, res, _next) => {

    const [updateAppoint] = await pool.query(`
    UPDATE appointment
    SET service_id = '${req.body.service_id}',
    date = '${req.body.date}',
    user_id = (select user_id from users where full_name = '${req.body.full_name}')
    where appointment_id = ${req.params.id}
    `)


    if (updateAppoint.affectedRows <= 0 ){
        res.status(404).json({
            status: 'error',
            message: 'Record not changed'
        });
    }
    else{
        res.status(200).json({
            status: 'success',
            message: 'record updated',
            results: updateAppoint.length,
            affectedRows: updateAppoint.affectedRows
        })
    }
}


export const deleteAppointment = async(req, res, _next) => {

    const [updateAppoint] = await pool.query(`
    Delete from appointment
    where appointment_id = ${req.params.id}
    `)


    if (updateAppoint.affectedRows <= 0 ){
        res.status(404).json({
            status: 'error',
            message: 'Record not changed'
        });
    }
    else{
        res.status(200).json({
            status: 'success',
            message: 'record updated',
            results: updateAppoint.length,
            affectedRows: updateAppoint.affectedRows
        })
    }
}