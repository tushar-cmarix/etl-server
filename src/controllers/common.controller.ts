import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import pick from '../utils/pick';
import { platformService } from '../services';

const fetchPlatforms = catchAsync(async (req: Request, res: Response) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await platformService.queryPlatform(filter, options);
    res.send(result);
});
export default { fetchPlatforms };
