import { writeFileSync } from 'fs'
import { globby } from 'globby'
import prettier from 'prettier'

/*
 * kudos to leerob from vercel
 * https://leerob.io/blog/nextjs-sitemap-robots
 */

async function generate() {
  const prettierConfig = await prettier.resolveConfig('./.prettierrc.js')
  const pages = await globby([
    'pages/*.js',
    'pages/*.tsx',
    'pages/*/*.tsx',
    'data/**/*.mdx',
    '_blog/*.mdx',
    '_case-studies/*.mdx',
    '_customers/*.mdx',
    '_alternatives/*.mdx',
    '!pages/index.tsx',
    '!data/*.mdx',
    '!pages/_*.js',
    '!pages/*/index.tsx',
    '!pages/api',
    '!pages/404.js',
    //get the generated partner pages
    '.next/server/pages/partners/*.html',
  ])

  const blogUrl = 'blog'
  const caseStudiesUrl = 'case-studies'
  const customerStoriesUrl = 'customers'

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${pages
          .filter((page) => !page.includes('_document.tsx'))
          .map((page) => {
            const path = page
              //replace the path for the generated partner pages
              .replace('.next/server/pages/partners/', '/partners/')
              .replace('pages', '')
              // add a `/` for blog posts
              .replace('_blog', `/${blogUrl}`)
              .replace('_case-studies', `/${caseStudiesUrl}`)
              .replace('_customers', `/${customerStoriesUrl}`)
              .replace('_alternatives', '/alternatives')
              .replace('.tsx', '')
              .replace('.mdx', '')
              .replace('.html', '')
              // replace the paths for nested 'index' based routes
              .replace('/auth/Auth', '/auth')
              .replace('/database/Database', '/database')
              .replace('/storage/Storage', '/storage')
              .replace('/realtime/Realtime', '/realtime')
              .replace('/edge-functions/edge-functions', '/edge-functions')
              .replace('/nextjs/Nextjs', '/nextjs')

            let route = path === '/index' ? '' : path

            if (route === '/alternatives/[slug]') return null
            if (route === '/partners/[slug]') return null
            if (route === '/case-studies/[slug]') return null
            if (route === '/customers/[slug]') return null
            if (route === '/launch-week/ticket-image') return null

            /**
             * Blog based urls
             * handle removal of dates in filename
             */
            if (route.includes(`/${blogUrl}/`)) {
              /**
               * remove directory from route
               */
              const _route = route.replace(`/${blogUrl}/`, '')
              /**
               * remove the date from the file name
               */
              const substring = _route.substring(11)
              /**
               * reconsruct the route
               */
              route = `/${blogUrl}/` + substring
            }

            return `
              <url>
                  <loc>${`https://supabase.com${route}`}</loc>
                  <changefreq>weekly</changefreq>
                  <changefreq>0.5</changefreq>
              </url>
            `
          })
          .join('')}
    </urlset>
    `

  const formatted = prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html',
  })

  // eslint-disable-next-line no-sync
  writeFileSync('public/sitemap_www.xml', formatted)
}

generate()
