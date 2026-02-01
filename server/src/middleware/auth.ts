import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
    user?: {
        userId: string
        role: string
    }
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
        res.status(401).send({ error: 'Authentication required' })
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string, role: string }
        req.user = decoded
        next()
    } catch (err) {
        res.status(401).send({ error: 'Invalid token' })
    }
}
