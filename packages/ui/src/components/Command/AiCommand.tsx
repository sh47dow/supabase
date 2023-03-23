import React, { useEffect, useReducer } from 'react'
import type { CreateCompletionResponse } from 'openai'
import { FC, useCallback, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
// @ts-ignore
import { SSE } from 'sse.js'
// import clippyImageDark from '../../public/img/clippy-dark.png'
// import clippyImage from '../../public/img/clippy.png'

import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useTheme } from 'common/Providers'
import Image from 'next/image'
import {
  Button,
  IconAlertCircle,
  IconAlertTriangle,
  IconLoader,
  IconSearch,
  IconUser,
  Input,
  Loading,
  Modal,
  Tabs,
} from 'ui'
// import components from '~/components'
// import { IS_PLATFORM } from '~/lib/constants'
// import { SearchContextValue } from './SearchProvider'
import SearchResult, { SearchResultType } from './SearchResult'
import { CommandGroup, CommandItem, CommandInput } from './Command.utils'
import { IconCopy } from '../Icon/icons/IconCopy'

import { AiIcon, AiIconChat, COMMAND_ROUTES, useCommandMenu } from './Command'

const questions = [
  'How do I get started with Supabase?',
  'How do I run Supabase locally?',
  'How do I connect to my database?',
  'How do I run migrations? ',
  'How do I listen to changes in a table?',
  'How do I set up authentication?',
]

const RLSquestions = [
  'How do I get started with Supabase?',
  'How do I run Supabase locally?',
  'How do I connect to my database?',
  'How do I run migrations? ',
  'How do I listen to changes in a table?',
  'How do I set up authentication?',
]

function getEdgeFunctionUrl() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')

  //   if (IS_PLATFORM) {
  if (true) {
    // @ts-ignore
    const [schemeAndProjectId, domain, tld] = supabaseUrl.split('.')
    return `${schemeAndProjectId}.functions.${domain}.${tld}`
  } else {
    return `${supabaseUrl}/functions/v1`
  }
}

const edgeFunctionUrl = getEdgeFunctionUrl()

function promptDataReducer(
  state: any[],
  action: {
    index?: number
    answer?: string | undefined
    status?: string
    query?: string | undefined
    type?: 'remove-last-item' | string
  }
) {
  // console.log('running reducer')
  // console.log('what is currently in', ...state)
  // console.log('what is the action payload', action)
  // set a standard state to use later
  let current = [...state]

  console.log(action)

  if (action.type) {
    switch (action.type) {
      case 'remove-last-item':
        console.log('removing last item')
        current.pop()
        return [...current]
        break

      default:
        break
    }
  }

  // check that an index is present
  if (action.index === undefined) return [...state]

  if (!current[action.index]) {
    current[action.index] = { query: '', answer: '', status: '' }
  }

  // if (action.answer !== undefined) {
  current[action.index].answer = action.answer
  // }
  if (action.query) {
    current[action.index].query = action.query
  }
  if (action.status) {
    current[action.index].status = action.status
  }

  // console.log('what i will update with', current)
  console.log(current)
  return [...current]

  throw Error('Unknown action.')
}

interface IAiCommand {
  query?: string
  setQuery?: () => void
  page?: string
}

