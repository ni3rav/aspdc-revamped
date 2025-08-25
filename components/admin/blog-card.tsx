/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Pencil,
    Trash2,
    Plus,
    Calendar,
    ExternalLink,
    User,
} from 'lucide-react'
import { Blog, NewBlog } from '@/db/types'
import { useUpdateBlog, useDeleteBlog, useAddBlog } from '@/hooks/useBlogs'

interface BlogCardProps {
    blog: Blog
}

export function BlogCard({ blog }: BlogCardProps) {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editData, setEditData] = useState<Partial<Blog>>({
        title: blog.title,
        author: blog.author,
        link: blog.link,
        publishDate: blog.publishDate,
        coverImage: blog.coverImage,
    })

    const updateMutation = useUpdateBlog()
    const deleteMutation = useDeleteBlog()

    const handleEdit = () => {
        updateMutation.mutate(
            { id: blog.id, blog: editData },
            {
                onSuccess: () => setIsEditOpen(false),
            }
        )
    }

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this blog?')) {
            deleteMutation.mutate(blog.id)
        }
    }

    return (
        <Card className="bg-card border-border">
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                    <div className="text-muted-foreground flex items-center text-sm">
                        <User className="mr-1 h-4 w-4" />
                        {blog.author}
                    </div>
                    <div className="text-muted-foreground flex items-center text-sm">
                        <Calendar className="mr-1 h-4 w-4" />
                        {new Date(blog.publishDate).toLocaleDateString()}
                    </div>
                </div>
                <CardTitle className="text-foreground">{blog.title}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
                {blog.coverImage && (
                    <div className="mb-3">
                        <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="border-border h-40 w-full rounded-md border object-cover"
                        />
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="text-primary hover:text-primary"
                    >
                        <a
                            href={blog.link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ExternalLink className="mr-1 h-4 w-4" />
                            Read Article
                        </a>
                    </Button>
                </div>
            </CardContent>

            <CardFooter className="flex justify-end space-x-2">
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-foreground"
                        >
                            <Pencil className="mr-1 h-4 w-4" />
                            Edit
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border">
                        <DialogHeader>
                            <DialogTitle className="text-foreground">
                                Edit Blog
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label
                                    htmlFor="title"
                                    className="text-foreground"
                                >
                                    Title
                                </Label>
                                <Input
                                    id="title"
                                    value={editData.title || ''}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            title: e.target.value,
                                        })
                                    }
                                    className="bg-background border-border text-foreground"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="author"
                                    className="text-foreground"
                                >
                                    Author
                                </Label>
                                <Input
                                    id="author"
                                    value={editData.author || ''}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            author: e.target.value,
                                        })
                                    }
                                    className="bg-background border-border text-foreground"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="link"
                                    className="text-foreground"
                                >
                                    Link
                                </Label>
                                <Input
                                    id="link"
                                    value={editData.link || ''}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            link: e.target.value,
                                        })
                                    }
                                    className="bg-background border-border text-foreground"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="publishDate"
                                    className="text-foreground"
                                >
                                    Publish Date
                                </Label>
                                <Input
                                    id="publishDate"
                                    type="date"
                                    value={
                                        editData.publishDate
                                            ? new Date(editData.publishDate)
                                                  .toISOString()
                                                  .split('T')[0]
                                            : ''
                                    }
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            publishDate: new Date(
                                                e.target.value
                                            ),
                                        })
                                    }
                                    className="bg-background border-border text-foreground"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="coverImage"
                                    className="text-foreground"
                                >
                                    Cover Image URL
                                </Label>
                                <Input
                                    id="coverImage"
                                    value={editData.coverImage || ''}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            coverImage: e.target.value,
                                        })
                                    }
                                    className="bg-background border-border text-foreground"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleEdit}
                                    disabled={updateMutation.isPending}
                                >
                                    {updateMutation.isPending
                                        ? 'Saving...'
                                        : 'Save'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="text-destructive hover:text-destructive"
                >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Delete
                </Button>
            </CardFooter>
        </Card>
    )
}

export function AddBlogCard() {
    const [isOpen, setIsOpen] = useState(false)
    const [newBlog, setNewBlog] = useState<NewBlog>({
        title: '',
        author: '',
        link: '',
        publishDate: new Date(),
        coverImage: null,
    })

    const addMutation = useAddBlog()

    const handleAdd = () => {
        addMutation.mutate(newBlog, {
            onSuccess: () => {
                setIsOpen(false)
                setNewBlog({
                    title: '',
                    author: '',
                    link: '',
                    publishDate: new Date(),
                    coverImage: null,
                })
            },
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Card className="bg-card border-border hover:bg-accent/50 cursor-pointer border-dashed transition-colors">
                    <CardContent className="flex h-40 flex-col items-center justify-center space-y-2">
                        <Plus className="text-muted-foreground h-8 w-8" />
                        <p className="text-muted-foreground">Add Blog</p>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-foreground">
                        Add New Blog
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="new-title" className="text-foreground">
                            Title
                        </Label>
                        <Input
                            id="new-title"
                            value={newBlog.title}
                            onChange={(e) =>
                                setNewBlog({
                                    ...newBlog,
                                    title: e.target.value,
                                })
                            }
                            className="bg-background border-border text-foreground"
                        />
                    </div>
                    <div>
                        <Label htmlFor="new-author" className="text-foreground">
                            Author
                        </Label>
                        <Input
                            id="new-author"
                            value={newBlog.author}
                            onChange={(e) =>
                                setNewBlog({
                                    ...newBlog,
                                    author: e.target.value,
                                })
                            }
                            className="bg-background border-border text-foreground"
                        />
                    </div>
                    <div>
                        <Label htmlFor="new-link" className="text-foreground">
                            Link
                        </Label>
                        <Input
                            id="new-link"
                            value={newBlog.link}
                            onChange={(e) =>
                                setNewBlog({ ...newBlog, link: e.target.value })
                            }
                            className="bg-background border-border text-foreground"
                        />
                    </div>
                    <div>
                        <Label
                            htmlFor="new-publishDate"
                            className="text-foreground"
                        >
                            Publish Date
                        </Label>
                        <Input
                            id="new-publishDate"
                            type="date"
                            value={
                                newBlog.publishDate.toISOString().split('T')[0]
                            }
                            onChange={(e) =>
                                setNewBlog({
                                    ...newBlog,
                                    publishDate: new Date(e.target.value),
                                })
                            }
                            className="bg-background border-border text-foreground"
                        />
                    </div>
                    <div>
                        <Label
                            htmlFor="new-coverImage"
                            className="text-foreground"
                        >
                            Cover Image URL
                        </Label>
                        <Input
                            id="new-coverImage"
                            value={newBlog.coverImage || ''}
                            onChange={(e) =>
                                setNewBlog({
                                    ...newBlog,
                                    coverImage: e.target.value || null,
                                })
                            }
                            className="bg-background border-border text-foreground"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAdd}
                            disabled={addMutation.isPending}
                        >
                            {addMutation.isPending ? 'Adding...' : 'Add Blog'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
