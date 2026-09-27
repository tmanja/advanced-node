import { Controller } from '@/application/controllers'
import { RequestHandler} from 'express'

type Adapter = (controller: Controller) => RequestHandler

export const adaptExpressRoute: Adapter = controller => async (req, res) => {
  const { statusCode, data } = await controller.handle({...req.body})
  const error = data instanceof Error ? data : undefined
  const response = statusCode === 200 ? data : { error: error!.message }
  res.status(statusCode).json(response)
}