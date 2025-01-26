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
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

// Mock data for the user profile
// const userProfile = {
//   name: "John Doe",
//   email: "john.doe@example.com",
//   age: 30,
//   weight: 75, // in kg
//   height: 180, // in cm
//   profilePicture: "/placeholder.svg",
// };

// Mock data for height over a month
// const heightData = [
//   { date: "2023-05-01", height: 180 },
//   { date: "2023-05-08", height: 180.2 },
//   { date: "2023-05-15", height: 180.5 },
//   { date: "2023-05-22", height: 180.3 },
//   { date: "2023-05-29", height: 180.7 },
// ];

const cmToFtIn = (cm: number) => {
  const inches = cm / 2.54;
  const feet = Math.floor(inches / 12);
  const remainingInches = (inches % 12).toFixed(1);
  return `${feet}'${remainingInches}"`;
};

export default function ProfileDetails() {
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const router = useRouter();
  const { data: userProfileData, isLoading } =
    api.userProfile.getUserProfileData.useQuery();

  const formattedHeightData = userProfileData?.height?.map((data) => ({
    ...data,
    height:
      heightUnit === "cm"
        ? data.height
        : Number.parseFloat(cmToFtIn(data.height)?.split("'")[0] ?? "0"),
  }));

  const handleAddNewHeight = () => {
    router.push("/upload-height-image");
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={userProfileData?.profilePicture}
                alt={userProfileData?.firstName ?? "User"}
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
                {userProfileData?.firstName}
              </h2>
              {/* <p className="text-gray-500">{userProfileData?.email}</p> */}
              <p>Age: {userProfileData?.age} years</p>
              <p>Weight: {userProfileData?.weight} kg</p>
              <p>
                Height:{" "}
                {heightUnit === "cm"
                  ? `${userProfileData?.latestHeight} cm`
                  : cmToFtIn(userProfileData?.latestHeight ?? 0)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Height Over Time</CardTitle>
              <CardDescription>
                Your height measurements for the past month
              </CardDescription>
            </div>
            <Button onClick={handleAddNewHeight}>Add New Height</Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex justify-end">
              <Select
                value={heightUnit}
                onValueChange={(value: "cm" | "ft") => setHeightUnit(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cm">Centimeters (cm)</SelectItem>
                  <SelectItem value="ft">
                    Feet and Inches (ft&apos;in)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ChartContainer
              config={{
                height: {
                  label: heightUnit === "cm" ? "Height (cm)" : "Height (ft'in)",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedHeightData}>
                  <XAxis dataKey="date" />
                  <YAxis
                    dataKey="height"
                    domain={heightUnit === "cm" ? ["auto", "auto"] : [5.9, 6]}
                    tickFormatter={(value: number) =>
                      heightUnit === "cm"
                        ? value.toFixed(1)
                        : `${value.toFixed(1)}'`
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="height"
                    stroke="var(--color-height)"
                    strokeWidth={2}
                  />
                  <ChartTooltip
                    content={({ payload, label }) => {
                      if (payload?.length) {
                        const value = payload[0]?.value as number;
                        return (
                          <div className="bg-background rounded p-2 shadow">
                            <p className="font-semibold">{label}</p>
                            <p>
                              Height:{" "}
                              {heightUnit === "cm"
                                ? `${value.toFixed(1)} cm`
                                : cmToFtIn(value)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
