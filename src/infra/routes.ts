import { Router, Request, Response } from 'express';

const router = Router();


// Rota de teste (Health Check)
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    message: 'Router is working'
  });
});

export { router };