import { NextApiRequest, NextApiResponse } from 'next'
import apiWrapper from 'lib/api/apiWrapper'
import {post} from "../../../../lib/common/fetch";
import {ProjectBase} from "../../../../types";

export default (req: NextApiRequest, res: NextApiResponse) => apiWrapper(req, res, handler)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'POST':
      return handlePost(req, res)
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).json({ data: null, error: { message: `Method ${method} Not Allowed` } })
  }
}

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const accessToken = JSON.parse(req.cookies['_token']).token
    let result = await post<{error?: {code: number, message: string}}>(
      `${process.env.MEMFIRE_CLOUD_API_URL}/api/v2/project/activate/${process.env.BASE_PROJECT_ID}`,
      {},{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }
    )
    if (result.error) {
      return res.status(400).json(result.error)
    } else {
      return res.status(200).json(result)
    }
  } catch (e) {
    return res.status(400).json(e)
  }
}
