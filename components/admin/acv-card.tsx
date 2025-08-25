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
import { Textarea } from '@/components/ui/textarea'
import { Pencil, Trash2, Plus, Calendar, Trophy } from 'lucide-react'
import { Achievement, NewAchievement } from '@/db/types'
import {
    useUpdateAcv,
    useDeleteAcv,
    useAddAchievement,
} from '@/hooks/useAchievements'

interface AchievementCardProps {
    achievement: Achievement
}

export function AchievementCard({ achievement }: AchievementCardProps) {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editData, setEditData] = useState<Partial<Achievement>>({
        title: achievement.title,
        description: achievement.description,
        date: achievement.date,
        imageUrl: achievement.imageUrl,
    })

    const updateMutation = useUpdateAcv()
    const deleteMutation = useDeleteAcv()

    const handleEdit = () => {
        updateMutation.mutate(
            { id: achievement.id, acv: editData },
            {
                onSuccess: () => setIsEditOpen(false),
            }
        )
    }

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this achievement?')) {
            deleteMutation.mutate(achievement.id)
        }
    }

    return (
        <Card className="bg-card border-border">
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                    <Trophy className="text-primary h-5 w-5" />
                    <div className="text-muted-foreground flex items-center text-sm">
                        <Calendar className="mr-1 h-4 w-4" />
                        {achievement.date instanceof Date
                            ? achievement.date.toISOString().split('T')[0]
                            : achievement.date}
                    </div>
                </div>
                <CardTitle className="text-foreground">
                    {achievement.title}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
                <p className="text-muted-foreground text-sm">
                    {achievement.description}
                </p>
                {achievement.imageUrl && (
                    <div className="mt-2">
                        <img
                            src={achievement.imageUrl}
                            alt={achievement.title}
                            className="border-border h-32 w-full rounded-md border object-cover"
                        />
                    </div>
                )}
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
                                Edit Achievement
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
                                    htmlFor="description"
                                    className="text-foreground"
                                >
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    value={editData.description || ''}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            description: e.target.value,
                                        })
                                    }
                                    className="bg-background border-border text-foreground"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="date"
                                    className="text-foreground"
                                >
                                    Date
                                </Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={
                                        editData.date
                                            ? editData.date instanceof Date
                                                ? editData.date
                                                      .toISOString()
                                                      .split('T')[0]
                                                : editData.date
                                            : ''
                                    }
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            date: new Date(e.target.value),
                                        })
                                    }
                                    className="bg-background border-border text-foreground"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="imageUrl"
                                    className="text-foreground"
                                >
                                    Image URL
                                </Label>
                                <Input
                                    id="imageUrl"
                                    value={editData.imageUrl || ''}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            imageUrl: e.target.value,
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

export function AddAchievementCard() {
    const [isOpen, setIsOpen] = useState(false)
    const [newAchievement, setNewAchievement] = useState<NewAchievement>({
        title: '',
        description: '',
        date: new Date(),
        imageUrl: null,
    })

    const addMutation = useAddAchievement()

    const handleAdd = () => {
        addMutation.mutate(newAchievement, {
            onSuccess: () => {
                setIsOpen(false)
                setNewAchievement({
                    title: '',
                    description: '',
                    date: new Date(),
                    imageUrl: null,
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
                        <p className="text-muted-foreground">Add Achievement</p>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-foreground">
                        Add New Achievement
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="new-title" className="text-foreground">
                            Title
                        </Label>
                        <Input
                            id="new-title"
                            value={newAchievement.title}
                            onChange={(e) =>
                                setNewAchievement({
                                    ...newAchievement,
                                    title: e.target.value,
                                })
                            }
                            className="bg-background border-border text-foreground"
                        />
                    </div>
                    <div>
                        <Label
                            htmlFor="new-description"
                            className="text-foreground"
                        >
                            Description
                        </Label>
                        <Textarea
                            id="new-description"
                            value={newAchievement.description}
                            onChange={(e) =>
                                setNewAchievement({
                                    ...newAchievement,
                                    description: e.target.value,
                                })
                            }
                            className="bg-background border-border text-foreground"
                        />
                    </div>
                    <div>
                        <Label htmlFor="new-date" className="text-foreground">
                            Date
                        </Label>
                        <Input
                            id="new-date"
                            type="date"
                            value={
                                newAchievement.date.toISOString().split('T')[0]
                            }
                            onChange={(e) =>
                                setNewAchievement({
                                    ...newAchievement,
                                    date: new Date(e.target.value),
                                })
                            }
                            className="bg-background border-border text-foreground"
                        />
                    </div>
                    <div>
                        <Label
                            htmlFor="new-imageUrl"
                            className="text-foreground"
                        >
                            Image URL
                        </Label>
                        <Input
                            id="new-imageUrl"
                            value={newAchievement.imageUrl || ''}
                            onChange={(e) =>
                                setNewAchievement({
                                    ...newAchievement,
                                    imageUrl: e.target.value || null,
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
                            {addMutation.isPending
                                ? 'Adding...'
                                : 'Add Achievement'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
