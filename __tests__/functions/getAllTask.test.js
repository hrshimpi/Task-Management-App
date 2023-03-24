
/* eslint-disable no-undef */

const Task = require('../../models/Task');
const { getAllTask } = require('../../controller/taskController');

jest.mock('../../models/Task', () => {
    return {
        find: jest.fn().mockResolvedValue([{ _id: '123', title: 'Test Title', owner: 'userId' }])
    }
});

describe('getAllTask', () => {
    let req, res;

    beforeEach(() => {
        req = {
            userId: 'userId',
        };
        res = {
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should get all tasks for the user', async () => {
        await getAllTask(req, res);
        expect(Task.find).toHaveBeenCalledWith({"owner":"userId"});
        expect(res.render).toHaveBeenCalledWith('tasks.ejs', { data: [{ _id: '123', title: 'Test Title', owner: 'userId' }] }, 0);
    });

    it('should return a 500 error if there is a problem with the request', async () => {
        const error = new Error('Test Error');
        Task.find.mockRejectedValue(error);
        await getAllTask(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Test Error' });
    });
});
