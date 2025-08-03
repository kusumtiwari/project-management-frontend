// AddTeamFormFields.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const InviteTeamMemberFormFields = () => (
    <div className="space-y-4 mt-4">
        <div className="space-y-4">
            {/* <Label htmlFor="email">Team Member Email</Label> */}
            <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email to invite"
                required
                className="focus:none "
            />
        </div>
    </div>
);
