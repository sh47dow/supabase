import { createClient } from '@supabase/supabase-js'
import { IconArrowRight, IconSearch, Input, Select } from '@supabase/ui'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import { useRouter } from 'next/router'
import DefaultLayout from '~/components/Layouts/Default'
import SectionContainer from '~/components/Layouts/SectionContainer'
import BecomeAPartner from '~/components/Partners/BecomeAPartners'
import PartnerLinkBox from '~/components/Partners/PartnerLinkBox'
import { Partner } from '~/types/partners'
import TileGrid from '../../../components/Partners/TileGrid'

const supabase = createClient(
  'https://obuldanrptloktxcffvn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNzY1NjAxNSwiZXhwIjoxOTUzMjMyMDE1fQ.0sfp_Njf7l4g-nOCF5a1TQE11rPqtz8Y10uctIetkBA'
)

export async function getStaticProps() {
  const { data: partners } = await supabase
    .from<Partner>('partners')
    .select('*')
    .eq('approved', true)
    .eq('type', 'expert')
    .order('category')
    .order('title')

  return {
    props: {
      partners,
    },
    revalidate: 18000, // In seconds - refresh every 5 hours
  }
}

interface Props {
  partners: Partner[]
}

function ExpertPartnersPage(props: Props) {
  const { partners } = props
  const partnersByCategory: { [category: string]: Partner[] } = {}
  partners.map(
    (p) => (partnersByCategory[p.category] = [...(partnersByCategory[p.category] ?? []), p])
  )
  const router = useRouter()

  const meta_title = 'Works With Supabase'
  const meta_description = `Find Integration Partners and Expert Services that work with Supabase.`

  return (
    <>
      <NextSeo
        title={meta_title}
        description={meta_description}
        openGraph={{
          title: meta_title,
          description: meta_description,
          url: `https://supabase.com/partners/experts`,
          images: [
            {
              url: `https://supabase.com${router.basePath}/images/product/database/database-og.jpg`, // TODO
            },
          ],
        }}
      />
      <DefaultLayout>
        <SectionContainer className="space-y-12">
          <div>
            <h1 className="h1">Find an Expert</h1>
            <h2 className="text-xl text-scale-900">
              Extend and automate your workflow by using integrations for your favorite tools.
            </h2>
          </div>
          <div className="grid grid-cols-12 lg:gap-16 xl:gap-32">
            <div className="col-span-3">
              {/* Horizontal link menu */}
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="space-y-4">
                  <div className="text-sm text-scale-900 mb-2">Explore more</div>
                  <PartnerLinkBox
                    title="Integrations"
                    color="blue"
                    description="Extend and automate your workflow by using integrations for your favorite tools."
                    href={`/partners/integrations`}
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="1"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                        />
                      </svg>
                    }
                  />
                  <PartnerLinkBox
                    title="Become a partner"
                    color="brand"
                    description="Experts in supabase"
                    href={`/partners/experts`}
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="1"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    }
                  />
                </div>
              </div>
            </div>
            <div className="col-span-9">
              {/* Partner Tiles */}
              <div className="grid">
                {partners.length ? (
                  <TileGrid partnersByCategory={partnersByCategory} hideCategories={true} />
                ) : (
                  <h2 className="h2">No Partners Found</h2>
                )}
              </div>
            </div>
          </div>

          {/* Become a partner form */}
          <BecomeAPartner supabase={supabase} />
        </SectionContainer>
      </DefaultLayout>
    </>
  )
}

export default ExpertPartnersPage
