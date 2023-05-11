import {NextApiRequest, NextApiResponse} from "next";
import apiWrapper from "../../../../../lib/api/apiWrapper";
import {get, post} from "../../../../../lib/common/fetch";
import {constructHeaders} from "../../../../../lib/api/apiHelpers";

export default (req: NextApiRequest, res: NextApiResponse) => apiWrapper(req, res, handler)

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req

    switch (method) {
        case 'GET':
            return handleGetAll(req, res)
        case 'POST':
            return handleCreate(req, res)
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).json({ data: null, error: { message: `Method ${method} Not Allowed` } })
    }
}

const handleGetAll = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const response = await get(`${process.env.MEMFIRE_CLOUD_API_URL}/api/v2/projects/${process.env.BASE_PROJECT_ID}/aliyunfc/list`, {
            headers: constructHeaders(req.headers)
        })
        if (response.code === 0) {
            return res.status(200).json(response.data.list)
        } else {
            return res.status(400).json(response.error)
        }
    } catch (e) {
        return res.status(400).json(e)
    }
}

const handleCreate = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const {env} = req.body
        const payload = {
            ...req.body,
            env: env.reduce((acc: any, cur: {key: string, value: string}) => {
                acc[cur.key] = cur.value
                return acc
            }, {})
        }
        const response = await post(`${process.env.MEMFIRE_CLOUD_API_URL}/api/v2/projects/${process.env.BASE_PROJECT_ID}/aliyunfc/create`, payload, {
            headers: constructHeaders(req.headers)
        })
        if (response.code === 0) {
            return res.status(200).json(response.data)
        } else {
            return res.status(400).json(response.error)
        }
    } catch (e) {
        return res.status(400).json(e)
    }
}
