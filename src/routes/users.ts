import express from 'express';
import { Request, Response, Router } from 'express';

const router: Router = express.Router();
router.get('/', (req: Request, res: Response) => {
  res.render('index', { title: 'Express' });
});

router.get('/pagos', (req: Request, res: Response) => {
  res.render('pagos', { title: 'Express' });
});


export default router;
