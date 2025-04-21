"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Wand2,
  MapPin,
  DollarSign,
  Leaf,
  Accessibility,
  TreePine,
  RefreshCw,
} from "lucide-react";
import { countries, getStatesByCountry, getCitiesByState } from "@/data/location-data";

interface ProjectData {
  name: string;
  description: string;
  landDimensions: {
    length: string;
    width: string;
    totalArea: string;
  };
  landUnit: string;
  budget: string;
  currency: string;
  location: {
    country: string;
    state: string;
    city: string;
    region: string;
  };
  preferences: {
    rooms: {
      bedrooms: number;
      bathrooms: number;
      kitchen: boolean;
      livingRoom: boolean;
      diningRoom: boolean;
      study: boolean;
      garage: boolean;
      additionalRooms: string[];
    };
    style: string;
    stories: number;
    energyEfficient: boolean;
    accessibility: boolean;
    outdoorSpace: boolean;
  };
  floorPlanTemplateId?: string;
  floorPlan?: {
    projectId?: string;
    userId?: string;
    imageUrl: string;
    description?: string;
    generatedBy?: string;
    style?: string;
    stories?: number;
    rooms?: {
      bedrooms: number;
      bathrooms: number;
    };
    dimensions?: {
      width: number;
      length: number;
      unit: string;
    };
  };
  generatedFloorPlan?: any;
}

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (projectData: ProjectData) => void;
}

// Import location data from our data file

