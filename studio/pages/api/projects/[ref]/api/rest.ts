import { NextApiRequest, NextApiResponse } from 'next'
import { PROJECT_ENDPOINT, PROJECT_REST_URL } from 'pages/api/constants'

import apiWrapper from 'lib/api/apiWrapper'
import {get} from "../../../../../lib/common/fetch";
import {OpenAPIV2} from "openapi-types";

export default (req: NextApiRequest, res: NextApiResponse) => apiWrapper(req, res, handler)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'HEAD':
      return res.status(200).json({})
    case 'GET':
      return handleGetAll(req, res)
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).json({ data: null, error: { message: `Method ${method} Not Allowed` } })
  }
}

const handleGetAll = async (req: NextApiRequest, res: NextApiResponse) => {
  const response = await get<OpenAPIV2.Document>(`${PROJECT_REST_URL}`, {
    headers: { apiKey: process.env.SUPABASE_ANON_KEY, Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}` },
    credentials: 'omit',
  })
  if (response.error) {
    return res.status(400).json({ error: response.error })
  } else {
    return res.status(200).json(response)
  }
}
