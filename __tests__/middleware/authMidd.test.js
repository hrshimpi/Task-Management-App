/* eslint-disable no-undef */
// const request = require('supertest');
// const app = require('../../index');
const requireAuth = require('../../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const User = require('../../models/Users');
//for require auth
describe('require auth middleware',()=>{

    it('should redirect to login if token is invalid', () => {
        const req = { session: { jwt: 'invalid_token' } };
        const res = { redirect: jest.fn() };
        // jwt.verify = jest.fn(() => { res.redirect });
        requireAuth.requireAuth(req, res);
        expect(res.redirect).toHaveBeenCalledWith('/login');
    });
    
    it('should call next if token is valid', () => {
        const req = { session: { jwt: 'valid_token' } };
        const res = { redirect: jest.fn() };
        const next = jest.fn();
        jwt.verify = jest.fn((token, secret, callback) => { callback(null, {}) });
        requireAuth.requireAuth(req, res, next);
        expect(next).toHaveBeenCalled();
    });
})


//for checkuser
describe(' check user middleware should return user id in req.userID',()=>{

    it('should should set re.locals.user to null of no token is present', async ()=>{
    const req = { session: { jwt: 'invalid_token' } };
    const res = { locals: { user:null } };
    const next = jest.fn();
    jwt.verify = jest.fn(() => { next() });
    await requireAuth.checkUser(req, res, next);
    expect(res.locals.user).toBe(null);
    expect(next).toHaveBeenCalled();
    })



    it('should set res.locals.user and req.userId with user data and call next if token is valid', async () => {
        const req = { session: { jwt: 'valid_token' } };
        const res = { locals: {} };
        const next = jest.fn();
        const user = { _id: '123' };
        jwt.verify = jest.fn((token, secret, callback) => { callback(null, { id: user._id }) });
        User.findById = jest.fn(() => Promise.resolve(user));
        await requireAuth.checkUser(req, res, next);
        expect(res.locals.user).toEqual(user);
        expect(req.userId).toEqual(user._id);
        expect(next).toHaveBeenCalled();
    });



    it('should handle error if User.findById throws an error', async () => {
        const req = { session: { jwt: 'valid_token' }, userId:null };
        const res = { locals: { user:null } };
        const next = jest.fn();
        const user = {};
        User.findById = jest.fn(() => { 
            // res.locals.user; next(); 
            Promise.resolve(user);
        });
        jwt.verify = jest.fn((  ) => { });
        await requireAuth.checkUser(req, res, next);
        expect(res.locals.user).toBe(null);
        expect(req.userId).toBe(null);
        // expect(next).toHaveBeenCalled();
    });
})
