import {NextApiRequest, NextApiResponse} from "next";
import apiWrapper from "../../../../../../lib/api/apiWrapper";
import {useOss} from "../../../../../../lib/api/ossClient";

const projectId = process.env.BASE_PROJECT_ID as string

export default (req: NextApiRequest, res: NextApiResponse) => apiWrapper(req, res, handler, {withAuth: true})

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    const {client: ossClient} = useOss()
    const hostingEnabled = await ossClient.bucketIsExist(projectId)
    if (hostingEnabled) {
        // res.status(200).json({data: {default: `https://${projectId}.${process.env.OSS_DEFAULT_DOMAIN}`, custom: ''}})
        const response = await ossClient.getDomain(projectId, req.headers)
        if (response.error) {
            res.status(response.error.code || 400).json({error: response.error})
        } else {
            res.status(200).json(response.data)
        }
    } else {
        res.status(200).json({data: {}})
    }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
    const {client: ossClient} = useOss()
    const response = await ossClient.deleteDomain(projectId, req.body.domain, req.headers)
    if (response.error) {
        return res.status(400).json({error: response.error})
    } else {
        return res.status(200).json(response.data)
    }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    const {client: ossClient} = useOss()
    const response = await ossClient.bindDomain(projectId, req.body.domain, req.headers)
    if (response.error) {
        return res.status(400).json({error: response.error})
    } else {
        return res.status(200).json(response.data)
    }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req

    switch (method) {
        case 'GET':
            return handleGet(req, res)
        case 'DELETE':
            return handleDelete(req, res)
        case 'POST':
            return handlePost(req, res)
        default:
            res.setHeader('Allow', ['POST', 'GET', 'DELETE'])
            res.status(405).json({ data: null, error: { message: `Method ${method} Not Allowed` } })
    }
}
