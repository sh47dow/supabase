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
        status: '9_completed_upgrade',
        initiated_at: '2021-08-31T09:00:00.000Z',
        target_version: 'v2.3.30',
    }
    return res.status(200).json(response)
}
