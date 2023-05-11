import { cloneDeep } from 'lodash'
import { values } from 'mobx'
import { Organization, Project } from 'types'

import { API_URL, PROJECT_STATUS } from 'lib/constants'
import { getWithTimeout } from 'lib/common/fetch'
import { IRootStore } from '../RootStore'
import DatabaseStore, { IDatabaseStore } from './DatabaseStore'
import OrganizationStore from './OrganizationStore'
import ProjectStore, { IProjectStore } from './ProjectStore'

export interface IAppStore {
  projects: ProjectStore
  organizations: OrganizationStore
  database: IDatabaseStore
  onProjectCreated: (project: Project) => void
  onProjectUpdated: (project: Project) => void
  onProjectDeleted: (project: Project) => void
  onProjectPaused: (projectRef: string) => void
  onProjectStatusUpdated: (projectRef: string, value: string) => void
  onProjectPostgrestStatusUpdated: (projectRef: string, value: 'OFFLINE' | 'ONLINE') => void
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

    this.projects = new ProjectStore(rootStore, `${this.baseUrl}/projects`, headers, {identifier: 'ref'})
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
      }
      this.projects.data[project.id] = temp
    }
  }

  onProjectUpdated(project: any) {
    if (project && project.ref) {
      const clone = cloneDeep(this.projects.data[project.ref])
      // only update available param
      if (project.name) clone.name = project.name
      if (project.status) clone.status = project.status
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

  // At global store level so that it can continue checking while the user
  // is doing something else outside of the project page
  async onProjectPaused(projectRef: string) {
    const checkProjectInactive = async () => {
      // const projectRef = this.projects.data[projectId]?.ref
      const projectStatus = await getWithTimeout(`${API_URL}/projects/${projectRef}/status`, {
        timeout: 2000,
      })
      if (projectStatus.status === PROJECT_STATUS.INACTIVE) {
        this.onProjectStatusUpdated(projectRef, PROJECT_STATUS.INACTIVE)
      } else {
        setTimeout(() => checkProjectInactive(), 5000)
      }
    }

    setTimeout(() => checkProjectInactive(), 5000)
  }

  onProjectStatusUpdated(projectRef: string, value: string) {
    const clone = cloneDeep(this.projects.data[projectRef])
    clone.status = value
    this.projects.data[projectRef] = clone
  }

  onProjectPostgrestStatusUpdated(projectRef: string, value: 'OFFLINE' | 'ONLINE') {
    const clone = cloneDeep(this.projects.data[projectRef])
    clone.postgrestStatus = value
    this.projects.data[projectRef] = clone
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
