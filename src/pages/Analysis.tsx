
import { useState, useEffect } from "react";
import { 
  Download, 
  Filter, 
  Calendar, 
  BarChart, 
  PieChart,
  LineChart,
  Receipt,
  Car,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RePieChart,
  Pie,
  LineChart as ReLineChart,
  Line,
  Cell,
} from "recharts";

// Sample project data
const projects = [
  { id: "1", name: "Kitchen Renovation" },
  { id: "2", name: "Bathroom Remodel" },
  { id: "3", name: "Office Buildout" },
  { id: "4", name: "Deck Construction" },
];

// Sample expenses data for projects
const projectExpenses = [
  { 
    project: "Kitchen Renovation", 
    materials: 1850.75, 
    labor: 2200.00, 
    equipment: 500.00, 
    other: 450.25,
    mileage: 187,
    mileageCost: 122.49,
    totalCost: 5123.49
  },
  { 
    project: "Bathroom Remodel", 
    materials: 1250.50, 
    labor: 1800.00, 
    equipment: 350.00, 
    other: 250.75,
    mileage: 95,
    mileageCost: 62.23,
    totalCost: 3713.48
  },
  { 
    project: "Office Buildout", 
    materials: 3500.00, 
    labor: 4200.00, 
    equipment: 1200.00, 
    other: 650.50,
    mileage: 65,
    mileageCost: 42.58,
    totalCost: 9593.08
  },
  { 
    project: "Deck Construction", 
    materials: 2800.65, 
    labor: 1800.00, 
    equipment: 525.00, 
    other: 325.75,
    mileage: 142,
    mileageCost: 93.01,
    totalCost: 5544.41
  },
];

// Sample monthly expense data
const monthlyData = [
  { name: "Jan", expenses: 2580, mileage: 210 },
  { name: "Feb", expenses: 3250, mileage: 315 },
  { name: "Mar", expenses: 4580, mileage: 425 },
  { name: "Apr", expenses: 3850, mileage: 380 },
  { name: "May", expenses: 4250, mileage: 290 },
  { name: "Jun", expenses: 5100, mileage: 350 },
];

// Sample expense categories data
const categoryData = [
  { name: "Materials", value: 9401.90, color: "#2563eb" },
  { name: "Labor", value: 10000.00, color: "#10b981" },
  { name: "Equipment", value: 2575.00, color: "#f59e0b" },
  { name: "Mileage", value: 320.31, color: "#6366f1" },
  { name: "Other", value: 1677.25, color: "#ec4899" },
];

// Sample project comparison data
const comparisonData = projectExpenses.map(project => ({
  name: project.project,
  estimatedCost: project.totalCost * 0.85, // Mock estimated cost (85% of actual for this example)
  actualCost: project.totalCost,
}));

