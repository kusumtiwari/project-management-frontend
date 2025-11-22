// AddTeamFormFields.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo } from "react";
import useRoleStore from "@/pages/roles/useRoleStore";
import { useFetchRoles } from "@/pages/roles/useRoleActions";
import { useFetchTeamMembers } from "./useTeamMembersActions";
import { useSessionStore } from "@/session/useSessionStore";

export const CreateTeamMemberFormFields = () => (
  <RoleFields />
);

const RoleFields = () => {
  useFetchRoles();
  const roles = useRoleStore((s:any) => s.roles);
  const profile = useSessionStore((s:any) => s.profile);
  const { data: teamsResp } = useFetchTeamMembers();

  const teams = (teamsResp as any)?.data?.data || [];
  const defaultTeamId = useMemo(() => profile?.teams?.[0]?.teamId, [profile]);

  useEffect(() => {
    // ensure roles are loaded
  }, [roles]);

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="username">Full Name</Label>
        <Input id="username" name="username" type="text" placeholder="Jane Doe" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="jane@example.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Temporary Password</Label>
        <Input id="password" name="password" type="password" placeholder="Set a password" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="roleId">Role</Label>
        <select id="roleId" name="roleId" className="w-full border rounded px-3 py-2" required>
          <option value="">Select a role</option>
          {roles?.map((r:any) => (
            <option key={r._id} value={r._id}>{r.roleName}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="teamId">Team</Label>
        <select
          id="teamId"
          name="teamId"
          className="w-full border rounded px-3 py-2"
          defaultValue={defaultTeamId || (teams[0]?._id || "")}
          required
        >
          <option value="" disabled>Select a team</option>
          {teams.map((t: any) => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
