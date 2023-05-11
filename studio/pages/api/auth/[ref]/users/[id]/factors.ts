import { NextApiRequest, NextApiResponse } from 'next'
import apiWrapper from 'lib/api/apiWrapper'
import {delete_} from "../../../../../../lib/common/fetch";

export default (req: NextApiRequest, res: NextApiResponse) => apiWrapper(req, res, handler)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'DELETE':
      return handleDelete(req, res)
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).json({ data: null, error: { message: `Method ${method} Not Allowed` } })
  }
}

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  // Platform specific endpoint
  try {
    // const { ref, id } = req.query
    // const result = await delete_(process.env.CLOUDFLARE_API_URL + `/user/${id}/mfa/${ref}`, {
    //   headers: {
    //     authorization: req.headers.authorization
    //   }
    // })
    const result = {}
    // if (result.error) {
    //   return res.status(400).json(result.error)
    // } else {
      return res.status(200).json(result)
    // }
  } catch (e) {
    return res.status(400).json(e)
  }
}
