import styles from './ticket-visual.module.css'
import TicketProfile from './TicketProfile'
import TicketNumber from './TicketNumber'
// import TicketMono from './ticket-mono'
// import TicketMonoMobile from './ticket-mono-mobile'
import Tilt from 'vanilla-tilt'
import useConfData from '~/components/LaunchWeek/Ticket/hooks/use-conf-data'
import TicketHeader from './TicketHeader'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type TicketGenerationState = 'default' | 'loading'
type Props = {
  size?: number
  name?: string
  ticketNumber?: number
  bgImageId?: number
  username?: string
  ticketGenerationState?: TicketGenerationState
  setTicketGenerationState?: any
  golden?: boolean
}

export default function TicketVisual({
  size = 1,
  name,
  username,
  bgImageId,
  ticketNumber,
  ticketGenerationState = 'default',
  setTicketGenerationState,
  golden = false,
}: Props) {
  const { session } = useConfData()
  const [imageIsLoading, setImageIsLoading] = useState(true)
  const ticketRef = useRef<HTMLDivElement>(null)
  const storageBaseFilepath = `https://obuldanrptloktxcffvn.supabase.co/storage/v1/object/public/images/lw7/tickets_bg`

  const ticketBg = {
    regular: {
      image: `${storageBaseFilepath}/_jpg/reg_bg_${bgImageId}.jpg`,
      overlay: `/images/launchweek/seven/ticket-overlay-reg.png`,
    },
    gold: {
      image: `${storageBaseFilepath}/golden/_jpg/gold_bg_${bgImageId}.jpg`,
      overlay: `/images/launchweek/seven/ticket-overlay-gold.png`,
    },
  }

  useEffect(() => {
    if (ticketRef.current && !window.matchMedia('(pointer: coarse)').matches) {
      Tilt.init(ticketRef.current, {
        glare: !golden,
        max: 4,
        gyroscope: true,
        'max-glare': 0.3,
        'full-page-listening': true,
      })
    }
  }, [ticketRef])

  return (
    <div className="flex relative flex-col w-[300px] md:w-full md:max-w-none h-auto">
      <div
        ref={ticketRef}
        className={[
          styles.visual,
          golden ? styles['visual--gold'] : '',
          session ? styles['visual--logged-in'] : '',
          !golden && 'overflow-hidden',
          'flex relative flex-col justify-between w-full pt-[150%] md:pt-[50%] before:rounded-2xl h-0 box-border',
        ].join(' ')}
        style={{
          ['--size' as string]: size,
        }}
        id="wayfinding--ticket-visual-inner-container"
      >
        <div className="absolute inset-0 h-[calc(100%-100px)] z-10 flex flex-col items-center justify-between w-full md:h-full flex-1 md:pl-[6%] md:pr-[15%] overflow-hidden">
          {username && <TicketHeader />}
          <div
            className="flex-1 w-full h-full md:h-auto flex py-6 md:py-4 flex-col justify-center"
            id="wayfinding--TicketProfile-container"
          >
            <TicketProfile
              name={name}
              username={username}
              size={size}
              ticketGenerationState={ticketGenerationState}
              setTicketGenerationState={setTicketGenerationState}
              golden={golden}
            />
          </div>
        </div>
        <TicketNumber number={ticketNumber} />
        <div
          id="wayfinding--ticket-dynamic-bg-image"
          className="absolute inset-0 z-0 rounded-2xl overflow-hidden"
        >
          {username && (
            <Image
              src={golden ? ticketBg.gold.overlay : ticketBg.regular.overlay}
              layout="fill"
              objectFit="cover"
              placeholder="blur"
              blurDataURL="/images/blur.png"
              className="absolute inset-[1px] z-[1] "
            />
          )}

          <Image
            src={golden ? ticketBg.gold.image : ticketBg.regular.image}
            layout="fill"
            objectFit="cover"
            placeholder="blur"
            blurDataURL="/images/blur.png"
            className={[
              'duration-700 ease-in-out transform scale-105',
              imageIsLoading ? 'grayscale blur-2xl scale-110' : 'grayscale-0 blur-0',
            ].join(' ')}
            onLoadingComplete={() => setImageIsLoading(false)}
          />
        </div>
      </div>
    </div>
  )
}
