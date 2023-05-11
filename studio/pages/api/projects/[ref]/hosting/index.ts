import {NextApiRequest, NextApiResponse} from "next";
import apiWrapper from "../../../../../lib/api/apiWrapper";
import formidable from "formidable";
import {useOss} from "../../../../../lib/api/ossClient";
import {co} from "co";
import promiseRetry from "promise-retry";
import * as fs from "fs";
import {OSS_RETRY_ERRORS} from "../../../constants";
import {IZipEntry} from "adm-zip";
import {COMPRESSED_FILE_SIZE_LIMIT, FILE_UPLOAD_PART_SIZE, SOURCE_FILE_SIZE_LIMIT} from "../../../../../lib/constants";

const gather = require('co-gather')
const AdmZip = require("adm-zip-iconv")

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};

// const unzipPath = `${__dirname}/../uploads/unzipped`
const uploadPath = `${__dirname}/../uploads`
const projectId = process.env.BASE_PROJECT_ID as string

export default (req: NextApiRequest, res: NextApiResponse) => apiWrapper(req, res, handler)

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req

    switch (method) {
        case 'GET':
            return handleGetAll(req, res)
        case 'DELETE':
            return handleDelete(req, res)
        case 'POST':
            return handlePost(req, res)
        default:
            res.setHeader('Allow', ['POST', 'GET', 'DELETE'])
            res.status(405).json({ data: null, error: { message: `Method ${method} Not Allowed` } })
    }
}

const createDirSync = (path: string) => {
    if (fs.existsSync(path)) {
        return;
    }
    fs.mkdirSync(path, { recursive: true });
}

const rollbackLatest = async (req: NextApiRequest) => {
    const {client} = useOss();
    try {
        const getObjectResult: any = await client.getObject(process.env.OSS_HOSTING_SOURCE_BUCKET as string, projectId)
        const historyZipFile = getObjectResult.content
        const {unzippedFiles, error} = unzipFile(historyZipFile)
        if (error) return {error: {message: 'restore history failed: ' + error.message}}
        const response = await client.clearBucket(projectId, req.headers)
        if (!response.error) {
            const res: any = await uploadFiles(unzippedFiles, false, req)
            if (res.error) {
                return {
                    error: {message: 'restore history failed: ' + res.error.message}
                }
            } else {
                return true
            }
        } else {
            return {error: {message: 'restore history failed: ' + response.error.message}}
        }
    } catch (e: any) {
        return {error: {message: 'restore history failed: ' + e.message}}
    }
}

const uploadFiles = (files:  IZipEntry[], isNewBucket: boolean, req: NextApiRequest, originFile?: formidable.File ): Promise<{results: any[] } | {error: any}> => {
    const {client} = useOss()
    client.useBucket(projectId)

    return co(function* () {
        const putFileResults: any[] = yield gather(files.filter(
            file => !file.isDirectory
        ).map(async file => {
            // return promiseRetry((retry, number) => {
            if (file.header.size > FILE_UPLOAD_PART_SIZE) {
                return await client.multipartUpload( file.getData(), file.entryName )
            } else {
                return await client.putOSS( file.getData(), file.entryName)
            }
        }))
        // })
        if (putFileResults.some(result => result.isError)) {
            throw putFileResults.find(result => result.isError).error.message
        } else {
            if (originFile) {
                yield promiseRetry((retry) => {
                    return uploadSourceFile(originFile).catch((err: any) => {
                        if (OSS_RETRY_ERRORS.includes(err.name)) {
                            return retry(err)
                        } else {
                            throw err
                        }
                    })
                }, {retries: 3})
            }
            return {results: putFileResults}
        }
    })
        .catch(async e => {
            if (isNewBucket) {
                await client.clearBucket(projectId, req.headers)
                return {error: e}
            } else {
                if (originFile) {
                    const rollbackResult = await rollbackLatest(req)
                    if (rollbackResult === true) {
                        return {error: {message: 'upload files failed, rollback to latest'}}
                    } else {
                        await client.clearBucket(projectId, req.headers)
                        return rollbackResult
                    }
                } else {
                    return {error: e}
                }
            }
        })
}

