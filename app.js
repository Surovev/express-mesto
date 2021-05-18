const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {
  celebrate, Joi, isCelebrateError,
} = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/Logger');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use(auth);

app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.use(errorLogger);

app.use(() => {
  throw new NotFoundError('Страница не найдена');
});

app.use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    const errorBody = err.details.get('body');
    const { details: [errorDetails] } = errorBody;
    res
      .status(400)
      .send({
        message: errorDetails.message,
      });
  } else {
    const { statusCode = err.status || 500, message = err.message || 'На сервере произошла ошибка' } = err;
    res
      .status(statusCode)
      .send({
        // проверяем статус и выставляем сообщение в зависимости от него
        message,
      });
  }
  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // console.log(`App listening on port ${PORT}`);
});
