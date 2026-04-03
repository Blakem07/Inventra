import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function DemoAccessPage() {
  return (
    <div data-testid="demo-access-page" className="h-screen flex items-center justify-center ">
      <Card className="w-full max-w-md p-5">
        <CardHeader>
          <CardTitle className="text-xl">Inventra Demo Access</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>

          <Button className="w-full">Enter</Button>
        </CardContent>
      </Card>
    </div>
  );
}
