"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Instance } from "@/lib/types"
import { RefreshCw, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

interface InstancesTableProps {
  instances: Instance[]
  loading: boolean
  onRefresh: () => void
  onTerminate: (instanceId: string) => Promise<void>
}

export function InstancesTable({ instances, loading, onRefresh, onTerminate }: InstancesTableProps) {
  const [terminatingId, setTerminatingId] = useState<string | null>(null)
  const [isTerminating, setIsTerminating] = useState(false)

  const handleTerminate = async (instanceId: string) => {
    setTerminatingId(instanceId)
    setIsTerminating(true)

    try {
      await onTerminate(instanceId)
    } finally {
      setIsTerminating(false)
      setTerminatingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "running":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "stopped":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between bg-gray-50 border-b">
        <CardTitle>Instances</CardTitle>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>SSH Port</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-9 w-20 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : instances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    No instances found. Launch your first instance to get started.
                  </TableCell>
                </TableRow>
              ) : (
                instances.map((instance) => {
                  const sshPort =
                    instance.ports && instance.ports["22/tcp"] ? instance.ports["22/tcp"][0]?.HostPort : "N/A"

                  return (
                    <TableRow key={instance.id}>
                      <TableCell className="font-mono text-sm">{instance.id}</TableCell>
                      <TableCell>{instance.name}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(instance.status)}`}>{instance.status}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{instance.ip_addr}</TableCell>
                      <TableCell>{sshPort}</TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={isTerminating && terminatingId === instance.id}
                            >
                              {isTerminating && terminatingId === instance.id ? (
                                <>
                                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                  Terminating...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Terminate
                                </>
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Terminate Instance</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to terminate instance{" "}
                                <span className="font-semibold">{instance.name}</span>? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => handleTerminate(instance.id)}
                              >
                                Terminate
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
