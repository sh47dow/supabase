import { NextApiRequest, NextApiResponse } from 'next'

import apiWrapper from 'lib/api/apiWrapper'
import { DEFAULT_PROJECT, PROJECT_REST_URL } from 'pages/api/constants'
import {get} from "../../../../lib/common/fetch";
import {Project} from "../../../../types";
import {IS_OFFLINE, statusFromMfToSupa} from "../../../../lib/constants";

export default (req: NextApiRequest, res: NextApiResponse) => apiWrapper(req, res, handler, {withAuth: true})

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
  // Platform specific endpoint
  if (IS_OFFLINE) {
    const response = {
      id: 1,
      ref: 'default',
      name: process.env.DEFAULT_PROJECT_NAME || 'Default Project',
      organization_id: 1,
      cloud_provider: 'localhost',
      status: 'ACTIVE_HEALTHY',
      region: 'local',
      connectionString: createDbConnectionString({
        db_user_supabase: 'postgres',
        db_host: 'localhost',
        db_pass_supabase: process.env.POSTGRES_PASSWORD as string,
        db_port: 5432,
        db_name: 'postgres',
        db_ssl: false,
      }),
      kpsVersion: 'kps-v1.0.0',
      restUrl: PROJECT_REST_URL,
    }

    return res.status(200).json(response)
  }
  try {
    let result = await get<{data?: Project, error?: {code: number, message: string}}>(
      `${process.env.MEMFIRE_CLOUD_API_URL}/api/v2/projects/${process.env.BASE_PROJECT_ID}`, {
        headers: {
          Authorization: req.headers.authorization
        }
      })
    if (result.error) {
      return res.status(400).json(result.error)
    } else {
      return res.status(200).json({
        ...result.data,
        status: statusFromMfToSupa(result.data!.status),
        restUrl: `https://${result.data!.restUrl}`,
        connectionString: createDbConnectionString({
          db_user_supabase: process.env.POSTGRES_USER || '',
          db_host: process.env.POSTGRES_HOST || '',
          db_pass_supabase: process.env.POSTGRES_PASSWORD || '',
          db_port: process.env.POSTGRES_PORT || 5432,
          db_name: process.env.POSTGRES_DB || '',
          db_ssl: false,
        })
      })
    }
  } catch (e) {
    return res.status(400).json(e)
  }
}

/**
 * Creates a Postgres connection string using the Supabase master login.
 * Expects the passwords to be encrypted (straight from the DB)
 */
const createDbConnectionString = ({
                                    db_user_supabase,
                                    db_pass_supabase,
                                    db_host,
                                    db_port,
                                    db_name,
                                    db_ssl,
                                  }: {
  db_user_supabase: string
  db_host: string
  db_pass_supabase: string
  db_port: number | string
  db_name: string
  db_ssl: boolean
}) => {
  return `postgres://${db_user_supabase}:${db_pass_supabase}@${db_host}:${db_port}/${db_name}?sslmode=${
    db_ssl ? 'require' : 'disable'
  }`
}
