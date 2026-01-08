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

export const AddProjectFormFields = () => {
    const [selectedTeamId, setSelectedTeamId] = useState<string>("");
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    // Fetch all teams
    const { data: teamsResp } = useFetchTeamMembers();
    const teams = useMemo(() => (teamsResp as any)?.data?.data || [], [teamsResp]);

    // Fetch members for selected team
    const { data: membersResp } = useFetchMembersByTeam(selectedTeamId);
    const members = useMemo(() => (membersResp as any)?.data?.data || [], [membersResp]);

    // Auto-select first team if available
    useEffect(() => {
        if (!selectedTeamId && teams?.length > 0) {
            setSelectedTeamId(teams[0]._id);
        }
    }, [teams, selectedTeamId]);

    const handleTeamChange = (teamId: string) => {
        setSelectedTeamId(teamId);
        setSelectedMembers([]); // Reset selected members when team changes
    };

    const toggleMember = (memberId: string) => {
        setSelectedMembers((prev) =>
            prev.includes(memberId)
                ? prev.filter((id) => id !== memberId)
                : [...prev, memberId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedMembers.length === members.length) {
            setSelectedMembers([]);
        } else {
            setSelectedMembers(members.map((m: any) => m._id));
        }
    };

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

            <div className="space-y-3 bg-white z-50 ">
                <Label htmlFor="teamId">Select Team *</Label>
                <Select
                    name="teamId"
                    value={selectedTeamId}
                    onValueChange={handleTeamChange}
                    required
            
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Choose a team" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                        {teams.map((team: any) => (
                            <SelectItem key={team._id} value={team._id}>
                                {team.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {selectedTeamId && members.length > 0 && (
                <div className="space-y-3 relative z-40">
                    <div className="flex items-center justify-between">
                        <Label>Assign Members (Optional)</Label>
                        <button
                            type="button"
                            onClick={toggleSelectAll}
                            className="text-xs text-blue-600 hover:underline"
                        >
                            {selectedMembers.length === members.length
                                ? "Deselect All"
                                : "Select All"}
                        </button>
                    </div>
                    <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2 bg-white">
                        {members.map((member: any) => (
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
                                    </div>
                                </label>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500">
                        {selectedMembers.length} member(s) selected
                    </p>
                    {/* Hidden input to store selected members */}
                    <input
                        type="hidden"
                        name="teamMembers"
                        value={JSON.stringify(selectedMembers)}
                    />
                </div>
            )}

            <div className="space-y-3 relative z-40">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue="Not Started">
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-3">
                <Label htmlFor="deadline">Deadline</Label>
                <Input id="deadline" name="deadline" type="date" />
            </div>
        </div>
    );
};