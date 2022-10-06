import { FC } from 'react'
import { IconX } from 'ui'

import { LogData, QueryType } from './Logs.types'

import DatabaseApiSelectionRender from './LogSelectionRenderers/DatabaseApiSelectionRender'
import DatabasePostgresSelectionRender from './LogSelectionRenderers/DatabasePostgresSelectionRender'
import FunctionInvocationSelectionRender from './LogSelectionRenderers/FunctionInvocationSelectionRender'
import FunctionLogsSelectionRender from './LogSelectionRenderers/FunctionLogsSelectionRender'
import DefaultExplorerSelectionRenderer from './LogSelectionRenderers/DefaultExplorerSelectionRenderer'
import DefaultPreviewSelectionRenderer from './LogSelectionRenderers/DefaultPreviewSelectionRenderer'
import { isDefaultLogPreviewFormat, LogsEndpointParams } from '.'
import useSingleLog from 'hooks/analytics/useSingleLog'
import Connecting from 'components/ui/Loading/Loading'

export interface LogSelectionProps {
  log: LogData | null
  onClose: () => void
  queryType?: QueryType
  projectRef: string
  params: Partial<LogsEndpointParams>
}

const LogSelection: FC<LogSelectionProps> = ({
  projectRef,
  log: partialLog,
  onClose,
  queryType,
  params = {},
}) => {
  const [{ logData: fullLog, isLoading }] = useSingleLog(
    projectRef,
    queryType,
    params,
    partialLog?.id
  )
  const Formatter = () => {
    switch (queryType) {
      case 'api':
        if (!fullLog) return null
        return <DatabaseApiSelectionRender log={fullLog} />

      case 'database':
        if (!fullLog) return null
        return <DatabasePostgresSelectionRender log={fullLog} />

      case 'fn_edge':
        if (!fullLog) return null
        return <FunctionInvocationSelectionRender log={fullLog} />

      case 'functions':
        if (!fullLog) return null
        return <FunctionLogsSelectionRender log={fullLog} />

      default:
        if (queryType && fullLog && isDefaultLogPreviewFormat(fullLog)) {
          return <DefaultPreviewSelectionRenderer log={fullLog} />
        }
        if (queryType && !fullLog) {
          return null
        }
        if (!partialLog) return null
        return <DefaultExplorerSelectionRenderer log={partialLog} />
    }
  }

  return (
    <div
      className={[
        'relative flex h-full flex-grow flex-col border border-l',
        'border-panel-border-light dark:border-panel-border-dark',
        'overflow-y-scroll bg-gray-200',
      ].join(' ')}
    >
      <div
        className={
          `absolute flex
          h-full w-full flex-col items-center justify-center gap-2 overflow-y-scroll bg-scale-200 text-center opacity-0 transition-all ` +
          (partialLog ? 'z-0 opacity-0' : 'z-10 opacity-100')
        }
      >
        <div
          className={
            `flex
          w-full
          max-w-sm
          scale-95
          flex-col
          items-center
          justify-center
          gap-6
          text-center
          opacity-0
          transition-all delay-300 duration-500 ` +
            (partialLog || isLoading ? 'mt-0 scale-95 opacity-0' : 'mt-8 scale-100 opacity-100')
          }
        >
          <div className="relative flex h-4 w-32 items-center rounded border border-scale-600 px-2 dark:border-scale-400">
            <div className="h-0.5 w-2/3 rounded-full bg-scale-600 dark:bg-scale-500"></div>
            <div className="absolute right-1 -bottom-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                />
              </svg>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm text-scale-1200">Select an Event</h3>
            <p className="text-xs text-scale-900">
              Select an Event to view the code snippet (pretty view) or complete JSON payload (raw
              view).
            </p>
          </div>
        </div>
      </div>
      <div
        className=" 
          relative
          h-px
          flex-grow
          bg-scale-300
        "
      >
        <div
          className="absolute top-6 right-6 cursor-pointer text-scale-900 transition hover:text-scale-1200"
          onClick={onClose}
        >
          <IconX size={14} strokeWidth={2} />
        </div>
        {isLoading && <Connecting />}
        <div className="flex flex-col space-y-6 bg-scale-300 py-8">
          {!isLoading && <Formatter />}
        </div>
      </div>
    </div>
  )
}

export default LogSelection
