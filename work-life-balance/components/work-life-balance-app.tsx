"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast, useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Briefcase, Home, PlusCircle, X, Calendar as CalendarIcon, Clock, Sun, Moon, Book } from "lucide-react"

type Task = {
  id: string
  title: string
  date: Date
  fromTime: string
  toTime: string
  isWork: boolean
}

type Resource = {
  id: string
  title: string
  url: string
  notes: string
}

export function WorkLifeBalanceAppComponent() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [tasks, setTasks] = useState<Task[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [newTask, setNewTask] = useState("")
  const [newTaskDate, setNewTaskDate] = useState<Date>(new Date())
  const [newTaskFromTime, setNewTaskFromTime] = useState("09:00")
  const [newTaskToTime, setNewTaskToTime] = useState("17:00")
  const [newTaskType, setNewTaskType] = useState<"work" | "personal">("work")
  const [selectedDayTasks, setSelectedDayTasks] = useState<Task[]>([])
  const [newResourceTitle, setNewResourceTitle] = useState("")
  const [newResourceUrl, setNewResourceUrl] = useState("")
  const [newResourceNotes, setNewResourceNotes] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load data from localStorage
    const storedTasks = localStorage.getItem("tasks")
    const storedResources = localStorage.getItem("resources")
    const storedDarkMode = localStorage.getItem("darkMode")

    if (storedTasks) setTasks(JSON.parse(storedTasks))
    if (storedResources) setResources(JSON.parse(storedResources))
    if (storedDarkMode) setIsDarkMode(JSON.parse(storedDarkMode))

    // Set initial dark mode
    document.documentElement.classList.toggle("dark", isDarkMode)
  }, [])

  useEffect(() => {
    if (date) {
      const filteredTasks = tasks.filter(
        (task) => new Date(task.date).toDateString() === date.toDateString()
      )
      setSelectedDayTasks(filteredTasks)
    }
  }, [date, tasks])

  useEffect(() => {
    // Save data to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks))
    localStorage.setItem("resources", JSON.stringify(resources))
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode))

    // Toggle dark mode
    document.documentElement.classList.toggle("dark", isDarkMode)
  }, [tasks, resources, isDarkMode])

  const validateForm = () => {
    if (newTask.trim() === "") {
      toast({ title: "Error", description: "Task title cannot be empty", variant: "destructive" })
      return false
    }
    if (newTaskFromTime >= newTaskToTime) {
      toast({ title: "Error", description: "Start time must be before end time", variant: "destructive" })
      return false
    }
    return true
  }

  const addTask = () => {
    if (validateForm()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask,
        date: newTaskDate,
        fromTime: newTaskFromTime,
        toTime: newTaskToTime,
        isWork: newTaskType === "work",
      }
      setTasks([...tasks, task])
      setNewTask("")
      toast({ title: "Success", description: "Task added successfully" })
    }
  }

  const removeTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
    toast({ title: "Success", description: "Task removed successfully" })
  }

  const addResource = () => {
    if (newResourceTitle.trim() === "") {
      toast({ title: "Error", description: "Resource title cannot be empty", variant: "destructive" })
      return
    }
    const resource: Resource = {
      id: Date.now().toString(),
      title: newResourceTitle,
      url: newResourceUrl,
      notes: newResourceNotes,
    }
    setResources([...resources, resource])
    setNewResourceTitle("")
    setNewResourceUrl("")
    setNewResourceNotes("")
    toast({ title: "Success", description: "Resource added successfully" })
  }

  const removeResource = (resourceId: string) => {
    setResources(resources.filter((resource) => resource.id !== resourceId))
    toast({ title: "Success", description: "Resource removed successfully" })
  }

  return (
    <TooltipProvider>
      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
        <div className="bg-background text-foreground">
          <header className="bg-primary text-primary-foreground p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">Work-Life Balance App</h1>
              <div className="flex items-center space-x-4">
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                  id="dark-mode-toggle"
                />
                <Label htmlFor="dark-mode-toggle">
                  {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </Label>
              </div>
            </div>
          </header>

          <main className="container mx-auto p-4 md:p-8">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <Tabs defaultValue="calendar" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3 rounded-lg bg-muted p-1">
                    <TabsTrigger value="calendar" className="rounded-md">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Calendar
                    </TabsTrigger>
                    <TabsTrigger value="tasks" className="rounded-md">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Task
                    </TabsTrigger>
                    <TabsTrigger value="resources" className="rounded-md">
                      <Book className="mr-2 h-4 w-4" />
                      Resources
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="calendar">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="shadow-md">
                        <CardContent className="p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border-0"
                          />
                        </CardContent>
                      </Card>
                      <Card className="shadow-md">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                            {date ? date.toDateString() : "Select a date"}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-[400px] pr-4">
                            {selectedDayTasks.length > 0 ? (
                              selectedDayTasks
                                .sort((a, b) => a.fromTime.localeCompare(b.fromTime))
                                .map((task) => (
                                  <Card key={task.id} className="mb-4 last:mb-0 shadow-sm">
                                    <CardContent className="p-4 flex items-center justify-between">
                                      <div>
                                        <h4 className="font-semibold">{task.title}</h4>
                                        <p className="text-sm text-muted-foreground">
                                          {task.fromTime} - {task.toTime}
                                        </p>
                                      </div>
                                      <div className="flex items-center">
                                        <Tooltip>
                                          <TooltipTrigger>
                                            {task.isWork ? (
                                              <Briefcase className="h-5 w-5 text-blue-500 mr-2" />
                                            ) : (
                                              <Home className="h-5 w-5 text-green-500 mr-2" />
                                            )}
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            {task.isWork ? "Work" : "Personal"}
                                          </TooltipContent>
                                        </Tooltip>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeTask(task.id)}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))
                            ) : (
                              <p className="text-center text-muted-foreground">No tasks for this day</p>
                            )}
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  <TabsContent value="tasks">
                    <Card className="shadow-md">
                      <CardHeader>
                        <CardTitle>Add New Task</CardTitle>
                        <CardDescription>Fill in the details to add a new task to your calendar</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={(e) => { e.preventDefault(); addTask(); }} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="task-title">Task Title</Label>
                              <Input
                                id="task-title"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                placeholder="Enter task title"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="task-date">Date</Label>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {newTaskDate.toDateString()}
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="p-0">
                                  <Calendar
                                    mode="single"
                                    selected={newTaskDate}
                                    onSelect={(date) => date && setNewTaskDate(date)}
                                    initialFocus
                                  />
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="task-from-time">From</Label>
                              <Input
                                id="task-from-time"
                                type="time"
                                value={newTaskFromTime}
                                onChange={(e) => setNewTaskFromTime(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="task-to-time">To</Label>
                              <Input
                                id="task-to-time"
                                type="time"
                                value={newTaskToTime}
                                onChange={(e) => setNewTaskToTime(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="task-type">Task Type</Label>
                              <Select onValueChange={(value: "work" | "personal") => setNewTaskType(value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select task type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="work">Work</SelectItem>
                                  <SelectItem value="personal">Personal</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button type="submit" className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Task
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="resources">
                    <Card className="shadow-md">
                      <CardHeader>
                        <CardTitle>Resource Library</CardTitle>
                        <CardDescription>Save links, documents, or notes related to your tasks</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={(e) => { e.preventDefault(); addResource(); }} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="resource-title">Resource Title</Label>
                            <Input
                              id="resource-title"
                              value={newResourceTitle}
                              onChange={(e) => setNewResourceTitle(e.target.value)}
                              placeholder="Enter resource title"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="resource-url">URL (optional)</Label>
                            <Input
                              id="resource-url"
                              value={newResourceUrl}
                              onChange={(e) => setNewResourceUrl(e.target.value)}
                              placeholder="Enter resource URL"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="resource-notes">Notes (optional)</Label>
                            <Textarea
                              id="resource-notes"
                              value={newResourceNotes}
                              onChange={(e) => setNewResourceNotes(e.target.value)}
                              placeholder="Enter notes about the resource"
                            />
                          </div>
                          <Button type="submit" className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Resource
                          </Button>
                        </form>
                        <div className="mt-6">
                          <h3 className="text-lg font-semibold mb-4">Saved Resources</h3>
                          <ScrollArea className="h-[300px] pr-4">
                            {resources.map((resource) => (
                              <Card key={resource.id} className="mb-4 last:mb-0 shadow-sm">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-semibold">{resource.title}</h4>
                                      {resource.url && (
                                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                                          {resource.url}
                                        </a>
                                      )}
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeResource(resource.id)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  {resource.notes && (
                                    <p className="text-sm text-muted-foreground mt-2">{resource.notes}</p>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </ScrollArea>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </main>

          <footer className="bg-muted text-muted-foreground p-4 mt-8">
            <div className="container mx-auto text-center">
              <p>&copy; 2023 Work-Life Balance App. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    </TooltipProvider>
  )
}