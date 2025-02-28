import express, { Router } from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import accountRoute from './accounts.route';
import commonRoute from './common.route';

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
    {
        path: '/accounts',
        route: accountRoute,
    },
    {
        path: '/common',
        route: commonRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
