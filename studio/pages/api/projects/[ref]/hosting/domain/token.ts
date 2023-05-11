import {NextApiRequest, NextApiResponse} from "next";
import apiWrapper from "../../../../../../lib/api/apiWrapper";
import {useOss} from "../../../../../../lib/api/ossClient";

const projectId = process.env.BASE_PROJECT_ID as string

export default (req: NextApiRequest, res: NextApiResponse) => apiWrapper(req, res, handler, {withAuth: true})

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


async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    const {client: ossClient} = useOss()
    const response = await ossClient.generateToken(projectId, req.body.domain, req.headers)
    if (response.error) {
        return res.status(400).json({error: response.error})
    } else {
        return res.status(200).json(response.data)
    }
}