export default function Analysis() {
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [activeView, setActiveView] = useState<"summary" | "projects" | "categories" | "comparison">("summary");

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-1 container py-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold">Cost Analysis</h1>
              <p className="text-muted-foreground mt-1">Analyze your expenses and track project costs</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span>Date Range</span>
              </Button>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-full md:w-72">
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Expenses</CardTitle>
                <CardDescription>All recorded expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-primary" />
                  <span className="text-3xl font-bold">$23,974.46</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Mileage</CardTitle>
                <CardDescription>Business trips</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-brand-green" />
                  <span className="text-3xl font-bold">489</span>
                  <span className="text-muted-foreground">miles</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Projects</CardTitle>
                <CardDescription>Current jobs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-brand-blue">
                    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                    <path d="M8 10v4" />
                    <path d="M12 10v2" />
                    <path d="M16 10v6" />
                  </svg>
                  <span className="text-3xl font-bold">4</span>
                  <span className="text-muted-foreground">projects</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeView} onValueChange={setActiveView as any}>
            <TabsList className="mb-6">
              <TabsTrigger value="summary" className="flex gap-2 items-center">
                <BarChart className="h-4 w-4" />
                Summary
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex gap-2 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                  <path d="M8 10v4" />
                  <path d="M12 10v2" />
                  <path d="M16 10v6" />
                </svg>
                Projects
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex gap-2 items-center">
                <PieChart className="h-4 w-4" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="comparison" className="flex gap-2 items-center">
                <LineChart className="h-4 w-4" />
                Comparison
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-6">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Monthly Expenses Overview</CardTitle>
                  <CardDescription>Expenses and mileage over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart
                      data={monthlyData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#2563eb" />
                      <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="expenses" name="Expenses ($)" fill="#2563eb" />
                      <Bar yAxisId="right" dataKey="mileage" name="Mileage (mi)" fill="#10b981" />
                    </ReBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Expense Distribution</CardTitle>
                    <CardDescription>Breakdown by category</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => `$${value.toFixed(2)}`}
                        />
                        <Legend />
                      </RePieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Project Comparison</CardTitle>
                    <CardDescription>Estimated vs. actual costs</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReBarChart
                        data={comparisonData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                        <Legend />
                        <Bar dataKey="estimatedCost" name="Estimated" fill="#6366f1" />
                        <Bar dataKey="actualCost" name="Actual" fill="#ec4899" />
                      </ReBarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Cost Breakdown</CardTitle>
                  <CardDescription>Expense categories by project</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart
                      data={projectExpenses}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="project" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                      <Legend />
                      <Bar dataKey="materials" name="Materials" stackId="a" fill="#2563eb" />
                      <Bar dataKey="labor" name="Labor" stackId="a" fill="#10b981" />
                      <Bar dataKey="equipment" name="Equipment" stackId="a" fill="#f59e0b" />
                      <Bar dataKey="mileageCost" name="Mileage" stackId="a" fill="#6366f1" />
                      <Bar dataKey="other" name="Other" stackId="a" fill="#ec4899" />
                    </ReBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {projectExpenses.map((project, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{project.project}</CardTitle>
                      <CardDescription>Project cost breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-4">
                        <Receipt className="h-5 w-5 text-primary" />
                        <span className="text-2xl font-bold">${project.totalCost.toFixed(2)}</span>
                      </div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">Materials:</div>
                          <div className="text-right font-medium">${project.materials.toFixed(2)}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">Labor:</div>
                          <div className="text-right font-medium">${project.labor.toFixed(2)}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">Equipment:</div>
                          <div className="text-right font-medium">${project.equipment.toFixed(2)}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">Mileage:</div>
                          <div className="text-right font-medium">
                            ${project.mileageCost.toFixed(2)} ({project.mileage} mi)
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">Other:</div>
                          <div className="text-right font-medium">${project.other.toFixed(2)}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="col-span-1 md:col-span-2">
                  <CardHeader>
                    <CardTitle>Expense Categories</CardTitle>
                    <CardDescription>Distribution of expenses by category</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                        <Legend />
                      </RePieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {categoryData.map((category, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">${category.value.toFixed(2)}</span>
                        <span className="text-muted-foreground text-sm">
                          {(category.value / 23974.46 * 100).toFixed(1)}% of total
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Cost Comparison</CardTitle>
                  <CardDescription>Estimated vs. actual costs by project</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart
                      data={comparisonData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                      <Legend />
                      <Bar dataKey="estimatedCost" name="Estimated" fill="#2563eb" />
                      <Bar dataKey="actualCost" name="Actual" fill="#10b981" />
                    </ReBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Budget Variance Analysis</CardTitle>
                    <CardDescription>How projects compare to estimates</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReLineChart
                        data={comparisonData.map(item => ({
                          name: item.name,
                          variance: ((item.actualCost - item.estimatedCost) / item.estimatedCost * 100),
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis unit="%" />
                        <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                        <Legend />
                        <Line type="monotone" dataKey="variance" name="Variance %" stroke="#6366f1" activeDot={{ r: 8 }} />
                      </ReLineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cost Analysis Insights</CardTitle>
                    <CardDescription>Key takeaways from project data</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] overflow-auto">
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg bg-muted/50">
                        <h3 className="font-semibold mb-2">Overall Budget Performance</h3>
                        <p className="text-sm text-muted-foreground">
                          Projects are running approximately 15% over initial estimates on average, 
                          with material costs being the primary factor.
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted/50">
                        <h3 className="font-semibold mb-2">Kitchen Renovation Analysis</h3>
                        <p className="text-sm text-muted-foreground">
                          The Kitchen Renovation project is 17.6% over budget primarily due to increased 
                          material costs and additional labor hours.
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted/50">
                        <h3 className="font-semibold mb-2">Mileage Efficiency</h3>
                        <p className="text-sm text-muted-foreground">
                          Mileage expenses represent only 1.3% of total project costs, indicating 
                          efficient trip planning and job scheduling.
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted/50">
                        <h3 className="font-semibold mb-2">Recommended Actions</h3>
                        <p className="text-sm text-muted-foreground">
                          Adjust material cost estimates by 12-15% for future projects to account 
                          for current market pricing trends.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
