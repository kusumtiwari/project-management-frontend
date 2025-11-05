// AddTeamFormFields.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import useRoleStore from "@/pages/roles/useRoleStore";
import { useFetchRoles } from "@/pages/roles/useRoleActions";

export const CreateTeamMemberFormFields = () => (
  <RoleFields />
);

const RoleFields = () => {
  useFetchRoles();
  const roles = useRoleStore((s:any) => s.roles);

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
    </div>
  );
};
