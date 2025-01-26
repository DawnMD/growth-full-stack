"use client";

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
import { toast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const formSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .png, .webp and .gif formats are supported.",
    ),
});

export default function ImageUploadForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();
  const apiUtils = api.useUtils();
  const addHeightImageMutation = api.growth.addHeightImage.useMutation({
    onSuccess: () => {
      void apiUtils.userProfile.getUserProfileData.invalidate();
      router.push("/dashboard");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values.image);
    addHeightImageMutation.mutate();
    // toast({
    //   title: "File uploaded",
    //   description: `Filename: ${values.image.name}, Size: ${(values.image.size / 1024 / 1024).toFixed(2)}MB`,
    // });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("image", file);
    } else {
      setPreview(null);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Image Upload</CardTitle>
        <CardDescription>Upload and preview an image file.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES.join(",")}
                      onChange={handleFileChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload an image (max 5MB, .jpg, .png, .webp, or .gif)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {preview && (
              <div className="mt-4">
                <h3 className="mb-2 text-lg font-semibold">Preview:</h3>
                <div className="relative h-64 w-full">
                  <Image
                    src={preview || "/placeholder.svg"}
                    alt="Preview"
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={!preview || addHeightImageMutation.isPending}
            >
              Upload
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
