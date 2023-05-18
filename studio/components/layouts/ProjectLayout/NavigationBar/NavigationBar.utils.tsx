import {
  IconArchive,
  IconBarChart,
  IconCode,
  IconDatabase,
  IconFileText,
  IconList,
  IconSettings,
  IconUsers,
} from 'ui'
import SVG from 'react-inlinesvg'

import { ProjectBase } from 'types'
import { Route } from 'components/ui/ui.types'
import {IS_OFFLINE, IS_PLATFORM, PROJECT_STATUS} from 'lib/constants'
import IconBase from "ui/src/components/Icon/IconBase";

export const generateToolRoutes = (ref?: string, project?: ProjectBase): Route[] => {
  const isProjectBuilding = project?.status === PROJECT_STATUS.COMING_UP
  const isProjectPaused = project?.status === PROJECT_STATUS.INACTIVE

  const homeUrl = `/project/${ref}`
  const buildingUrl = `/project/${ref}/building`

  return [
    {
      key: 'editor',
      label: 'Table Editor',
      icon: (
        <SVG
          src="/img/table-editor.svg"
          style={{ width: `${18}px`, height: `${18}px` }}
          preProcessor={(code) => code.replace(/svg/, 'svg class="m-auto text-color-inherit"')}
        />
      ),
      link:
        ref &&
        (isProjectPaused ? homeUrl : isProjectBuilding ? buildingUrl : `/project/${ref}/editor`),
    },
    {
      key: 'sql',
      label: 'SQL Editor',
      icon: (
        <SVG
          src="/img/sql-editor.svg"
          style={{ width: `${18}px`, height: `${18}px` }}
          preProcessor={(code) => code.replace(/svg/, 'svg class="m-auto text-color-inherit"')}
        />
      ),
      link:
        ref &&
        (isProjectPaused ? homeUrl : isProjectBuilding ? buildingUrl : `/project/${ref}/sql`),
    },
  ]
}
export const generateProductRoutes = (ref?: string, project?: ProjectBase): Route[] => {
  const isProjectBuilding = project?.status !== PROJECT_STATUS.ACTIVE_HEALTHY
  const isProjectPaused = project?.status === PROJECT_STATUS.INACTIVE

  const homeUrl = `/project/${ref}`
  const buildingUrl = `/project/${ref}/building`

  return [
    {
      key: 'database',
      label: 'Database',
      icon: <IconDatabase size={18} strokeWidth={2} />,
      link:
        ref &&
        (isProjectPaused
          ? homeUrl
          : isProjectBuilding
          ? buildingUrl
          : `/project/${ref}/database/tables`),
    },
    {
      key: 'auth',
      label: 'Authentication',
      icon: <IconUsers size={18} strokeWidth={2} />,
      link:
        ref &&
        (isProjectPaused
          ? homeUrl
          : isProjectBuilding
          ? buildingUrl
          : `/project/${ref}/auth/users`),
    },
    {
      key: 'storage',
      label: 'Storage',
      icon: <IconArchive size={18} strokeWidth={2} />,
      link:
        ref &&
        (isProjectPaused
          ? homeUrl
          : isProjectBuilding
          ? buildingUrl
          : `/project/${ref}/storage/buckets`),
    },
    ...(!IS_OFFLINE ? [{
      key: 'hosting',
      label: '静态托管',
      icon: <IconBase size={18} strokeWidth={2} src={
        // <SVG src={'/img/icons/static-hosting.svg'}/>
        <g id="控件" stroke="currentColor" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="base侧导航" transform="translate(-1.000000, -247.000000)" fill-rule="nonzero">
            <g id="托管" transform="translate(0.000000, 246.000000)">
              <rect id="矩形" fill="none" opacity="0" x="0" y="0" width="20" height="20"></rect>
              <path d="M10,1.25 L16.9391803,4.72160045 L16.5036885,5.35520425 L10,2.10149692 L2.11065574,6.04854504 L2.11065574,13.951455 L10,17.8980134 L17.8893443,13.951455 L17.8893443,7.61688584 L18.75,7.61688584 L18.75,14.3725518 L10,18.75 L1.25,14.3725518 L1.25,5.62744823 L10,1.25 Z M5.69672132,7.06211527 L10.8606557,9.51035255 L10.8606557,14.8964745 L5.69672132,12.4482373 L5.69672132,7.06211527 Z M7.41803279,6.08282036 L12.5819672,8.53105764 L12.5819672,13.9171796 L11.7213115,12.6112899 L11.7213115,8.96341634 L8.22360656,7.30498042 L7.41803279,6.08282036 Z M6.55737704,8.31022663 L6.55737704,12.0158786 L10,13.6483632 L10,9.94271125 L6.55737704,8.31022663 Z M9.13934426,5.10352547 L14.3032787,7.55176273 L14.3032787,12.9378847 L13.442623,11.631995 L13.442623,7.98412143 L9.94491803,6.32568551 L9.13934426,5.10352547 Z" id="形状结合" stroke="currentColor" stroke-width="0.5" fill="currentColor"></path>
            </g>
          </g>
        </g>
      } />,
      link:
        ref &&
        (isProjectPaused
          ? homeUrl
          : isProjectBuilding
            ? buildingUrl
            : `/project/${ref}/hosting`)
    }] : []),
    ...(IS_PLATFORM && !IS_OFFLINE
      ? [
          {
            key: 'functions',
            label: 'Edge Functions',
            icon: <IconCode size={18} strokeWidth={2} />,
            link:
              ref &&
              (isProjectPaused
                ? homeUrl
                : isProjectBuilding
                ? buildingUrl
                : `/project/${ref}/functions`),
          },
        ]
      : []),
  ]
}

export const generateOtherRoutes = (ref?: string, project?: ProjectBase): Route[] => {
  const isProjectBuilding = project?.status === PROJECT_STATUS.COMING_UP
  const isProjectPaused = project?.status === PROJECT_STATUS.INACTIVE

  const homeUrl = `/project/${ref}`
  const buildingUrl = `/project/${ref}/building`

  return [
    ...(IS_PLATFORM
      ? [
          {
            key: 'reports',
            label: 'Reports',
            icon: <IconBarChart size={18} strokeWidth={2} />,
            link:
              ref &&
              (isProjectPaused
                ? homeUrl
                : isProjectBuilding
                ? buildingUrl
                : `/project/${ref}/reports`),
          },
        ]
      : []),
    ...(IS_PLATFORM
      ? [
          {
            key: 'logs',
            label: 'Logs',
            icon: <IconList size={18} strokeWidth={2} />,
            link:
              ref &&
              (isProjectPaused
                ? homeUrl
                : isProjectBuilding
                ? buildingUrl
                : `/project/${ref}/logs/explorer`),
          },
        ]
      : []),
    {
      key: 'api',
      label: 'API Docs',
      icon: <IconFileText size={18} strokeWidth={2} />,
      link:
        ref &&
        (isProjectPaused ? homeUrl : isProjectBuilding ? buildingUrl : `/project/${ref}/api`),
    },
    ...(IS_PLATFORM
      ? [
          {
            key: 'settings',
            label: 'Project Settings',
            icon: <IconSettings size={18} strokeWidth={2} />,
            link: ref && `/project/${ref}/settings/general`,
          },
        ]
      : []),
  ]
}
