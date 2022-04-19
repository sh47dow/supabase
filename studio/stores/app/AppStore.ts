import { cloneDeep } from 'lodash'
import { values } from 'mobx'
import { Organization, Project } from 'types'

import { API_URL } from 'lib/constants'
import { IRootStore } from '../RootStore'
import DatabaseStore, { IDatabaseStore } from './DatabaseStore'
import OrganizationStore from './OrganizationStore'
import ProjectStore, { IProjectStore } from './ProjectStore'

export interface IAppStore {
  projects: IProjectStore
  organizations: OrganizationStore
  database: IDatabaseStore
  onProjectCreated: (project: any) => void
  onProjectUpdated: (project: any) => void
  onProjectDeleted: (project: any) => void
  onProjectConnectionStringUpdated: (projectId: number, value: string) => void
  onProjectStatusUpdated: (projectId: number, value: string) => void
  onOrgAdded: (org: any) => void
  onOrgUpdated: (org: any) => void
  onOrgDeleted: (org: any) => void
}
export default class AppStore implements IAppStore {
  rootStore: IRootStore
  projects: ProjectStore
  organizations: OrganizationStore
  database: DatabaseStore

  baseUrl: string

  constructor(rootStore: IRootStore) {
    this.rootStore = rootStore
    this.baseUrl = API_URL || '/api'

    const headers: any = {}

    this.projects = new ProjectStore(rootStore, `${this.baseUrl}/projects`, headers)
    this.organizations = new OrganizationStore(rootStore, `${this.baseUrl}/organizations`, headers)
    this.database = new DatabaseStore(rootStore, `${this.baseUrl}/database`, headers)
  }

  onProjectCreated(project: any) {
    if (project && project.id) {
      const temp: Project = {
        id: project.id,
        ref: project.ref,
        name: project.name,
        status: project.status,
        organization_id: project.organization_id,
        cloud_provider: project.cloud_provider,
        region: project.region,
        inserted_at: project.inserted_at,
        subscription_id: project.subscription_id,
        kpsVersion: undefined,
        connectionString: undefined,
      }
      this.projects.data[project.id] = temp
    }
  }

  onProjectUpdated(project: any) {
    if (project && project.id) {
      const clone = cloneDeep(this.projects.data[project.id])
      clone.name = project.name
      clone.status = project.status
      this.projects.data[project.id] = clone
    }
  }

  onProjectDeleted(project: any) {
    if (project && project.id) {
      // cleanup project saved queries
      localStorage.removeItem(`supabase-queries-state-${project.ref}`)
      localStorage.removeItem(`supabase_${project.ref}`)
      delete this.projects.data[project.id]
    }
  }

  onProjectConnectionStringUpdated(projectId: number, value: string) {
    const clone = cloneDeep(this.projects.data[projectId])
    clone.connectionString = value
    this.projects.data[projectId] = clone
  }

  onProjectStatusUpdated(projectId: number, value: string) {
    const clone = cloneDeep(this.projects.data[projectId])
    clone.status = value
    this.projects.data[projectId] = clone
  }

  onOrgUpdated(updatedOrg: Organization) {
    if (updatedOrg && updatedOrg.id) {
      const originalOrg = this.organizations.data[updatedOrg.id]
      this.organizations.data[updatedOrg.id] = {
        ...originalOrg,
        ...updatedOrg,
      }
    }
  }

  onOrgAdded(org: Organization) {
    if (org && org.id) {
      this.organizations.data[org.id] = org
    }
  }

  onOrgDeleted(org: Organization) {
    if (org && org.id) {
      const projects = values(this.projects.data)
      // cleanup projects saved queries
      const removedprojects = projects.filter(
        (project: Project) => project.organization_id === org.id
      )
      removedprojects.forEach((project: Project) => {
        localStorage.removeItem(`supabase-queries-state-${project.ref}`)
        localStorage.removeItem(`supabase_${project.ref}`)
      })
      // remove projects belong to removed org
      const updatedProjects = projects.filter(
        (project: Project) => project.organization_id != org.id
      )
      this.projects.data = updatedProjects.reduce((map: any, x: any) => {
        map[x.id] = { ...x }
        return map
      }, {})
      delete (this.organizations.data as any)[org.id]
    }
  }
}
