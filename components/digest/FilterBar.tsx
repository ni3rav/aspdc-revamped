'use client'

import { Category, Tag, Author } from '@/lib/hive'
import { useRouter, useSearchParams } from 'next/navigation'
import { X, Filter } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface FilterBarProps {
    categories: Category[]
    tags: Tag[]
    authors: Author[]
    activeCategory?: string
    activeTags?: string
    activeAuthor?: string
}

export function FilterBar({
    categories,
    tags,
    authors,
    activeCategory,
    activeTags,
    activeAuthor,
}: FilterBarProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const updateFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        params.delete('page')
        router.push(`/digest?${params.toString()}`)
    }

    const clearFilters = () => {
        router.push('/digest')
    }

    const hasActiveFilters = activeCategory || activeTags || activeAuthor

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-neutral-400">
                    <Filter size={16} />
                    <span className="text-sm font-medium">Filters:</span>
                </div>

                <Select
                    value={activeCategory || 'all'}
                    onValueChange={(value) =>
                        updateFilter('category', value === 'all' ? null : value)
                    }
                >
                    <SelectTrigger className="w-[160px] border-white/20 bg-neutral-900/50 text-sm">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="border-white/20 bg-neutral-900">
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.slug} value={cat.slug}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={activeAuthor || 'all'}
                    onValueChange={(value) =>
                        updateFilter('author', value === 'all' ? null : value)
                    }
                >
                    <SelectTrigger className="w-[160px] border-white/20 bg-neutral-900/50 text-sm">
                        <SelectValue placeholder="Author" />
                    </SelectTrigger>
                    <SelectContent className="border-white/20 bg-neutral-900">
                        <SelectItem value="all">All Authors</SelectItem>
                        {authors.map((author) => (
                            <SelectItem key={author.id} value={author.id}>
                                {author.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-neutral-400 hover:text-white"
                    >
                        <X size={14} className="mr-1" />
                        Clear
                    </Button>
                )}
            </div>

            {activeTags && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-neutral-500">Tags:</span>
                    {activeTags.split(',').map((tagSlug) => {
                        const tag = tags.find((t) => t.slug === tagSlug)
                        if (!tag) return null
                        return (
                            <Badge
                                key={tagSlug}
                                variant="outline"
                                className="border-primary/30 text-primary hover:bg-primary/10 cursor-pointer gap-1"
                                onClick={() => {
                                    const newTags = activeTags
                                        .split(',')
                                        .filter((t) => t !== tagSlug)
                                        .join(',')
                                    updateFilter('tags', newTags || null)
                                }}
                            >
                                {tag.name}
                                <X size={12} />
                            </Badge>
                        )
                    })}
                </div>
            )}

            {tags.length > 0 && !activeTags && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-neutral-500">Popular:</span>
                    {tags.slice(0, 8).map((tag) => (
                        <Badge
                            key={tag.slug}
                            variant="outline"
                            className="cursor-pointer border-white/20 text-xs text-neutral-400 transition hover:border-white/40 hover:text-white"
                            onClick={() => {
                                const currentTags = activeTags
                                    ? activeTags.split(',')
                                    : []
                                if (!currentTags.includes(tag.slug)) {
                                    updateFilter(
                                        'tags',
                                        [...currentTags, tag.slug].join(',')
                                    )
                                }
                            }}
                        >
                            {tag.name}
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    )
}
