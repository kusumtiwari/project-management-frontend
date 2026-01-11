import React, { useMemo, useState, useEffect } from "react";
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
import { useFetchMembersByTeam } from "../team/useTeamMembersActions";
import { useSessionStore } from "@/session/useSessionStore";

interface AddTaskFormFieldsProps {
  projectId?: string;
}

interface Team {
  _id: string;
  name: string;
}

interface TeamMember {
  _id: string;
  username: string;
  email: string;
  role?: string;
}

export const AddTaskFormFields: React.FC<AddTaskFormFieldsProps> = ({
  projectId,
}) => {
  const profile = useSessionStore((s: any) => s.profile);

  // --- Step 1: fetch project teams & members ---
  const {
    data: projectResp,
    isLoading: projectLoading,
    error: projectError,
  } = useFetchProjectMembers(projectId || "");

  const projectTeams: Team[] = useMemo(() => {
    return projectResp?.data?.data?.teams || [];
  }, [projectResp]);

  // --- Step 2: selected team ---
  const [selectedTeam, setSelectedTeam] = useState<string>(
    projectTeams?.[0]?._id || ""
  );

  useEffect(() => {
    if (projectTeams.length > 0 && !selectedTeam) {
      setSelectedTeam(projectTeams[0]._id);
    }
  }, [projectTeams]);

  // --- Step 3: fetch members of selected team ---
  const {
    data: teamMembersResp,
    isLoading: teamMembersLoading,
    error: teamMembersError,
  } = useFetchMembersByTeam(selectedTeam);

  const teamMembers = useMemo(() => {
    if (!teamMembersResp?.data?.data) return [];
    return Array.isArray(teamMembersResp.data.data)
      ? teamMembersResp.data.data
      : [];
  }, [teamMembersResp]);

  console.log(teamMembersResp,'team members of team')
  const [selectedMember, setSelectedMember] = useState<string>("");

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" name="title" placeholder="Enter task title" required />
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

      {/* Select Team */}
      <div className="space-y-2">
        <Label htmlFor="team">Team *</Label>
        {projectLoading ? (
          <div className="text-sm text-gray-500 p-3 border rounded">Loading teams...</div>
        ) : projectError ? (
          <div className="text-sm text-red-500 p-3 border rounded bg-red-50">
            Failed to load teams
          </div>
        ) : (
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger id="team">
              <SelectValue placeholder="Select a team" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-white max-h-60 overflow-y-auto">
              {projectTeams.map((team) => (
                <SelectItem key={team._id} value={team._id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Assign Member */}
      <div className="space-y-2">
        <Label htmlFor="assignedTo">Assign To (Optional)</Label>
        {teamMembersLoading ? (
          <div className="text-sm text-gray-500 p-3 border rounded">
            Loading team members...
          </div>
        ) : teamMembersError ? (
          <div className="text-sm text-red-500 p-3 border rounded bg-red-50">
            Failed to load members
          </div>
        ) : (
          <Select value={selectedMember} onValueChange={setSelectedMember}>
            <SelectTrigger id="assignedTo">
              <SelectValue placeholder="Select a team member" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-white max-h-60 overflow-y-auto">
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {teamMembers.map((member) => (
                <SelectItem key={member._id} value={member._id}>
                  {member.username} ({member.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Deadline */}
      <div className="space-y-2">
        <Label htmlFor="deadline">Deadline (Optional)</Label>
        <Input
          id="deadline"
          name="deadline"
          type="date"
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (Optional)</Label>
        <Input id="tags" name="tags" placeholder="bug, ui, urgent (comma separated)" />
        <div className="text-xs text-gray-500">Add tags separated by commas</div>
      </div>
    </div>
  );
};
