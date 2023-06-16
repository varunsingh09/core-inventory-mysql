const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const moment = require('moment');
const mysqlConnection = require('../database');
const defaultInventory = require('../default/inventory');

const usersController = {};

usersController.logIn = (req, res) => {
    const { name, password } = req.body;
    if (name === 'testuser' && password === 'testuser') {
        res.status(200).send({
            token: createToken(1),
            done: 'Log In correct'
        });                
        defaultInventory();                           
    } else {
        const query = 'SELECT * FROM users WHERE name = ?';
        mysqlConnection.query(query, [name], (error, rows, fields) => {
            if (!error) {
                if (rows.length === 0) {
                    res.status(401).send({
                        error: { name: 'Username incorrect' }
                    });
                } else {
                    const user = rows[0];
                    const equals = bcrypt.compareSync(password, user.password);
                    if (!equals) {
                        res.status(401).send({
                            error: { password: 'Password incorrect' }
                        });
                    } else {
                        res.status(200).send({
                            token: createToken(user.id),
                            done: 'Log In correct'
                        });                                      
                    }
                }
            }else {
                console.log(error);            
            }        
        });
    }
};

usersController.signUp = (req, res) => {    
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    const { name, password } = req.body;     
    userNameExists(name, exists => {        
        if (!exists) {
            const query = 'INSERT INTO users (name, password) VALUES (?, ?)';    
            mysqlConnection.query(query, [name, password], (error, rows, fields) => {
                if (!error) {         
                    const userId = rows.insertId;                                       
                    res.status(200).send({
                        token: createToken(userId),
                        done: 'Sign Up correct'
                    });
                } else {
                    console.log(error);                
                }                    
            });
        } else {
            res.status(409).send({
                error: { name: 'User name in use' }
            });
        }           
    }); 
};

usersController.mainUser = (req, res) => {    
    const query = 'SELECT * FROM users WHERE id = ?';
    mysqlConnection.query(query, [req.userId], (error, rows, fields) => {
        if (!error) {
            if (rows.length > 0) {
                res.status(200).send(rows[0]);       
            } else {                            
                res.status(404).send({ status: 'User not found' });
            }
        } else {
            console.log(error);            
        } 
    });
};

module.exports = usersController;

const createToken = (userId) => {
    let payload = {
        userId,
        createdAt: moment().unix(),
        expireAt: moment().add(1, 'day').unix()
    };
    return jwt.encode(payload, process.env.TOKEN_KEY);
};

const userNameExists = (name, exists) => {            
    const query = 'SELECT * FROM users WHERE name = ?';
    mysqlConnection.query(query, [name], (error, rows, fields) => {
        if (!error) {                                                
            if (rows.length > 0) {
                exists(true);
            } else {
                exists(false);
            }
        } else {
            console.log(error);            
        }
    });        
};