---
title: Getting hacked
date: 2008-06-20
tags:
  - post
  - migrated
---

My worst nightmare happened last night, and I didn’t even know it until late this morning. I was hacked…

### Sequence of events:

#### June 19th

- 10pm EST – hacker figured out my email password, logged in, and sent out a mass email to the top 20 people on my contact list (most contacted people), thankfully gmail calculates this list only when you use the web interface in gmail, which I haven’t used in quite some time since I switched to using Apple Mail.app. Most everyone on the top 20 were family or friends. Mysteriously the hacker does not send the mass mail to Sam or Xian, who were both on my top 20 list. The two people who would have known to call me (rather than email me) and tell me to take immediate action.
- 10:16pm EST – Hacker? tries logging into my blog admin section from this ip 90.194.192.57 unsuccessfully
- 10:20pm EST – Hacker? successfully logs into my blog admin section from this ip 88.191.47.11
- 10:23pm EST – Magically whoever logged in at 10:20 is now logged in under a different ip 128.197.11.30 and figuring out my blogging system
- 10:29pm EST – Hacker figures out my layout management system and starts adding javascript to my template files, first my tag.liquid file
- 10:31pm EST – Hacker finds my layout.liquid file, the master layout, and adds several javascript lines in there. They cause anyone who visits my site to get forwarded to a nasty porn storm site, and installed some sort of tracking js linked to cetrk.com and crazyegg? Keeps updating the
