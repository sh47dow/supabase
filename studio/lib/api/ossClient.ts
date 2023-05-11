// @CreateTime: 2023/2/21
// @Author: sh47dow
// @Contact: sh47dow@gmail.com
// @Last Modified By: ruyingzheng
// @Last Modified Time: 11:04
// @Description: 阿里云OSS相关接口服务
import OSS from 'ali-oss'
import {get, post} from "../common/fetch";
import {constructHeaders} from "./apiHelpers";

let client: AliOss

export const useOss = function () {
   if (client) {
       return {client}
   } else {
       client = new AliOss()
       return {client}
   }
}

class AliOss {
    store: OSS
    constructor() {
        this.store = new OSS({
            accessKeyId: process.env.OSS_ACCESS_KEY_ID as string,
            accessKeySecret: process.env.OSS_KEY_SECRET as string,
            endpoint: process.env.OSS_ENDPOINT as string,
            timeout: process.env.OSS_TIME_OUT as string,
            // @ts-ignore
            retryMax: 3
        })
    }

    async bucketIsExist(bucketName?: string): Promise<boolean> {
        try {
            // 指定存储空间名称。
            const result = await this.store.getBucketInfo(bucketName || process.env.BASE_PROJECT_ID as string)
            if (result.bucket) {
                return true
            } else {
                throw 'unknown error'
            }
        } catch (error: any) {
            // 判断指定的存储空间是否存在。
            if (error.name === 'NoSuchBucketError') {
                return false
            } else {
                throw error
            }
        }
    }

    getObject(bucket: string, name: string) {
        const response = this.useBucket(bucket).store.get(name)
        return response
    }


    putOSS (src: string | Buffer,dist: string) {
        return this.store.put(dist, src);
    }

    multipartUpload (file: string | Buffer, name: string) {
        return this.store.multipartUpload(name, file, {});
    }

    useBucket(bucket: string) {
        this.store.useBucket(bucket)
        return this
    }

    createBucket(projectId: string, headers: {[key: string]: any}) {
        return get(`${process.env.MEMFIRE_CLOUD_API_URL}/api/v2/projects/${projectId}/hosting/create`, {
                    headers: {
                        ...constructHeaders(headers),
                        'Content-Type': 'application/json'
                    }
                })
    }

    clearBucket(projectId: string, headers: {[key: string]: any}) {
        return get(`${process.env.MEMFIRE_CLOUD_API_URL}/api/v2/projects/${projectId}/hosting/clear`, {
                    headers: {
                        ...constructHeaders(headers),
                        'Content-Type': 'application/json'
                    }
                })
    }

    // deleteBucket(projectId: string, headers: {[key: string]: any}) {
    //     return get(`${process.env.NODE_ENV === 'development  ? 'http://192.168.110.6:8765p :rocess.env.MEMFIRE_CLOUD_API_URL}/api/v2/projects/${projectId}/hosting/delete`, {
    //                 headers: {
    //                     ...constructHeaders(headers),
    //                     'Content-Type': 'application/json'
    //                 }
    //             })
    // }


    getObjectList(projectId: string, prefix: string, headers: {[key: string]: any}) {
        return get(`${process.env.MEMFIRE_CLOUD_API_URL}/api/v2/projects/${projectId}/hosting?prefix=${prefix}`, {
            headers: {
                ...constructHeaders(headers),
                'Content-Type': 'application/json'
            }
        }).then(results => {
            if (results.data && results.data.length > 0) {
                results.data.map((item: {name: string, size: number, createdTime: string, type: string}) => {
                    item.type = item.name.endsWith('/') ? 'folder' : 'file'
                    if (item.type === 'folder') {
                        item.name = item.name.split('/')[0]
                    }
                    return item
                })
            }
            return results
        })
    }

    getDomain(bucket: string, headers: { [prop: string]: any }) {
        return get(`${process.env.MEMFIRE_CLOUD_API_URL}/api/v2/projects/${bucket}/hosting/domain`, {
            headers: {
                ...constructHeaders(headers)
            }
        })
    }

    bindDomain(bucket: string, domain: string, headers: { [prop: string]: any; }) {
        return post(`${process.env.MEMFIRE_CLOUD_API_URL}/api/v2/projects/${bucket}/hosting/domain`, {domain}, {
            headers: {
                ...constructHeaders(headers)
            }
        })
    }

    generateToken(bucket: string, domain: string, headers: { [prop: string]: any }) {
        return post(`${process.env.MEMFIRE_CLOUD_API_URL}/api/v2/projects/${bucket}/hosting/domain/token`, {domain}, {
            headers: {
                ...constructHeaders(headers)
            }
        })
    }

    deleteDomain(bucket: string, domain: string, headers: { [prop: string]: any }) {
        return get(`${process.env.MEMFIRE_CLOUD_API_URL}/api/v2/projects/${bucket}/hosting/domain/delete?domain=${domain}`, {
            headers: {
                ...constructHeaders(headers)
            }
        })
    }

}
