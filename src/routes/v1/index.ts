import express, { Router } from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';

const router: Router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/users',
        route: userRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