const AiCommand: FC<IAiCommand> = ({ query, setQuery, page }) => {
  const { isDarkMode } = useTheme()

  // const { close, query, setQuery } = useSearch()
  const [answer, setAnswer] = useState<string | undefined>('')
  const [results, setResults] = useState<any[]>()
  const [isResponding, setIsResponding] = useState(false)
  const [hasClippyError, setHasClippyError] = useState(false)
  const [hasSearchError, setHasSearchError] = useState(false)
  const [selectedTab, setSelectedTab] = useState('clippy-panel')
  const eventSourceRef = useRef<SSE>()
  const supabaseClient = useSupabaseClient()
  const { isLoading, setIsLoading } = useCommandMenu()

  const [promptIndex, setPromptIndex] = useState(0)
  const [promptData, dispatchPromptData] = useReducer(promptDataReducer, [])

  const cantHelp = answer?.trim() === "Sorry, I don't know how to help with that."
  const status = isLoading
    ? 'Clippy is searching...'
    : isResponding
    ? 'Clippy is responding...'
    : cantHelp || hasClippyError
    ? 'Clippy has failed you'
    : undefined

  // const handleSearchConfirm = useCallback(
  //   async (query: string) => {
  //     console.log('query', query)
  //     // console.log('query', query)

  //     setResults(undefined)
  //     setAnswer(undefined)
  //     setIsResponding(false)
  //     setHasClippyError(false)
  //     setHasSearchError(false)
  //     setIsLoading(true)

  //     const { error, data: pageSections } = await supabaseClient.functions.invoke('search', {
  //       body: { query: query },
  //     })

  //     setIsLoading(false)

  //     if (error) {
  //       setIsLoading(false)
  //       setIsResponding(false)
  //       setHasSearchError(true)
  //       console.error(error)
  //       return
  //     }

  //     if (!Array.isArray(pageSections)) {
  //       setIsLoading(false)
  //       setIsResponding(false)
  //       setHasSearchError(true)
  //       console.error('Malformed response')
  //       return
  //     }

  //     setResults(pageSections)
  //   },
  //   [supabaseClient]
  // )

  // console.log('current index', promptIndex)

  const handleClippyConfirm = useCallback(
    async (query: string) => {
      // setResults(undefined)
      // const promptIndex = promptIndex
      console.log('handleClippyConfirm ran')
      console.log('promptIndex', promptIndex)
      setAnswer(undefined)
      setQuery('')
      dispatchPromptData({ index: promptIndex, answer: undefined, query: query })
      setIsResponding(false)
      setHasClippyError(false)
      setHasSearchError(false)
      setIsLoading(true)

      let queryToSend = query

      switch (page) {
        case COMMAND_ROUTES.AI_ASK_ANYTHING:
          queryToSend = query
          break

        case COMMAND_ROUTES.AI_RLS_POLICY:
          queryToSend = `Given this table schema:
          
          Schema STRIPE has tables: 
            CHARGE with columns [ID, AMOUNT, CREATED, CURRENCY, CUSTOMER_ID]
            CUSTOMER with columns [ID, NAME, CREATED, SHIPPING_ADDRESS_STATE]
          
          \n\nAnswer with only an RLS policy in SQL, no other text: ${query}`
          break
        default:
          break
      }

      console.log('query to send:', queryToSend)

      const eventSource = new SSE(`${edgeFunctionUrl}/clippy-search`, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        payload: JSON.stringify({ query: queryToSend }),
      })

      function handleError<T>(err: T) {
        setIsLoading(false)
        setIsResponding(false)
        // setHasClippyError(true)
        console.error(err)
      }

      eventSource.addEventListener('error', handleError)
      eventSource.addEventListener('message', (e: any) => {
        try {
          setIsLoading(false)

          if (e.data === '[DONE]') {
            // console.log('I HAVE FINSHED')
            setIsResponding(false)
            setAnswer(undefined)
            setPromptIndex((x) => {
              return x + 1
            })
            return
          }

          setIsResponding(true)

          const completionResponse: CreateCompletionResponse = JSON.parse(e.data)
          const [{ text }] = completionResponse.choices

          console.log('Im going to use index:', promptIndex)

          setAnswer((answer) => {
            const currentAnswer = answer ?? ''

            dispatchPromptData({
              index: promptIndex,
              answer: currentAnswer + text,
            })

            return (answer ?? '') + text
          })
        } catch (err) {
          handleError(err)
        }
      })

      eventSource.stream()

      eventSourceRef.current = eventSource

      setIsLoading(true)
    },
    [promptIndex, promptData]
  )

  const handleConfirm = useCallback(
    (selectedTab: string, query: string) => {
      switch (selectedTab) {
        case 'search-panel':
        // return handleSearchConfirm(query)
        case 'clippy-panel':
          return handleClippyConfirm(query)
      }
    },
    [
      // handleSearchConfirm,
      handleClippyConfirm,
    ]
  )

  // function handleResetPrompt() {
  //   eventSourceRef.current?.close()
  //   eventSourceRef.current = undefined
  //   setQuery('')
  //   setResults(undefined)
  //   setAnswer(undefined)
  //   setIsResponding(false)
  //   setHasClippyError(false)
  //   setHasSearchError(false)
  // }

  // console.log(promptData)

  useEffect(() => {
    if (query) {
      handleClippyConfirm(query)
    }
  }, [])

  const showActions =
    !query &&
    page === COMMAND_ROUTES.AI_RLS_POLICY &&
    !isResponding &&
    !isLoading &&
    promptData.length > 0

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="relative mb-[70px] py-4 overflow-y-auto overflow-hidden max-h-[720px]">
        {/* <Tabs
          activeId={selectedTab}
          onChange={(tabId) => {
            setSelectedTab(tabId)
            if (!query) {
              handleResetPrompt()
              return
            }
            handleConfirm(tabId, query)
          }}
        > */}
        {/* <Tabs.Panel id="search-panel" label="Guides & Reference">
            <div className="mb-6">
              {!isLoading && !hasSearchError && !results && (
                <div className="p-10 grid">
                  <h2 className="text-lg text-center text-scale-1100">
                    Search Supabase guides & reference docs
                  </h2>
                </div>
              )}
              {results && results.length > 0 && (
                <div className="flex flex-col gap-3 max-h-[70vh] lg:max-h-[50vh] overflow-y-auto px-4 py-4 rounded-lg bg-scale-200">
                  {results.map((page) => {
                    const pageSections = page.sections.filter((section) => !!section.heading)
                    return (
                      <div key={page.id} className="flex flex-col gap-3">
                        <SearchResult
                          href={page.path}
                          type={SearchResultType.Document}
                          title={page.meta.title}
                        />
                        {pageSections.length > 0 && (
                          <div className="flex flex-row">
                            <div className="border bg-scale-300 rounded-xl self-stretch p-[1px] ml-4 mr-4"></div>
                            <div className="flex flex-col gap-3 items-stretch grow">
                              {pageSections.map((section) => (
                                <SearchResult
                                  key={section.id}
                                  href={`${page.path}${page.type === 'reference' ? '/' : '#'}${
                                    section.slug
                                  }`}
                                  type={SearchResultType.Section}
                                  title={section.heading}
                                  chip={page.meta.title}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
              {isLoading && (
                <div className="p-6 grid gap-6 mt-4">
                  <Loading active>{}</Loading>
                  <p className="text-lg text-center">Searching for results</p>
                </div>
              )}
              {results && results.length === 0 && (
                <div className="p-6 flex flex-col items-center gap-6 mt-4">
                  <IconAlertTriangle strokeWidth={1.5} size={40} />
                  <p className="text-lg text-center">No results found.</p>
                  <Button size="tiny" type="secondary" onClick={handleResetPrompt}>
                    Try again?
                  </Button>
                </div>
              )}
              {hasSearchError && (
                <div className="p-6 flex flex-col items-center gap-6 mt-4">
                  <IconAlertTriangle strokeWidth={1.5} size={40} />
                  <p className="text-lg text-center">
                    Sorry, looks like we&apos;re having some issues with search!
                  </p>
                  <p className="text-sm text-center">Please try again in a bit.</p>
                  <Button size="tiny" type="secondary" onClick={handleResetPrompt}>
                    Try again?
                  </Button>
                </div>
              )}
            </div>
          </Tabs.Panel> */}
        {/* <Tabs.Panel id="clippy-panel" label="Ask Clippy"> */}
        {/* {!isLoading && !answer && !hasClippyError && (
          <div className="">
            <div className="mt-2">
              <h2 className="text-sm text-scale-1100">Not sure where to start?</h2>

              <ul className="text-sm mt-4 text-scale-1100 grid md:flex gap-4 flex-wrap max-w-3xl">
                {questions.map((question) => {
                  const key = question.replace(/\s+/g, '_')
                  return (
                    <li key={key}>
                      <button
                        className="hover:bg-slate-400 hover:dark:bg-slate-400 px-4 py-2 bg-slate-300 dark:bg-slate-200 rounded-lg transition-colors"
                        onClick={() => {
                          setQuery(question)
                          handleClippyConfirm(question)
                        }}
                      >
                        {question}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        )} */}

        <div className="flex flex-col gap-6">
          {promptData.map((prompt, i) => {
            if (!prompt.query) return <></>

            return (
              <>
                {prompt.query && (
                  <div className="flex gap-6 mx-4">
                    <div className="w-7 h-7 bg-brand-900 rounded-full border border-brand-800 flex items-center justify-center text-brand-1200">
                      <IconUser strokeWidth={2} size={16} />
                    </div>
                    <div className="prose text-scale-1000">{prompt.query}</div>
                  </div>
                )}

                <div className="px-4">
                  {
                    // cantHelp
                    false ? (
                      <p className="flex flex-col gap-4 items-center p-4">
                        <div className="grid md:flex items-center gap-2 mt-4 text-center justify-items-center">
                          <IconAlertCircle />
                          <p>Sorry, I don&apos;t know how to help with that.</p>
                        </div>
                        {/* <Button size="tiny" type="secondary" onClick={handleResetPrompt}>
                        Try again?
                      </Button> */}
                      </p>
                    ) : (
                      <div className="flex gap-6">
                        <AiIconChat />
                        {/* <div
                      className="w-7 h-7 
                        
                        bg-gradient-to-r from-purple-900 to-pink-900
                        
                        rounded-lg border border-pink-400 flex items-center justify-center
                        shadow-sm
                        "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-4 h-4 text-white"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                        />
                      </svg>
                    </div> */}
                        <div className="w-full">
                          {isLoading && promptIndex === i ? (
                            <div className="bg-scale-700 h-[21px] w-[13px] mt-1 animate-pulse animate-bounce"></div>
                          ) : (
                            <ReactMarkdown
                              linkTarget="_blank"
                              className="prose dark:prose-dark"
                              remarkPlugins={[remarkGfm]}
                              transformLinkUri={(href) => {
                                const supabaseUrl = new URL('https://supabase.com')
                                const linkUrl = new URL(href, 'https://supabase.com')

                                if (linkUrl.origin === supabaseUrl.origin) {
                                  return linkUrl.toString()
                                }

                                return href
                              }}
                              // components={components}
                            >
                              {prompt.answer}
                            </ReactMarkdown>
                          )}
                        </div>
                      </div>
                    )
                  }
                </div>

                {showActions && promptIndex === i + 1 && (
                  <CommandGroup heading="" forceMount className="!pt-0 !pl-[60px]">
                    <CommandItem
                      onSelect={() => {
                        if (!query) {
                          alert("You've selected me")
                        }
                      }}
                      forceMount
                    >
                      <IconCopy className="mr-2" />
                      <span>Copy SQL to clipboard</span>
                    </CommandItem>
                    {promptData.length > 1 && (
                      <CommandItem
                        forceMount
                        onSelect={() => {
                          if (!query) {
                            dispatchPromptData({ type: 'remove-last-item' })
                            setPromptIndex((x) => {
                              return x - 1
                            })
                            // alert('back to previous version')
                          }
                        }}
                      >
                        <IconCopy className="mr-2" />
                        <span>Back to previous version</span>
                      </CommandItem>
                    )}
                    <CommandItem forceMount>
                      <IconCopy className="mr-2" />
                      <span>Run in SQL editor</span>
                    </CommandItem>
                  </CommandGroup>
                )}
              </>
            )
          })}
        </div>

        {promptData.length <= 0 && page === COMMAND_ROUTES.AI_ASK_ANYTHING && (
          <CommandGroup heading="Examples" forceMount>
            {questions.map((question) => {
              const key = question.replace(/\s+/g, '_')
              return (
                <CommandItem
                  onSelect={() => {
                    if (!query) {
                      handleClippyConfirm(question)
                    }
                  }}
                  forceMount
                  key={key}
                >
                  <AiIcon />
                  {question}
                </CommandItem>
              )
            })}
          </CommandGroup>
        )}

        {/* {promptData.length <= 0 && page === COMMAND_ROUTES.AI_RLS_POLICY && (
          <CommandGroup heading="Examples" forceMount>
            {RLSquestions.map((question) => {
              const key = question.replace(/\s+/g, '_')
              return (
                <CommandItem
                  onSelect={() => {
                    if (!query) {
                      handleClippyConfirm(question)
                    }
                  }}
                  forceMount
                  key={key}
                >
                  <AiIcon />
                  {question}
                </CommandItem>
              )
            })}
          </CommandGroup>
        )} */}

        {/* {isLoading && (
          <div className="p-6 grid gap-6 mt-4">
            <Loading active>{}</Loading>
            <p className="text-lg text-center">Searching for results</p>
          </div>
        )} */}
        {hasClippyError && (
          <div className="p-6 flex flex-col items-center gap-6 mt-4">
            <IconAlertTriangle className="text-amber-900" strokeWidth={1.5} size={21} />
            <p className="text-lg text-scale-1200 text-center">
              Sorry, looks like Clippy is having a hard time!
            </p>
            <p className="text-sm text-scale-900 text-center">Please try again in a bit.</p>
            {/* <Button size="tiny" type="secondary" onClick={handleResetPrompt}>
              Try again?
            </Button> */}
          </div>
        )}
        <div className="absolute right-0 top-0 mt-3 mr-4 hidden md:block">
          {/* <Button type="default" size="tiny" onClick={close}>
            esc
          </Button> */}
        </div>
        {/* {!isLoading && answer && (
          <div className="absolute right-0 top-0 mt-3 mr-16 hidden md:block">
            <Button type="text" size="tiny" onClick={handleResetPrompt}>
              Try again
            </Button>
          </div>
        )} */}
      </div>
      <div className="absolute bottom-0 w-full">
        {/* <Input */}
        <Input
          className="bg-scale-100 rounded mx-3"
          autoFocus
          type="textarea"
          placeholder={selectedTab === 'search-panel' ? 'Search documentation' : 'Ask a question'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          // icon={<IconSearch size="small" />}
          onKeyDown={(e) => {
            switch (e.key) {
              case 'Enter':
                if (!query) {
                  return
                }
                handleConfirm(selectedTab, query)
                return
              default:
                return
            }
          }}
        />
        <div className="text-scale-1100 px-3">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-centerp gap-1 py-2 text-scale-800">
              <span>Powered by OpenAI.</span>
            </div>
            <div className="flex items-center gap-6 py-1">
              {status ? (
                <span className="bg-scale-400 rounded-lg py-1 px-2 items-center gap-2 hidden md:flex">
                  {(isLoading || isResponding) && <IconLoader size={14} className="animate-spin" />}
                  {status}
                </span>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { AiCommand }
