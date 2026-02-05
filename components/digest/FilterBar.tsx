'use client'

import { Category, Tag, Author } from '@/lib/hive'
import { useRouter, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'
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
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-4">
                    <Select
                        value={activeCategory || 'all'}
                        onValueChange={(value) =>
                            updateFilter(
                                'category',
                                value === 'all' ? null : value
                            )
                        }
                    >
                        <SelectTrigger className="h-11 w-[180px] border-neutral-700 bg-neutral-800 text-base">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent className="border-neutral-700 bg-neutral-900">
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
                            updateFilter(
                                'author',
                                value === 'all' ? null : value
                            )
                        }
                    >
                        <SelectTrigger className="h-11 w-[180px] border-neutral-700 bg-neutral-800 text-base">
                            <SelectValue placeholder="Author" />
                        </SelectTrigger>
                        <SelectContent className="border-neutral-700 bg-neutral-900">
                            <SelectItem value="all">All Authors</SelectItem>
                            {authors.map((author) => (
                                <SelectItem key={author.id} value={author.id}>
                                    {author.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="default"
                        onClick={clearFilters}
                        className="gap-2 text-sm text-neutral-400 hover:text-white"
                    >
                        <X size={16} />
                        Clear filters
                    </Button>
                )}
            </div>

            {activeTags && (
                <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-neutral-800 pt-4">
                    <span className="text-sm font-medium text-neutral-500">
                        Active:
                    </span>
                    {activeTags.split(',').map((tagSlug) => {
                        const tag = tags.find((t) => t.slug === tagSlug)
                        if (!tag) return null
                        return (
                            <Badge
                                key={tagSlug}
                                variant="outline"
                                className="border-primary text-primary hover:bg-primary/10 h-8 cursor-pointer gap-2 px-3 text-sm"
                                onClick={() => {
                                    const newTags = activeTags
                                        .split(',')
                                        .filter((t) => t !== tagSlug)
                                        .join(',')
                                    updateFilter('tags', newTags || null)
                                }}
                            >
                                {tag.name}
                                <X size={14} />
                            </Badge>
                        )
                    })}
                </div>
            )}

            {tags.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-neutral-800 pt-4">
                    <span className="mr-2 text-sm font-medium text-neutral-500">
                        Tags:
                    </span>
                    {tags.slice(0, 6).map((tag) => {
                        const isActive = activeTags
                            ?.split(',')
                            .includes(tag.slug)
                        return (
                            <Badge
                                key={tag.slug}
                                variant="outline"
                                className={`h-8 cursor-pointer px-3 text-sm transition ${
                                    isActive
                                        ? 'border-primary text-primary'
                                        : 'border-neutral-700 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200'
                                }`}
                                onClick={() => {
                                    if (isActive) {
                                        const newTags = activeTags
                                            ?.split(',')
                                            .filter((t) => t !== tag.slug)
                                            .join(',')
                                        updateFilter('tags', newTags || null)
                                    } else {
                                        const currentTags = activeTags
                                            ? activeTags.split(',')
                                            : []
                                        updateFilter(
                                            'tags',
                                            [...currentTags, tag.slug].join(',')
                                        )
                                    }
                                }}
                            >
                                {tag.name}
                            </Badge>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
