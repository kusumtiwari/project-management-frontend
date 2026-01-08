import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { useFetchProjectMembers } from "./useTaskActions";

interface AddTaskFormFieldsProps {
    projectId?: string;
}

export const AddTaskFormFields: React.FC<AddTaskFormFieldsProps> = ({ projectId }) => {
    const [selectedMember, setSelectedMember] = useState<string>("");
    
    // Fetch project members
    const { data: membersResp } = useFetchProjectMembers(projectId || "");
    const members = useMemo(() => (membersResp as any)?.data || [], [membersResp]);

    return (
        <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="Enter task title" required />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Enter description" rows={4} />
            </div>

            {/* Status */}
            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue="backlog">
                    <SelectTrigger id="status" className="w-full">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-white">
                        <SelectItem value="backlog">Backlog</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                        <SelectItem value="deployed">Deployed</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Assigned To */}
            {projectId && members.length > 0 && (
                <div className="space-y-2">
                    <Label htmlFor="assignedTo">Assign To (Optional)</Label>
                    <Select name="assignedTo" value={selectedMember} onValueChange={setSelectedMember}>
                        <SelectTrigger id="assignedTo" className="w-full">
                            <SelectValue placeholder="Select a team member" />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-white">
                            <SelectItem value="">Unassigned</SelectItem>
                            {members.map((member: any) => (
                                <SelectItem key={member._id} value={member._id}>
                                    {member.username} ({member.email})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Deadline */}
            <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input id="deadline" name="deadline" type="date" />
            </div>

            {/* Tags (comma separated) */}
            <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" name="tags" placeholder="bug, ui, urgent" />
            </div>
        </div>
    );
};
