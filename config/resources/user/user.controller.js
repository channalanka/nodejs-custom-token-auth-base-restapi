import joi from 'joi';
import User from './user.model';
import userService from './user.service';
class Usercontroller{
    signUp = async(req, res)=>{
        try{
            const {value, error} = userService.validateSignUp(req.body);
            if(error && error.details){
                console.log(error);
                return res.status(400).json(error)
            }
            const salt = userService.generateRandomSalt();
            const encryptPassword = userService.encryptPassword(value.password, salt);
            const user = await User.create({
                fname: value.fname,
                lname: value.lname,
                email: value.email,
                password: encryptPassword.toString('base64'),
                salt: salt.toString('base64')
            });
            return res.status(200).json(user);
            
        } catch(ex){
            console.log(ex);
            return res.status(500).json(ex)
        }
    }

    login =async(req,res)=>{
        try{
            const{value, error} = userService.validateLogin(req.body);
            if(error && error.details){
                console.log(error);
                return res.status(400).json(error)
            } 
            const user = await User.findOne({email:value.email});
            if(!user){
                return res.status(400).json({error: 'Invalid username or Password'});
            }
            if(!userService.comparePassword(value.password, user.password, user.salt)){
                return res.status(400).json({error: 'Invalid username or Password'});
            }

            const payload ={
                lname: user.lname,
                fname: user.fname,
                email: user.email,
                _id: user._id
            }
            const token = userService.generateToken(payload);
            return res.status(200).json({"token": token});

        } catch(ex){
            console.log(ex);
            return res.status(500).json(ex);
        }
    }

    token= async (req, res)=>{
        const verify = userService.verifyToken(req.body.token)
        return res.status(200).json(verify);
    }


}

export default new Usercontroller();