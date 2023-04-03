import { useCommandState } from 'cmdk-supabase'
import { useRouter } from 'next/router'
import * as React from 'react'
import { ElementRef, useRef } from 'react'
import { IconHome } from '../Icon/icons/IconHome'

import { IconArrowRight } from './../Icon/icons/IconArrowRight'
import { IconBook } from './../Icon/icons/IconBook'
import { IconColumns } from './../Icon/icons/IconColumns'
import { IconInbox } from './../Icon/icons/IconInbox'
import { IconLifeBuoy } from './../Icon/icons/IconLifeBuoy'
import { IconMonitor } from './../Icon/icons/IconMonitor'
import { IconPhone } from './../Icon/icons/IconPhone'
import { IconUser } from './../Icon/icons/IconUser'

import AiCommand from './AiCommand'
import sharedItems from './utils/shared-nav-items.json'
import { AiIcon } from './Command.icons'
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandLabel,
  CommandList,
  CommandShortcut,
} from './Command.utils'
import { useCommandMenu } from './CommandMenuProvider'
import DocsSearch from './DocsSearch'
import CommandMenuShortcuts from './CommandMenuShortcuts'
import SearchOnlyItem from './SearchOnlyItem'
import SearchableStudioItems from './SearchableStudioItems'
import { COMMAND_ROUTES } from './Command.constants'
import GenerateSQL from './GenerateSQL'

export const CHAT_ROUTES = [
  COMMAND_ROUTES.AI, // this one is temporary
  COMMAND_ROUTES.AI_ASK_ANYTHING,
  COMMAND_ROUTES.AI_RLS_POLICY,
  COMMAND_ROUTES.GENERATE_SQL,
]

const iconPicker: { [key: string]: React.ReactNode } = {
  arrowRight: <IconArrowRight />,
  book: <IconBook />,
  inbox: <IconInbox />,
  mobile: <IconPhone />,
  person: <IconUser />,
  services: <IconColumns />,
  contact: <IconMonitor />,
  icon: <IconHome />,
  products: <IconColumns />,
}

interface CommandMenuProps {
  projectRef?: string
}

