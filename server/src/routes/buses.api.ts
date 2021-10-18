import { Request, Response, Application } from 'express';

export default function (app: Application, express: any, db: any) {
  const router = express.Router();

  router.get('/', async (req: Request, res: Response) => {
    try {
      const response = await db.services.busesservice.helloBuses();
      res.json(response);
    } catch (err) {
      console.error;
    }
  });
  return router;
}
