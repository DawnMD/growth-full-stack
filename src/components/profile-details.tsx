"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

type CustomTooltipProps = TooltipProps<number, string> & {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded border bg-background p-3 shadow">
        <p className="font-semibold">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value?.toFixed(1) ?? "N/A"}{" "}
            {entry.name?.includes("Weight") ? "kg" : "cm"}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const chartConfig = {
  weight: {
    userWeight: {
      label: "Your Weight",
      color: "hsl(var(--chart-1))",
    },
    avgWeight: {
      label: "Average Weight",
      color: "hsl(var(--chart-2))",
    },
  },
  height: {
    userHeight: {
      label: "Your Height",
      color: "hsl(var(--chart-1))",
    },
    avgHeight: {
      label: "Average Height",
      color: "hsl(var(--chart-2))",
    },
  },
};

export default function ProfileDetails() {
  const router = useRouter();
  const { data: userProfileData, isLoading } =
    api.userProfile.getUserProfileData.useQuery();

  const formattedHeightData =
    userProfileData?.height?.map((data) => ({
      ...data,
      height: data.height,
      createdAt: new Date(data.createdAt).toLocaleDateString(),
    })) ?? [];

  const formattedWeightData =
    userProfileData?.weight?.map((data) => ({
      ...data,
      weight: data.weight,
      createdAt: data.createdAt.toLocaleDateString(),
    })) ?? [];

  // Dunmmy data for average weight
  const averageWeightData = Array.from({ length: 10 }, (_, i) => ({
    createdAt: new Date(
      Date.now() - i * 1000 * 60 * 60 * 24,
    ).toLocaleDateString(),
    weight: Math.random() * 10 + 50,
  }));

  // Dummy data for average height
  const averageHeightData = Array.from({ length: 10 }, (_, i) => ({
    createdAt: new Date(
      Date.now() - i * 1000 * 60 * 60 * 24,
    ).toLocaleDateString(),
    height: Math.random() * 10 + 150,
  }));

  const [activeTab, setActiveTab] = useState("weight");

  const handleAddNewMeasurement = () => {
    router.push(`/upload-new-measurement`);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto space-y-6 p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={userProfileData?.profilePicture}
              alt={userProfileData?.firstName}
            />
            <AvatarFallback>
              {userProfileData?.firstName
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold">
              {userProfileData?.firstName} {userProfileData?.lastName}
            </h2>

            <p>Age: {userProfileData?.age ?? "N/A"} years</p>
            <p>Weight: {userProfileData?.latestWeight ?? "N/A"} kg</p>
            <p>Height: {userProfileData?.latestHeight ?? "N/A"} cm</p>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Health Metrics Over Time</CardTitle>
            <Button onClick={handleAddNewMeasurement}>
              Add New Measurement
            </Button>
          </div>
          <CardDescription>
            Track your progress and compare with others
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "weight" | "height")
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="weight">Weight</TabsTrigger>
              <TabsTrigger value="height">Height</TabsTrigger>
            </TabsList>
            <TabsContent value="weight">
              {formattedWeightData && formattedWeightData.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <ChartContainer
                    config={{ userWeight: chartConfig.weight.userWeight }}
                    className="h-[300px]"
                  >
                    <LineChart data={formattedWeightData}>
                      <XAxis dataKey="createdAt" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        name="Your Weight"
                        stroke="var(--color-userWeight)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ChartContainer>
                  <ChartContainer
                    config={{ avgWeight: chartConfig.weight.avgWeight }}
                    className="h-[300px]"
                  >
                    <LineChart data={averageWeightData}>
                      <XAxis dataKey="createdAt" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        name="Average Weight"
                        stroke="var(--color-avgWeight)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  No average weight data available
                </div>
              )}
            </TabsContent>
            <TabsContent value="height">
              {formattedHeightData && formattedHeightData.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <ChartContainer
                    config={{ userHeight: chartConfig.height.userHeight }}
                    className="h-[300px]"
                  >
                    <LineChart data={formattedHeightData}>
                      <XAxis dataKey="createdAt" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="height"
                        name="Your Height"
                        stroke="var(--color-userHeight)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ChartContainer>
                  <ChartContainer
                    config={{ avgHeight: chartConfig.height.avgHeight }}
                    className="h-[300px]"
                  >
                    <LineChart data={averageHeightData}>
                      <XAxis dataKey="createdAt" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="height"
                        name="Average Height"
                        stroke="var(--color-avgHeight)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  No average height data available
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
