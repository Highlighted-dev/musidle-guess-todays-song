import express, { NextFunction, Request, Response, Router } from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import userModel from '../models/UserModel';
import Mailgun from 'mailgun.js';
import formData from 'form-data';
import { validateSingUp } from '@musidle-guess-todays-song/util-user-validation';
dotenv.config();

const router: Router = express.Router();
const jsonParser = bodyParser.json();

const generateToken = () => {
  // Generate random token that has 6 characters
  const token = Math.random().toString(36).substring(2, 8);
  return token;
};

router.post('/register', jsonParser, async (req: Request, res: Response) => {
  // Checks if any value is null. Validates password and email. If password is not valid, return error. If email is not valid, return error.
  if (req.body.username && req.body.email && req.body.password) {
    try {
      validateSingUp(req.body.email, req.body.password, req.body.username);
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const token = generateToken();

      const user = await userModel.create({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        role: 'user',
        token: token,
      });

      const authenticationUrl = `${
        process.env.NODE_ENV == 'production' ? process.env.API_URL : 'http://localhost:4200'
      }/verify/${user._id}/${token}`;

      const mailgun = new Mailgun(formData);
      const mg = mailgun.client({
        username: 'api',
        key: process.env.MAILGUN_API_KEY || 'key-yourkeyhere',
        url: 'https://api.eu.mailgun.net',
      });
      const htmlContent = `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
          }
          h1 {
            color: #333;
          }
          p {
            color: #555;
            font-size: 16px;
          }
          .verification-code {
            background-color: #007BFF;
            color: #fff;
            font-size: 18px;
            padding: 10px 20px;
            border-radius: 5px;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Hello, ${req.body.username}</h1>
          <p>Thank you for creating your Musidle account. Paste this (${authenticationUrl}) into the browser or click the button below</p>
          <div class="verification-code"><a style="color:#fff; text-decoration:none;" href="${authenticationUrl}">VERIFY</a></div>
        </div>
      </body>
      </html>
    `;

      mg.messages
        .create('mg.musidle.live', {
          from: 'Musidle Verification <noreply@mg.musidle.live>',
          to: [`${req.body.email}`],
          subject: 'Your Musidle account has been created!',
          text: `Please verify your account`,
          html: htmlContent,
        })
        .then(msg => console.log(msg))
        .catch(err => console.log(err));
      return res.json({ status: 'ok' });
    } catch (e) {
      if (e instanceof Error) {
        return res.json({
          status: 'error',
          message: e.message,
        });
      }
      return res.json({
        status: 'error',
        message: e,
      });
    }
  }
  return res.status(400).json({
    status: 'error',
    message: 'Could not create User. Please check if all fields are filled in correctly',
  });
});

router.post('/activate/', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.id || !req.body.token)
      return res.status(400).json({ status: 'error', message: 'Bad request' });
    const user = await userModel.findOne({
      _id: req.body.id,
    });

    if (!user)
      return res
        .status(400)
        .json({ status: 'error', message: 'Couldnt find user with this id in database' });
    if (user.activated)
      return res.status(200).json({ status: 'success', message: 'Account is already activated.' });
    if (user.token !== req.body.token)
      return res.status(400).json({ status: 'error', message: 'Token is wrong.' });
    await userModel.updateOne(
      {
        _id: req.body.id,
      },
      {
        activated: true,
      },
    );
    res.status(200).json({ status: 'success', message: 'Account activated succsefully' });
  } catch (e) {
    next(e);
  }
});

export default router;
