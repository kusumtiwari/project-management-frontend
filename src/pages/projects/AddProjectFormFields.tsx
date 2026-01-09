// AddProjectFormFields.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { useFetchTeamMembers, useFetchMembersByTeam } from "../team/useTeamMembersActions";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AddProjectFormFields = () => {
    const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [currentTeamId, setCurrentTeamId] = useState<string>("");

    // Fetch all teams
    const { data: teamsResp } = useFetchTeamMembers();
    const teams = useMemo(() => (teamsResp as any)?.data?.data || [], [teamsResp]);

    // Fetch members for all selected teams
    const { data: membersResp } = useFetchMembersByTeam(selectedTeams.join(','));
    const allMembers = useMemo(() => {
        if (!membersResp) return [];
        const members = (membersResp as any)?.data?.data || [];
        // Remove duplicates based on user ID
        const uniqueMembers = members.filter((member: any, index: number, self: any[]) => 
            index === self.findIndex(m => m._id === member._id)
        );
        return uniqueMembers;
    }, [membersResp]);

    // Auto-select first team if available
    useEffect(() => {
        if (selectedTeams.length === 0 && teams?.length > 0) {
            setSelectedTeams([teams[0]._id]);
        }
    }, [teams, selectedTeams]);

    const addTeam = (teamId: string) => {
        if (teamId && !selectedTeams.includes(teamId)) {
            setSelectedTeams(prev => [...prev, teamId]);
            setCurrentTeamId("");
        }
    };

    const removeTeam = (teamId: string) => {
        setSelectedTeams(prev => prev.filter(id => id !== teamId));
        // Remove members from removed team
        const membersFromRemovedTeam = allMembers
            .filter((m: any) => m.teamId === teamId)
            .map((m: any) => m._id);
        setSelectedMembers(prev => prev.filter(id => !membersFromRemovedTeam.includes(id)));
    };

    const toggleMember = (memberId: string) => {
        setSelectedMembers((prev) =>
            prev.includes(memberId)
                ? prev.filter((id) => id !== memberId)
                : [...prev, memberId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedMembers.length === allMembers.length) {
            setSelectedMembers([]);
        } else {
            setSelectedMembers(allMembers.map((m: any) => m._id));
        }
    };

    const getTeamName = (teamId: string) => {
        return teams.find((t: any) => t._id === teamId)?.name || 'Unknown Team';
    };

    const availableTeams = teams.filter((t: any) => !selectedTeams.includes(t._id));

    return (
        <div className="space-y-4 mt-4">
            <div className="space-y-3">
                <Label htmlFor="name">Project Name</Label>
                <Input
                    id="name"
                    name="name"
                    placeholder="Enter project name"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter project description"
                    rows={3}
                />
            </div>

            <div className="space-y-3">
                <Label>Select Teams *</Label>
                
                {/* Selected Teams Display */}
                {selectedTeams.length > 0 && (
                    <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">
                            Selected Teams ({selectedTeams.length}):
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {selectedTeams.map((teamId) => (
                                <div 
                                    key={teamId} 
                                    className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                                >
                                    <span>{getTeamName(teamId)}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeTeam(teamId)}
                                        className="hover:bg-blue-200 rounded-full p-0.5"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add Team Dropdown */}
                {availableTeams.length > 0 && (
                    <div className="flex gap-2">
                        <Select
                            value={currentTeamId}
                            onValueChange={setCurrentTeamId}
                        >
                            <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Add another team" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableTeams.map((team: any) => (
                                    <SelectItem key={team._id} value={team._id}>
                                        {team.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => addTeam(currentTeamId)}
                            disabled={!currentTeamId}
                        >
                            Add
                        </Button>
                    </div>
                )}

                {/* Hidden input for form submission */}
                <input
                    type="hidden"
                    name="teams"
                    value={JSON.stringify(selectedTeams)}
                    required
                />
            </div>

            {selectedTeams.length > 0 && allMembers.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label>Assign Members (Optional)</Label>
                        <div className="flex gap-2">
                            <span className="text-xs text-gray-500">
                                {selectedMembers.length} of {allMembers.length} selected
                            </span>
                            <button
                                type="button"
                                onClick={toggleSelectAll}
                                className="text-xs text-blue-600 hover:underline"
                            >
                                {selectedMembers.length === allMembers.length
                                    ? "Deselect All"
                                    : "Select All"}
                            </button>
                        </div>
                    </div>
                    <div className="border rounded-md p-3 max-h-64 overflow-y-auto space-y-2 bg-white">
                        {allMembers.map((member: any) => {
                            const memberTeam = teams.find((t: any) => t._id === member.teamId);
                            return (
                                <div key={member._id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`member-${member._id}`}
                                        checked={selectedMembers.includes(member._id)}
                                        onCheckedChange={() => toggleMember(member._id)}
                                    />
                                    <label
                                        htmlFor={`member-${member._id}`}
                                        className="text-sm cursor-pointer flex-1"
                                    >
                                        <div className="font-medium">{member.username}</div>
                                        <div className="text-xs text-gray-500">
                                            {member.email} • {member.role}
                                            {memberTeam && (
                                                <span className="ml-1 px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                                                    {memberTeam.name}
                                                </span>
                                            )}
                                        </div>
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                    {/* Enhanced hidden input to store selected members with team info */}
                    <input
                        type="hidden"
                        name="teamMembers"
                        value={JSON.stringify(selectedMembers.map(memberId => {
                            const member = allMembers.find((m: any) => m._id === memberId);
                            return {
                                userId: memberId,
                                teamId: member?.teamId,
                                role: "member"
                            };
                        }))}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue="Not Started">
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Not Started">Not Started</SelectItem>
                            <SelectItem value="Planning">Planning</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="On Hold">On Hold</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="space-y-3">
                    <Label htmlFor="priority">Priority</Label>
                    <Select name="priority" defaultValue="medium">
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-3">
                <Label htmlFor="deadline">Deadline</Label>
                <Input id="deadline" name="deadline" type="date" />
            </div>
        </div>
    );
};