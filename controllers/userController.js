import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'


import UserModel from '../modules/user.js';


export const register = async (req, res) => {
    try{
   /* Шифрование пароля  */
     const password = req.body.password;
     const salt = await bcrypt.genSalt(10);//Алгоритм шифрование 
     const hash = await bcrypt.hash(password,salt)//зашифрованный пароль
   
   
     const doc = new UserModel({
       email: req.body.email,
       fullName: req.body.fullName,
       avatarUrl: req.body.avatarUrl,
       passwordHash:hash,
     })
   
     /* create user in db */
     const user = await doc.save()
   
   /* get token  */
   const token = jwt.sign({
     _id:user._id,
   }, 
   'secret123',//ключ 
   {
   expiresIn:'30d', //deadline :)
   })
   
   const {passwordHash, ...userData} = user._doc
   
     res.json({
       ...userData,
       token})
      
      res.render('login')

    }catch(err){
     console.log(err);
     res.status(500).json({
       message:"cannot registration",
     })
    }
   
}
export const login = async (req, res) => {
  try {
      const { email, password } = req.body;

      // Find the user by email
      const user = await UserModel.findOne({ email });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
          return res.status(400).json({ message: 'Incorrect email or password' });
      }

      // Check if the user is the admin
      if (email === 'admin@gmail.com' && password === '12605291') {
          // If so, assign the role as admin
          user.role = 'admin';
      } else {
          // Otherwise, assign the role as user
          user.role = 'user';
      }

      // Save the updated user role
      await user.save();

      // Generate JWT token
      const token = jwt.sign({ _id: user._id }, 'secret123', { expiresIn: '30d' });
      console.log('Generated token:', token);

      // Save the token in the local storage
      res.locals.token = token;
      res.redirect('/');
      /*  res.json({ token }); */
    
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Sorry, cannot login' });
  }
};


export const getMe = async (req, res) =>{
    try{
      const user = await UserModel.findById(req.userId);
      if(!user){
        return res.status(404).json({
          message:"no user",
        })
      }
  
     const { passwordHash, ...userData } = user._doc;
  
    res.json(userData);
  
    }catch (err){
      console.log(err);
      res.status(500).json({
        message:"no acccess",
      })
    }
  }