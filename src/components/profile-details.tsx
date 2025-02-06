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
import { states } from "@/data/states";
import { api } from "@/trpc/react";
import { useClerk } from "@clerk/nextjs";
import { Check, Cross, Pin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Legend,
  Line,
  LineChart,
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
  const { signOut } = useClerk();
  const router = useRouter();
  const { data: userProfileData, isLoading } =
    api.student.getStudentProfile.useQuery();

  const formattedHeightData =
    userProfileData?.heights?.map((data) => ({
      ...data,
      height: data.height,
      createdAt: new Date(data.createdAt).toLocaleDateString(),
    })) ?? [];

  const formattedWeightData =
    userProfileData?.weights?.map((data) => ({
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
    router.push(`/student/upload-new-measurement`);
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
          <Button
            onClick={() =>
              signOut({
                redirectUrl: "/",
              })
            }
          >
            Signout
          </Button>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Report</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="grid w-full grid-cols-4 gap-4">
            <div className="flex flex-col items-center justify-center">
              <p>Name</p>
              <p>
                {userProfileData?.firstName} {userProfileData?.lastName}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p>Age</p>
              <p>{userProfileData?.age} years</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p>Gender</p>
              <p>{userProfileData?.gender}</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p>State</p>
              <p>
                {
                  states.find(
                    (state) => state.abbreviation === userProfileData?.state,
                  )?.name
                }
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p>Weight</p>
              <p>{userProfileData?.latestWeight} kg</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p>Height</p>
              <p>{userProfileData?.latestHeight} cm</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p>BMI</p>
              <p>
                {/* bmi from weight and height, weight in kgs and height in cm */}
                {/* convert height to meters */}
                {userProfileData?.latestWeight
                  ? (
                      userProfileData?.latestWeight /
                      (((userProfileData?.latestHeight / 100) *
                        userProfileData?.latestHeight) /
                        100)
                    ).toFixed(2)
                  : "N/A"}
                kg/m²
              </p>
            </div>
          </div>
          <p>Nutritional status: Normal, but at a risk of mild malnutrition</p>
          <div className="flex flex-col gap-4">
            <p className="text-center">health and nutritional assessment</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <p>Height-for-Age: Within normal range</p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <p>Weight-for-Height: Proportionate growth observed</p>
              </div>
              <div className="flex items-center gap-2">
                <Cross className="h-4 w-4 text-red-500" />
                <p>
                  Dietary Deficiencies Identified: Slight deficiency in iron and
                  vitamin D
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Cross className="h-4 w-4 text-red-500" />
                <p>
                  Risk Factors: Prone to seasonal infections due to lower
                  immunity
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-center">action plan for growth optimization</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Pin className="h-4 w-4 text-yellow-500" />
                <p>Short term (3 months):</p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <p>
                  Include more iron-rich foods like spinach, jaggery, and
                  lentils
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <p>Increase sun exposure for vitamin D</p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <p>
                  Regular weight and height tracking using AI-based MAAP tool
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Pin className="h-4 w-4 text-yellow-500" />
                <p>Long term (6-12 months):</p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <p>Balanced diet ensuring complete micronutrient needs</p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <p>Deworming every 6 months as per pediatrician advice</p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <p>Annual nutritional screening</p>
              </div>
            </div>
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
