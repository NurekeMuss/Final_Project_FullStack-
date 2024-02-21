/* import jwt from 'jsonwebtoken'
export default(req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '') ;

    if(token){
        try{
            const decoded = jwt.verify(token, 'secret123')

            req.userId = decoded._id;
            next();
        }catch(e){
            return res.status(403).json({
                message:'No access token'
            }) 
        }
    }else{
        return res.status(403).json({
            message:'No access token'
        })
    }
} */
import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123');
            
            // Attach decoded token to request object
            req.decodedToken = decoded;
            // Pass the token to the response header
            res.setHeader('Authorization', token);
            next();
        } catch (e) {
            return res.status(403).json({
                message: 'Invalid access token'
            });
        }
    } else {
        return res.status(403).json({
            message: 'No access token provided'
        });
    }
};
