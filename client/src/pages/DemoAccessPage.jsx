import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { authenticateDemo } from "../api/demo.js";
import { useNavigate } from "react-router-dom";

const DEMO_PASSWORD = "demo";

export default function DemoAccessPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function onEnterDemo() {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await authenticateDemo(DEMO_PASSWORD);

      if (res.authenticated) {
        navigate("/");
        return;
      }

      setErrorMessage("Demo access failed. Please try again.");
    } catch (err) {
      setErrorMessage(err.message || "Demo access failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div data-testid="demo-access-page" className="h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-5">
        <CardHeader>
          <CardTitle className="text-xl">Inventra Demo</CardTitle>
          <CardDescription>Controlled demo environment with seeded sample data.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {errorMessage && (
            <p data-testid="error-message" className="text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          <Button type="button" onClick={onEnterDemo} disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Entering..." : "Enter"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
