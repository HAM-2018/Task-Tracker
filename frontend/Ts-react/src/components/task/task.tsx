import { type FC, type ReactElement, useState, useEffect } from "react";
import {Card,CardContent,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card";
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { ITask } from "@/types/tasks.interface";
import type { IUpdateTask } from "@/types/updateTask.interface";
import { useUpdateTask } from "@/hooks/useUpdateTask.hook";
import { useDeleteTask } from "@/hooks/useDeleteTasks.hook";
import { useQueryClient } from "@tanstack/react-query";
import { useSharedTask } from "@/hooks/useSharedTask.hook";
import { useConnections } from "@/hooks/useConnections";

export const Task: FC<ITask> = (props: ITask): ReactElement => {
    const {title, description, status, priority, dueDate, _id} = props;
    const [progress, setProgress] = useState(false);
    const {mutate} = useUpdateTask();
    const {mutate: deleteTask, isPending} = useDeleteTask();
    const queryClient = useQueryClient();

    const [editOpen, setEditOpen] = useState(false);
    const [editTitle, setEditTitle] = useState(title);
    const [editDescription, setEditDescription] = useState(description);
    const [editDueDate, setEditDueDate] = useState(new Date(dueDate));
    const [calendarOpen, setCalendarOpen] = useState(false);

    // shared task
    const {connections, loadConnections} = useConnections();
    const [shareOpen, setShareOpen] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const {mutate: shareTask } = useSharedTask();

    let formattedDate = new Date(dueDate).toLocaleDateString("en-AM" , {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    useEffect(() => {
      if (status === "inProgress"){
        setProgress(true);
      }
      loadConnections();
    }, [status]);

    function handleProgressChange(value: boolean) {
      setProgress(value);
      if(_id){
      mutate({_id: _id, status: value ? "inProgress" : "todo"})
      }
      queryClient.invalidateQueries({
         queryKey: ["fetchTasks"],
         refetchType: "all",
      });
    };

    function handleTaskCompleted() {
      if(_id){
        console.log("Updating task with:", { _id, status: "completed" });
      mutate({_id: _id, status: "completed"})
      }
      queryClient.invalidateQueries({
         queryKey: ["fetchTasks"],
         refetchType: "all",
      });
    };
    return (
    <Card className="w-full mb-8">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle className="basis-2/3 leading-8">{title}</CardTitle>
        <div>
          <Badge className="mr-2" variant="outline">{formattedDate}</Badge>
          {priority === "normal" && <Badge className="bg-yellow-800" variant="outline">{priority}</Badge>}
          {priority === "low" && <Badge className="bg-blue-800" variant="outline">{priority}</Badge>}
          {priority === "high" && <Badge className="bg-red-800" variant="outline">{priority}</Badge>}
        </div>
      </CardHeader>

      <CardContent>
        <p>{description}</p>
      </CardContent>

      <CardFooter className="flex flex-wrap justify-between gap-4 items-start">
  <div className="flex items-center">
    <Switch id="In-Progress" checked={progress} onCheckedChange={handleProgressChange} />
    <Label className="ml-4" htmlFor="In-Progress">In Progress</Label>
  </div>

  <div className="flex flex-col w-full space-y-2">
    {/* Completed task */}
    <Button className="w-full" onClick={handleTaskCompleted} variant="outline">
      Completed
    </Button>

    {/* Row of 3 buttons: Delete, Share, Edit */}
    <div className="flex w-full gap-2">
      <Button
        className="flex-1 text-red-600 hover:text-red-700"
        variant="outline"
        onClick={() => { if (_id) deleteTask(_id); }}
      >
        {isPending ? "Deleting..." : "Delete"}
      </Button>

      {/* Share task */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogTrigger asChild>
          <Button className="flex-1" variant="outline">Share</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Select connections to share this task with:</p>
            <div className="space-y-2 max-h-48 overflow-y-auto border p-2 rounded">
              {connections.filter(c => c.status === "accepted").length === 0 ? (
                <p className="text-sm text-gray-500">No connections found</p>
              ) : connections.filter(c => c.status === "accepted").map(c => (
                <label key={c.user._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedUserIds.includes(c.user._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUserIds([...selectedUserIds, c.user._id]);
                      } else {
                        setSelectedUserIds(selectedUserIds.filter(id => id !== c.user._id));
                      }
                    }}
                  />
                  <span>{c.user.username} ({c.user.email})</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShareOpen(false)}>Cancel</Button>
              <Button onClick={() => {
                if (_id && selectedUserIds.length > 0) {
                  shareTask({ taskId: _id, sharedWith: selectedUserIds });
                  setShareOpen(false);
                  setSelectedUserIds([]);
                }
              }}>Share</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit task */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger asChild>
          <Button className="flex-1" variant="outline">Edit</Button>
        </DialogTrigger>
        <DialogContent
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Title" />
            <Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Description" />
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
              onClick={() => setCalendarOpen(prev => !prev)}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {editDueDate ? format(editDueDate, "PPP") : <span>Pick a date</span>}
            </Button>
            {calendarOpen && (
              <div className="mt-2 w-full border rounded-md shadow-md z-[50] bg-gray-800 text-white">
                <Calendar
                  mode="single"
                  selected={editDueDate}
                  onSelect={(date) => {
                    if (date) {
                      setEditDueDate(date);
                      setCalendarOpen(false);
                    }
                  }}
                  className="w-full p-2"
                  initialFocus
                />
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button onClick={() => {
                if (_id) {
                  mutate({
                    _id,
                    title: editTitle,
                    description: editDescription,
                    dueDate: editDueDate.toISOString(),
                  } as IUpdateTask);
                  setEditOpen(false);
                  queryClient.invalidateQueries({ queryKey: ["fetchTasks"] });
                }
              }}>Update</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</CardFooter>

    </Card>
  );
};