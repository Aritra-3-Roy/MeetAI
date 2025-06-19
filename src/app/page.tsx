"use client";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import {Button} from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { on } from "events";
import { se } from "date-fns/locale";
export default function Home() {

  const { data: session } = authClient.useSession() 

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    await authClient.signUp.email({
        email, // user email address
        name, // user password -> min 8 characters by default
        password, // user display name
    }, {
      onError: () => {
        window.alert("Something went wrong, please try again.");
      },
      onSuccess: () => {
        window.alert("User created successfully!");
      }
  });
  };

  const onLogin = async () => {
    await authClient.signIn.email({
        email, // user email address
        password, // user display name
    }, {
      onError: () => {
        window.alert("Something went wrong, please try again.");
      },
      onSuccess: () => {
        window.alert("User created successfully!");
      }
  });
  };

  if(session) {
    return (
      <div className="flex flex-col p-4 gap-y-4">
        <p>Welcome back, {session.user.name}!</p>
        <Button onClick={() => authClient.signOut()} className="w-full">
        Sign Out
      </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-10">
      <div className="p-4 flex flex-col gap-y-4">
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={onSubmit} className="w-full">
        Create User
      </Button>
    </div>
    <div className="p-4 flex flex-col gap-y-4">
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={onLogin} className="w-full">
        Login
      </Button>
    </div>
    </div>
  );
}
