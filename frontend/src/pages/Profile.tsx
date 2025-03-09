
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Mail, Lock, User, Github } from "lucide-react";
import { AvatarColorPicker } from "@/components/ui-custom/AvatarColorPicker";
import { useTheme } from "@/contexts/ThemeContext";

const Profile = () => {
  // Theme state
  const { theme, setTheme } = useTheme();
  
  // State for login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // State for register form
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  
  // State for profile (if logged in)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john@example.com",
    joinedDate: "January 2023"
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This would connect to a backend for authentication
    // For now, we'll simulate a successful login
    setTimeout(() => {
      setIsLoggedIn(true);
      toast.success("Login successful", {
        description: "Welcome back to your account"
      });
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This would connect to a backend for registration
    // For now, we'll simulate a successful registration
    setTimeout(() => {
      setIsLoggedIn(true);
      setUserData({
        ...userData,
        name: registerName,
        email: registerEmail
      });
      toast.success("Registration successful", {
        description: "Your account has been created"
      });
    }, 1000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast("Logged out successfully", {
      description: "You have been securely logged out"
    });
  };

  const handleOAuthLogin = (provider: string) => {
    // This would initiate OAuth flow
    toast("Redirecting to " + provider, {
      description: "You will be redirected to complete authentication"
    });
    
    // Simulate successful login
    setTimeout(() => {
      setIsLoggedIn(true);
      toast.success("Login successful", {
        description: `You've been authenticated with ${provider}`
      });
    }, 1500);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    toast.success(`Theme switched to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  };

  if (isLoggedIn) {
    // Show user profile when logged in
    return (
      <div className="space-y-6 max-w-3xl mx-auto py-4">
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Manage your personal information and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 pb-6 border-b">
              <div className="flex-shrink-0">
                <AvatarColorPicker size="lg" />
              </div>
              <div className="space-y-1 flex-grow">
                <h3 className="text-xl font-semibold">{userData.name}</h3>
                <p className="text-muted-foreground">{userData.email}</p>
                <p className="text-sm text-muted-foreground">Member since {userData.joinedDate}</p>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" placeholder="Enter current password to change it" />
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" placeholder="New password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button>Save Changes</Button>
              <Button variant="outline" onClick={handleLogout}>Logout</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the application looks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Use dark theme for the application</p>
                </div>
                <Switch 
                  checked={theme === 'dark'} 
                  onCheckedChange={toggleTheme} 
                />
              </div>
              
              <div>
                <p className="font-medium mb-3">Theme Color</p>
                <p className="text-sm text-muted-foreground mb-4">Customize your theme with different colors</p>
                <div className="flex flex-wrap gap-3 items-center">
                  <p className="text-sm">Click your avatar to change theme color:</p>
                  <AvatarColorPicker size="md" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
            <CardDescription>Manage your connected social accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Github className="h-6 w-6" />
                  <div>
                    <p className="font-medium">GitHub</p>
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Connect</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-6 w-6" />
                  <div>
                    <p className="font-medium">Google</p>
                    <p className="text-sm text-muted-foreground">Connected as {userData.email}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Disconnect</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show login/register when not logged in
  return (
    <div className="space-y-6 max-w-md mx-auto py-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
        <p className="text-muted-foreground mt-2">Sign in to access your account and trading bot</p>
      </div>
      
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input 
                    id="login-email" 
                    type="email" 
                    placeholder="your@email.com" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Password</Label>
                    <a href="#" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <Input 
                    id="login-password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" leadingIcon={<Lock size={16} />}>
                  Sign In
                </Button>
              </form>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => handleOAuthLogin("GitHub")}
                    leadingIcon={<Github size={16} />}
                  >
                    GitHub
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleOAuthLogin("Google")}
                    leadingIcon={<Mail size={16} />}
                  >
                    Google
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>
                Enter your information to create a new account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Full Name</Label>
                  <Input 
                    id="register-name" 
                    placeholder="John Doe" 
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input 
                    id="register-email" 
                    type="email" 
                    placeholder="your@email.com" 
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input 
                    id="register-password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" leadingIcon={<User size={16} />}>
                  Create Account
                </Button>
              </form>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => handleOAuthLogin("GitHub")}
                    leadingIcon={<Github size={16} />}
                  >
                    GitHub
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleOAuthLogin("Google")}
                    leadingIcon={<Mail size={16} />}
                  >
                    Google
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;