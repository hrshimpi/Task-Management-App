/* eslint-disable no-undef */

const Task = require('../../models/Task');
const { deleteTask } = require('../../controller/taskController');

jest.mock('../../models/Task', () => {
    return {
        findById: jest.fn().mockResolvedValue({ _id: '123', title: 'Test Title', desc: 'Test Description', remove: jest.fn().mockResolvedValue() }),
    }
});

describe('deleteTask', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {
                id: '123'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            redirect: jest.fn(),
            json: jest.fn()
        };
    });
    
    afterEach(() => {
        jest.resetAllMocks();
      });
    
      afterAll(() => {
        jest.restoreAllMocks();
      });

    it('should delete the task by id', async () => {
        await deleteTask(req, res);
        expect(Task.findById).toHaveBeenCalledWith('123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.redirect).toHaveBeenCalledWith("/tasks");
    });

    it('should return a 400 error if the task with specific id is not found', async () => {
        Task.findById.mockResolvedValue(null);
        await deleteTask(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "cannot find user"});
    });

    it('should return a 500 error if there is a problem with the request', async () => {
        const error = new Error('Test Error');
        Task.findById.mockRejectedValue(error);
        await deleteTask(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Test Error' });
    });
});
