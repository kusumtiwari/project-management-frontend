import React, { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useFetchProjectMembers } from "./useTaskActions";
import { useSessionStore } from "@/session/useSessionStore";
import { request } from "@/utils/request";
import { getAPIAUTHHEADERS, APIENDPOINTS } from "@/constants/APIEndpoints";
// Adjust this import path to wherever these are exported

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

  // --- Step 2: selected teams (multiple) ---
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);

  // --- Step 3: fetch members from all selected teams ---
  const [combinedTeamMembers, setCombinedTeamMembers] = useState<TeamMember[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [membersFetchError, setMembersFetchError] = useState(false);

  // Fetch members whenever selected teams change
  useEffect(() => {
    if (selectedTeams.length === 0) {
      setCombinedTeamMembers([]);
      setIsLoadingMembers(false);
      setMembersFetchError(false);
      return;
    }

    const fetchAllTeamMembers = async () => {
      setIsLoadingMembers(true);
      setMembersFetchError(false);

      try {
        const memberPromises = selectedTeams.map(async (teamId) => {
          try {
            const response = await request(`${APIENDPOINTS.TEAMSETUP}${teamId}/members`, {
              method: "GET",
              headers: getAPIAUTHHEADERS(),
            });
            return response?.data?.data || [];
          } catch (err) {
            console.error(`Error fetching members for team ${teamId}:`, err);
            return [];
          }
        });

        const results = await Promise.all(memberPromises);
        
        // Combine and deduplicate members
        const membersMap = new Map<string, TeamMember>();
        results.flat().forEach((member: TeamMember) => {
          if (member && member._id && !membersMap.has(member._id)) {
            membersMap.set(member._id, member);
          }
        });

        setCombinedTeamMembers(Array.from(membersMap.values()));
        setIsLoadingMembers(false);
      } catch (error) {
        console.error('Error fetching team members:', error);
        setMembersFetchError(true);
        setIsLoadingMembers(false);
      }
    };

    fetchAllTeamMembers();
  }, [selectedTeams]);

  console.log('Combined team members:', combinedTeamMembers);

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);

  const toggleTeam = (teamId: string) => {
    setSelectedTeams(prev =>
      prev.includes(teamId)
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const removeTeam = (teamId: string) => {
    setSelectedTeams(prev => prev.filter(id => id !== teamId));
  };

  const removeMember = (memberId: string) => {
    setSelectedMembers(prev => prev.filter(id => id !== memberId));
  };

  const getTeamName = (teamId: string) => {
    return projectTeams.find(t => t._id === teamId)?.name || "";
  };

  const getMemberName = (memberId: string) => {
    return combinedTeamMembers.find(m => m._id === memberId)?.username || "";
  };

  // Clear selected members when they're no longer in available members
  useEffect(() => {
    const validMemberIds = new Set(combinedTeamMembers.map(m => m._id));
    setSelectedMembers(prev => prev.filter(id => validMemberIds.has(id)));
  }, [combinedTeamMembers]);

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" name="title" required />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={4} />
      </div>

      {/* Select Teams - Multi-select */}
      <div className="space-y-2">
        <Label htmlFor="teams">Teams *</Label>
        {projectLoading ? (
          <div className="text-sm text-gray-500 p-3 border rounded">
            Loading teams...
          </div>
        ) : projectError ? (
          <div className="text-sm text-red-500 p-3 border rounded bg-red-50">
            Failed to load teams
          </div>
        ) : (
          <div className="space-y-2">
            {/* Selected teams display */}
            {selectedTeams.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 border rounded bg-gray-50">
                {selectedTeams.map(teamId => (
                  <div
                    key={teamId}
                    className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                  >
                    <span>{getTeamName(teamId)}</span>
                    <button
                      type="button"
                      onClick={() => removeTeam(teamId)}
                      className="hover:bg-blue-200 rounded p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsTeamDropdownOpen(!isTeamDropdownOpen)}
                className="w-full p-3 border rounded text-left bg-white hover:bg-gray-50 flex items-center justify-between"
              >
                <span className="text-sm text-gray-600">
                  {selectedTeams.length === 0
                    ? "Select teams..."
                    : `${selectedTeams.length} team(s) selected`}
                </span>
                <span className="text-gray-400">▼</span>
              </button>

              {isTeamDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                  {projectTeams.map(team => (
                    <label
                      key={team._id}
                      className="flex items-center gap-2 p-3 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTeams.includes(team._id)}
                        onChange={() => toggleTeam(team._id)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{team.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Assign Members - Multi-select */}
      <div className="space-y-2">
        <Label htmlFor="assignedTo">Assign To (Optional)</Label>
        {selectedTeams.length === 0 ? (
          <div className="text-sm text-gray-500 p-3 border rounded bg-gray-50">
            Please select at least one team first
          </div>
        ) : isLoadingMembers ? (
          <div className="text-sm text-gray-500 p-3 border rounded">
            Loading team members...
          </div>
        ) : membersFetchError ? (
          <div className="text-sm text-red-500 p-3 border rounded bg-red-50">
            Failed to load members
          </div>
        ) : (
          <div className="space-y-2">
            {/* Selected members display */}
            {selectedMembers.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 border rounded bg-gray-50">
                {selectedMembers.map(memberId => {
                  const member = combinedTeamMembers.find(m => m._id === memberId);
                  return (
                    <div
                      key={memberId}
                      className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-sm"
                    >
                      <span>{member?.username}</span>
                      <button
                        type="button"
                        onClick={() => removeMember(memberId)}
                        className="hover:bg-green-200 rounded p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMemberDropdownOpen(!isMemberDropdownOpen)}
                className="w-full p-3 border rounded text-left bg-white hover:bg-gray-50 flex items-center justify-between"
              >
                <span className="text-sm text-gray-600">
                  {selectedMembers.length === 0
                    ? "Select members..."
                    : `${selectedMembers.length} member(s) selected`}
                </span>
                <span className="text-gray-400">▼</span>
              </button>

              {isMemberDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                  {combinedTeamMembers.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500">
                      No members available
                    </div>
                  ) : (
                    combinedTeamMembers.map(member => (
                      <label
                        key={member._id}
                        className="flex items-center gap-2 p-3 hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member._id)}
                          onChange={() => toggleMember(member._id)}
                          className="w-4 h-4"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{member.username}</div>
                          <div className="text-xs text-gray-500">{member.email}</div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
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
        <Input
          id="tags"
          name="tags"
          placeholder="bug, ui, urgent (comma separated)"
        />
        <div className="text-xs text-gray-500">
          Add tags separated by commas
        </div>
      </div>

      {/* Hidden inputs to submit selected values */}
      <input
        type="hidden"
        name="selectedTeams"
        value={JSON.stringify(selectedTeams)}
      />
      <input
        type="hidden"
        name="selectedMembers"
        value={JSON.stringify(selectedMembers)}
      />
    </div>
  );
};