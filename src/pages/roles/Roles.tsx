import React from 'react';
import Header from '@/components/elements/heading/Header';
import { Button } from '@/components/ui/button';
import { useModal } from '@/hooks/useModal';
import { useCreateRole, useDeleteRole, useFetchPermissionList, useFetchRoles, useUpdateRole } from './useRoleActions';
import useRoleStore from './useRoleStore';
import ModalForm from '@/components/ui/ModalForm';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import NoData from '@/components/elements/no-data/NoData';

type Props = {
  // Define your props here
}

const Roles: React.FC<Props> = ({ }) => {
  const { isOpen, openModal, closeModal, setIsOpen } = useModal();
  useFetchPermissionList();
  useFetchRoles();
  const permissionList = useRoleStore((state: any) => state?.permissions);
  const roles = useRoleStore((state:any) => state.roles);
  const { mutate: createRole } = useCreateRole();
  const { mutate: updateRole } = useUpdateRole();
  const { mutate: deleteRole } = useDeleteRole();

  const [editOpen, setEditOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<any>(null);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const roleName = String(formData.get('roleName') || '').trim();
    const permissions = permissionList.filter((p: string) => formData.get(p) === 'on');

    if (!roleName || permissions.length === 0) {
      return; // Minimal guard; toasts handled in hook
    }

    createRole(
      { roleName, permissions },
      {
        onSuccess: () => closeModal(),
      }
    );
  };

  return (
    <div>
      <Header
        text="Roles"
        rightContent={
          <Button onClick={openModal} variant="default" size="sm">
            Add Roles
          </Button>
        }
      />

      {/* Roles List */}
      {roles?.length === 0 ? (
        <NoData />
      ) : (
        <div className="mt-4 rounded-2xl border bg-white shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
          <Table className="text-gray-900 dark:text-gray-100">
            <TableHeader>
              <TableRow className="dark:hover:bg-neutral-900">
                <TableHead className="dark:text-gray-300">Role</TableHead>
                <TableHead className="dark:text-gray-300">Permissions</TableHead>
                <TableHead className="dark:text-gray-300">Created</TableHead>
                <TableHead className="dark:text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((r:any) => (
                <TableRow key={r._id} className="dark:hover:bg-neutral-800/60">
                  <TableCell className="font-medium dark:text-gray-100">{r.roleName}</TableCell>
                  <TableCell className="dark:text-gray-200">{Array.isArray(r.permissions) ? r.permissions.length : 0}</TableCell>
                  <TableCell className="dark:text-gray-200">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}</TableCell>
                  <TableCell className="dark:text-gray-200">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="dark:border-neutral-700 dark:text-gray-200" onClick={() => { setEditing(r); setEditOpen(true); }}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => {
                        if (confirm(`Delete role "${r.roleName}"?`)) deleteRole(r._id);
                      }}>Delete</Button>
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
        formTitle="Create Role"
        submitHandler={submitHandler}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="roleName" className="text-sm font-medium">Role Name</label>
            <Input id="roleName" name="roleName" placeholder="e.g. Project Manager" required />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Permissions</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[300px] overflow-auto p-2 border rounded">
              {permissionList?.map((perm: string) => (
                <label key={perm} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name={perm} />
                  <span>{perm}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </ModalForm>

      {/* Edit Role Modal */}
      <ModalForm
        open={editOpen}
        onOpenChange={setEditOpen}
        formTitle={editing ? `Edit Role: ${editing.roleName}` : 'Edit Role'}
        submitHandler={(e) => {
          e.preventDefault();
          if (!editing) return;
          const formData = new FormData(e.currentTarget as HTMLFormElement);
          const roleName = String(formData.get('roleName') || '').trim();
          const perms = permissionList.filter((p: string) => formData.get(p) === 'on');
          updateRole({ id: editing._id, roleName: roleName || editing.roleName, permissions: perms }, { onSuccess: () => setEditOpen(false) });
        }}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="roleName" className="text-sm font-medium">Role Name</label>
            <Input id="roleName" name="roleName" defaultValue={editing?.roleName} />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Permissions</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[300px] overflow-auto p-2 border rounded">
              {permissionList?.map((perm: string) => (
                <label key={perm} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name={perm} defaultChecked={editing?.permissions?.includes(perm)} />
                  <span>{perm}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </ModalForm>
    </div>
  );
};

export default Roles;