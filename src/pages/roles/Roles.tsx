import React from "react";
import Header from "@/components/elements/heading/Header";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import {
  useCreateRole,
  useDeleteRole,
  useFetchPermissionList,
  useFetchRoles,
  useUpdateRole,
} from "./useRoleActions";
import useRoleStore from "./useRoleStore";
import ModalForm from "@/components/ui/ModalForm";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NoData from "@/components/elements/no-data/NoData";
import ConfirmDialog from "@/components/ui/confirm-dialog";

type Props = {
  // Define your props here
};

const Roles: React.FC<Props> = ({}) => {
  const { isOpen, openModal, closeModal, setIsOpen } = useModal();
  useFetchPermissionList();
  useFetchRoles();

  const permissionList = useRoleStore((state: any) => state?.permissions);
  const roles = useRoleStore((state: any) => state.roles);
  const { mutate: createRole } = useCreateRole();
  const { mutate: updateRole } = useUpdateRole();
  const { mutate: deleteRole } = useDeleteRole();

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<any>(null);

  type Mode = "add" | "edit";

  const [mode, setMode] = React.useState<Mode>("add");
  const [editing, setEditing] = React.useState<any>(null);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const roleName = String(formData.get("roleName") || "").trim();
    const permissions = permissionList.filter(
      (p: string) => formData.get(p) === "on",
    );

    if (!roleName || permissions.length === 0) return;

    if (mode === "add") {
      createRole({ roleName, permissions }, { onSuccess: () => closeModal() });
    }

    if (mode === "edit" && editing) {
      updateRole(
        {
          id: editing._id,
          roleName,
          permissions,
        },
        { onSuccess: () => closeModal() },
      );
    }
  };

  const handleAdd = () => {
    setMode("add");
    setEditing(null);
    openModal();
  };

  const handleEdit = (role: any) => {
    setMode("edit");
    setEditing(role);
    openModal();
  };

  return (
    <div>
      <Header
        text="Roles"
        rightContent={
          <Button onClick={handleAdd} size="sm" variant='primary'>
            Add Role
          </Button>
        }
      />

      {/* Roles List */}
      {roles?.length === 0 ? (
        <NoData />
      ) : (
        <div className="mt-4 rounded-2xl border bg-white shadow-sm">
          <Table className="text-gray-900">
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((r: any) => (
                <TableRow key={r._id}>
                  <TableCell className="font-medium">{r.roleName}</TableCell>
                  <TableCell>
                    {Array.isArray(r.permissions) ? r.permissions.length : 0}
                  </TableCell>
                  <TableCell>
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleEdit(r)}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSelectedRole(r);
                          setDeleteOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ModalForm
        open={isOpen}
        onOpenChange={setIsOpen}
        formTitle={
          mode === "add" ? "Create Role" : `Edit Role: ${editing?.roleName}`
        }
        submitHandler={submitHandler}
      >
        <div className="space-y-4">
          <div className="space-y-6">
            <label htmlFor="roleName" className="text-sm font-medium">
              Role Name
            </label>
            <Input
              id="roleName"
              name="roleName"
              placeholder="e.g. Project Manager"
              required
              defaultValue={mode === "edit" ? editing?.roleName : ""}
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Permissions</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[300px] overflow-auto p-2 border rounded">
              {permissionList?.map((perm: string) => (
                <label key={perm} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name={perm}
                    defaultChecked={
                      mode === "edit"
                        ? editing?.permissions?.includes(perm)
                        : false
                    }
                  />
                  <span>{perm}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </ModalForm>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Role"
        description={`Are you sure you want to delete "${selectedRole?.roleName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        destructive
        // loading={isDeleting}
        onConfirm={() => {
          if (!selectedRole) return;

          deleteRole(selectedRole._id, {
            onSuccess: () => {
              setDeleteOpen(false);
              setSelectedRole(null);
            },
          });
        }}
      />
    </div>
  );
};

export default Roles;
