'use client';
import React, { MutableRefObject, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { validateSingUp } from '@musidle-guess-todays-song/util-user-validation';
import { toast } from './ui/use-toast';
import { signIn, useSession } from 'next-auth/react';
import axios from 'axios';
import UserMenu from './UserMenu';

function LoginAndRegister() {
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
      try {
        validateSingUp(email, password, username);
        setLoading(true);

        await axios
          .post('/externalApi/auth/register/', {
            username,
            email,
            password,
          })
          .then(response => response.data)
          .then(async responseData => {
            if (responseData.status === 'ok') {
              await signIn('credentials', {
                email,
                password,
                redirect: false,
              }).catch(error => {
                toast({
                  variant: 'destructive',
                  title: 'Failed to login',
                  description: error,
                });
              });
              return toast({
                title: 'Registered successfully, please check your email to verify your account',
              });
            } else {
              throw responseData.message.message;
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
      } catch (error) {
        if (error instanceof Error) {
          return toast({
            variant: 'destructive',
            title: 'Failed to Register',
            description: error.message,
          });
        }
      }
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
        }).then(response => {
          if (response?.error) {
            return toast({
              variant: 'destructive',
              title: 'Failed to login',
              description: response.error,
            });
          }
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
                      <Input
                        id="username"
                        type="name"
                        placeholder="user"
                        ref={usernameRef}
                        onKeyDown={event => {
                          if (event.key === 'Enter') {
                            handleSignUp();
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="user@gmail.com"
                        ref={emailRef}
                        onKeyDown={event => {
                          if (event.key === 'Enter') {
                            handleSignUp();
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="******"
                        ref={passwordRef}
                        onKeyDown={event => {
                          if (event.key === 'Enter') {
                            handleSignUp();
                          }
                        }}
                      />
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
        <UserMenu />
      )}
    </>
  );
}

export default LoginAndRegister;
