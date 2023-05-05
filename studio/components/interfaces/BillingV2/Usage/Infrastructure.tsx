import ShimmeringLoader from 'components/ui/ShimmeringLoader'
import { useInfraMonitoringQuery } from 'data/analytics/infra-monitoring-query'
import { useProjectSubscriptionQuery } from 'data/subscriptions/project-subscription-query'
import dayjs from 'dayjs'
import UsageBarChart from './UsageBarChart'
import SectionContent from './SectionContent'
import SectionHeader from './SectionHeader'
import { USAGE_CATEGORIES } from './Usage.constants'

export interface InfrastructureProps {
  projectRef: string
}

// [Joshen] Need to update the IO budget chart to show burst mbps and duration next time

const Infrastructure = ({ projectRef }: InfrastructureProps) => {
  const { data: subscription } = useProjectSubscriptionQuery({ projectRef })
  const { current_period_start, current_period_end } = subscription?.billing ?? {}
  const startDate = new Date((current_period_start ?? 0) * 1000).toISOString()
  const endDate = new Date((current_period_end ?? 0) * 1000).toISOString()
  const categoryMeta = USAGE_CATEGORIES.find((category) => category.key === 'infra')

  const { data: cpuUsageData, isLoading: isLoadingCpuUsageData } = useInfraMonitoringQuery({
    projectRef,
    attribute: 'cpu_usage',
    interval: '1d',
    startDate,
    endDate,
  })

  const { data: memoryUsageData, isLoading: isLoadingMemoryUsageData } = useInfraMonitoringQuery({
    projectRef,
    attribute: 'ram_usage',
    interval: '1d',
    startDate,
    endDate,
  })

  const { data: ioBudgetData, isLoading: isLoadingIoBudgetData } = useInfraMonitoringQuery({
    projectRef,
    attribute: 'disk_io_budget',
    interval: '1d',
    startDate,
    endDate,
  })

  const chartMeta: any = {
    cpu_usage: {
      isLoading: isLoadingCpuUsageData,
      data: cpuUsageData?.data ?? [],
    },
    ram_usage: {
      isLoading: isLoadingMemoryUsageData,
      data: memoryUsageData?.data ?? [],
    },
    disk_io_budget: {
      isLoading: isLoadingIoBudgetData,
      data: ioBudgetData?.data ?? [],
    },
  }

  if (categoryMeta === undefined) return null

  return (
    <>
      <SectionHeader title={categoryMeta.name} description={categoryMeta.description} />
      {categoryMeta.attributes.map((attribute) => {
        const chartData = chartMeta[attribute.key]?.data ?? []

        // [Joshen] Ideally this should come from the API imo, foresee some discrepancies
        const lastZeroValue = chartData.find(
          (x: any) => x.loopId > 0 && x[attribute.attribute] === 0
        )
        const lastKnownValue =
          lastZeroValue !== undefined
            ? dayjs(lastZeroValue.period_start)
                .subtract(1, 'day')
                .format('DD MMM YYYY, HH:mma (ZZ)')
            : undefined

        return (
          <SectionContent key={attribute.key} section={attribute}>
            {attribute.key === 'disk_io_budget' && (
              // [Joshen] Eventually should show the overview of the io bandwidth in mbps for burst, baseline and duration
              <>
                <div className="space-y-1">
                  <p>What is Disk IO Bandwidth?</p>
                  <p className="text-sm text-scale-1000">
                    Smaller compute instances can burst up to the maximum disk IO bandwidth for 30
                    minutes in a day. Beyond that, the performance reverts to the baseline disk IO
                    bandwidth.
                  </p>
                </div>
                {/* <div>
                  <div className="flex items-center justify-between border-b py-1">
                    <p className="text-xs text-scale-1000">
                      Included in {subscription?.tier.name.toLowerCase()}
                    </p>
                    {usageMeta?.limit === -1 ? (
                      <p className="text-xs">None</p>
                    ) : (
                      <p className="text-xs">{(usageMeta?.limit ?? 0).toLocaleString()}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between border-b py-1">
                    <p className="text-xs text-scale-1000">Used</p>
                    <p className="text-xs">{(usageMeta?.usage ?? 0).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <p className="text-xs text-scale-1000">Extra volume used this month</p>
                    <p className="text-xs">
                      {((usageMeta?.limit ?? 0) === -1 || usageExcess < 0
                        ? 0
                        : usageExcess
                      ).toLocaleString()}
                    </p>
                  </div>
                </div> */}
              </>
            )}
            <div className="space-y-1">
              {attribute.key === 'disk_io_budget' ? (
                <p>IO Budget remaining each day</p>
              ) : (
                <p>
                  Max{' '}
                  <span className={attribute.key === 'ram_usage' ? 'lowercase' : ''}>
                    {attribute.name}
                  </span>{' '}
                  usage each day
                </p>
              )}
              {attribute.chartDescription.split('\n').map((paragraph, idx) => (
                <p key={`para-${idx}`} className="text-sm text-scale-1000">
                  {paragraph}
                </p>
              ))}
              {lastKnownValue !== undefined && (
                <span className="text-sm text-scale-1000">Last updated at: {lastKnownValue}</span>
              )}
            </div>
            {chartMeta[attribute.key].isLoading ? (
              <div className="space-y-2">
                <ShimmeringLoader />
                <ShimmeringLoader className="w-3/4" />
                <ShimmeringLoader className="w-1/2" />
              </div>
            ) : (
              <UsageBarChart
                name={attribute.name}
                unit={attribute.unit}
                attribute={attribute.attribute}
                data={chartData}
                yFormatter={(value) => `${value}%`}
                yLimit={100}
              />
            )}
          </SectionContent>
        )
      })}
    </>
  )
}

export default Infrastructure
