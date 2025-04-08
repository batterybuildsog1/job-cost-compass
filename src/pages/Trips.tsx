import { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreHorizontal,
  Car,
  Map,
  Calendar,
  Clock,
  MapPin,
  Route,
  DollarSign,
  Info,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const trips = [
  {
    id: "1",
    startLocation: "Home Office",
    endLocation: "Johnson Residence",
    date: "2023-03-18",
    distance: 42.5,
    duration: "45 minutes",
    project: "Kitchen Renovation",
    type: "Business",
    startTime: "08:15 AM",
    endTime: "09:00 AM",
    mapImage: "/placeholder.svg",
  },
  {
    id: "2",
    startLocation: "Johnson Residence",
    endLocation: "Home Depot",
    date: "2023-03-18",
    distance: 12.8,
    duration: "15 minutes",
    project: "Kitchen Renovation",
    type: "Business",
    startTime: "11:30 AM",
    endTime: "11:45 AM",
    mapImage: "/placeholder.svg",
  },
  {
    id: "3",
    startLocation: "Home Depot",
    endLocation: "Johnson Residence",
    date: "2023-03-18",
    distance: 13.2,
    duration: "18 minutes",
    project: "Kitchen Renovation",
    type: "Business",
    startTime: "12:45 PM",
    endTime: "01:03 PM",
    mapImage: "/placeholder.svg",
  },
  {
    id: "4",
    startLocation: "Home Office",
    endLocation: "Williams Residence",
    date: "2023-03-01",
    distance: 28.5,
    duration: "32 minutes",
    project: "Deck Construction",
    type: "Business",
    startTime: "07:45 AM",
    endTime: "08:17 AM",
    mapImage: "/placeholder.svg",
  },
  {
    id: "5",
    startLocation: "Home Office",
    endLocation: "Grocery Store",
    date: "2023-03-19",
    distance: 7.5,
    duration: "12 minutes",
    project: null,
    type: "Personal",
    startTime: "05:30 PM",
    endTime: "05:42 PM",
    mapImage: "/placeholder.svg",
  },
];

const projects = [
  { id: "1", name: "Kitchen Renovation" },
  { id: "2", name: "Bathroom Remodel" },
  { id: "3", name: "Office Buildout" },
  { id: "4", name: "Deck Construction" },
];

export default function Trips() {
  const [searchTerm, setSearchTerm] = useState("");
  const [addTripOpen, setAddTripOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [tripTypeFilter, setTripTypeFilter] = useState<"all" | "business" | "personal">("all");

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = 
      trip.startLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.endLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trip.project && trip.project.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTab = activeTab === "all" || 
      (trip.project && activeTab === "business") || 
      (!trip.project && activeTab === "personal");
    
    const matchesType = tripTypeFilter === "all" || 
      (tripTypeFilter === "business" && trip.type === "Business") ||
      (tripTypeFilter === "personal" && trip.type === "Personal");
    
    return matchesSearch && matchesTab && matchesType;
  });

  const totalDistance = filteredTrips.reduce((sum, trip) => sum + trip.distance, 0);
  const businessDistance = filteredTrips
    .filter(trip => trip.type === "Business")
    .reduce((sum, trip) => sum + trip.distance, 0);
  const personalDistance = filteredTrips
    .filter(trip => trip.type === "Personal")
    .reduce((sum, trip) => sum + trip.distance, 0);
  
  const mileageRate = 0.655;
  const businessMileageValue = businessDistance * mileageRate;

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-1 container py-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-bold">Mileage Tracking</h1>
              <p className="text-muted-foreground mt-1">Track and categorize your business and personal trips</p>
            </div>
            <Dialog open={addTripOpen} onOpenChange={setAddTripOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Trip
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Trip</DialogTitle>
                  <DialogDescription>
                    Enter the details of your trip.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startLocation" className="text-right">
                      From
                    </Label>
                    <Input id="startLocation" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endLocation" className="text-right">
                      To
                    </Label>
                    <Input id="endLocation" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Date
                    </Label>
                    <Input id="date" type="date" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="distance" className="text-right">
                      Distance
                    </Label>
                    <div className="col-span-3 relative">
                      <Input id="distance" />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        miles
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right mt-3">
                      Trip Type
                    </Label>
                    <RadioGroup defaultValue="business" className="col-span-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="business" id="business" />
                        <Label htmlFor="business">Business</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="personal" id="personal" />
                        <Label htmlFor="personal">Personal</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="project" className="text-right">
                      Project
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={() => setAddTripOpen(false)}>Save Trip</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Distance</CardTitle>
                <CardDescription>All trips</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  <span className="text-3xl font-bold">{totalDistance.toFixed(1)}</span>
                  <span className="text-muted-foreground">miles</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Business Mileage</CardTitle>
                <CardDescription>Tax deductible</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-brand-green" />
                  <span className="text-3xl font-bold">${businessMileageValue.toFixed(2)}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    <Info className="h-3 w-3" />
                    <span>{businessDistance.toFixed(1)} mi @ ${mileageRate}/mi</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Personal Mileage</CardTitle>
                <CardDescription>Non-deductible</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-muted-foreground" />
                  <span className="text-3xl font-bold">{personalDistance.toFixed(1)}</span>
                  <span className="text-muted-foreground">miles</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                className="pl-10"
                placeholder="Search trips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={tripTypeFilter === "all" ? "default" : "outline"} 
                size="sm"
                onClick={() => setTripTypeFilter("all")}
              >
                All
              </Button>
              <Button 
                variant={tripTypeFilter === "business" ? "default" : "outline"} 
                size="sm"
                onClick={() => setTripTypeFilter("business")}
              >
                Business
              </Button>
              <Button 
                variant={tripTypeFilter === "personal" ? "default" : "outline"} 
                size="sm"
                onClick={() => setTripTypeFilter("personal")}
              >
                Personal
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Date Range
              </Button>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Trips</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredTrips.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <Car className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">No trips found</h2>
                  <p className="text-muted-foreground max-w-md mb-6">
                    {searchTerm ? 
                      `No trips match "${searchTerm}". Try a different search term.` : 
                      "You haven't added any trips yet. Add a trip to get started."}
                  </p>
                  {!searchTerm && (
                    <Button onClick={() => setAddTripOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Add Trip
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTrips.map((trip) => (
                    <Card key={trip.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">Trip to {trip.endLocation}</CardTitle>
                            <CardDescription>From {trip.startLocation}</CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>View on Map</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            trip.type === "Business" 
                              ? "bg-blue-100 text-blue-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {trip.type}
                          </span>
                          {trip.project && (
                            <span className="text-xs text-muted-foreground">
                              {trip.project}
                            </span>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4 pb-0">
                        <div className="aspect-[16/9] bg-gray-100 rounded-md mb-4 overflow-hidden">
                          <img
                            src={trip.mapImage}
                            alt={`Map for trip from ${trip.startLocation} to ${trip.endLocation}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-y-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{new Date(trip.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{trip.startTime} - {trip.endTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Route className="h-4 w-4 text-muted-foreground" />
                            <span>{trip.distance.toFixed(1)} miles</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{trip.duration}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="mt-4">
                        <Button variant="default" className="w-full">
                          <Map className="mr-2 h-4 w-4" />
                          View Trip Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
