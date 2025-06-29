---
title: OSX Styled web gui
date: 2008-10-15
tags:
  - post
  - migrated
---

I’ll probably get in trouble for this, but I decided to [release it](http://github.com/jonmagic/webapp_gui/) anyways… I’ve been working on some software for running my company and needed a nice GUI, implemented in HTML/CSS/JS. I decided, since I prefer using OSX over any other interface, I wanted my web app to look like OSX too.

So I started from scratch and made up this GUI using minimal HTML markup, simple CSS (I use the [blueprint](http://www.blueprintcss.org/) CSS library as a foundation), the [jquery](http://jquery.com) JavaScript library (including jQuery UI elements), and the [famfamfam silk](http://www.famfamfam.com/lab/icons/silk/) icon set.

This is not **TOTALLY** OSX themed, as I couldn’t find any tabs anywhere in OSX that worked for web apps (at least not easily implemented ones), so I used the jQuery tabs instead and just made them match as close as possible to the rest of the theme.

#### Caveat

This will not work in IE (I’m pretty sure, but haven’t tested), but it does work in modern versions of WebKit-based browsers (Safari and Chrome) and Firefox.

[Here is the link to my GitHub repo](http://github.com/jonmagic/webapp_gui/tree/master)
