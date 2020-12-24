const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
import * as bodyParser from 'body-parser';
import { Application } from 'express';
import { router as authRouter } from './routes/authRouter';

const app: Application = express();
const PORT = config.get('port');

app.use(bodyParser.json());

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
