import { body } from "express-validator";

export const loginValidator = [
    body("email",'Wrong format of email').isLength({min:3}),
    body("password" , 'Password should contain min 5 symbolss').isLength({min:5}),
];
export const registerValidaation = [
    body("fullName", 'Write your name ').isLength({min:3}),
    body("password" , 'Password should contain min 5 symbolss').isLength({min:5}),
];
