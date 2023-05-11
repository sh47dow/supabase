import apiWrapper from 'lib/api/apiWrapper'
import {NextApiRequest, NextApiResponse} from "next";
import {serverSupaClient} from "../../../../../../lib/api/supabaseClient";

export default (req: NextApiRequest, res: NextApiResponse) => apiWrapper(req, res, handler)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'PATCH':
      return handlePatch(req, res)
    case 'DELETE':
      return handleDelete(req, res)
    default:
      res.setHeader('Allow', ['PATCH'])
      res.status(405).json({ data: null, error: { message: `Method ${method} Not Allowed` } })
  }
}

const handlePatch = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { bucket } = req.query
    const { public: isPublic } = req.body
    const result = await serverSupaClient.storage.updateBucket(bucket as string, { public: isPublic })
    if (result.error) {
      return res.status(400).json(result.error)
    } else {
      return res.status(200).json(result.data)
    }
  } catch (e) {
    return res.status(400).json(e)
  }
}

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { bucket } = req.query
    const result = await serverSupaClient.storage.deleteBucket(bucket as string)
    if (result.error) {
      return res.status(400).json(result.error)
    } else {
      return res.status(200).json(result.data)
    }
  } catch (e) {
    return res.status(400).json(e)
  }
}
