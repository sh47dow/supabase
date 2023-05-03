export const Y_DOMAIN_CEILING_MULTIPLIER = 4 / 3

export const USAGE_STATUS = {
  NORMAL: 'NORMAL',
  APPROACHING: 'APPROACHING',
  EXCEEDED: 'EXCEEDED',
}

export interface CategoryAttribute {
  key: string // Property from project usage
  attribute: string // For querying against stats-daily / infra-monitoring
  name: string
  unit: 'bytes' | 'absolute'
  docsUrl?: string
  description: string
  chartDescription: string
}
export const USAGE_CATEGORIES: {
  key: 'infra' | 'bandwidth' | 'sizeCount' | 'activity'
  name: string
  attributes: CategoryAttribute[]
}[] = [
  {
    key: 'infra',
    name: 'Infrastructure',
    attributes: [
      {
        key: 'cpu_usage',
        attribute: 'cpu_usage',
        name: 'CPU usage',
        unit: 'absolute',
        description: 'Some description here',
        chartDescription: 'Some description here',
      },
      {
        key: 'ram_usage',
        attribute: 'ram_usage',
        name: 'Memory usage',
        unit: 'absolute',
        description: 'Some description here',
        chartDescription: 'Some description here',
      },
      {
        key: 'disk_io_budget',
        attribute: 'disk_io_budget',
        name: 'IO budget',
        unit: 'absolute',
        description: 'Some description here',
        chartDescription: 'Some description here',
      },
    ],
  },
  {
    key: 'bandwidth',
    name: 'Bandwidth',
    attributes: [
      {
        key: 'db_egress',
        attribute: 'total_egress_modified',
        name: 'Database egress',
        unit: 'bytes',
        description: 'Contains any outgoing traffic (egress) from your database',
        chartDescription:
          'Billing is based on the total sum of egress in GB throughout your billing period. The data shown here is refreshed over a period of 24 hours.',
      },
      {
        key: 'storage_egress',
        attribute: 'total_storage_egress',
        name: 'Storage egress',
        unit: 'bytes',
        description:
          'Contains any outgoing traffic (egress) from your storage buckets (only download operations are counted). We currently do not differentiate between no-cache and cache hits.',
        chartDescription:
          'Billing is based on the total amount of egress in GB throughout your billing period. The data shown here is refreshed over a period of 24 hours.',
      },
    ],
  },
  {
    key: 'sizeCount',
    name: 'Size & Counts',
    attributes: [
      {
        key: 'db_size',
        attribute: 'total_db_size_bytes',
        name: 'Database size',
        unit: 'bytes',
        description: "Size of your project's database",
        docsUrl: 'https://supabase.com/docs/guides/platform/database-usage',
        chartDescription:
          'Billing is based on the average daily database size in GB throughout the billing period. The data shown here is refreshed over a period of 24 hours.',
      },
      {
        key: 'storage_size',
        attribute: 'total_storage_size_bytes',
        name: 'Storage size',
        unit: 'bytes',
        description: 'Sum of all objects in your storage buckets',
        chartDescription:
          'Billing is based on the average size in GB throughout your billing period. The data shown here is refreshed over a period of 24 hours.',
      },
      {
        key: 'func_count',
        attribute: 'total_func_count',
        name: 'Edge function count',
        unit: 'absolute',
        description: 'Number of serverless functions in your project',
        chartDescription:
          'Billing is based on the maximum amount of functions at any point in time throughout your billing period. The data shown here is refreshed over a period of 24 hours.',
      },
    ],
  },
  {
    key: 'activity',
    name: 'Activity',
    attributes: [
      {
        key: 'monthly_active_users',
        attribute: 'total_auth_billing_period_mau',
        name: 'Monthly active users (MAU)',
        unit: 'absolute',
        description:
          'The amount of distinct users requesting your API throughout the billing period. Resets at the beginning of every billing period.',
        chartDescription: 'The data shown here is refreshed over a period of 24 hours.',
      },
      {
        key: 'monthly_active_sso_users',
        attribute: 'total_auth_billing_period_sso_mau',
        name: 'Monthly active single sign-on (SSO) users',
        unit: 'absolute',
        description:
          'The amount of distinct Single Sign-On users requesting your API throughout the billing period. Resets at the beginning of every billing period.',
        chartDescription: 'The data shown here is refreshed over a period of 24 hours.',
      },
      {
        key: 'storage_image_render_count',
        attribute: 'total_storage_image_render_count',
        name: 'Storage image transformations',
        unit: 'absolute',
        description:
          'We distinctly count all images that were transformed in the billing period, ignoring any transformations.\nIf you transform one image with different transformations, it only counts as one. We only count the unique (origin) images being transformed.',
        chartDescription: 'The data shown here is refreshed over a period of 24 hours.',
      },
      {
        key: 'func_invocations',
        attribute: 'total_func_invocations',
        name: 'Edge function invocations',
        unit: 'absolute',
        description:
          'Every single serverless function invocation independent of response status is counted. ',
        chartDescription:
          'Billing is based on the sum of all invocations throughout your billing period. The data shown here is refreshed over a period of 24 hours.',
      },
      {
        key: 'realtime_message_count',
        attribute: 'total_realtime_message_count',
        name: 'Realtime message count',
        unit: 'absolute',
        description: 'Total number of realtime messages sent',
        chartDescription:
          'Billing is based on the total amount of messages throughout your billing period. The data shown here is refreshed over a period of 24 hours.',
      },
      {
        key: 'realtime_peak_connection',
        attribute: 'total_realtime_peak_connection',
        name: 'Realtime peak connections',
        unit: 'absolute',
        description: 'Total number of successful connections (not connection attempts)',
        chartDescription:
          'Billing is based on the maximum amount of concurrent peak connections throughout your billing period.',
      },
    ],
  },
]
