"use client";

import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Edit, Check, Trash2 } from "lucide-react";
import { HiDatabase } from "react-icons/hi";

import { CreateDatabaseDialog } from "./CreateDatabaseDialog";
import { BaseDirectoryDialog } from "./BaseDirectoryDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { DatabaseInfo } from "@/types/DatabaseManager";

type DatabaseManagerProps = {
  baseDirectory: string | null;
  onBaseDirectoryChange: () => Promise<void>;
  baseDirectoryDialogOpen: boolean;
  setBaseDirectoryDialogOpen: (open: boolean) => void;
};

export function DatabaseManager({
  baseDirectory,
  onBaseDirectoryChange,
  baseDirectoryDialogOpen,
  setBaseDirectoryDialogOpen,
}: DatabaseManagerProps) {
  const [databases, setDatabases] = useState<DatabaseInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dbToDelete, setDbToDelete] = useState<string | null>(null);

  const loadDatabases = async () => {
    try {
      setLoading(true);
      await invoke('refresh_databases');
      const dbs = await invoke<DatabaseInfo[]>('list_databases');
      setDatabases(dbs);
      await onBaseDirectoryChange();
    } catch (error) {
      toast.error(`Error updating databases: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabases();
  }, []);

  const setActiveDatabase = async (name: string) => {
    try {
      await invoke('set_active_db', { name });
      toast.success(`Database '${name}' set as active`);
      loadDatabases();
    } catch (error) {
      toast.error(`Error setting active database: ${error}`);
    }
  };

  const confirmDeleteDatabase = (name: string) => {
    setDbToDelete(name);
    setDeleteDialogOpen(true);
  };

  const removeDatabase = async () => {
    if (!dbToDelete) return;

    try {
      await invoke('remove_database', { name: dbToDelete });
      toast.success(`Database '${dbToDelete}' removed`);
      setDeleteDialogOpen(false);
      setDbToDelete(null);
      loadDatabases();
    } catch (error) {
      toast.error(`Error removing database: ${error}`);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Intl.DateTimeFormat("en-US", { dateStyle: "short", timeStyle: "short" }).format(new Date(dateString));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Database Manager</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadDatabases}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button variant="outline" onClick={() => setBaseDirectoryDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" /> Directory
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <HiDatabase className="mr-2 h-4 w-4" /> New Database
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Databases</CardTitle>
          <CardDescription>Manage your databases and select an active one.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : databases.length === 0 ? (
            <div className="text-center py-4">No databases found. Create a new one.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Last Accessed</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {databases.map((db) => (
                  <TableRow key={db.name}>
                    <TableCell>
                      {db.is_active ? (
                        <Badge variant="default" className="bg-green-600">Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>{db.name}</TableCell>
                    <TableCell>{formatDate(db.last_accessed)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {!db.is_active && (
                          <Button variant="outline" size="sm" onClick={() => setActiveDatabase(db.name)}>
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => confirmDeleteDatabase(db.name)}
                          className="hover:bg-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CreateDatabaseDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onDatabaseCreated={loadDatabases}
        baseDirectory={baseDirectory}
      />

      <BaseDirectoryDialog
        open={baseDirectoryDialogOpen}
        onOpenChange={setBaseDirectoryDialogOpen}
        onDirectorySet={loadDatabases}
        currentDirectory={baseDirectory}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to remove the database <strong>{dbToDelete}</strong>?</p>
          <DialogFooter className="flex justify-end gap-2 pt-6">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={removeDatabase}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
