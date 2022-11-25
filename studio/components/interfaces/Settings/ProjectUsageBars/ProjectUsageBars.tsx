import { FC, useEffect } from 'react'
import { Badge, IconAlertCircle, Loading } from 'ui'

import { useStore } from 'hooks'
import { formatBytes } from 'lib/helpers'
import { PRICING_TIER_PRODUCT_IDS, USAGE_APPROACHING_THRESHOLD } from 'lib/constants'
import SparkBar from 'components/ui/SparkBar'
import ShimmeringLoader from 'components/ui/ShimmeringLoader'
import InformationBox from 'components/ui/InformationBox'
import { USAGE_BASED_PRODUCTS } from 'components/interfaces/Billing/Billing.constants'
import { ProjectUsageResponse, useProjectUsageQuery } from 'data/usage/project-usage-query'

interface Props {
  projectRef?: string
}

const ProjectUsage: FC<Props> = ({ projectRef }) => {
  const { ui } = useStore()
  const { data: usage, error, isLoading } = useProjectUsageQuery({ projectRef })

  const projectHasNoLimits =
    ui.selectedProject?.subscription_tier === PRICING_TIER_PRODUCT_IDS.PAYG ||
    ui.selectedProject?.subscription_tier === PRICING_TIER_PRODUCT_IDS.ENTERPRISE

  const showUsageExceedMessage =
    ui.selectedProject?.subscription_tier !== undefined && !projectHasNoLimits

  useEffect(() => {
    if (error) {
      ui.setNotification({
        category: 'error',
        message: `Failed to get project's usage data: ${(error as any)?.message ?? 'unknown'}`,
      })
    }
  }, [error])

  if (!isLoading && error) {
    return (
      <InformationBox
        hideCollapse
        defaultVisibility
        icon={<IconAlertCircle strokeWidth={2} />}
        title="There was an issue loading the usage details of your project"
      />
    )
  }

  return (
    <Loading active={isLoading}>
      {usage && (
        <div>
          {USAGE_BASED_PRODUCTS.map((product) => {
            const isExceededUsage =
              showUsageExceedMessage &&
              product.features
                .map((feature) => {
                  const featureUsage = usage[feature.key as keyof ProjectUsageResponse]
                  return (featureUsage.usage ?? 0) / featureUsage.limit > 1
                })
                .some((x) => x === true)
            return (
              <div
                key={product.title}
                className={[
                  'mb-8 overflow-hidden rounded border',
                  'border-panel-border-light dark:border-panel-border-dark',
                ].join(' ')}
              >
                <table className="w-full bg-panel-body-light dark:bg-panel-body-dark">
                  {/* Header */}
                  <thead className="bg-panel-header-light dark:bg-panel-header-dark">
                    <tr className="overflow-hidden rounded">
                      <th className="w-1/4 px-6 py-3 text-left">
                        <div className="flex items-center space-x-4">
                          <div
                            className={[
                              'flex h-8 w-8 items-center justify-center',
                              'rounded bg-scale-500 dark:bg-white',
                            ].join(' ')}
                          >
                            {product.icon}
                          </div>
                          <h5 className="mb-0">{product.title}</h5>
                        </div>
                      </th>
                      {/* Plan Limits */}
                      <th className="hidden p-3 text-left text-xs font-medium leading-4 text-gray-400 lg:table-cell">
                        {isExceededUsage && <Badge color="red">Exceeded usage</Badge>}
                      </th>
                      {/* Usage */}
                      <th className="p-3 text-left text-xs font-medium leading-4 text-gray-400" />
                    </tr>
                  </thead>

                  {/* Line items */}
                  {usage === undefined ? (
                    <div className="w-96 px-4 pt-1 pb-4">
                      <ShimmeringLoader />
                    </div>
                  ) : (
                    <tbody>
                      {product.features.map((feature) => {
                        const featureUsage = usage[feature.key as keyof ProjectUsageResponse]
                        const usageValue = featureUsage.usage || 0
                        const usageRatio = usageValue / featureUsage.limit
                        const isApproaching = usageRatio >= USAGE_APPROACHING_THRESHOLD
                        const isExceeded = showUsageExceedMessage && usageRatio >= 1

                        return (
                          <tr
                            key={feature.title}
                            className="border-t border-panel-border-light dark:border-panel-border-dark"
                          >
                            <td className="whitespace-nowrap px-6 py-3 text-sm text-scale-1200">
                              {feature.title}
                            </td>
                            {ui.selectedProject?.subscription_tier !== undefined && (
                              <>
                                {showUsageExceedMessage && (
                                  <td className="hidden w-1/5 whitespace-nowrap p-3 text-sm text-scale-1200 lg:table-cell">
                                    {(usageRatio * 100).toFixed(2)} %
                                  </td>
                                )}
                                <td className="px-6 py-3 text-sm text-scale-1200">
                                  {showUsageExceedMessage ? (
                                    <SparkBar
                                      type="horizontal"
                                      barClass={`${
                                        isExceeded
                                          ? 'bg-red-900'
                                          : isApproaching
                                          ? 'bg-yellow-900'
                                          : 'bg-brand-900'
                                      }`}
                                      value={usageValue}
                                      max={featureUsage.limit}
                                      labelBottom={
                                        feature.units === 'bytes'
                                          ? formatBytes(usageValue)
                                          : usageValue.toLocaleString()
                                      }
                                      labelTop={
                                        feature.units === 'bytes'
                                          ? formatBytes(featureUsage.limit)
                                          : featureUsage.limit.toLocaleString()
                                      }
                                    />
                                  ) : (
                                    <span>
                                      {feature.units === 'bytes' ? formatBytes(usageValue) : ''}
                                    </span>
                                  )}
                                </td>
                              </>
                            )}
                          </tr>
                        )
                      })}
                    </tbody>
                  )}
                </table>
              </div>
            )
          })}
        </div>
      )}
    </Loading>
  )
}

export default ProjectUsage
