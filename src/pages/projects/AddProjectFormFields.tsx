import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { useFetchTeamMembers } from "../team/useTeamMembersActions";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AddProjectFormFields: React.FC = () => {
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [currentTeamId, setCurrentTeamId] = useState<string>("");

  // Fetch all teams
  const { data: teamsResp } = useFetchTeamMembers();
  const teams = useMemo(
    () => (teamsResp as any)?.data?.data || [],
    [teamsResp]
  );

  useEffect(() => {
    if (selectedTeams.length === 0 && teams.length > 0) {
      setSelectedTeams([teams[0]._id]);
    }
  }, [teams]);

  const addTeam = (teamId: string) => {
    if (teamId && !selectedTeams.includes(teamId)) {
      setSelectedTeams((prev) => [...prev, teamId]);
      setCurrentTeamId("");
    }
  };

  const removeTeam = (teamId: string) => {
    setSelectedTeams((prev) => prev.filter((id) => id !== teamId));
  };

  const getTeamName = (teamId: string) =>
    teams.find((t: any) => t._id === teamId)?.name || "Unknown Team";

  const availableTeams = teams.filter(
    (t: any) => !selectedTeams.includes(t._id)
  );

  return (
    <div className="space-y-6 mt-4">
      {/* Project Info */}
      <div className="p-4 border rounded-xl bg-white space-y-4">
        <h3 className="text-lg font-semibold">Project Information</h3>
        <div className="space-y-3">
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter project name"
            required
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Enter project description"
            rows={3}
          />
        </div>
      </div>

      {/* Teams Selection */}
      <div className="p-4 border rounded-xl bg-white space-y-4">
        <h3 className="text-lg font-semibold">Teams</h3>
        {selectedTeams.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTeams.map((teamId: string) => (
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
        )}

        {availableTeams.length > 0 && (
          <div className="flex gap-2 mt-2">
            <Select value={currentTeamId} onValueChange={setCurrentTeamId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a team" />
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

        <input
          type="hidden"
          name="teams"
          value={JSON.stringify(selectedTeams)}
          required
        />
      </div>

      {/* Status & Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-xl bg-white space-y-3">
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

        <div className="p-4 border rounded-xl bg-white space-y-3">
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

      {/* Deadline */}
      <div className="p-4 border rounded-xl bg-white space-y-3">
        <Label htmlFor="deadline">Deadline</Label>
        <Input id="deadline" name="deadline" type="date" />
      </div>
    </div>
  );
};
