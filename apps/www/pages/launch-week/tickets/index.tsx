import { NextSeo } from 'next-seo'
import { GetServerSideProps } from 'next'
import DefaultLayout from '~/components/Layouts/Default'
import SectionContainer from '~/components/Layouts/SectionContainer'
import { SITE_ORIGIN, SITE_URL } from '~/lib/constants'
import { createClient } from '@supabase/supabase-js'
import { useEffect, useRef, useState } from 'react'
import { LaunchWeekLogoHeader } from '~/components/LaunchWeek/LaunchSection/LaunchWeekLogoHeader'
import { motion } from 'framer-motion'
import { UserData } from '~/components/LaunchWeek/Ticket/hooks/use-conf-data'
import LW7BgGraphic from '../../../components/LaunchWeek/LW7BgGraphic'
import CTABanner from '../../../components/CTABanner'
import { debounce } from 'lodash'
import TicketsGrid from '../../../components/LaunchWeek/Ticket/TicketsGrid'

interface Props {
  users: UserData[]
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321',
  process.env.SUPABASE_SERVICE_ROLE_SECRET ??
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_SECRET ??
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9idWxkYW5ycHRsb2t0eGNmZnZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njk3MjcwMTIsImV4cCI6MTk4NTMwMzAxMn0.SZLqryz_-stF8dgzeVXmzZWPOqdOrBwqJROlFES8v3I'
)

export const getPagination = (page: number = 1, size: number) => {
  const limit = size ? +size : 3
  const from = page ? page * limit : 0
  const to = page ? from + size : size

  return { from, to }
}

const loadUsers = async (offset = 0, pageCount: number) => {
  const { from, to } = getPagination(offset, pageCount)

  return await supabaseAdmin!
    .from('lw7_tickets_golden')
    .select('*')
    .range(from, to - 1)
    .order('createdAt', { ascending: false })
}

export default function TicketsPage({ users }: Props) {
  const ref = useRef(null)
  const PAGE_COUNT = 20
  const STORAGE_URL = 'https://obuldanrptloktxcffvn.supabase.co/storage/v1/object/public/images/lw7'
  const description = 'Supabase Launch Week 7 | 3-7 April 2023'
  const [isLoading, setIsLoading] = useState(false)
  const [offset, setOffset] = useState(1)
  const [isLast, setIsLast] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [loadedUsers, setLoadedUsers] = useState<any[]>(users)

  useEffect(() => {
    loadMoreUsers(offset)
  }, [hasLoaded])

  const loadMoreUsers = async (offset: number) => {
    if (isLast) return
    setOffset((prev) => prev + 1)
    setIsLoading(true)
    const { data: users } = await loadUsers(offset, PAGE_COUNT)
    console.log(`loaded users (offset ${offset}): `, users)
    setLoadedUsers((prevUsers) => [...prevUsers, ...(users as any[])])
    setIsLoading(false)
    if ((users as any[]).length < PAGE_COUNT) setIsLast(true)
  }

  const getOgUrl = (username: string) => `${STORAGE_URL}/tickets/gallery/${username}.png`

  useEffect(() => {
    document.body.className = 'dark bg-[#1C1C1C]'
  }, [])

  const isBottomInView = () => {
    if (ref.current && window) {
      const rect = (ref.current as HTMLDivElement)?.getBoundingClientRect()
      const isInView = rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
      setHasLoaded((prev) => !prev && isInView)
    }
  }

  useEffect(() => {
    window.addEventListener(
      'scroll',
      debounce(() => !isLast && isBottomInView(), 500)
    )

    return () => {
      window.removeEventListener('scroll', isBottomInView)
    }
  }, [])

  const finalAnimationState = { y: 0, opacity: 1 }

  return (
    <>
      <NextSeo
        title={`#SupaLaunchWeek Tickets`}
        openGraph={{
          title: `#SupaLaunchWeek Tickets`,
          description: description,
          url: `${SITE_URL}/tickets`,
          images: [
            {
              url: `${SITE_ORIGIN}/images/launchweek/seven/launch-week-7-teaser.jpg`,
            },
          ],
        }}
      />
      <DefaultLayout>
        <div className="bg-[#1C1C1C] -mt-20">
          <div className="relative bg-lw7 pt-20">
            <div className="relative z-10">
              <SectionContainer className="flex flex-col justify-around items-center !py-4 md:!py-8 gap-2 md:gap-4 !px-2 !mx-auto h-auto">
                <LaunchWeekLogoHeader />
              </SectionContainer>
              <LW7BgGraphic />
            </div>
            <div className="bg-lw7-gradient absolute inset-0 z-0" />
          </div>
          <SectionContainer className="z-10 -mt-60 md:-mt-[500px] max-w-none overflow-hidden">
            <div className="text-center relative z-10 text-white">
              <motion.div
                className="max-w-[38rem] mx-auto px-4 flex flex-col items-center gap-4"
                initial={{ y: -20, opacity: 0 }}
                whileInView={finalAnimationState}
                viewport={{ once: true, margin: '-150px' }}
                transition={{ type: 'spring', bounce: 0, delay: 0.2 }}
              >
                <h2 className="text-4xl">
                  Check out <span className="gradient-text-pink-500">all the tickets</span>
                </h2>
                <p className="radial-gradient-text-scale-500">
                  Mark your calendars for April 16th and join us on Discord for Launch Week 7's
                  final day to find out if you're one of the lucky winners. Get sharing!
                </p>
              </motion.div>
            </div>
            <div ref={ref}>
              <TicketsGrid loadedUsers={loadedUsers} isLoading={isLoading} />
            </div>
          </SectionContainer>
        </div>
        <CTABanner />
      </DefaultLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const { data: users } = await supabaseAdmin!
    .from('lw7_tickets_golden')
    .select('*')
    .order('createdAt', { ascending: false })
    .limit(20)

  return {
    props: {
      users,
    },
  }
}
