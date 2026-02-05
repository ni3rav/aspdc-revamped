import { hive } from '@/lib/hive'
import { FilterBar } from './FilterBar'

interface FilterBarWrapperProps {
    searchParams: Promise<{
        category?: string
        tags?: string
        author?: string
        page?: string
    }>
}

export async function FilterBarWrapper({
    searchParams,
}: FilterBarWrapperProps) {
    const params = await searchParams

    const [categories, tags, authors] = await Promise.all([
        hive.listCategories(),
        hive.listTags(),
        hive.listAuthors(),
    ])

    return (
        <FilterBar
            categories={categories}
            tags={tags}
            authors={authors}
            activeCategory={params.category}
            activeTags={params.tags}
            activeAuthor={params.author}
        />
    )
}
