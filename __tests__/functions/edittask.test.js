/* eslint-disable no-undef */
const Task = require('../../models/Task');
const { getEditTask } = require('../../controller/taskController');

jest.mock('../../models/Task', () => {
    return {
        findById: jest.fn().mockResolvedValue({ _id: '123', title: 'Test Title', desc: 'Test Description' })
    }
});

describe('getEditTask', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {
                id: '123'
            }
        };
        res = {
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should get the task data for the specific id', async () => {
        await getEditTask(req, res);
        expect(Task.findById).toHaveBeenCalledWith('123');
        expect(res.render).toHaveBeenCalledWith('editTask', { taskData: { _id: '123', title: 'Test Title', desc: 'Test Description' } });
    });

    it('should return a 500 error if there is a problem with the request', async () => {
        const error = new Error('Test Error');
        Task.findById.mockRejectedValue(error);
        await getEditTask(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Test Error' });
    });
});
