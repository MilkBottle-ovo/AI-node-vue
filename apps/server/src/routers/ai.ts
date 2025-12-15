import {Router}from'express';
import aiController from '../controllers/aiController.js';

const router:Router = Router();
router.post('/run', aiController.runAI);
router.get('/', (req, res) => {
  res.send('AI OK');
});
export default router;