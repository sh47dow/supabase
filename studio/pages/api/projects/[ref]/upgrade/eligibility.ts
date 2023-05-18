import { NextApiRequest, NextApiResponse } from 'next'
import apiWrapper from 'lib/api/apiWrapper'

export default (req: NextApiRequest, res: NextApiResponse) => apiWrapper(req, res, handler)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      return handleGet(req, res)
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).json({ data: null, error: { message: `Method ${method} Not Allowed` } })
  }
}

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const response = {
    "eligible": false,
    "current_app_version": "supabase-postgres-15.1.0.75",
    "latest_app_version": "supabase-postgres-15.1.0.75",
    "target_upgrade_versions": [],
    "requires_manual_intervention": null,
    "potential_breaking_changes": []
  }
  return res.status(200).json(response)
}
