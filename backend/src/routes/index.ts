import { Router, type Router as ExpressRouter } from 'express';
import { authRouter } from '../modules/auth/auth.routes.js';
import { tournamentRouter } from '../modules/tournament/tournament.routes.js';
import { userRouter } from '../modules/user/user.routes.js';
import { registrationRouter } from '../modules/registration/registration.routes.js';
import { matchResultRouter } from '../modules/match-result/matchResult.routes.js';
import { advancementRouter } from '../modules/advancement/advancement.routes.js';
import { paymentRouter } from '../modules/payment/payment.routes.js';

export const apiRouter: ExpressRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/tournaments', tournamentRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/registrations', registrationRouter);
apiRouter.use('/match-results', matchResultRouter);
apiRouter.use('/advancements', advancementRouter);
apiRouter.use('/payments', paymentRouter);