const CommandMenu = ({ projectRef }: CommandMenuProps) => {
  const router = useRouter()

  const commandInputRef = useRef<ElementRef<typeof CommandInput>>(null)
  const { isOpen, setIsOpen, actions, search, setSearch, pages, setPages, currentPage, site } =
    useCommandMenu()

  const ThemeOptions = ({ isSubItem = false }) => {
    return (
      <CommandGroup>
        <SearchOnlyItem
          isSubItem={isSubItem}
          onSelect={() => {
            actions.toggleTheme(true)
            setIsOpen(false)
          }}
        >
          Change Theme to dark
        </SearchOnlyItem>
        <SearchOnlyItem
          isSubItem={isSubItem}
          onSelect={() => {
            actions.toggleTheme(false)
            setIsOpen(false)
          }}
        >
          Change Theme to light
        </SearchOnlyItem>
      </CommandGroup>
    )
  }

  const showCommandInput = !currentPage || !CHAT_ROUTES.includes(currentPage)

  return (
    <>
      <CommandDialog
        page={currentPage}
        visible={isOpen}
        onInteractOutside={() => {
          setIsOpen(!open)
        }}
        size={'xlarge'}
        className={'max-h-[70vh] lg:max-h-[50vh] overflow-hidden overflow-y-auto'}
      >
        {pages.length > 0 && <CommandMenuShortcuts />}
        {showCommandInput && (
          <CommandInput
            ref={commandInputRef}
            placeholder="Type a command or search..."
            value={search}
            onValueChange={setSearch}
          />
        )}
        <CommandList className={['my-2', showCommandInput && 'max-h-[300px]'].join(' ')}>
          {!currentPage && (
            <>
              <CommandGroup heading="Documentation" forceMount>
                <CommandItem
                  type="command"
                  onSelect={() => {
                    setPages([...pages, COMMAND_ROUTES.AI])
                  }}
                  forceMount
                >
                  <AiIcon />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-900 to-brand-1100">
                    Ask Supabase AI
                    {search ? (
                      <>
                        {': '}
                        <span className="text-scale-1200 font-semibold">{search}</span>
                      </>
                    ) : (
                      '...'
                    )}
                  </span>
                </CommandItem>
                <CommandItem
                  type="command"
                  onSelect={() => setPages([...pages, COMMAND_ROUTES.DOCS_SEARCH])}
                  forceMount
                >
                  <IconBook className="" />

                  <span>
                    Search the docs
                    {search ? (
                      <>
                        {': '}
                        <span className="text-scale-1200 font-semibold">{search}</span>
                      </>
                    ) : (
                      '...'
                    )}
                  </span>
                </CommandItem>
              </CommandGroup>

              {site === 'docs' && (
                <CommandGroup heading="Quickstarts">
                  {sharedItems.quickstarts.map((item) => (
                    <CommandItem key={item.url} type="link" onSelect={() => router.push(item.url)}>
                      <IconArrowRight className="text-scale-900" />
                      <CommandLabel>
                        Start with <span className="font-bold"> {item.label}</span>
                      </CommandLabel>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {site === 'docs' && (
                <CommandGroup heading="Projects">
                  {sharedItems.projectTools.map((item) => (
                    <CommandItem key={item.url} type="link" onSelect={() => router.push(item.url)}>
                      <IconArrowRight className="text-scale-900" />
                      <CommandLabel>
                        <span className="font-bold"> {item.label}</span>
                      </CommandLabel>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {site === 'docs' && (
                <CommandGroup heading="Studio tools">
                  {sharedItems.tools.map((item) => (
                    <CommandItem key={item.url} type="link" onSelect={() => router.push(item.url)}>
                      <IconArrowRight className="text-scale-900" />
                      <CommandLabel>
                        Go to <span className="font-bold"> {item.label}</span>
                      </CommandLabel>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {site === 'studio' && [
                <CommandGroup heading="Experimental">
                  <CommandItem
                    forceMount
                    type="command"
                    onSelect={() => setPages([...pages, COMMAND_ROUTES.GENERATE_SQL])}
                  >
                    <AiIcon className="text-scale-1100" />
                    <CommandLabel>Generate SQL with Supabase AI</CommandLabel>
                  </CommandItem>
                </CommandGroup>,
                <CommandGroup heading="Navigate">
                  {sharedItems.tools.map((item) => {
                    const itemUrl = (
                      projectRef ? item.url.replace('_', projectRef) : item.url
                    ).split('https://app.supabase.com')[1]

                    return (
                      <CommandItem key={item.url} type="link" onSelect={() => router.push(itemUrl)}>
                        <IconArrowRight className="text-scale-900" />
                        <CommandLabel>
                          Go to <span className="font-bold"> {item.label}</span>
                        </CommandLabel>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>,
              ]}

              {/* <DashboardTableEditor /> */}

              <CommandGroup heading="Support">
                {sharedItems.support.map((item) => (
                  <CommandItem key={item.url} type="link" onSelect={() => router.push(item.url)}>
                    <IconLifeBuoy className="text-scale-900" />
                    <CommandLabel>
                      Go to <span className="font-bold"> {item.label}</span>
                    </CommandLabel>
                  </CommandItem>
                ))}
              </CommandGroup>

              {site === 'docs' && (
                <CommandGroup heading="General">
                  {sharedItems.docsGeneral.map((item) => (
                    <CommandItem key={item.url} type="link" onSelect={() => router.push(item.url)}>
                      {item?.icon && iconPicker[item.icon]}
                      <CommandLabel>{item.label}</CommandLabel>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              <CommandGroup heading="Settings">
                <CommandItem type="link" onSelect={() => setPages([...pages, 'Theme'])}>
                  <IconMonitor className="mr-2" />
                  Change theme
                </CommandItem>
              </CommandGroup>
              <ThemeOptions isSubItem />
              {site === 'studio' && search && <SearchableStudioItems />}
            </>
          )}
          {currentPage === COMMAND_ROUTES.AI && <AiCommand />}
          {currentPage === COMMAND_ROUTES.DOCS_SEARCH && <DocsSearch />}
          {currentPage === COMMAND_ROUTES.GENERATE_SQL && <GenerateSQL />}
          {currentPage === COMMAND_ROUTES.THEME && <ThemeOptions />}
        </CommandList>
      </CommandDialog>
    </>
  )
}

export default CommandMenu