export function CreateProjectDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateProjectDialogProps) {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [floorPlanTemplates, setFloorPlanTemplates] = useState<any[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [designers, setDesigners] = useState<any[]>([]);
  const [isLoadingDesigners, setIsLoadingDesigners] = useState(false);
  const [projectData, setProjectData] = useState<ProjectData>({
    name: "",
    description: "",
    landDimensions: {
      length: "",
      width: "",
      totalArea: "",
    },
    landUnit: "sq ft",
    budget: "",
    currency: "USD",
    location: {
      country: "United States",
      state: "",
      city: "",
      region: "",
    },
    preferences: {
      rooms: {
        bedrooms: 2,
        bathrooms: 2,
        kitchen: true,
        livingRoom: true,
        diningRoom: true,
        study: false,
        garage: false,
        additionalRooms: [],
      },
      style: "Modern",
      stories: 1,
      energyEfficient: true,
      accessibility: false,
      outdoorSpace: true,
    },
    floorPlanTemplateId: "",
  });

  // State to track the active tab in step 5
  const [activeTab, setActiveTab] = useState("templates");

  // Fetch data when the dialog opens or tab changes
  useEffect(() => {
    if (open && step === 5) {
      if (activeTab === "templates") {
        fetchFloorPlanTemplates();
      } else if (activeTab === "designers") {
        fetchDesigners();
      }
    }
  }, [open, step, activeTab]);

  // Fetch designers when location changes or when we reach step 5 and the designers tab is active
  useEffect(() => {
    if (step === 5 && activeTab === "designers") {
      // Only fetch if we have some location data
      if (projectData.location.city || projectData.location.state || projectData.location.country) {
        console.log('Fetching designers for location:', projectData.location);
        fetchDesigners();
      }
    }
  }, [projectData.location.city, projectData.location.state, projectData.location.country, step, activeTab]);

  // Function to fetch floor plan templates
  const fetchFloorPlanTemplates = async () => {
    try {
      setIsLoadingTemplates(true);
      console.log('Fetching floor plan templates...');

      // Use the new API endpoint that doesn't require authentication
      const response = await fetch('/api/templates');
      const data = await response.json();

      console.log('API response:', data);

      if (data.success && data.templates && data.templates.length > 0) {
        setFloorPlanTemplates(data.templates);
        console.log('Loaded templates:', data.templates);
      } else {
        console.warn('No templates returned from API, using fallback templates');
        // Fallback to hardcoded templates
        setFloorPlanTemplates([
          {
            projectId: 'project-1',
            name: 'Modern House Floor Plan',
            style: 'modern',
            imageUrl: '/uploads/floor-plans/project-1/modern-floor-plan.svg',
            bedrooms: 3,
            bathrooms: 2
          },
          {
            projectId: 'project-2',
            name: 'Farmhouse Floor Plan',
            style: 'farmhouse',
            imageUrl: '/uploads/floor-plans/project-2/farmhouse-floor-plan.svg',
            bedrooms: 4,
            bathrooms: 3
          },
          {
            projectId: 'project-3',
            name: 'Cottage Floor Plan',
            style: 'cottage',
            imageUrl: '/uploads/floor-plans/project-3/cottage-floor-plan.svg',
            bedrooms: 2,
            bathrooms: 1
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching floor plan templates:', error);
      toast.error('Failed to load floor plan templates');

      // Fallback to hardcoded templates on error
      setFloorPlanTemplates([
        {
          projectId: 'project-1',
          name: 'Modern House Floor Plan',
          style: 'modern',
          imageUrl: '/uploads/floor-plans/project-1/modern-floor-plan.svg',
          bedrooms: 3,
          bathrooms: 2
        },
        {
          projectId: 'project-2',
          name: 'Farmhouse Floor Plan',
          style: 'farmhouse',
          imageUrl: '/uploads/floor-plans/project-2/farmhouse-floor-plan.svg',
          bedrooms: 4,
          bathrooms: 3
        },
        {
          projectId: 'project-3',
          name: 'Cottage Floor Plan',
          style: 'cottage',
          imageUrl: '/uploads/floor-plans/project-3/cottage-floor-plan.svg',
          bedrooms: 2,
          bathrooms: 1
        }
      ]);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  // Function to fetch real-time designers based on location
  const fetchDesigners = async () => {
    try {
      setIsLoadingDesigners(true);
      console.log('Fetching designers for location:', projectData.location);

      // Format location for API request
      const locationString = [
        projectData.location.city,
        projectData.location.state,
        projectData.location.country
      ].filter(Boolean).join(', ');

      if (!locationString) {
        console.warn('No location specified, using default location');
        toast.warning('Please specify a location to find local designers');
      }

      const apiUrl = `/api/real-time/designers?location=${encodeURIComponent(locationString || 'New York, USA')}`;
      console.log('Calling API:', apiUrl);

      // Use the real-time designers API
      const response = await fetch(apiUrl);
      const data = await response.json();

      console.log('Designers API response:', data);

      if (data.success && data.designers && data.designers.length > 0) {
        setDesigners(data.designers);
        console.log('Loaded designers:', data.designers);
        toast.success(`Found ${data.designers.length} designers in ${locationString || 'your area'}`);
      } else {
        console.warn('No designers returned from API, using fallback designers');
        // Set fallback designers
        setDesigners([
          {
            id: "designer-1",
            name: "Sarah Johnson",
            company: "Modern Space Designs",
            experience: 12,
            specialization: "Modern",
            bio: "Award-winning designer with a passion for creating functional, beautiful spaces. Sarah has worked on projects across the country and brings a unique perspective to each design.",
            phone: "(212) 555-1234",
            email: "sarah@modernspacedesigns.com",
            portfolio: "Specializes in open-concept living spaces with clean lines and sustainable materials.",
            imageUrl: "/uploads/designers/designer-1.jpg"
          },
          {
            id: "designer-2",
            name: "Michael Chen",
            company: "Harmony Interiors",
            experience: 15,
            specialization: "Contemporary",
            bio: "Michael blends Eastern and Western design philosophies to create harmonious living spaces. His work emphasizes balance, flow, and connection to nature.",
            phone: "(212) 555-5678",
            email: "michael@harmonyinteriors.com",
            portfolio: "Known for innovative use of natural light and indoor gardens.",
            imageUrl: "/uploads/designers/designer-2.jpg"
          },
          {
            id: "designer-3",
            name: "Emily Rodriguez",
            company: "Classic Revival",
            experience: 8,
            specialization: "Traditional",
            bio: "Emily specializes in breathing new life into traditional design elements. She has a keen eye for detail and a deep appreciation for craftsmanship.",
            phone: "(212) 555-9012",
            email: "emily@classicrevival.com",
            portfolio: "Focuses on elegant, timeless interiors with modern functionality.",
            imageUrl: "/uploads/designers/designer-3.jpg"
          }
        ]);
        toast.info('Using sample designers for demonstration');
      }
    } catch (error) {
      console.error('Error fetching designers:', error);
      toast.error('Failed to load designers for your area');

      // Set fallback designers on error
      setDesigners([
        {
          id: "designer-1",
          name: "Sarah Johnson",
          company: "Modern Space Designs",
          experience: 12,
          specialization: "Modern",
          bio: "Award-winning designer with a passion for creating functional, beautiful spaces.",
          phone: "(212) 555-1234",
          email: "sarah@modernspacedesigns.com",
          imageUrl: "/uploads/designers/designer-1.jpg"
        },
        {
          id: "designer-2",
          name: "Michael Chen",
          company: "Harmony Interiors",
          experience: 15,
          specialization: "Contemporary",
          bio: "Michael blends Eastern and Western design philosophies to create harmonious living spaces.",
          phone: "(212) 555-5678",
          email: "michael@harmonyinteriors.com",
          imageUrl: "/uploads/designers/designer-2.jpg"
        }
      ]);
    } finally {
      setIsLoadingDesigners(false);
    }
  };

  // Get available states and cities based on current selections
  const getAvailableStates = useCallback(() => {
    const countryCode = countries.find(c => c.name === projectData.location.country)?.code || "US";
    return getStatesByCountry(countryCode);
  }, [projectData.location.country]);

  const getAvailableCities = useCallback(() => {
    if (!projectData.location.state) return [];
    const availableStates = getAvailableStates();
    const stateCode = availableStates.find(s => s.name === projectData.location.state)?.code || "";
    const citiesList = stateCode ? getCitiesByState(stateCode) : [];
    return citiesList;
  }, [projectData.location.state, projectData.location.country]);

  // Use state to store these values to ensure they're updated properly
  interface State {
    code: string;
    name: string;
  }

  const [availableStates, setAvailableStates] = useState<State[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  // Update available states and cities when country or state changes
  useEffect(() => {
    const states = getAvailableStates();
    setAvailableStates(states);
  }, [projectData.location.country, getAvailableStates]);

  useEffect(() => {
    const cities = getAvailableCities();
    setAvailableCities(cities);

    // Debug log
    console.log('Updated cities for state:', {
      state: projectData.location.state,
      citiesCount: cities.length,
      cities: cities
    });
  }, [projectData.location.state, getAvailableCities]);

  // Handle country change with special logic
  const handleCountryChange = useCallback((value: string) => {
    const newCountry = value;
    const countryCode = countries.find(c => c.name === newCountry)?.code || "US";
    const newStates = getStatesByCountry(countryCode);

    // Check if current state is valid for the new country
    const currentState = projectData.location.state;
    const isStateValid = currentState ? newStates.some(s => s.name === currentState) : false;

    if (isStateValid) {
      // Keep state but check if city is still valid
      const stateCode = newStates.find(s => s.name === currentState)?.code || "";
      const newCities = stateCode ? getCitiesByState(stateCode) : [];
      const currentCity = projectData.location.city;
      const isCityValid = currentCity ? newCities.includes(currentCity) : false;

      setProjectData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          country: newCountry,
          city: isCityValid ? currentCity : ""
        }
      }));
    } else {
      // Reset both state and city
      setProjectData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          country: newCountry,
          state: "",
          city: ""
        }
      }));
    }
  }, [projectData.location.state, projectData.location.city]);

  // Handle state change with special logic
  const handleStateChange = useCallback((value: string) => {
    const newState = value;

    // Always reset city when state changes
    setProjectData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        state: newState,
        city: ""
      }
    }));

    // Log the state change
    console.log(`State changed to ${newState}`);
  }, []);

  // Handle city change
  const handleCityChange = useCallback((value: string) => {
    console.log(`City selected: ${value}`);
    setProjectData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        city: value
      }
    }));
  }, []);

  // Handle region change
  const handleRegionChange = useCallback((value: string) => {
    setProjectData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        region: value
      }
    }));
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setProjectData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  // Removed unused handleLocationChange function

  const handleSelectChange = useCallback(
    (field: string, value: string) => {
      setProjectData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleDimensionChange = useCallback(
    (field: string, value: string) => {
      setProjectData((prev) => {
        const newDimensions = { ...prev.landDimensions, [field]: value };

        if (field === "length" || field === "width") {
          const length =
            field === "length"
              ? parseFloat(value) || 0
              : parseFloat(prev.landDimensions.length) || 0;
          const width =
            field === "width"
              ? parseFloat(value) || 0
              : parseFloat(prev.landDimensions.width) || 0;

          if (length > 0 && width > 0) {
            newDimensions.totalArea = (length * width).toString();
          }
        }

        return {
          ...prev,
          landDimensions: newDimensions,
        };
      });
    },
    []
  );

  const handlePreferenceChange = useCallback(
    (category: "rooms" | "" | undefined, field: string, value: any) => {
      setProjectData((prev) => {
        if (!category) {
          return {
            ...prev,
            preferences: {
              ...prev.preferences,
              [field]: value,
            },
          };
        }

        if (category === "rooms") {
          return {
            ...prev,
            preferences: {
              ...prev.preferences,
              rooms: {
                ...prev.preferences.rooms,
                [field]: value,
              },
            },
          };
        }

        return {
          ...prev,
          preferences: {
            ...prev.preferences,
            [category]: value,
          },
        };
      });
    },
    [setProjectData]
  );
  const handleRoomChange = useCallback(
    (room: string, value: boolean) => {
      setProjectData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          rooms: {
            ...prev.preferences.rooms,
            [room]: value,
          },
        },
      }));
    },
    []
  );

  const handleNext = useCallback(() => {
    if (step === 1) {
      if (!projectData.name || !projectData.description) {
        toast.error("Please fill in all required fields");
        return;
      }
    } else if (step === 2) {
      if (
        !projectData.landDimensions.length ||
        !projectData.landDimensions.width ||
        !projectData.budget
      ) {
        toast.error("Please fill in all required fields");
        return;
      }
    } else if (step === 3) {
      if (
        !projectData.location.country ||
        !projectData.location.state ||
        !projectData.location.city
      ) {
        toast.error("Please fill in all location fields");
        return;
      }
    }

    setStep(step + 1);
  }, [step, projectData]);

  const handleBack = useCallback(() => {
    setStep(step - 1);
  }, [step]);

  const handleSubmit = useCallback(async () => {
    try {
      const length = parseFloat(projectData.landDimensions.length) || 0;
      const width = parseFloat(projectData.landDimensions.width) || 0;
      const totalArea = (length * width).toString();

      // Check if we have a generated floor plan
      // This is useful for debugging and future enhancements

      const finalProjectData = {
        ...projectData,
        landDimensions: {
          ...projectData.landDimensions,
          totalArea,
        },
        budget: projectData.budget,
        // Don't set userId here - let the API handle it with the authenticated user
      };

      console.log('Creating project with data:', finalProjectData);
      toast.info('Creating your project...');

      // Try to create the project using our new API
      try {
        const response = await fetch('/api/project-create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(finalProjectData),
        });

        const data = await response.json();

        if (data.success) {
          console.log('Project created successfully via direct API:', data.project);
          toast.success('Project created successfully!');

          // Redirect to the projects page to see the new project
          console.log('Redirecting to projects page...');

          // First, try to verify the project was created by calling the debug API
          try {
            const verifyResponse = await fetch('/api/debug/projects');
            if (verifyResponse.ok) {
              const verifyData = await verifyResponse.json();
              console.log('Verify projects response:', verifyData);

              if (verifyData.projects && verifyData.projects.length > 0) {
                console.log(`Verified ${verifyData.projects.length} projects exist in database`);
              } else {
                console.warn('No projects found in database after creation');

                // Try to fix projects
                const fixResponse = await fetch('/api/debug/fix-projects');
                if (fixResponse.ok) {
                  const fixData = await fixResponse.json();
                  console.log('Fix projects response:', fixData);
                }
              }
            }
          } catch (verifyError) {
            console.error('Error verifying project creation:', verifyError);
          }

          // Add a small delay to ensure the project is saved before redirecting
          setTimeout(() => {
            // Force a hard refresh to ensure the projects list is updated
            window.location.href = '/dashboard/projects?refresh=' + new Date().getTime();
          }, 2000);
        } else {
          console.error('Error creating project via direct API:', data.error);
          // Fall back to the original method
          onSubmit(finalProjectData);
        }
      } catch (error) {
        console.error('Error creating project via direct API:', error);
        // Fall back to the original method
        onSubmit(finalProjectData);
      }

      // Reset form
      setStep(1);
      setProjectData({
        name: "",
        description: "",
        landDimensions: {
          length: "",
          width: "",
          totalArea: "",
        },
        landUnit: "sq ft",
        budget: "",
        currency: "USD",
        location: {
          country: "United States",
          state: "",
          city: "",
          region: "",
        },
        preferences: {
          rooms: {
            bedrooms: 2,
            bathrooms: 2,
            kitchen: true,
            livingRoom: true,
            diningRoom: true,
            study: false,
            garage: false,
            additionalRooms: [],
          },
          style: "Modern",
          stories: 1,
          energyEfficient: true,
          accessibility: false,
          outdoorSpace: true,
        },
        floorPlanTemplateId: "",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error('Failed to create project. Please try again.');
    }
  }, [projectData, onSubmit, onOpenChange]);

  // State to track the generated floor plan for display in the preview tab

  const handleGenerateAI = useCallback(async () => {
    try {
      setIsGenerating(true);

      // Prepare project data for AI generation
      const length = parseFloat(projectData.landDimensions.length) || 0;
      const width = parseFloat(projectData.landDimensions.width) || 0;
      const totalArea = (length * width).toString();

      const aiProjectData = {
        ...projectData,
        landDimensions: {
          ...projectData.landDimensions,
          totalArea,
        },
        userId: "anonymous", // Use anonymous user ID for now
      };

      console.log('Generating real-time floor plan with data:', aiProjectData);
      toast.info('Generating your floor plan... This may take a moment.');

      // Call the real-time floor plan API
      const response = await fetch('/api/real-time/floor-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aiProjectData),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Floor plan generated successfully:', data.floorPlan);
        toast.success('Floor plan generated successfully!');

        // Store the generated floor plan in the project data

        // Update the project data with the floor plan
        setProjectData(prev => ({
          ...prev,
          floorPlan: data.floorPlan,
          generatedFloorPlan: data.floorPlan, // Add to project data for submission
        }));

        // Switch to the preview tab to show the generated floor plan
        setActiveTab("preview");
      } else {
        console.error('Error generating floor plan:', data.error);
        toast.error('Failed to generate floor plan. Please try again.');
      }
    } catch (error) {
      console.error('Error in handleGenerateAI:', error);
      toast.error('Failed to generate floor plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [projectData, setActiveTab]);

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white sm:max-w-[450px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription className="text-slate-400">
            Fill in the details to create a new construction project
          </DialogDescription>
        </DialogHeader>

        <div className="relative overflow-hidden py-2">
          <div className="flex justify-between mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  i === step
                    ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white"
                    : i < step
                    ? "bg-teal-900/50 text-teal-400"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                {i}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={projectData.name}
                    onChange={handleChange}
                    placeholder="Modern Villa"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={projectData.description}
                    onChange={handleChange}
                    placeholder="A brief description of your project"
                    className="bg-slate-700 border-slate-600 min-h-[100px]"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label>Land Dimensions</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="length" className="text-sm text-slate-400">
                        Length
                      </Label>
                      <div className="flex">
                        <Input
                          id="length"
                          type="number"
                          value={projectData.landDimensions.length}
                          onChange={(e) =>
                            handleDimensionChange("length", e.target.value)
                          }
                          placeholder="40"
                          className="bg-slate-700 border-slate-600 rounded-r-none"
                        />
                        <div className="px-3 py-2 bg-slate-700 border border-slate-600 border-l-0 rounded-r-md text-slate-400">
                          {projectData.landUnit.split(" ")[0]}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="width" className="text-sm text-slate-400">
                        Width
                      </Label>
                      <div className="flex">
                        <Input
                          id="width"
                          type="number"
                          value={projectData.landDimensions.width}
                          onChange={(e) =>
                            handleDimensionChange("width", e.target.value)
                          }
                          placeholder="30"
                          className="bg-slate-700 border-slate-600 rounded-r-none"
                        />
                        <div className="px-3 py-2 bg-slate-700 border border-slate-600 border-l-0 rounded-r-md text-slate-400">
                          {projectData.landUnit.split(" ")[0]}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="flex justify-between">
                      <Label
                        htmlFor="totalArea"
                        className="text-sm text-slate-400"
                      >
                        Total Area
                      </Label>
                      <span className="text-sm text-teal-400">
                        {projectData.landDimensions.totalArea
                          ? parseFloat(
                              projectData.landDimensions.totalArea
                            ).toLocaleString()
                          : "0"}{" "}
                        {projectData.landUnit}
                      </span>
                    </div>
                    <Select
                      value={projectData.landUnit}
                      onValueChange={(value) =>
                        handleSelectChange("landUnit", value)
                      }
                    >
                      <SelectTrigger className="w-full mt-1 bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="sq ft">Square Feet (sq ft)</SelectItem>
                        <SelectItem value="sq m">Square Meters (sq m)</SelectItem>
                        <SelectItem value="acres">Acres</SelectItem>
                        <SelectItem value="hectares">Hectares</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2 mt-6">
                  <Label htmlFor="budget">Budget</Label>
                  <div className="flex">
                    <Select
                      value={projectData.currency}
                      onValueChange={(value) =>
                        handleSelectChange("currency", value)
                      }
                    >
                      <SelectTrigger className="w-[100px] bg-slate-700 border-slate-600 rounded-r-none">
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                        <SelectItem value="AUD">AUD (A$)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="budget"
                      name="budget"
                      type="number"
                      value={projectData.budget}
                      onChange={handleChange}
                      placeholder="50000"
                      className="bg-slate-700 border-slate-600 border-l-0 rounded-l-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={projectData.location.country}
                    onValueChange={handleCountryChange}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 max-h-[200px] overflow-y-auto">
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Select
                    value={projectData.location.state}
                    onValueChange={handleStateChange}
                    disabled={availableStates.length === 0}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder={availableStates.length === 0 ? "Select country first" : "Select state"} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 max-h-[200px] overflow-y-auto">
                      {availableStates.length > 0 ? (
                        availableStates.map((state) => (
                          <SelectItem key={state.code} value={state.name}>
                            {state.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-4 text-center text-slate-400">
                          No states available for this country
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Select
                    value={projectData.location.city}
                    onValueChange={handleCityChange}
                    disabled={availableCities.length === 0}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder={availableCities.length === 0 ? "Select state first" : "Select city"} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 max-h-[200px] overflow-y-auto">
                      {availableCities.length > 0 ? (
                        availableCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-4 text-center text-slate-400">
                          {projectData.location.state ? "No cities available for this state" : "Please select a state first"}
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Region/Area (Optional)</Label>
                  <Input
                    id="region"
                    value={projectData.location.region}
                    onChange={(e) => handleRegionChange(e.target.value)}
                    placeholder="e.g., Downtown, Suburb, etc."
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <div className="space-y-3">
                  <div>
                    <Label className="text-base font-medium">
                      Building Preferences
                    </Label>
                    <p className="text-xs text-slate-400 mt-1">
                      Customize your floor plan requirements
                    </p>
                  </div>

                  {/* Compact Room Configuration */}
                  <div className="space-y-2">
                    <Label className="text-sm">Room Configuration</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-1">
                        <Label htmlFor="bedrooms" className="text-xs text-slate-400 w-16">
                          Bedrooms
                        </Label>
                        <Select
                          value={projectData.preferences.rooms.bedrooms.toString()}
                          onValueChange={(value) =>
                            handlePreferenceChange("rooms", "bedrooms", parseInt(value))
                          }
                        >
                          <SelectTrigger className="bg-slate-700 border-slate-600 h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Label htmlFor="bathrooms" className="text-xs text-slate-400 w-16">
                          Bathrooms
                        </Label>
                        <Select
                          value={projectData.preferences.rooms.bathrooms.toString()}
                          onValueChange={(value) =>
                            handlePreferenceChange("rooms", "bathrooms", parseInt(value))
                          }
                        >
                          <SelectTrigger className="bg-slate-700 border-slate-600 h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            {[1, 2, 3, 4, 5].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Room Checkboxes */}
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1">
                      <div className="flex items-center space-x-1">
                        <Checkbox
                          id="kitchen"
                          checked={projectData.preferences.rooms.kitchen}
                          onCheckedChange={(checked) =>
                            handleRoomChange("kitchen", checked as boolean)
                          }
                          className="bg-slate-700 border-slate-600 h-3 w-3"
                        />
                        <Label htmlFor="kitchen" className="text-xs text-slate-300">
                          Kitchen
                        </Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Checkbox
                          id="livingRoom"
                          checked={projectData.preferences.rooms.livingRoom}
                          onCheckedChange={(checked) =>
                            handleRoomChange("livingRoom", checked as boolean)
                          }
                          className="bg-slate-700 border-slate-600 h-3 w-3"
                        />
                        <Label htmlFor="livingRoom" className="text-xs text-slate-300">
                          Living Room
                        </Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Checkbox
                          id="diningRoom"
                          checked={projectData.preferences.rooms.diningRoom}
                          onCheckedChange={(checked) =>
                            handleRoomChange("diningRoom", checked as boolean)
                          }
                          className="bg-slate-700 border-slate-600 h-3 w-3"
                        />
                        <Label htmlFor="diningRoom" className="text-xs text-slate-300">
                          Dining Room
                        </Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Checkbox
                          id="study"
                          checked={projectData.preferences.rooms.study}
                          onCheckedChange={(checked) =>
                            handleRoomChange("study", checked as boolean)
                          }
                          className="bg-slate-700 border-slate-600 h-3 w-3"
                        />
                        <Label htmlFor="study" className="text-xs text-slate-300">
                          Study/Office
                        </Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Checkbox
                          id="garage"
                          checked={projectData.preferences.rooms.garage}
                          onCheckedChange={(checked) =>
                            handleRoomChange("garage", checked as boolean)
                          }
                          className="bg-slate-700 border-slate-600 h-3 w-3"
                        />
                        <Label htmlFor="garage" className="text-xs text-slate-300">
                          Garage
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Building Style */}
                  <div className="space-y-1">
                    <Label className="text-sm">Building Style</Label>
                    <Select
                      value={projectData.preferences.style}
                      onValueChange={(value) =>
                        handlePreferenceChange("", "style", value)
                      }
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="Modern">Modern</SelectItem>
                        <SelectItem value="Traditional">Traditional</SelectItem>
                        <SelectItem value="Contemporary">Contemporary</SelectItem>
                        <SelectItem value="Minimalist">Minimalist</SelectItem>
                        <SelectItem value="Industrial">Industrial</SelectItem>
                        <SelectItem value="Farmhouse">Farmhouse</SelectItem>
                        <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                        <SelectItem value="Colonial">Colonial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Number of Stories */}
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <Label className="text-sm">Number of Stories</Label>
                      <span className="text-xs text-teal-400">
                        {projectData.preferences.stories}
                      </span>
                    </div>
                    <Select
                      value={projectData.preferences.stories.toString()}
                      onValueChange={(value) =>
                        handlePreferenceChange("", "stories", parseInt(value))
                      }
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="1">Single Story</SelectItem>
                        <SelectItem value="2">Two Stories</SelectItem>
                        <SelectItem value="3">Three Stories</SelectItem>
                        <SelectItem value="4">Four Stories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Additional Features */}
                  <div className="space-y-1">
                    <Label className="text-sm">Additional Features</Label>
                    <div className="grid grid-cols-1 gap-1">
                      <div className="flex items-center space-x-1">
                        <Checkbox
                          id="energyEfficient"
                          checked={projectData.preferences.energyEfficient}
                          onCheckedChange={(checked) =>
                            handlePreferenceChange("", "energyEfficient", checked as boolean)
                          }
                          className="bg-slate-700 border-slate-600 h-3 w-3"
                        />
                        <Label
                          htmlFor="energyEfficient"
                          className="text-xs text-slate-300 flex items-center"
                        >
                          <Leaf className="h-3 w-3 mr-1 text-green-500" />
                          Energy Efficient Design
                        </Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Checkbox
                          id="accessibility"
                          checked={projectData.preferences.accessibility}
                          onCheckedChange={(checked) =>
                            handlePreferenceChange("", "accessibility", checked as boolean)
                          }
                          className="bg-slate-700 border-slate-600 h-3 w-3"
                        />
                        <Label
                          htmlFor="accessibility"
                          className="text-xs text-slate-300 flex items-center"
                        >
                          <Accessibility className="h-3 w-3 mr-1 text-blue-500" />
                          Accessibility Features
                        </Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Checkbox
                          id="outdoorSpace"
                          checked={projectData.preferences.outdoorSpace}
                          onCheckedChange={(checked) =>
                            handlePreferenceChange("", "outdoorSpace", checked as boolean)
                          }
                          className="bg-slate-700 border-slate-600 h-3 w-3"
                        />
                        <Label
                          htmlFor="outdoorSpace"
                          className="text-xs text-slate-300 flex items-center"
                        >
                          <TreePine className="h-3 w-3 mr-1 text-teal-500" />
                          Outdoor Living Space
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium text-white">
                    Project Created Successfully!
                  </h3>
                  <p className="text-slate-400">
                    Choose a floor plan template or generate an AI floor plan
                  </p>
                </div>

                <Tabs defaultValue="templates" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="bg-slate-700 border border-slate-600">
                    <TabsTrigger
                      value="preview"
                      className="data-[state=active]:bg-slate-600"
                    >
                      <Building2 className="mr-2 h-4 w-4" /> Preview
                    </TabsTrigger>
                    <TabsTrigger
                      value="templates"
                      className="data-[state=active]:bg-slate-600"
                    >
                      <Building2 className="mr-2 h-4 w-4" /> Templates
                    </TabsTrigger>
                    <TabsTrigger
                      value="ai"
                      className="data-[state=active]:bg-slate-600"
                    >
                      <Wand2 className="mr-2 h-4 w-4" /> AI Tools
                    </TabsTrigger>
                    <TabsTrigger
                      value="designers"
                      className="data-[state=active]:bg-slate-600"
                    >
                      <MapPin className="mr-2 h-4 w-4" /> Designers
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="preview" className="mt-4 space-y-4">
                    <div className="bg-slate-700 p-4 rounded-md space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Building2 className="h-5 w-5 text-teal-400 mr-2" />
                          <span className="text-white font-medium">
                            {projectData.name}
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm">
                          {projectData.description}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center text-slate-400">
                            <MapPin className="h-4 w-4 mr-1 text-slate-500" />
                            {projectData.location.city},{" "}
                            {projectData.location.state},{" "}
                            {projectData.location.country}
                          </div>
                          <div className="flex items-center text-slate-400">
                            <DollarSign className="h-4 w-4 mr-1 text-slate-500" />
                            {projectData.currency} {projectData.budget}
                          </div>
                        </div>
                      </div>

                      {/* Generated Floor Plan Preview */}
                      {projectData.floorPlan && (
                        <div className="border border-slate-600 rounded-md overflow-hidden">
                          <div className="bg-slate-800 p-2 flex justify-between items-center">
                            <h5 className="text-white text-sm font-medium">Generated Floor Plan</h5>
                            <Badge variant="outline" className="text-xs border-teal-500 text-teal-400">
                              {projectData.floorPlan.style || 'Custom'} Style
                            </Badge>
                          </div>
                          <div className="relative h-64 w-full bg-slate-900">
                            <Image
                              src={projectData.floorPlan.imageUrl}
                              alt="Generated Floor Plan"
                              fill
                              style={{ objectFit: 'contain' }}
                            />
                          </div>
                          <div className="p-3 bg-slate-800 border-t border-slate-700">
                            <div className="flex justify-between text-xs text-slate-400 mb-2">
                              <span>Bedrooms: {projectData.floorPlan.rooms?.bedrooms || projectData.preferences.rooms.bedrooms}</span>
                              <span>Bathrooms: {projectData.floorPlan.rooms?.bathrooms || projectData.preferences.rooms.bathrooms}</span>
                              <span>Stories: {projectData.floorPlan.stories || projectData.preferences.stories}</span>
                            </div>
                            <div className="max-h-32 overflow-y-auto text-xs text-slate-400 bg-slate-900 p-2 rounded">
                              {projectData.floorPlan.description ? (
                                <div className="whitespace-pre-line">{projectData.floorPlan.description}</div>
                              ) : (
                                <p>No description available</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {!projectData.floorPlan && (
                        <div className="text-center py-6 border border-dashed border-slate-600 rounded-md">
                          <Wand2 className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                          <p className="text-slate-400 mb-3">No floor plan generated yet</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-teal-500 text-teal-400 hover:bg-teal-500/10"
                            onClick={() => setActiveTab("ai")}
                          >
                            Generate Floor Plan
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="templates" className="mt-4 space-y-4">
                    <div className="bg-slate-700 p-4 rounded-md">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-white font-medium">
                          Floor Plan Templates
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-300 hover:text-white"
                          onClick={fetchFloorPlanTemplates}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                        </Button>
                      </div>

                      {isLoadingTemplates ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
                        </div>
                      ) : floorPlanTemplates.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                          {floorPlanTemplates.map((template) => (
                            <div
                              key={template.projectId}
                              className={`relative border-2 rounded-md overflow-hidden cursor-pointer transition-all ${projectData.floorPlanTemplateId === template.projectId ? 'border-teal-500 ring-2 ring-teal-500/50' : 'border-slate-600 hover:border-slate-500'}`}
                              onClick={() => setProjectData(prev => ({ ...prev, floorPlanTemplateId: template.projectId }))}
                            >
                              <div className="relative h-40 w-full">
                                <Image
                                  src={template.imageUrl}
                                  alt={template.name || 'Floor plan template'}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                              <div className="p-2 bg-slate-800">
                                <p className="text-sm text-white truncate">{template.style} Style</p>
                                <p className="text-xs text-slate-400">{template.bedrooms} bed, {template.bathrooms} bath</p>
                              </div>
                              {projectData.floorPlanTemplateId === template.projectId && (
                                <div className="absolute top-2 right-2 bg-teal-500 text-white p-1 rounded-full">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-slate-400 mb-4">No floor plan templates available</p>
                          <Button
                            variant="outline"
                            className="border-slate-600 text-slate-300"
                            onClick={fetchFloorPlanTemplates}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" /> Try Again
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="ai" className="mt-4 space-y-4">
                    <div className="bg-slate-700 p-4 rounded-md text-center">
                      <Wand2 className="h-10 w-10 text-teal-400 mx-auto mb-2" />
                      <h4 className="text-white font-medium mb-2">
                        Generate AI Floor Plan
                      </h4>
                      <p className="text-slate-300 text-sm mb-4">
                        Our AI will create a custom floor plan based on your
                        project details.
                      </p>
                      <Button
                        onClick={handleGenerateAI}
                        disabled={isGenerating}
                        className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
                      >
                        {isGenerating ? "Generating..." : "Generate Floor Plan"}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="designers" className="mt-4 space-y-4">
                    <div className="bg-slate-700 p-4 rounded-md">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-white font-medium">
                          Local Designers in {projectData.location.city || projectData.location.state || projectData.location.country || 'Your Area'}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-300 hover:text-white"
                          onClick={fetchDesigners}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                        </Button>
                      </div>

                      {isLoadingDesigners ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
                        </div>
                      ) : designers.length > 0 ? (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                          {designers.map((designer) => (
                            <div
                              key={designer.id}
                              className="bg-slate-800 p-3 rounded-md border border-slate-700 hover:border-slate-600 transition-colors"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-full bg-slate-700 flex-shrink-0 overflow-hidden">
                                  {designer.imageUrl ? (
                                    <Image
                                      src={designer.imageUrl}
                                      alt={designer.name}
                                      width={48}
                                      height={48}
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                                      {designer.name.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h5 className="text-white text-sm font-medium">{designer.name}</h5>
                                  <p className="text-teal-400 text-xs">{designer.company}</p>
                                  <p className="text-slate-400 text-xs mt-1">{designer.specialization} • {designer.experience} years exp.</p>
                                  <p className="text-slate-500 text-xs mt-2">{designer.bio}</p>
                                  <div className="mt-2 flex items-center gap-3">
                                    <div className="text-xs text-slate-400">{designer.phone}</div>
                                    <div className="text-xs text-slate-400">{designer.email}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-slate-400 mb-4">For more designers in your area</p>
                          <Button
                            variant="outline"
                            className="border-teal-500 text-teal-400 hover:bg-teal-500/10"
                            onClick={() => window.location.href = '/designers'}
                          >
                            <MapPin className="h-4 w-4 mr-2" /> Visit Designers Page
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="flex justify-between">
          {step > 1 && step < 5 ? (
            <Button
              variant="outline"
              onClick={handleBack}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Back
            </Button>
          ) : (
            <div></div>
          )}

          {step < 5 ? (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
            >
              Create Project
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}