import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";

import WidgetHeader from "./header";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

const formSchema = z.object({
  name: z.string().min(1, "Name is required "),
  email: z.string().email("Invalid email address"),
});

type FormSchema = z.infer<typeof formSchema>;

// TODO: fetch real organizationId
const organizationId = "1234";

const WidgetAuthScreen = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const createContactSession = useMutation(api.public.contactSessions.create);

  const onSubmit = async (values: FormSchema) => {
    if (!organizationId) return;
    const metadata = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages?.join(""),
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      viewPortSize: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      cookieEnabled: navigator.cookieEnabled,
      referrer: document.referrer || "direct",
      currentUrl: window.location.href,
    };

    const contactSessionId = await createContactSession({
      ...values,
      organizationId,
      metadata,
    });
    console.log(contactSessionId);
  };
  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hi there 👋</p>
          <p className="text-lg">Let&apos;s get you started</p>
        </div>
      </WidgetHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-y-4 p-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    className="bg-background h-10"
                    placeholder="e.g. Ben Brown"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormMessage />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className="bg-background h-10"
                    placeholder="e.g. ben.brown@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormMessage />
          <Button
            disabled={form.formState.isSubmitting}
            size="lg"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};

export default WidgetAuthScreen;
