import { HttpResponse } from '@/application/helpers';

export interface Middleware {
  handle: (httpRequest: any) => HttpResponse
}