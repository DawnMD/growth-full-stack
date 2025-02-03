"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const formSchema = z
  .object({
    weight: z.number().min(20).max(500),
    height: z.number().min(50).max(300).optional(),
    heightImage: z.instanceof(File).optional(),
  })
  .refine((data) => data.height ?? data.heightImage, {
    message: "Either height or height image is required",
    path: ["height"],
  });
export default function AddMetricsForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"manual" | "image">("manual");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: undefined,
      height: undefined,
      heightImage: undefined,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("heightImage", file);
    } else {
      setImagePreview(null);
      form.setValue("heightImage", undefined);
    }
  };

  const apiUtils = api.useUtils();

  const { mutate: addHealthMetrics, isPending: isAddingHealthMetrics } =
    api.growth.addHealthMetrics.useMutation({
      onSuccess: async () => {
        toast({
          title: "Metrics added successfully",
          description: "Your health metrics have been updated.",
        });
        form.reset();
        await apiUtils.userProfile.getUserProfileData.invalidate();
        router.push("/dashboard");
      },
      onError: () => {
        toast({
          title: "Error",
          description: "There was a problem adding your metrics.",
          variant: "destructive",
        });
      },
    });

  const {
    mutateAsync: getHeightFromImage,
    isPending: isGettingHeightFromImage,
  } = api.growth.getHeightFromImage.useMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Here you would typically send the data to your API
      console.log(values);

      if (activeTab === "image" && values.heightImage) {
        const height = await getHeightFromImage(values.heightImage);

        addHealthMetrics({
          weight: values.weight,
          height: height,
        });
      } else {
        addHealthMetrics({
          weight: values.weight,
          height: values.height!,
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "There was a problem adding your metrics.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Add Health Metrics</CardTitle>
        <CardDescription>Enter your current weight and height</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your weight"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your weight in kilograms
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as "manual" | "image")
              }
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                <TabsTrigger value="image">Image Upload</TabsTrigger>
              </TabsList>
              <TabsContent value="manual">
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter your height"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Enter your height in centimeters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="image">
                <FormField
                  control={form.control}
                  name="heightImage"
                  render={() => (
                    <FormItem>
                      <FormLabel>Height Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload an image to determine your height
                      </FormDescription>
                      <FormMessage />
                      {imagePreview && (
                        <div className="mt-2">
                          <Image
                            src={imagePreview}
                            width={100}
                            height={100}
                            alt="Height preview"
                            className="h-auto max-h-48 max-w-full rounded-lg"
                          />
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <Button
              type="submit"
              disabled={isAddingHealthMetrics || isGettingHeightFromImage}
            >
              {isAddingHealthMetrics || isGettingHeightFromImage
                ? "Submitting..."
                : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
