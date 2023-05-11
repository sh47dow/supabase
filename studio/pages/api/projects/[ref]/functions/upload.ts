import {NextApiRequest, NextApiResponse} from "next";
import {FUNCTION_URL_EXPIRY} from "../../../../../lib/constants";
import apiWrapper from "../../../../../lib/api/apiWrapper";
import OSS from "ali-oss";
import formidable from "formidable";
import * as fs from "fs";

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

export default (req: NextApiRequest, res: NextApiResponse) => apiWrapper(req, res, handler)

const ossStore = new OSS({
  accessKeyId: process.env.OSS_FUNCTION_ACCESS_KEY_ID as string,
  accessKeySecret: process.env.OSS_FUNCTION_KEY_SECRET as string,
  bucket: process.env.OSS_FUNCTION_BUCKET as string,
  endpoint: process.env.OSS_FUNCTION_ENDPOINT as string,
})

// 给filename添加时间戳
const parseFilename = (filename: string) => {
  const [...item] = filename.split('.')
  const ext = item.pop()
  return `${item.join('.')}_${Date.now()}.${ext}`
}

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

const parseFormData = (req: NextApiRequest): Promise<{fields: formidable.Fields, files: formidable.Files}> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({ multiples: false});
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      } else {
        return resolve({ fields, files });
      }
    });
  });
}

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {ref} = req.query
    const {fields, files} = await parseFormData(req)
    const file = files['file'] as formidable.File;
    const stream = fs.createReadStream(file.filepath);
    // @ts-ignore
    const {name, res: response} = await ossStore.putStream(`${parseFilename(fields.name)}`, stream);
    if (response.status !== 200) {
      return res.status(400).json({error: {message: '上传文件失败 '}})
    }
    const url = ossStore.signatureUrl(name, { expires: FUNCTION_URL_EXPIRY } as any)
    return res.status(response.status).json({data: {url: url.replace('http://', 'https://'), name}})
  } catch (e) {
    return res.status(400).json(e)
  }
}
