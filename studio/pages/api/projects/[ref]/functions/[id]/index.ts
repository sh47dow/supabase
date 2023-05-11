import {NextApiRequest, NextApiResponse} from "next";
import apiWrapper from "../../../../../../lib/api/apiWrapper";
import {get, post, delete_} from "../../../../../../lib/common/fetch";
import OSS from "ali-oss";
import {FUNCTION_URL_EXPIRY} from "../../../../../../lib/constants";
import {constructHeaders} from "../../../../../../lib/api/apiHelpers";

export default (req: NextApiRequest, res: NextApiResponse) => apiWrapper(req, res, handler, {withAuth: true})

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      return handleGet(req, res)
    case 'POST':
      return handleUpdate(req, res)
    case 'DELETE':
      return handleDelete(req, res)
    default:
      res.setHeader('Allow', ['GET', 'POST', "DELETE"])
      res.status(405).json({ data: null, error: { message: `Method ${method} Not Allowed` } })
  }
}

const ossStore = new OSS({
  accessKeyId: process.env.OSS_FUNCTION_ACCESS_KEY_ID as string,
  accessKeySecret: process.env.OSS_FUNCTION_KEY_SECRET as string,
  bucket: process.env.OSS_FUNCTION_BUCKET as string,
  endpoint: process.env.OSS_FUNCTION_ENDPOINT as string,
})

const getZipFileUrl = (zipFile: string) => {
  // 根据文件名获取阿里云OSS的文件下载地址
  const url = ossStore.signatureUrl(zipFile, {
    expires: FUNCTION_URL_EXPIRY,
  } as any)
  // 将url中的http替换为https
  return url.replace('http://', 'https://')
}

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {id} = req.query
    const response = await get(`${process.env.MEMFIRE_CLOUD_API_URL}/api/v2/projects/${process.env.BASE_PROJECT_ID}/aliyunfc/${id}`, {
      headers: constructHeaders(req.headers)
    }).then(res => res.data.zipFile ? {...res, data: {...res.data, zipFileUrl: getZipFileUrl(res.data.zipFile)}} : res)
    if (response.code === 0) {
      return res.status(200).json(response.data)
    } else {
      return res.status(400).json(response.error)
    }
  } catch (e) {
    return res.status(400).json(e)
  }
}

const handleUpdate = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {id} = req.query
    const response = await post(`${process.env.MEMFIRE_CLOUD_API_URL}/api/v2/projects/${process.env.BASE_PROJECT_ID}/aliyunfc/${id}`, req.body, {
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

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {id} = req.query
    const response = await delete_(`${process.env.MEMFIRE_CLOUD_API_URL}/api/v2/projects/${process.env.BASE_PROJECT_ID}/aliyunfc/${id}`,{}, {
      headers: constructHeaders(req.headers)
    })
    if (response.code === 0) {
      return res.status(200).json({})
    } else {
      return res.status(400).json(response.error)
    }
  } catch (e) {
    return res.status(400).json(e)
  }
}
