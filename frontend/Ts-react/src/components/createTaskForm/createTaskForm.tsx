import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createTaskSchema } from "@/schemas/createTask.schema";
import {z} from "zod";
import { useCreateTask } from "@/hooks/createTask.hook";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner"


export const CreateTaskForm = () => {

    const form = useForm<z.infer<typeof createTaskSchema>>({
      resolver: zodResolver(createTaskSchema),
      defaultValues: {
         status: "todo",
         priority: "normal",
      },
    });

    const {mutate, isSuccess,} = useCreateTask();

    function onSubmit (values: z.infer<typeof createTaskSchema>) {
      let dueDate = values.dueDate.toISOString();
      mutate({...values, dueDate});
    }

    useEffect(() => {
      if (isSuccess){
         toast("New Task Created!");
         form.reset();
      }
    }, [isSuccess]);

    return (
        <div>
            <h2 className="text-xl mb-4">Create a new Task</h2>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="py-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({field}) => (
                     <FormItem>
                        <FormControl>
                           <Input type= "text" placeholder="Task Title" {...field}
                           value={field.value ?? ""}
                           />
                        </FormControl>
                     <FormMessage />
                     </FormItem>
                  )}
               />
                </div>
                 <div className="flex flex-row justify-between py-2">
                    <div className="w-full mr-2">
                     <FormField
                        control={form.control}
                        name="status"
                        render={({field}) => (
                           <FormItem>
                           <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                 <SelectTrigger>
                                 <SelectValue placeholder="Status" />
                                 </SelectTrigger>
                              </FormControl>
                                 <SelectContent>
                                    <SelectGroup>
                                       <SelectItem value="todo">Not started</SelectItem>
                                       <SelectItem value="inProgress">In-Progress</SelectItem>
                                       </SelectGroup>
                                 </SelectContent>                            
                           </Select>
                           <FormMessage/>
                           </FormItem>
                        )}
                     />
                    
                     
                    
                    </div>
                    <div className="w-full ml-2">
                    <FormField
                        control={form.control}
                        name="priority"
                        render={({field}) => (
                           <FormItem>
                           <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                 <SelectTrigger>
                                 <SelectValue placeholder="Priority" />
                                 </SelectTrigger>
                              </FormControl>
                                 <SelectContent>
                                    <SelectGroup>
                                       <SelectItem value="low">Low</SelectItem>
                                       <SelectItem value="normal">Normal</SelectItem>
                                       <SelectItem value="high">High</SelectItem>
                                       </SelectGroup>
                                 </SelectContent>
                           </Select>
                           <FormMessage/>
                           </FormItem>
                        )}
                     />
                    </div>
                 </div>
                 <div className="py-2">
                  <FormField
                control={form.control}
                name="dueDate"
                render={({field}) => (
                  <FormItem>
                      <Popover>
                    <PopoverTrigger asChild>
                     <FormControl>
                        <Button
                           variant={"outline"}
                           className={cn(
                           "w-full justify-start text-left font-normal",
                           !field.value && "text-muted-foreground"
                           )}
                           >
                           <CalendarIcon className="mr-2 h-4 w-4" />
                           {field.value ?  (
                              format(field.value, "PPP")
                           ) : (
                              <span>Due Date</span>
                           )}
                        </Button>
                     </FormControl>
                     </PopoverTrigger>
                     <PopoverContent className="w-auto p-0" side="bottom">
                        <Calendar
                        mode="single"
                        selected = {field.value}
                        onSelect = {field.onChange}
                        disabled = {(date) => date < new Date()}
                        initialFocus
                        />
                    </PopoverContent>
                     </Popover>
                     <FormMessage/>
                  </FormItem>
                )}
                />
                    


                 </div>
                 <div className="py-2">
                  <FormField
                  control={form.control}
                  name="description"
                  render={({field}) => (
                     <FormItem>
                        <FormControl>
                           <Textarea 
                           placeholder="Task Description." 
                           {...field}
                           value= {field.value ?? ""} 
                           />
                        </FormControl>
                     <FormMessage />
                     </FormItem>
                  )}
               />
                 </div>
                 <div className="py-2 flex justify-end">
                    <Button type="submit">Create Task</Button>
                 </div>
            </form>
            </Form>
            <Toaster />
        </div>
    );
};