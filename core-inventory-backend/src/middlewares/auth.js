const jwt = require('jwt-simple');
const moment = require('moment');

const checkToken = (req, res, next) => {    
    if (!req.headers.authorization)
        return res.send({ error: 'Must include the header' });

    const token = req.headers.authorization.split(' ')[1];
    let payload = null;

    try {
        payload = jwt.decode(token, process.env.TOKEN_KEY);
    } catch (error) {
        return res.send({ error: 'Invalid token' });
    }

    if (moment().unix() > payload.expiresAt) {
        return res.send({ error: 'Expired token' });
    }

    req.userId = payload.userId;

    next();
};

module.exports = { checkToken };