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

interface ProjectMember {
    _id: string;
    username: string;
    email: string;
    role?: string;
}

export const AddTaskFormFields: React.FC<AddTaskFormFieldsProps> = ({ projectId }) => {
    const [selectedMember, setSelectedMember] = useState<string>("");
    
    // Fetch project members
    const { data: membersResp, isLoading: membersLoading, error: membersError } = useFetchProjectMembers(projectId || "");
    
    // Extract members with proper typing and error handling
    const members: ProjectMember[] = useMemo(() => {
        try {
            console.log('Members response:', membersResp);
            
            if (!membersResp?.data?.data?.members) {
                console.log('No members found in response structure');
                return [];
            }
            
            const membersList = membersResp.data.data.members;
            console.log('Extracted members list:', membersList);
            
            return Array.isArray(membersList) ? membersList : [];
        } catch (error) {
            console.error('Error extracting members:', error);
            return [];
        }
    }, [membersResp]);

    console.log('Available members for task assignment:', members);

    return (
        <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input 
                    id="title" 
                    name="title" 
                    placeholder="Enter task title" 
                    required 
                />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="Enter task description" 
                    rows={4} 
                />
            </div>

            {/* Status and Priority Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                {/* Priority */}
                <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select name="priority" defaultValue="medium">
                        <SelectTrigger id="priority" className="w-full">
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-white">
                            <SelectItem value="low">🟢 Low</SelectItem>
                            <SelectItem value="medium">🟡 Medium</SelectItem>
                            <SelectItem value="high">🟠 High</SelectItem>
                            <SelectItem value="urgent">🔴 Urgent</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Assigned To */}
            <div className="space-y-2">
                <Label htmlFor="assignedTo">Assign To (Optional)</Label>
                {membersLoading ? (
                    <div className="text-sm text-gray-500 p-3 border rounded">
                        Loading project members...
                    </div>
                ) : membersError ? (
                    <div className="text-sm text-red-500 p-3 border rounded border-red-200 bg-red-50">
                        Error loading members. Please try again.
                    </div>
                ) : (
                    <>
                        <Select name="assignedTo" value={selectedMember} onValueChange={setSelectedMember}>
                            <SelectTrigger id="assignedTo" className="w-full">
                                <SelectValue placeholder={
                                    members.length > 0 
                                        ? "Select a team member" 
                                        : "No members available"
                                } />
                            </SelectTrigger>
                            <SelectContent className="z-50 bg-white max-h-60 overflow-y-auto">
                                <SelectItem value="">Unassigned</SelectItem>
                                {members.map((member) => (
                                    <SelectItem key={member._id} value={member._id}>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{member.username}</span>
                                            <span className="text-xs text-gray-500">{member.email}</span>
                                            {member.role && (
                                                <span className="text-xs text-blue-600">({member.role})</span>
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        
                        {projectId && members.length === 0 && !membersLoading && (
                            <div className="text-sm text-amber-600 p-3 border rounded border-amber-200 bg-amber-50">
                                ⚠️ No team members assigned to this project yet. 
                                Ask an admin to assign members to the project first.
                            </div>
                        )}
                        
                        {!projectId && (
                            <div className="text-sm text-gray-500">
                                Project ID not available.
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Deadline */}
            <div className="space-y-2">
                <Label htmlFor="deadline">Deadline (Optional)</Label>
                <Input 
                    id="deadline" 
                    name="deadline" 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                />
            </div>

            {/* Tags */}
            <div className="space-y-2">
                <Label htmlFor="tags">Tags (Optional)</Label>
                <Input 
                    id="tags" 
                    name="tags" 
                    placeholder="bug, ui, urgent, feature (comma separated)" 
                />
                <div className="text-xs text-gray-500">
                    Add tags separated by commas to categorize your task
                </div>
            </div>
        </div>
    );
};