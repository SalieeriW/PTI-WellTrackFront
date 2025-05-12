"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserSettingsComponent from "@/components/user-setting";
import PasswordSettingsComponent from "@/components/password-setting";

export default function AccoutManagement() {
  const tabs = [
    {
      value: "account",
      title: "Account",
      description:
        "Update your personal information here. Click save when you're done.",
      content: <UserSettingsComponent />,
    },
    {
      value: "password",
      title: "Password",
      description: "Change your password here.",
      content: <PasswordSettingsComponent />,
    },
  ];

  return (
    <Tabs defaultValue={tabs[0].value} className="w-full h-full">
      <TabsList className="grid grid-cols-1 sm:grid-cols-2 w-full mb-6">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="w-full h-full"
        >
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{tab.title}</CardTitle>
              <CardDescription>{tab.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">{tab.content}</CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
