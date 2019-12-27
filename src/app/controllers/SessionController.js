import jwt from 'jsonwebtoken';
import User from '../models/User';
import Auth from '../../config/auth';
import HttpStatus from '../constants/httpStatus';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);

    if (!user) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'Email not found!' });
    }

    if (!(await user.checkPassword(password))) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'Wrong password!' });
    }

    const { id, nome } = user;
    return res.json({
      user: {
        id,
        nome,
        email,
      },
      token: jwt.sign({ id }, Auth.secret, { expiresIn: Auth.expiresIn }),
    });
  }
}

export default new SessionController();
