// @CreateTime: 2023/2/6
// @Author: sh47dow
// @Contact: sh47dow@gmail.com
// @Last Modified By: ruyingzheng
// @Last Modified Time: 14:49
// @Description: 静态托管服务

import {IRootStore} from "../RootStore";
import {makeAutoObservable} from "mobx";
import {API_URL} from "../../lib/constants";
import {delete_, get, post} from "../../lib/common/fetch";


export interface IProjectStaticHostingStore {
    isLoading: boolean
    isLoaded: boolean
    isError: boolean
    state: string
    data: { name: string, createdTime: string, size: number, type: 'file' | 'folder' }[]
    domain: string
    customDomain: string
    defaultDomain: string
    baseUrl: string
    projectRef: string

    /**
     * 查询已上传的文件
     */
    fetchByPath: (path?: string) => any
    /**
     * 清空已上传的文件
     */
    clear: () => any
    /**
     * 上传文件
     */
    upload: (file: File) => any

    queryDomain: () => any

    setProjectRef: (ref: string) => void

    getToken: (domain: string) => any

    bindDomain: (domain: string) => any

    unbindDomain: () => any
}

export class ProjectStaticHostingStore implements IProjectStaticHostingStore {
    baseUrl = ''
    projectRef = ''
    data = []
    defaultDomain = ''
    customDomain = ''
    STATES = {
        INITIAL: 'initial',
        LOADING: 'loading',
        ERROR: 'error',
        LOADED: 'loaded',
    }

    state = this.STATES.INITIAL
    rootStore: IRootStore

    constructor(rootStore: IRootStore, options: { projectRef: string }) {
        this.rootStore = rootStore
        this.projectRef = options.projectRef
        makeAutoObservable(this)
    }

    get isLoading() {
        return this.state === this.STATES.INITIAL || this.state === this.STATES.LOADING
    }

    get isLoaded() {
        return this.state === this.STATES.LOADED
    }

    get isError() {
        return this.state === this.STATES.ERROR
    }

    get domain() {
        if (this.customDomain)  {
            return this.customDomain
        } else if (this.defaultDomain) {
            return this.defaultDomain
        } else {
            return ''
        }
    }

    async queryDomain() {
        const response = await get(`${this.baseUrl}/domain`)
        if (!response.error) {
            this.defaultDomain = response.default
            this.customDomain = response.custom
        }
    }

    async clear(): Promise<any> {
        // this.state = this.STATES.LOADING
        try {
            const headers = {
                'Content-Type': 'application/json',
            }
            const deleted = await delete_(this.baseUrl, {}, {headers})
            if (deleted.error) throw deleted.error
            this.data = []
            // this.state = this.STATES.LOADED
            return this.data
        } catch (error: any) {
            // this.state = this.STATES.ERROR
            this.rootStore.ui.setNotification({category: 'error', message: error.message})
            return {error}
        }
    }

    async fetchByPath(path = '') {
        this.state = this.STATES.LOADING
        try {
            const headers = {
                'Content-Type': 'application/json',
            }
            const response = await get(`${this.baseUrl}?prefix=${path}`, {headers})
            if (response.error) {
                throw response.error
            } else {
                this.data = response.data || []
                this.state = this.STATES.LOADED
            }
        } catch (error: any) {
            this.data = [];
            this.state = this.STATES.ERROR
            return this.rootStore.ui.setNotification({category: 'error', message: error.message || 'unknown error'})
        }
    }

    async upload(file: File) {
        // this.state = this.STATES.LOADING
        try {
            if (!file.type.includes('zip')) {
                throw Error('只支持上传zip文件')
            }
            const headers = {
                'Content-Type': 'multiple/form-data',
                'Accept': '*/*'
            }
            const formData = new FormData()
            formData.append('file', file)
            debugger
            const response = await post(`${this.baseUrl}`, formData, {headers})
            if (response.error) {
                // this.rootStore.ui.setNotification({category: 'error', message: response.error.message})
                throw response.error
            } else {
                // this.data = response.data
                // this.state = this.STATES.LOADED
                return response
            }
        } catch (error: any) {
            // this.state = this.STATES.ERROR
            this.rootStore.ui.setNotification({category: 'error', message: error.message || error.msg || 'unknown error'})
            return {error}
        }
    }

    setProjectRef(ref?: string) {
        if (ref) {
            this.projectRef = ref
            this.baseUrl = `${API_URL}/projects/${ref}/hosting`
        }
    }

    async getToken(domain: string) {
        try {
            const response = await post(`${this.baseUrl}/domain/token`, {domain})
            if (response.error) {
                throw response.error
            } else {
                return response
            }
        } catch (e: any) {
            this.rootStore.ui.setNotification({category: 'error', message: e.message || 'unknown error'})
            return {error: e}
        }

    }

    async bindDomain(domain: string) {
        try {
            const response = await post(`${this.baseUrl}/domain`, {domain})
            if (response.error) {
                throw response.error
            } else {
                this.customDomain = response.custom
                this.defaultDomain = response.default
                return response
            }
        } catch (e: any) {
            this.rootStore.ui.setNotification({category: 'error', message: e.message || 'unknown error'})
            return {error: e}
        }
    }

    async unbindDomain() {
        try {
            if (!this.customDomain) {
                throw Error('没有配置自定义域名')
            }
            const response = await delete_(`${this.baseUrl}/domain`, {domain: this.customDomain})
            if (response.error) {
                throw response.error
            } else {
                this.customDomain = response.custom
                this.defaultDomain = response.default
                return response
            }
        } catch (e: any) {
            this.rootStore.ui.setNotification({category: 'error', message: e.message || 'unknown error'})
            return {error: e}
        }
    }

}
