// AddProjectFormFields.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const AddProjectFormFields = () => (
    <div className="space-y-4 mt-4">
        <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input id="name" name="name" placeholder="Enter project name" required />
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

        <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input id="deadline" name="deadline" type="date" />
        </div>

        {/* Optionally add a multi-select for teamMembers later */}
    </div>
);