const uploadSourceFile = async (file: formidable.File ) => {
    const {client} = useOss()
    if (file.size > 1024 * 1024) {
        return await client.useBucket(process.env.OSS_HOSTING_SOURCE_BUCKET as string).multipartUpload(file.filepath, `${projectId}`)
    }  else {
        return await client.useBucket(process.env.OSS_HOSTING_SOURCE_BUCKET as string).putOSS(file.filepath, `${projectId}`)
    }
}

const unzipFile = (filePath: string | Buffer): { error?: any, unzippedFiles: IZipEntry[] } => {
    // fs.rmSync(unzipPath, {recursive: true, force: true});
    try {
        let zip = new AdmZip(filePath)
        const indexEntry = zip.getEntry('index.html')
        if (!indexEntry) {
            throw Error('根路径下缺少index.html文件')
        } else {
            if (indexEntry.header.made === 63) {
                zip = new AdmZip(filePath, 'GBK')
            }
        }
        const zipEntries: IZipEntry[] = zip.getEntries()
        const largeSingleFile = zipEntries.find(entity => !entity.isDirectory && entity.header.size > COMPRESSED_FILE_SIZE_LIMIT)
        if (largeSingleFile) {
            throw Error('单个文件大小超过限制，解压失败')
        } else {
            return {unzippedFiles: zipEntries}
        }
    } catch (e: any) {
        return {error: e, unzippedFiles: []}
    }
}

const parseFormData = (req: NextApiRequest): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        createDirSync(`${uploadPath}`);
        const form = new formidable.IncomingForm({
            uploadDir: uploadPath,
            multiples: false,
            keepExtensions: true,
            filename: () => projectId as string
        })
        form.once('error', (err) => {
            // res.status(400).json({error: err})
            return reject(err)
        })
        .parse(req, async (err, fields, files) => {
            if (err) {
                return reject(err)
            }
            const originFile: formidable.File = files['file'] as any

            // if (!originFile) throw 'invalid params'
            if (!originFile) {
                return reject('invalid params')
            }

            if (!originFile.mimetype!.includes('zip')) {
                return reject('invalid file type')
            }

            if (originFile.size > SOURCE_FILE_SIZE_LIMIT) {
                return reject('压缩文件大小超过限制')
            }

            const {unzippedFiles, error} = unzipFile(originFile.filepath)
            if (error) {
                // throw error
                return reject(error.message || error)
            }
            const {client} = useOss()
            const isExist = await client.bucketIsExist(projectId)

            if (!isExist) {
                const response = await client.createBucket(projectId, req.headers)
                if (response.error) {
                    // throw response.error
                    return reject(response.error)
                }
            } else {
                const response = await client.clearBucket(projectId, req.headers)
                if (response.error) {
                    // throw response.error
                    return reject(response.error)
                }
            }
            const result: any = await uploadFiles(unzippedFiles, !isExist, req, originFile)
            if (result.results) {
                // res.status(200).json({data: unzippedFiles})
                resolve(result.results)
            } else {
                // throw result ? result.error : 'unknown error'
                return reject(result.error)
            }
        });
    })
}

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const results = await parseFormData(req)
        fs.rmSync(uploadPath, { recursive: true, force: true });
        return res.status(200).json({data: results})
    } catch (e: any) {
        fs.rmSync(uploadPath, { recursive: true, force: true });
        return res.status(400).json({error: e})
    }
}

const handleGetAll = async (req: NextApiRequest, res: NextApiResponse) => {
    const {client} = useOss()
    const isHostingEnabled = await client.bucketIsExist(projectId)
    if (!isHostingEnabled) return res.status(200).json({data: []})
    const prefix = req.query['prefix'].toString() || ''

    const results = await client.getObjectList(projectId, prefix, req.headers)
    if (results.error) {
        return res.status(400).json({error: results.error})
    } else {
        return res.status(200).json(results)
    }

}

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
    const {client} = useOss()
    const response = await client.clearBucket(projectId, req.headers)
    if (response.error) {
        return res.status(400).json({error: response.error})
    } else {
        return res.status(200).json(response)
    }
}
