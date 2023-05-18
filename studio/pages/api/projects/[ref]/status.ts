import { NextApiRequest, NextApiResponse } from 'next'
import apiWrapper from 'lib/api/apiWrapper'
import {ProjectBase} from "../../../../types";
import {get} from "../../../../lib/common/fetch";
import {IS_OFFLINE, statusFromMfToSupa} from "../../../../lib/constants";


export default (req: NextApiRequest, res: NextApiResponse) => apiWrapper(req, res, handler, { withAuth: true })

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
    if (IS_OFFLINE) {
        return res.status(200).json({
            status: 'ACTIVE_HEALTHY'
        })
    }

    try {
        let result = await get<{data?: ProjectBase, error?: {code: number, message: string}}>(
            `${process.env.MEMFIRE_CLOUD_API_URL}/api/v2/projects/${process.env.BASE_PROJECT_ID}`,
            {
                headers: {
                    Authorization: req.headers.authorization,
                }
            }
        )
        if (result.error) {
            return res.status(400).json(result.error)
        } else {
            return res.status(200).json({
                status: statusFromMfToSupa(result.data!.status),
            })
        }
    } catch (e) {
        return res.status(400).json(e)
    }
}
