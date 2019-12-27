import * as Yup from 'yup';
import User from '../models/User';
import HttpStatus from '../constants/httpStatus';

class UserController {
  async index(req, res) {
    const users = await User.findAll();
    return res.json(users);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'Validation fails!' });
    }

    const userExists = await User.findByEmail(req.body.email);

    if (userExists) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'Email already in use' });
    }
    const { id, nome, email, provider } = await User.create(req.body);

    return res.status(HttpStatus.CREATED).json({ id, nome, email, provider });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string(),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'Validation fails!' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const userExists = await User.findByEmail(req.body.email);

      if (userExists) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: 'User already exists' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'Password does not match' });
    }

    const { id, nome, provider } = await user.update(req.body);

    return res.json({ id, nome, email, provider });
  }
}

export default new UserController();
