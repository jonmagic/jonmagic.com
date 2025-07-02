---
title: Running Mephisto (and other Rails apps) on Site5
date: 2009-04-20T00:00:00.000Z
tags:
  - post
  - migrated
description: >-
  Get Mephisto running smoothly on Site5 with tips on setting up Ruby, Rails,
  and your own gem repository. Dive in for a simple, quirky setup guide!
---

There are a few steps in getting the latest Mephisto (0.8.2 at the time of this writing) working on the shared host [Site5](http://www.site5.com). As I’m writing this Site5 is upgrading all their servers to Ruby 1.8.7, Rails 2.2.2, RubyGems 1.3.1, and Mysql 5.0. Thanks to everyone at Site5 that helped, [Ben](http://twitter.com/BenAtSite5), Beau, and the guy I talked to today (forgot his name). Continue reading for the steps I/we had to take to get things running properly.

**UPDATE:** Please make sure to update your .htaccess, Site5 now supports mod_rails on most, if not all of their servers.

### Get your own gems repository working

1. ssh to your account and in `~/` create a gems dir.

   ```sh
   mkdir gems
   ```

2. create a .gemrc file in `~/`

   ```sh
   nano ~/.gemrc
   ```

3. paste the following in (changing username to be your user)

   ```yaml
   gemhome: /home/username/gems
   gempath:
     - /home/username/gems
     - /usr/lib/ruby/gems/1.8
   ```

4. edit (or create) .bash_profile in `~/`

   ```sh
   nano ~/.bash_profile
   ```

5. paste the following (changing username to be your user)

   ```sh
   export GEM_PATH=/home/username/gems:/usr/lib/ruby/gems/1.8
   export GEM_HOME=/home/username/gems
   ```

Now you should be able to run `gem environment` and see the correct values.

### Downloading Mephisto and getting it setup.

I downloaded the latest release of Mephisto from [http://mephistoblog.com/download](http://mephistoblog.com/download), version 0.8.2 Drax Fixes. Once I had it on my dev machine I scp’d it up to Site5. There I created an apps dir in `~/` on my Site5 account, and untarred mephisto there. I renamed the dir to `mephisto_0.8.2` and got to work on configuring stuff. First I copied `config/database.example.yml` to `config/database.yml`, went in and deleted all the extra lines, and just configured what I needed. I like to configure my development database, and then for the production one just have it point at the same settings like so:

```yaml
development:
  adapter: mysql
  database: username_database
  username: username_dbuser
  password: password
  host: localhost
  encoding: utf8

test:
  adapter: mysql
  database: username_testdatabase
  username: username_dbtestuser
  password: password
  host: localhost
  encoding: utf8

production:
  development
```

I’ve been getting into testing stuff more lately, so I went ahead and configured a test database as well. Remember back at the beginning how we had to setup our own spot for gems? Well now we need to tell this application where to look for those gems, and put our app into production mode. `nano config/environment.rb` and set the top five lines to look like this (leave everything else alone in this file, oh, and make sure to replace username with your user):

```ruby
# Be sure to restart your web server when you modify this file.
ENV['GEM_PATH'] = '/home/username/gems:/usr/lib/ruby/gems/1.8'
# Uncomment below to force Rails into production mode when
# you don't control web/app server and can't set it the proper way
ENV['RAILS_ENV'] ||= 'production'
```

### Preparing dependencies and tell Apache what to do with requests!

At this point you’ll have to run the following commands inside your `mephisto` dir to get our dependencies ready.

```sh
rake config/initializers/session_store.rb
rake gems:install
rake db:bootstrap
```

**THE FOLLOWING .htaccess STUFF IS OBSOLETE, PLEASE JUMP AHEAD**

Once you’ve got that done we’re almost there! The next to last thing is add an `.htaccess` file to our public folder so that Apache knows to execute `dispatch.fcgi` when a request comes in. So `nano public/.htaccess` and paste the following:

```apache
Options +FollowSymLinks +ExecCGI
RewriteEngine On
RewriteRule ^$ index.html [QSA]
RewriteRule ^([^.]+)$ $1.html [QSA]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^(.*)$ dispatch.fcgi [QSA,L]
RewriteCond %{HTTP_ACCEPT} application/xrdsxml
RewriteCond %{HTTP_ACCEPT} !application/xrdsxml\s*;\s*q\s*=\s*0(\.0{1,3})?\s*(,|$)
ErrorDocument 500 "<h2>Application error</h2>Rails application failed to start properly"
```

**OK, NOW THAT Site5 SUPPORTS mod_rails MAKE YOUR .htaccess LOOK LIKE THIS**

```apache
PassengerEnabled on
```

Last but not least we need to go to `~/` and rename `public_html` to `public_html_old` and then create a symlink like so:

```sh
ln -s ~/apps/mephisto_0.8.2/public public_html
```

That's it! Open your browser and try to access your site. Things should be working at this point.

If it returns "Rails application failed to start properly” start looking to make sure you have all the gems you need. One thing I like to do is from my mephisto dir, run `./script/console` and do a few db lookups, then if that works I run `./script/server -e production` and then in a second ssh session to my Site5 account I’ll do a `curl http://localhost:3000/` to see what it returns. Often you can see the exact error doing it this way, and fix the problem!

**OTHER NOTES:**

1. Do not install image_science gem even though mephisto works with it now. Site5 does not install freeimage on their servers, only imagemagick, and the Rmagick gem, so just go with those.
2. You could automate a lot of this with Capistrano, but if you are only doing it once, why bother? I use Capistrano in a lot in other instances, but was just lazy here :-)
3. Make sure your permissions on your public folder and dispatch.fcgi are set to 755
