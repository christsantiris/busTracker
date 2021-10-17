export default function (app, express, db) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const response = await db.services.busesservice.helloBuses();
      res.json(response);
    } catch (err) {
      console.error;
    }
  });
  return router;
}
