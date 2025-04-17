"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Building, Settings, LogOut, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock data for users
const mockUsers = [
  {
    id: "1",
    username: "johndoe",
    email: "john@example.com",
    createdAt: "2023-09-10T08:30:00Z",
    lastActive: "2023-12-15T14:20:00Z",
    projectsCount: 3,
  },
  {
    id: "2",
    username: "janedoe",
    email: "jane@example.com",
    createdAt: "2023-10-05T11:45:00Z",
    lastActive: "2023-12-14T09:15:00Z",
    projectsCount: 2,
  },
  {
    id: "3",
    username: "bobsmith",
    email: "bob@example.com",
    createdAt: "2023-11-20T16:10:00Z",
    lastActive: "2023-12-13T17:30:00Z",
    projectsCount: 1,
  },
]

// Mock data for projects
const mockProjects = [
  {
    id: "1",
    name: "Modern Villa",
    owner: "johndoe",
    createdAt: "2023-10-15T10:30:00Z",
    status: "In Progress",
    budget: "$500,000",
  },
  {
    id: "2",
    name: "Office Building",
    owner: "janedoe",
    createdAt: "2023-11-20T14:45:00Z",
    status: "Planning",
    budget: "$1,200,000",
  },
  {
    id: "3",
    name: "Shopping Mall",
    owner: "bobsmith",
    createdAt: "2023-12-05T09:15:00Z",
    status: "Planning",
    budget: "$3,500,000",
  },
]

export default function AdminDashboardPage() {
  const { user } = useUser()
  const router = useRouter()
  const [users, setUsers] = useState(mockUsers)
  const [projects, setProjects] = useState(mockProjects)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: "user" | "project" } | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleDeleteClick = (id: string, type: "user" | "project") => {
    setItemToDelete({ id, type })
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!itemToDelete) return

    if (itemToDelete.type === "user") {
      setUsers(users.filter((user) => user.id !== itemToDelete.id))
      toast.success("User deleted successfully")
    } else {
      setProjects(projects.filter((project) => project.id !== itemToDelete.id))
      toast.success("Project deleted successfully")
    }

    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400">Manage users, projects, and platform settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-cyan-400">{users.length}</p>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-teal-400">{projects.length}</p>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Active Today</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-emerald-400">2</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="users" className="data-[state=active]:bg-slate-700">
              <Users className="mr-2 h-4 w-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-slate-700">
              <Building className="mr-2 h-4 w-4" /> Projects
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-slate-700">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white">Registered Users</CardTitle>
                <CardDescription className="text-slate-400">Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader className="bg-slate-800">
                    <TableRow className="hover:bg-slate-800/80 border-slate-700">
                      <TableHead className="text-slate-300">Username</TableHead>
                      <TableHead className="text-slate-300">Email</TableHead>
                      <TableHead className="text-slate-300">Registered On</TableHead>
                      <TableHead className="text-slate-300">Last Active</TableHead>
                      <TableHead className="text-slate-300">Projects</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-slate-800/80 border-slate-700">
                        <TableCell className="text-white">{user.username}</TableCell>
                        <TableCell className="text-slate-300">{user.email}</TableCell>
                        <TableCell className="text-slate-300">{formatDate(user.createdAt)}</TableCell>
                        <TableCell className="text-slate-300">{formatDate(user.lastActive)}</TableCell>
                        <TableCell className="text-slate-300">{user.projectsCount}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                            onClick={() => handleDeleteClick(user.id, "user")}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white">All Projects</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage construction projects across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader className="bg-slate-800">
                    <TableRow className="hover:bg-slate-800/80 border-slate-700">
                      <TableHead className="text-slate-300">Project Name</TableHead>
                      <TableHead className="text-slate-300">Owner</TableHead>
                      <TableHead className="text-slate-300">Created On</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Budget</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id} className="hover:bg-slate-800/80 border-slate-700">
                        <TableCell className="text-white">{project.name}</TableCell>
                        <TableCell className="text-slate-300">{project.owner}</TableCell>
                        <TableCell className="text-slate-300">{formatDate(project.createdAt)}</TableCell>
                        <TableCell className="text-slate-300">{project.status}</TableCell>
                        <TableCell className="text-slate-300">{project.budget}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                            onClick={() => handleDeleteClick(project.id, "project")}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white">Platform Settings</CardTitle>
                <CardDescription className="text-slate-400">Configure global settings for the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300">Platform settings functionality will be implemented here.</p>
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    // In a real app, we would sign out the admin
                    toast.success("Logged out successfully")
                    router.push("/")
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription className="text-slate-400">
              {itemToDelete?.type === "user"
                ? "Are you sure you want to delete this user? This action cannot be undone."
                : "Are you sure you want to delete this project? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" className="bg-red-600 hover:bg-red-700" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

