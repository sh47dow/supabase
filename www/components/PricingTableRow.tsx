import React from 'react'
import ReactDOM from 'react-dom'
import { IconHelpCircle, IconWatch, Space, Typography } from '@supabase/ui'
import ReactTooltip from 'react-tooltip'

const Chevron = (props: any) => (
  <>
    <svg
      className={`h-5 w-5 text-green-500`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
    <span className="sr-only">Included in {props.tier}</span>
  </>
)

const Minus = (props: any) => (
  <>
    <svg
      className="h-5 w-5 text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
        clipRule="evenodd"
      />
    </svg>
    <span className="sr-only">Not included in {props.tier}</span>
  </>
)

export const PricingTableRowDesktop = (props: any) => {
  const category = props.category

  return (
    <>
      <tr className="divide-x dark:divide-gray-600" style={{ borderTop: 'none' }}>
        <th
          className="bg-gray-50 dark:bg-gray-700 py-3 pl-6 text-sm font-medium text-gray-900 dark:text-white text-left"
          scope="colgroup"
        >
          <Space size={4}>
            {category.icon ? (
              <div className="flex items-center justify-center h-8 w-8 rounded-md bg-gray-800 text-white dark:bg-white">
                <svg
                  className="h-4 w-4 stroke-white dark:stroke-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={category.icon}
                  />
                </svg>
              </div>
            ) : null}
            <Typography.Title level={4}>{category.title}</Typography.Title>
          </Space>
        </th>
        <td className="bg-gray-50 dark:bg-dark-700 py-5 px-6"></td>
        <td className="bg-gray-50 dark:bg-dark-700 py-5 px-6"></td>
        <td className="bg-gray-50 dark:bg-dark-700 py-5 px-6"></td>
      </tr>

      {category.features.map((feat: any) => {
        return (
          <tr className="divide-x dark:divide-gray-600">
            <th
              className="flex items-center py-5 px-6 text-sm font-normal text-gray-500 dark:text-gray-300 text-left"
              scope="row"
            >
              <span>{feat.title} </span>
              {feat.tooltip && (
                <span
                  className="ml-2 cursor-pointer hover:text-gray-800 dark:hover:text-white"
                  data-tip={feat.tooltip}
                >
                  <IconHelpCircle size="small" />
                </span>
              )}
            </th>

            {Object.values(feat.tiers).map((tier) => {
              return (
                <td className="py-5 px-6">
                  {typeof tier === 'boolean' && tier === true ? (
                    <Chevron tier={tier} />
                  ) : typeof tier === 'boolean' && tier === false ? (
                    <Minus tier={tier} />
                  ) : (
                    <span className="block text-sm text-gray-700 dark:text-white">{tier}</span>
                  )}
                </td>
              )
            })}
          </tr>
        )
      })}
      <ReactTooltip effect={'solid'} />
    </>
  )
}

export const PricingTableRowMobile = (props: any) => {
  const category = props.category
  const tier = props.tier

  return (
    <>
      <table className="mt-8 w-full">
        <caption className="bg-gray-50 dark:bg-dark-900 border-t border-gray-200 dark:border-gray-600 py-3 px-4 text-sm font-medium text-gray-900 dark:text-white text-left">
          <Space size={4}>
            {category.icon ? (
              <div className="flex items-center justify-center h-8 w-8 rounded-md bg-gray-900 text-white dark:bg-white">
                <svg
                  className="h-4 w-4 stroke-white dark:stroke-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={category.icon}
                  />
                </svg>
              </div>
            ) : null}
            <Typography.Title level={4}>{category.title}</Typography.Title>
          </Space>
        </caption>
        <thead>
          <tr>
            <th className="sr-only" scope="col">
              Feature
            </th>
            <th className="sr-only" scope="col">
              Included
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-600 ">
          {category.features.map((feat) => {
            return (
              <tr className="border-t border-gray-200 dark:border-gray-600 ">
                <th className="py-5 px-4 text-sm font-normal text-gray-500 text-left" scope="row">
                  <span>
                    <Typography.Text type="secondary">{feat.title}</Typography.Text>
                  </span>
                </th>
                <td className="py-5 pr-4 text-right">
                  {typeof feat.tiers[tier] === 'boolean' && feat.tiers[tier] === true ? (
                    <div className="inline-block">
                      <Chevron tier={tier} />
                    </div>
                  ) : typeof feat.tiers[tier] === 'boolean' && feat.tiers[tier] === false ? (
                    <div className="inline-block">
                      <Minus tier={tier} />
                    </div>
                  ) : (
                    <span className="block text-sm text-gray-700 dark:text-white">
                      {feat.tiers[tier]}
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <ReactTooltip effect={'solid'} />
    </>
  )
}
