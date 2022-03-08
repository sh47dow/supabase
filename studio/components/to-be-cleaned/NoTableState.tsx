import { FC } from 'react'
import { useRouter } from 'next/router'
import ProductEmptyState from './ProductEmptyState'

interface Props {
  message: string
}

const NoTableState: FC<Props> = ({ message }) => {
  const router = useRouter()
  const { ref } = router.query

  return (
    <ProductEmptyState
      title="No public tables found"
      ctaButtonLabel="Create a new table"
      onClickCta={() => {
        router.push(`/project/${ref}/editor`)
      }}
    >
      <p className="text-sm text-scale-1100">{message}</p>
    </ProductEmptyState>
  )
}

export default NoTableState
