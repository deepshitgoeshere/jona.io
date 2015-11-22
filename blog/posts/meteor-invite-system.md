---
title: How to create an invite-based login system in Meteor
short: meteor-invitesystem
date: 2015-10-27
description: It's easy, really!
author: jona
---

Some sites want to restrict registration and require users who want to sign up to have some kind of registration token. Today we're going to look at how to implement that in Meteor.

Our goal is to provide a registration form that can only be submitted when there is an invitation token supplied (as a query string). The URL will look something like this: `http://our.site/register?token=30wnepwd2e`.

By the way, the code is in CoffeeScript, and we're using Iron Router and collection2.

So let's get started by defining some routes:
```coffeescript
# lib/router.coffee
Router.configure
  layoutTemplate: 'mainLayout'
  notFoundTemplate: '404'

Router.route '/', ->
  this.render 'staticMain'
,
  name: 'root'
```

Now, we're going to deviate from the norm which is `accounts-ui` and use the fantastic `useraccounts` package system, which means you want to install a package that's preconfigured for a CSS framework or the unstyled version, which you can customize yourself. I'll just go with Bootstrap:

```bash
meteor add useraccounts:bootstrap
meteor add useraccounts:iron-routing
# If you haven't installed Bootstrap:
meteor add twbs:bootstrap
# or (needs configuration):
meteor add reywood:bootstrap3-sass
```

Let's configure useraccounts:

```coffeescript
# lib/config/useraccounts.coffee
AccountsTemplates.addField
  _id: 'username'
  type: 'text'
  displayName: 'username'
  required: true
  minLength: 2
  lowercase: true

AccountsTemplates.removeField 'email'
AccountsTemplates.addField
  _id: 'email'
  type: 'email'
  required: true
  re: /.+@(.+){2,}\.(.+){2,}/

AccountsTemplates.removeField 'password'
AccountsTemplates.addField
  _id: 'password'
  type: 'password'
  required: true
  minLength: 5

AccountsTemplates.configure
  defaultLayout: 'mainLayout'
  texts:
    signUpLink_pre: ''
    signUpLink_link: ''

AccountsTemplates.configureRoute 'signIn',
  path: 'login'

AccountsTemplates.configureRoute 'signUp',
  path: 'register'
```

So far, so good. Now that we have a working registration and login system, let's lock it down to require an invitation to sign up. First, we want to create a database document to hold our invites in (since users can't just use any random code):

```coffeescript
# models/UserInvitation.coffee
@UserInvitations = new Mongo.Collection 'invitations'

userInvitationSchema = new SimpleSchema
  token:
    type: String
    min: 19
    max: 20
  used:
    type: Boolean

UserInvitations.attachSchema(userInvitationSchema)
```

We create the `used` field because it's always wise to keep tokens instead of deleting them, for whatever purpose (You can, though). Next, let's add some tokens via the Meteor mongo console:

```bash
meteor mongo
meteor:PRIMARY> db.invitations.insert({token: 'aaaaaaaaaaaaaaaaaaaa', used: false});
```

The `used:false` is VERY important, otherwise the system will be unable to find that token.

This is where it gets kinda tricky. We need to make sure the router provides the invitation query string to the template, and to the useraccounts system. We do this by modifying the useraccounts register route:

```coffeescript
# lib/config/useraccounts.coffee
AccountsTemplates.configureRoute 'signUp',
  path: 'register'
  layoutTemplate: 'mainLayout'
  name: 'register'
  data: ->
    { invitationToken: this.params.query.token }
```

We provide the `invitationToken` as data for the template. Next up, we'll add a field to the registration form that will get filled with the invitation token provided by the router in the next part. Let's add it:

```coffeescript
# lib/config/useraccounts.coffee
AccountsTemplates.addField
  _id: 'invitationToken'
  type: 'hidden'
```

So far, so good. Now we have a field that's submitted with the rest of the registration form, and goes in the users `profile` field in the database document (`user.profile.token`). Next up, we'll create a hook that runs right after the form is submitted, and fills said field with the actual token. We'll modify the `AccountsTemplates.configure` block:

```coffeescript
AccountsTemplates.configure
  defaultLayout: 'mainLayout'
  texts:
    signUpLink_pre: ''
    signUpLink_link: ''
  preSignUpHook: (pwd, info) ->
    info.profile.invitationToken = Template.instance().data.invitationToken
```

As you can see, the profile field, which corresponds to the form field we added before, is getting filled with the `invitationToken` variable passed down from the router.

Now it's time for the serverside part. Let's add a `Accounts.validateNewUser` hook:

```coffeescript
# server/hooks.coffee
Accounts.validateNewUser (user) ->
  invitation = UserInvitations.findOne
    token: user.profile.invitationToken
    used: false
  if !invitation
    throw new Meteor.Error(403, 'Please provide a valid invitation.')
  UserInvitations.update
    token: user.profile.invitationToken
    used: false
  ,
    $set:
      used: true
  return true
```

We'll find the invitation in the database, and if it doesn't exist, we'll just throw and error. We also update the record to be 'used'. It even displays nicely if we provide an invalid token:

![image](http://i.pomf.pl/suwwlx.png)

And that's pretty much it! It's up to you to decide how you want to create and distribute tokens. Maybe you'll be able to create them via an admin dashboard or just manually, who knows!

What you can do now, however, is redirect back somewhere if there's no token provided at all, something like this:

```coffeescript
# lib/router.js
Router.onBeforeAction ->
  if !this.params.query.token
    Router.go('/')
  this.next()
, {only: 'register'}
```

If someone not logged in visits the `/register` route and doesn't have a `?token=something` query string, they'll automatically be redirected back to the main page (or anywhere else you'd like!).

Try and visit http://localhost:3000/register?token=aaaaaaaaaaaaaaaaaaaa, and see if signing up works!

If there's any questions that remain after this (or if it doesn't work because I've missed something), or if you just want to say hello, email me at [jona@schisma.co](mailto:jona@schisma.co). Toodles
