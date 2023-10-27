'use client';
import React, { MutableRefObject, useContext, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  doesPasswordHaveCapitalLetter,
  doesPasswordHaveNumber,
  isEmailValid,
} from '@/utils/Validations';
import { toast } from './ui/use-toast';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useNextAuthStore } from '@/stores/NextAuthStore';
import axios from 'axios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const LoginAndRegister = () => {
  const { data } = useSession();
  const usernameRef = useRef() as MutableRefObject<HTMLInputElement>;
  const emailRef = useRef() as MutableRefObject<HTMLInputElement>;
  const passwordRef = useRef() as MutableRefObject<HTMLInputElement>;
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignUp = async () => {
    // If all input values aren't null
    if (emailRef.current.value && passwordRef.current.value && usernameRef.current.value) {
      const email = emailRef.current.value;
      const username = usernameRef.current.value;
      const password = passwordRef.current.value;
      if (!isEmailValid(email))
        return toast({
          variant: 'destructive',
          title: 'Failed to Register',
          description: 'Email is not valid',
        });

      if (!doesPasswordHaveCapitalLetter(password))
        return toast({
          variant: 'destructive',
          title: 'Failed to Register',
          description: 'Password does not have a capital letter',
        });

      if (!doesPasswordHaveNumber(password))
        return toast({
          variant: 'destructive',
          title: 'Failed to Register',
          description: 'Password does not have a number',
        });

      setLoading(true);
      await axios
        .post('/externalApi/auth/register/', {
          username,
          email,
          password,
        })
        .then(response => response.data)
        .then(async response_data => {
          if (response_data.status === 'ok') {
            await signIn('credentials', {
              email,
              password,
              redirect: false,
            });
            return toast({
              title: 'Registered successfully',
            });
          } else {
            throw response_data.message.message;
          }
        })
        .catch(error => {
          toast({
            variant: 'destructive',
            title: 'Failed to Register',
            description: error,
          });
        });
      setLoading(false);
      return;
    }
    return toast({
      variant: 'destructive',
      title: 'Failed to Register',
      description: 'Please enter all fields',
    });
  };

  const validateSignIn = () => {
    if (!emailRef.current.value || !passwordRef.current.value) {
      toast({
        variant: 'destructive',
        title: 'Failed to login',
        description: 'Email or password is not set',
      });
      return false;
    }
    if (emailRef.current.value.length < 6 || passwordRef.current.value.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Failed to login',
        description: 'Email and password must be at least 6 characters long',
      });
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    if (validateSignIn()) {
      // If emailRef and passordRef aren't null
      if (emailRef.current && passwordRef.current) {
        setLoading(true);
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        await signIn('credentials', {
          email,
          password,
          redirect: false,
        });
        setLoading(false);
      }
    }
  };
  return (
    <>
      {!data?.user.email ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={'ghost'}>Login</Button>
          </DialogTrigger>
          <DialogContent>
            <Tabs defaultValue="login" className="w-full pt-5">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Login to your account to access all features</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        placeholder="user"
                        ref={emailRef}
                        onKeyDown={event => {
                          if (event.key === 'Enter') {
                            handleSignIn();
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        placeholder="******"
                        type="password"
                        ref={passwordRef}
                        onKeyDown={event => {
                          if (event.key === 'Enter') {
                            handleSignIn();
                          }
                        }}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSignIn} disabled={loading}>
                      Sign in
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>Create your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" type="name" placeholder="user" ref={usernameRef} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email">E-mail</Label>
                      <Input id="email" type="email" placeholder="user@gmail.com" ref={emailRef} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="******" ref={passwordRef} />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSignUp} disabled={loading}>
                      Sign Up
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">Profile</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="text-center">{data?.user?.username}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>Stats</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                signOut();
                useNextAuthStore.setState({
                  session: null,
                });
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default LoginAndRegister;
