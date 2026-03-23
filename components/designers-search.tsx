"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Building, Star, MessageSquare } from "lucide-react";
import Image from "next/image";

interface Designer {
  id: string;
  name: string;
  company: string;
  experience: number;
  specialization: string;
  bio: string;
  phone: string;
  email: string;
  website?: string;
  portfolio?: string;
  imageUrl?: string;
  rating?: number;
  projects?: number;
  location?: string;
  address?: string;
  mapsUrl?: string;
}

export function DesignersSearch() {
  const [searchLocation, setSearchLocation] = useState("");
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDesigners = async (location: string) => {
    try {
      setIsLoading(true);
      setError("");
      setDesigners([]);

      const response = await fetch(`/api/real-time/designers?location=${encodeURIComponent(location)}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.designers) && data.designers.length > 0) {
        const enhancedDesigners = data.designers.map((designer: Designer) => ({
          ...designer,
          imageUrl: designer.imageUrl || "/placeholder-user.jpg",
          projects: designer.projects || Math.floor(Math.random() * 100) + 50,
          location: designer.location || location,
        }));

        setDesigners(enhancedDesigners);
        return;
      }

      setDesigners([]);
      setError(`No designers found in ${location}. Try another location.`);
    } catch (err) {
      console.error("Error fetching designers:", err);
      setError("Failed to fetch designers. Please try again.");
      setDesigners([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchLocation.trim()) {
      fetchDesigners(searchLocation);
    }
  };

  useEffect(() => {
    fetchDesigners("New York, NY");
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Find Local Designers</h1>
        <p className="text-slate-400">Connect with top-rated designers and architects in your area</p>

        <form onSubmit={handleSearch} className="mt-4 flex gap-2">
          <Input
            type="text"
            placeholder="Enter city, state or country (e.g., New York, NY)"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="flex-1 bg-slate-800 border-slate-700 text-white"
          />
          <Button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white" disabled={isLoading}>
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </form>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-100 p-4 rounded-md mb-6">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {designers.map((designer, index) => {
          const safeName = designer.name || "Design Partner";
          const safeRating = Number(designer.rating || 4.5);
          const safeProjects = Number(designer.projects || 0);
          const safeSpecialization = designer.specialization || "Interior Design";
          const safeLocation = designer.location || designer.address || designer.company || "Local Area";

          return (
            <Card key={designer.id || `${safeName}-${index}`} className="bg-slate-800 border-slate-700 overflow-hidden">
              <CardContent className="p-0">
                <div className="flex p-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-700 mr-4 flex-shrink-0">
                    {designer.imageUrl ? (
                      <Image
                        src={designer.imageUrl}
                        alt={safeName}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                        unoptimized={designer.imageUrl.startsWith("http")}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-xl font-bold">
                        {safeName.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white">{safeName}</h3>

                    <div className="flex items-center mt-1 mb-2">
                      <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= Math.floor(safeRating) ? "fill-yellow-400" : "fill-transparent"}`}
                          />
                        ))}
                      </div>
                      <span className="text-yellow-400 ml-1">{safeRating.toFixed(1)}</span>
                      <span className="text-slate-400 text-sm ml-2">({safeProjects} projects)</span>
                    </div>

                    <div className="flex items-center text-slate-400 text-sm mb-1">
                      <Building className="h-4 w-4 mr-1" />
                      <span>{safeSpecialization}</span>
                    </div>

                    <div className="flex items-center text-slate-400 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{safeLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-700 p-3">
                  <div className="space-y-2">
                    {(designer.phone || designer.email) && (
                      <div className="text-xs text-slate-400 truncate">
                        {designer.phone && <span className="block">Phone: {designer.phone}</span>}
                        {designer.email && <span className="block">Email: {designer.email}</span>}
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
                        onClick={() => {
                          if (designer.website) {
                            window.open(designer.website, "_blank");
                          } else {
                            alert(`Contact ${safeName} at ${designer.email || "N/A"} or ${designer.phone || "N/A"}`);
                          }
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" /> Contact
                      </Button>

                      {designer.mapsUrl && (
                        <Button
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          onClick={() => window.open(designer.mapsUrl, "_blank")}
                        >
                          <MapPin className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {designers.length > 0 && (
        <div className="mt-6 text-center">
          <Button variant="outline" className="border-slate-600 text-slate-400 hover:bg-slate-700">
            Load More Designers
          </Button>
        </div>
      )}
    </div>
  );
}
