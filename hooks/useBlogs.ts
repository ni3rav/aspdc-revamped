import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchBlogs } from '@/db/queries'
import { addBlog, deleteBlog, updateBlog } from '@/db/mutations'
import { toast } from 'sonner'
import { Blog, NewBlog } from '@/db/types'

export function useBlogs() {
    return useQuery({
        queryKey: ['fetch-blogs'],
        queryFn: fetchBlogs,
    })
}

export function useAddBlog() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (blog: NewBlog) => addBlog(blog),
        onSuccess: () => {
            toast.success('Blog added successfully')
            queryClient.invalidateQueries({ queryKey: ['fetch-blogs'] })
        },
        onError: () => {
            toast.error('Failed to add blog')
        },
    })
}

export function useUpdateBlog() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, blog }: { id: string; blog: Partial<Blog> }) => {
            const formattedBlog: Partial<Blog> = {
                ...blog,
                ...(blog.publishDate && {
                    publishDate: new Date(blog.publishDate),
                }),
            }
            return updateBlog(id, formattedBlog)
        },
        onSuccess: () => {
            toast.success('Blog updated successfully')
            queryClient.invalidateQueries({ queryKey: ['fetch-blogs'] })
        },
        onError: (error: Error) => {
            toast.error('Failed to update blog')
            console.error('Error updating blog:', error.message)
        },
    })
}

export function useDeleteBlog() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteBlog(id),
        onSuccess: () => {
            toast.success('Blog deleted successfully')
            queryClient.invalidateQueries({ queryKey: ['fetch-blogs'] })
        },
        onError: (error: Error) => {
            toast.error('Failed to delete blog')
            console.error('Error deleting blog:', error.message)
        },
    })
}
