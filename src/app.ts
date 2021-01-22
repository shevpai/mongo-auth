import { Application } from 'express';
import { router as authRouter } from './routes/authRouter';

const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const app: Application = express();
const PORT = config.get('port');

app.use(helmet());
app.use(
  rateLimiter({
    max: 30,
    windowMs: 60 * 60 * 1e3,
    message: 'Too many requests from this IP, please try again in an hour',
  })
);

app.use(bodyParser.json());

app.use(mongoSanitize());
app.use(xss());

app.use('/auth', authRouter);

async function start() {
  try {
    await mongoose.connect(config.get('mongoURI'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    app.listen(PORT, () => console.log(`Server is start on port ${PORT}...`));
  } catch (e) {
    console.error(`Server error: ${e.message}`);
    process.exit(1);
  }
}

start();
