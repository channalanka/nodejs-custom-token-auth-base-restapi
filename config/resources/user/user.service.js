import joi from 'joi';
import moment from 'moment';
import crypto from 'crypto';
import util from 'util';

const PBKDF2_ITERATION = 10000;
const PBKDF2_KEY_LENGTH = 256;
const PBKDF2_HASH_ALG = 'sha512';
const SHARED_SECRET ='U3vGpjrsQ8EQvfSRQCNhfhVuukK3Uqqox1tDfi14ECE=';
export default {


    validateSignUp(body){
        const userSchema = joi.object().keys({
            fname: joi.string().required(),
            lname: joi.string().required(),  
            email: joi.string().email({minDomainAtoms:2}).required(),
            password: joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
        }); 

        const result = joi.validate(body, userSchema);
        return result;
    },

    validateLogin(body){
        const loginSchema = joi.object().keys({
            email: joi.string().required(),
            password: joi.string().required()
        }); 

        const result = joi.validate(body, loginSchema);
        return result;
    },

    encryptPassword(plainText, salt){
        
        const hashKey = crypto.pbkdf2Sync(plainText, salt, PBKDF2_ITERATION, PBKDF2_KEY_LENGTH, PBKDF2_HASH_ALG)
        return hashKey;
    },

    generateRandomSalt(){
        console.log(crypto.randomBytes(32))
        console.log(crypto.randomBytes(32).toString('base64'));
        return crypto.randomBytes(32);
    },

    comparePassword(plainText, password, salt){
        const saltBuffer = new Buffer(salt, 'base64');
        const passwordBuffer = new Buffer(password, 'base64');
        const newPass = this.encryptPassword(plainText, saltBuffer);
        return crypto.timingSafeEqual(passwordBuffer, newPass)
    },

    generateToken(payload){
        console.log( moment());
        const expiredate = moment();
        expiredate.utc();
        expiredate.add(2, 'h');
        console.log( expiredate);
        
       const token = {
           payload: payload,
           expire: expiredate
       }
       
       const hmac = crypto.createHmac('sha256', new Buffer(SHARED_SECRET, 'base64'));
       hmac.update(JSON.stringify(token));
       const signedkey = hmac.digest('base64');
       const paylodString = Buffer.from(JSON.stringify(token)).toString('base64');
       return util.format('%s.%s', paylodString, signedkey);
    },

    verifyToken(token){
        const splitToken = token.split('.');
        const hmac = crypto.createHmac('sha256', new Buffer(SHARED_SECRET, 'base64'));
        const payload = Buffer.from(splitToken[0],'base64');
        hmac.update(payload); 
        const newsignedKey = hmac.digest('base64');
        const signedKey = Buffer.from(splitToken[1], 'base64');
        return crypto.timingSafeEqual(Buffer.from(newsignedKey, 'base64'),signedKey );
    }

}
