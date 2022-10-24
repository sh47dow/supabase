import { NextPage } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from 'ui'
import { observer } from 'mobx-react-lite'

import { useStore } from 'hooks'

const Error500: NextPage = ({}) => {
  const { ui } = useStore()
  const { theme } = ui

  return (
    <div className="relative mx-auto flex h-full w-full flex-col items-center justify-center space-y-6">
      <div className="absolute top-0 mx-auto w-full max-w-7xl px-8 pt-6 sm:px-6 lg:px-8">
        <nav className="relative flex items-center justify-between sm:h-10">
          <div className="flex flex-shrink-0 flex-grow items-center lg:flex-grow-0">
            <div className="flex w-full items-center justify-between md:w-auto">
              <a href="/projects">
                <Image
                  src={theme == 'dark' ? '/img/supabase-dark.svg' : '/img/supabase-light.svg'}
                  alt=""
                  height={24}
                  width={120}
                />
              </a>
            </div>
          </div>
        </nav>
      </div>
      <div className="flex w-[320px] flex-col items-center justify-center space-y-3">
        <h4 className="text-lg">Something went wrong 🤕</h4>
        <p className="text-center">
          Sorry about that, please try again later or feel free to reach out to us if the problem
          persists.
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/projects">
          <a>
            <Button>Head back</Button>
          </a>
        </Link>
        <Link href="/support/new">
          <a>
            <Button type="secondary">Submit a support request</Button>
          </a>
        </Link>
      </div>
    </div>
  )
}

export default observer(Error500)
