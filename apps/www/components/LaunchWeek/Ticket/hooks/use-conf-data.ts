import { Session, SupabaseClient } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'

export type PageState = 'registration' | 'ticket'

export type UserData = {
  id?: string
  ticketNumber?: number
  username?: string
  name?: string
  golden?: boolean
  referrals?: number
  sharedOnTwitter?: string
  sharedOnLinkedIn?: string
}

type ConfDataContextType = {
  supabase: SupabaseClient
  session: Session | null
  userData: UserData
  setUserData: React.Dispatch<React.SetStateAction<UserData>>
  setPageState: React.Dispatch<React.SetStateAction<PageState>>
}

export const ConfDataContext = createContext<ConfDataContextType | null>(null)

export default function useConfData() {
  const result = useContext(ConfDataContext)
  console.log('result', result)
  if (!result) {
    throw new Error()
  }
  return result
}
