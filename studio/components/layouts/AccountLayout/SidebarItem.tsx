import { FC } from 'react'
import Link from 'next/link'
import { Menu, IconLogOut, IconArrowUpRight } from 'ui'

interface Props {
  id: any
  label: string
  href?: string
  isActive?: boolean
  isSubitem?: boolean
  isExternal?: boolean
  onClick?: () => void
}

const SidebarItem: FC<Props> = ({
  id,
  label,
  href,
  isActive = false,
  isSubitem = false,
  isExternal = false,
  onClick = () => {},
}) => {
  if (href === undefined) {
    const icon = isExternal ? (
      <IconArrowUpRight size="tiny" />
    ) : label === 'Logout' ? (
      <IconLogOut size="tiny" />
    ) : undefined

    return (
      <Menu.Item
        rounded
        key={id}
        style={{ marginLeft: isSubitem ? '.5rem' : '0' }}
        active={isActive}
        onClick={onClick}
        icon={icon}
      >
        {isSubitem ? <p className="text-sm">{label}</p> : label}
      </Menu.Item>
    )
  }

  return (
    <Link href={href || ''}>
      <a className="block" target={isExternal ? '_blank' : '_self'}>
        <button
          className={[
            'ring-scale-1200 border-scale-500 group-hover:border-scale-900 group',
            'flex max-w-full cursor-pointer items-center space-x-2 py-1 font-normal',
            'outline-none focus-visible:z-10 focus-visible:ring-1',
          ].join(' ')}
          onClick={onClick}
        >
          {isExternal && (
            <span className="text-scale-900 group-hover:text-scale-1100 truncate text-sm transition">
              <IconArrowUpRight size="tiny" />
            </span>
          )}
          <span
            title={label}
            className="text-scale-1100 group-hover:text-scale-1200 w-full truncate text-sm transition"
          >
            {isSubitem ? <p>{label}</p> : label}
          </span>
        </button>
      </a>
    </Link>
  )
}

export default SidebarItem
