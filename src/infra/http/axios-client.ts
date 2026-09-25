import { HttpGetClient } from '@/infra/http'
import axios from 'axios'

export class AxiosHttpClient implements HttpGetClient {
  async get ({ url, params }: HttpGetClient.params): Promise<any> {
    const { data } = await axios.get(url, { params })
    return data
  }
}