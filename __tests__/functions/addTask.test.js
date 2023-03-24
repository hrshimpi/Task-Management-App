/* eslint-disable no-undef */
const Task = require('../../models/Task');
const { addTask }  = require('../../controller/taskController');

jest.mock('../../models/Task');
// jest.mock('../../models/Task', () => {
//     return jest.fn().mockImplementation(() => {
//         return {
//             create: jest.fn().mockResolvedValue({
//                 owner: '123',
//                 title: 'Test Title',
//                 desc: 'Test Description'
//              })
//         }
//     });
// });

describe('for adding task using addTask function', () => {
    let req, res;

    beforeEach(() => {
        req = {
            userId: '123',
            body: {
                title: 'Test Title',
                desc: 'Test Description'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            redirect: jest.fn(),
            json: jest.fn()
        };
    });

    it('should add a task to the database', async () => {
        Task.create.mockImplementationOnce(()=>({
            owner: '123',
            title: 'Test Title',
            desc: 'Test Description'
        }))
        await addTask(req, res);
        // expect(Task.create).toHaveBeenCalledWith({
        //     owner: '123',
        //     title: 'Test Title',
        //     desc: 'Test Description'
        // });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.redirect).toHaveBeenCalledWith('/tasks');
    });

    it('should return a 400 error if there is a problem with the request', async () => {
        const error = new Error('Test Error');
        Task.create.mockRejectedValue(error);
        await addTask(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Test Error' });
    });
});
