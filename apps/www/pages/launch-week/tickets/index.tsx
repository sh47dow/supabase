import { NextSeo } from 'next-seo'
import DefaultLayout from '~/components/Layouts/Default'
import SectionContainer from '~/components/Layouts/SectionContainer'
import TicketContainer from '~/components/LaunchWeek/Ticket/TicketContainer'
import { SITE_ORIGIN, SITE_URL } from '~/lib/constants'
import { useRouter } from 'next/router'
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import CTABanner from '../../../components/CTABanner'

export default function TicketHome() {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const description = 'Supabase Launch Week 7 | 3-7 April 2023'
  const { query } = useRouter()
  const ticketNumber = query.ticketNumber?.toString()
  const defaultUserData = {
    id: query.id?.toString(),
    ticketNumber: ticketNumber ? parseInt(ticketNumber, 10) : undefined,
    name: query.name?.toString(),
    username: query.username?.toString(),
  }

  useEffect(() => {
    if (!supabase) {
      setSupabase(
        createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
      )
    }
  }, [])

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        setSession(session)
      })

      return () => subscription.unsubscribe()
    }
  }, [supabase])

  useEffect(() => {
    document.body.className = 'dark bg-[#1C1C1C]'
  }, [])

  return (
    <>
      <NextSeo
        title={`Get your #SupaLaunchWeek Ticket`}
        openGraph={{
          title: `Get your #SupaLaunchWeek Ticket`,
          description: description,
          url: `${SITE_URL}/tickets`,
          images: [
            {
              url: `${SITE_ORIGIN}/images/launchweek/seven/launch-week-7.jpg`,
            },
          ],
        }}
      />
      <DefaultLayout>
        <SectionContainer className="flex flex-col gap-16">
          <div className="flex flex-col gap-3 items-center justify-center xl:justify-start">
            <img
              src="/images/launchweek/launchweek-logo--light.svg"
              className="flex w-40 dark:hidden lg:w-80"
            />
            <img
              src="/images/launchweek/launchweek-logo--dark.svg"
              className="hidden w-40 dark:flex lg:w-80"
            />
            <p className="text-scale-1100 text-sm">Dec 12 - 16 at 8 AM PT | 11 AM ET</p>
          </div>

          {supabase && (
            <TicketContainer
              supabase={supabase}
              session={session}
              defaultUserData={defaultUserData}
              defaultPageState="ticket"
            />
          )}
        </SectionContainer>
        <CTABanner />
      </DefaultLayout>
    </>
  )
}
