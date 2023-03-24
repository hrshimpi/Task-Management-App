/* eslint-disable no-undef */
const User = require('../../models/Users');
const { signup_post } = require('../../controller/authController');

jest.mock('../../models/Users', () => {
  return {
    create: jest.fn()
  };
});

describe('signup_post', () => {
  const req = {
    body: {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password',
      name: 'Test User',
      age: 25,
    },
    file:{
      path: 'uploads/l1.png'
    }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  const user = {
    _id: '123abc'
  };
  it('creates a new user and returns a 201 status', async () => {
    
    User.create.mockResolvedValue(user);

    await signup_post(req, res);

    expect(User.create).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password',
      name: 'Test User',
      age: 25,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ user: '123abc' });
  });


  it('error ouccred while signing up and return error code 400', async ()=>{
    User.create.mockResolvedValue(null);
    await signup_post(req,res);

    expect(User.create).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password',
      name: 'Test User',
      age: 25
    })

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
          errors:expect.objectContaining({
              email:expect.any(String),
              password:expect.any(String),
              username:expect.any(String),
          })
      })
    );
  })
});

const { signup_get } = require('../../controller/authController')

describe('signup_get', () => {
    it('should render the signup view', () => {
        const req = {};
        const res = {
            render: jest.fn()
        };
        signup_get(req, res);
        expect(res.render).toHaveBeenCalledWith('signup');
    });
});

