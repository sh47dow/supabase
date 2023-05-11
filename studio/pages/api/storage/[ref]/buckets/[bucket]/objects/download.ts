import { NextApiRequest, NextApiResponse } from 'next'

import apiWrapper from 'lib/api/apiWrapper'
import {serverSupaClient} from "../../../../../../../lib/api/supabaseClient";

export default (req: NextApiRequest, res: NextApiResponse) => apiWrapper(req, res, handler)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'POST':
      return handlePost(req, res)
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).json({ data: null, error: { message: `Method ${method} Not Allowed` } })
  }
}

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  // Platform specific endpoint
  try {
    const {path} = req.body
    const result = await serverSupaClient.storage.from(req.query.bucket as string).download(path)
    if (result.error) {
      return res.status(400).json(result.error)
    } else {
      const arrayBuffer = await result.data.arrayBuffer()
      return res.status(200).send(Buffer.from(arrayBuffer))
    }
  } catch (e) {
    return res.status(400).json(e)
  }
}
