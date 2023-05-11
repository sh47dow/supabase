import apiWrapper from 'lib/api/apiWrapper'
import {NextApiRequest, NextApiResponse} from "next";
import {serverSupaClient} from "../../../../../../lib/api/supabaseClient";

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
  // empty bucket
  try {
    const { bucket } = req.query
    const result = await serverSupaClient.storage.emptyBucket(bucket as string)
    if (result.error) {
      return res.status(400).json(result.error)
    } else {
      return res.status(200).json(result.data)
    }
  } catch (e) {
    return res.status(400).json(e)
  }
}
