import {useEffect, useState} from 'react'
import Link from 'next/link'
import { Button } from 'ui'
import {getDomain} from "../../lib/helpers";

export default function EmptyPageState({ error }: any) {
  const [cloudDomain, setCloudDomain] = useState('')

  useEffect(() => {
    setCloudDomain(getDomain())
    console.error('Error', error)
  }, [])

  return (
    <div className="mx-auto flex h-full w-full flex-col items-center justify-center space-y-6">
      <div className="flex w-[320px] flex-col items-center justify-center space-y-3">
        <h4 className="text-lg">出了点问题 🤕</h4>
        <p className="text-center text-sm text-scale-1100">
          很抱歉，请稍后重试，如果问题仍然存在，请随时与我们联系。
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <Link href={ cloudDomain }>
          <a>
            <Button>返回</Button>
          </a>
        </Link>
        <Link href="https://community.memfiredb.com/category/2/memfiredb%E7%94%A8%E6%88%B7%E9%97%AE%E7%AD%94">
          <a>
            <Button type="secondary">反馈问题</Button>
          </a>
        </Link>
      </div>
      <p className="text-sm text-scale-1100 text-center">
        Error: [{error?.code}] {error?.message}
      </p>
    </div>
  )
}
