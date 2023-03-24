/* eslint-disable no-undef */
const User = require('../../models/Users');
const { login_post } = require('../../controller/authController');

// jest.mock('../../models/Users', () => {
//   return {
//     login: jest.fn()
//   };
// });

describe('login_post', () => {
  const req = {
    body: {
      email: 'test@example.com',
      password: 'password'
    },
    // session: {
    //   jwt: null,
    //   save: jest.fn()
    // }
  };
  const res = {
    status: 200,
    json: jest.fn(()=> res),
    send: jest.fn(()=> res),
  };
  const user = {
    _id: '123abc'
  };


  it('logs in a user and returns a 200 status', async () => {
    
    // User.login = jest.fn(()=> Promise.resolve(user));
    User.login = jest.fn().mockResolvedValue(user);

    await login_post(req, res);

    expect(User.login).toHaveBeenCalledWith(
      'test@example.com',
      'password'
    );
    // expect(req.session.jwt).toBeTruthy();
    // expect(req.session.save).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.json).toHaveBeenCalledWith({ user: '123abc' });
  });
  
  it('handles login errors and returns a 400 status', async () => {
        
      User.login = jest.fn().mockRejectedValue(new Error('Incorrect email'));
        const req = { body: { email: 'test@example', password: 'password' } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };

        await login_post(req, res);

        expect(User.login).toHaveBeenCalledWith({
          email: 'test@example.com', 
          password: 'password'
        })

        expect(res.status).toBe(400);
        // expect(res.json).toHaveBeenCalledWith({ errors: ['Invalid email or password'] });
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
              errors:expect.objectContaining({
                  email:expect.any(String),
                  password:expect.any(String),
                  username:expect.any(String),
              })
          })
        );
  });
});
