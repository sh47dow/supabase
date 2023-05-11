import {IconChevronRight, IconLoader} from "ui";
import React from "react";
type breadcrumbProps = {
    breadcrumbs: string[],
    selectBreadcrumb: (index: number) => void
    className: string
}

const HeaderBreadcrumbs = (props: breadcrumbProps) => {
    // Max 5 crumbs, otherwise replace middle segment with ellipsis and only
    // have the first 2 and last 2 crumbs visible
    const {breadcrumbs, selectBreadcrumb, className} = props
    const ellipsis = '...'
    const breadcrumbsWithIndexes = breadcrumbs.map((name, index) => {
        return { name, index }
    })

    const formattedBreadcrumbs =
        breadcrumbsWithIndexes.length <= 5
            ? breadcrumbsWithIndexes
            : breadcrumbsWithIndexes
                .slice(0, 2)
                .concat([{ name: ellipsis, index: -1 }])
                .concat(
                    breadcrumbsWithIndexes.slice(
                        breadcrumbsWithIndexes.length - 2,
                        breadcrumbsWithIndexes.length
                    )
                )

    return (
        <div className={["ml-3 flex items-center", className].join(' ')}>
            {formattedBreadcrumbs.map((crumb, idx) => (
                <div className="flex items-center" key={crumb.name}>
                    {idx !== 0 && <IconChevronRight size={10} strokeWidth={2} className="mx-3" />}
                    <p
                        key={crumb.name}
                        className={`truncate text-sm ${crumb.name !== ellipsis ? 'cursor-pointer' : ''}`}
                        style={{ maxWidth: '6rem' }}
                        onClick={() => (crumb.name !== ellipsis ? selectBreadcrumb(crumb.index) : {})}
                    >
                        {crumb.name}
                    </p>
                </div>
            ))}
        </div>
    )
}

export default HeaderBreadcrumbs
