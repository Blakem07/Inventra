import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { authenticateDemo } from "../api/demo.js";
import { useNavigate } from "react-router-dom";

export default function DemoAccessPage() {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  function onChange(e) {
    setPassword(e.target.value);
  }

  async function onSubmit(e) {
    e.preventDefault();

    try {
      const res = await authenticateDemo(password);
      console.log(res);

      if (res.authenticated) {
        setErrorMessage("");
        navigate("/");
      }
    } catch (err) {
      setErrorMessage(err.message);
    }
  }

  return (
    <div data-testid="demo-access-page" className="h-screen flex items-center justify-center">
      <Card className="w-full max-w-md p-5">
        <CardHeader>
          <CardTitle className="text-xl">Inventra Demo Access</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={onChange} />
              {errorMessage && (
                <span data-testid="error-message" className="text-sm text-red-600">
                  {errorMessage}
                </span>
              )}
            </div>

            <Button type="submit" className="w-full">
              Enter
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
