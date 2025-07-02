---
title: 'Capistrano recipe and howto for Rails, Mongrel, and Nginx'
date: 2008-01-10T00:00:00.000Z
tags:
  - post
  - migrated
description: >-
  Streamline your Rails app deployment with Capistrano, Nginx, and Mongrel.
  Optimize your setup with custom Capistrano recipes for Ubuntu-based servers.
---

### UPDATE: This is outdated due to the release of Capistrano 2… I will work on a new tutorial as soon as I have a project I need to deploy… 1-10-08

All righty then. Recently my firm ([SabreTech](http://www.sabretechllc.com)) got a contract to write and deploy a fairly complicated web app for a local business. Immediately I asked my friend [Xian](http://mintchaos.com) to give me some deployment ideas, and he suggested I use [nginx](http://nginx.net/) as my web server instead of [Apache](http://www.apache.org/) as well as [Slicehost](http://slicehost.com) as my vps host provider…

So I set up my Slicehost account and started hacking. About a week later (five hours of work snuck in here and there), I’ve got my vps up and running smoothly. I’ve been using [Capistrano](http://weblog.jamisbuck.org/2006/3/6/switchtower-renamed) for deployment for awhile, but I also wanted to use it to set up my server, and that is when I ran across deprec. [Deprec](http://deprec.rubyforge.org/) is a nice little gem with a ton of capistrano recipes for setting up and deploying a server. It had some great recipes for deploying to [Ubuntu](http://ubuntu.org), so I chose Ubuntu as my OS for my new slice (vps).

Now I just had to write some of my own recipes for setting up and deploying with Nginx instead of Apache. That is where most of my time was spent. Below you’ll find my instructions and recipes:

#### Prerequisites

1. Install the capistrano and deprec gems on your development machine
2. Cap your app; in the root of your app dir, run: `cap -A`
3. Set up deprec: from the root of your app, run `deprec_dotfiles` which just creates a file in your user dir called `.caprc`, which contains the following line:
   `require 'deprec/recipes'`
4. Your server must be running ubuntu (it should work on any debian based OS though)
5. Your svn repository must be accessible by the same user listed in your `deploy.rb`
6. [`nginx.conf`](http://jonmagic.com/assets/2008/1/10/nginx.conf.txt), `database.yml.production`, and `deploy.rb` must exist and be configured in `app/config` (and checked into your repository)
7. You need to take [this file](http://jonmagic.com/assets/2008/1/10/jonmagic_recipes.txt) and append the contents to the bottom of your `config/deploy.rb` (these are the recipes I wrote)
8. Make sure and configure the mongrel settings in your `deploy.rb`

#### Instructions

1. Log into your server as root and add a new user (the user you specify in your `deploy.rb`), set the password, and finally add to sudoers file
    1. `useradd -m bobby`
    2. `passwd bobby`
    3. `visudo`
2. From the root of your app run:
   `cap install_rails_stack_with_nginx`
3. The last one takes a while, but when it is done run:
   `cap svn_cache_credentials`
4. Finally run:
   `cap deploy_first_time`
    1. (When it asks for mysql user password just press enter, unless you changed the mysql root password)

#### Files

- [nginx.conf](http://jonmagic.com/assets/2008/1/10/nginx.conf.txt)
- [my recipes, add to bottom of deploy.rb](http://jonmagic.com/assets/2008/1/10/jonmagic_recipes.txt)
