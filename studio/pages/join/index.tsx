import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button, IconCheckSquare } from '@supabase/ui'

import { useProfile, useStore } from 'hooks'
import { auth } from 'lib/gotrue'
import { API_URL } from 'lib/constants'
import { get, post, delete_ } from 'lib/common/fetch'

interface ITokenInfo {
  organization_name?: string | undefined
  token_does_not_exist?: boolean
  email_match?: boolean
  authorized_user?: boolean
  expired_token?: boolean
  invite_id?: number
}

type TokenInfo = ITokenInfo | undefined

const JoinOrganizationPage = () => {
  const router = useRouter()
  const { slug, token } = router.query
  const { ui, app } = useStore()
  const { profile } = useProfile()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tokenValidationInfo, setTokenValidationInfo] = useState<TokenInfo>(undefined)
  const [tokenInfoLoaded, setTokenInfoLoaded] = useState(false)
  const {
    token_does_not_exist,
    email_match,
    authorized_user,
    expired_token,
    organization_name,
    invite_id,
  } = tokenValidationInfo || {}

  const loginRedirectLink = `/?next=${encodeURIComponent(`/join?token=${token}&slug=${slug}`)}`

  useEffect(() => {
    const fetchTokenInfo = async () => {
      await ui.load()

      const response = await get(`${API_URL}/organizations/${slug}/members/join?token=${token}`)
      if (response.error && response.error.code === 401) {
        setTokenValidationInfo({
          authorized_user: false,
        })
      } else {
        setTokenInfoLoaded(true)
        setTokenValidationInfo(response)
      }
    }

    if (token && !tokenInfoLoaded) {
      fetchTokenInfo()
    }
  }, [token])

  async function handleJoinOrganization() {
    setIsSubmitting(true)
    const response = await post(`${API_URL}/organizations/${slug}/members/join?token=${token}`, {})
    if (response.error) {
      ui.setNotification({
        category: 'error',
        message: `Failed to join organization: ${response.error.message}`,
      })
      setIsSubmitting(false)
    } else {
      setIsSubmitting(false)
      app.organizations.load()
      router.push('/')
    }
  }

  async function handleDeclineJoinOrganization() {
    setIsSubmitting(true)
    const response = await delete_(
      `${API_URL}/organizations/${slug}/members/invite?invited_id=${invite_id}`,
      {}
    )
    if (response.error) {
      ui.setNotification({
        category: 'error',
        message: `Failed to decline invitation: ${response.error.message}`,
      })
      setIsSubmitting(false)
    } else {
      setIsSubmitting(false)
      router.push('/')
    }
  }

  const isError =
    !!(tokenInfoLoaded && token_does_not_exist) ||
    (tokenInfoLoaded && !email_match) ||
    (tokenInfoLoaded && expired_token)

  const ErrorMessage = () => {
    const message = token_does_not_exist ? (
      <>
        <p>The invite token is invalid.</p>
        <p className="text-scale-900">
          Try copying and pasting the link from the invite email, or ask the organization owner to
          invite you again.
        </p>
      </>
    ) : !email_match ? (
      <>
        <p>
          Your email address {profile?.primary_email} does not match the email address this
          invitation was sent to.
        </p>
        <p className="text-scale-900">
          To accept this invitation, you will need to{' '}
          <a
            className="text-brand-900 cursor-pointer"
            onClick={async () => {
              await auth.signOut()
              router.reload()
            }}
          >
            sign out
          </a>{' '}
          and then sign in or create a new account using the same email address used in the
          invitation.
        </p>
      </>
    ) : expired_token ? (
      <>
        <p>The invite token has expired.</p>
        <p className="text-scale-900">Please request a new one from the organization member.</p>
      </>
    ) : (
      ''
    )

    return (
      <div
        className={[
          'flex flex-col items-center justify-center gap-3 text-sm',
          isError ? 'text-scale-1100' : 'text-scale-1200',
        ].join(' ')}
      >
        {message}
      </div>
    )
  }

  return (
    <div
      className={[
        'bg-scale-200 flex h-full min-h-screen',
        'w-full flex-col place-items-center',
        'items-center justify-center gap-8 px-5',
      ].join(' ')}
    >
      <Link href="/">
        <a className="flex items-center justify-center gap-4">
          <img
            src="/img/supabase-logo.svg"
            alt="Supabase"
            className="block h-[24px] cursor-pointer rounded"
          />
        </a>
      </Link>
      <div
        className="
          bg-scale-300 border-scale-400 mx-auto overflow-hidden
          rounded-md border text-center shadow
          md:w-[400px]
          "
      >
        <div className="flex flex-col gap-2 px-6 py-8">
          {!token_does_not_exist ? (
            <>
              <p className="text-scale-1200 text-sm">You have been invited to join </p>
              {organization_name ? (
                <>
                  <p className="text-scale-1200 text-3xl">
                    {organization_name ? `${organization_name}` : 'an organization'}{' '}
                  </p>
                  <p className="text-scale-900 text-sm">an organization on Supabase</p>
                </>
              ) : (
                <>
                  <p className="text-scale-1200 text-3xl">an organization</p>
                </>
              )}
            </>
          ) : (
            <div className="w-96"></div>
          )}
        </div>

        <div
          className={['border-scale-400 border-t', isError ? 'bg-sand-100' : 'bg-transparent'].join(
            ' '
          )}
        >
          <div className="flex flex-col gap-4 px-6 py-4 ">
            {authorized_user && !expired_token && email_match && tokenInfoLoaded && (
              <div className="flex flex-row items-center justify-center gap-3">
                <Button onClick={handleDeclineJoinOrganization} htmlType="submit" type="default">
                  Decline
                </Button>
                <Button
                  onClick={handleJoinOrganization}
                  htmlType="submit"
                  loading={isSubmitting}
                  type="primary"
                  icon={<IconCheckSquare />}
                >
                  Join organization
                </Button>
              </div>
            )}

            {tokenInfoLoaded && <ErrorMessage />}

            {!authorized_user && (
              <div className="flex flex-col gap-3">
                <p className="text-scale-900 text-xs">
                  You will need to sign in to accept this invitation
                </p>
                <div className="flex justify-center gap-3">
                  <Link passHref href={loginRedirectLink}>
                    <Button as="a" type="default">
                      Sign in
                    </Button>
                  </Link>
                  <Link passHref href={loginRedirectLink}>
                    <Button as="a" type="default">
                      Create an account
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JoinOrganizationPage
