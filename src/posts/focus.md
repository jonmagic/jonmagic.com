---
title: Focus
date: 2012-09-07T00:00:00.000Z
tags:
  - post
  - migrated
description: >-
  In just six months, we built GitHub's custom support system by learning to
  focus and prioritize core goals. Discover how commitment and innovation led
  the way.
---

We just finished shipping a six month long milestone on one of our support tools at [GitHub](https://github.com). One lesson I learned along the way was focus.

### Make a Commitment

When I first heard about this project, the tool that handles all incoming support requests at GitHub, I was immediately intrigued and volunteered myself to help. Sitting down with the person who had developed the tool to that point and the support team, we came up with a few core things that had to happen, plus a lot of higher level todos.

At the time, our support tool was just a front-end to a popular customer care service called [Tender](http://tenderapp.com), that was actually built by a couple GitHub employees in their previous lives. The service had done its job for a long time, but it was clear that our needs were changing, and that we couldn’t rely on a third party service to meet them.

So, I made the commitment to help achieve this goal and get our support system running on its own as a full fledged application inside of GitHub. I am not actually sure if I would have made this commitment if I had read through the codebase and understood what a long road it would be. Thankfully, in my gung-ho sorta way I just signed up on the spot.

### Frame All Questions & Answers

Having made the commitment, I dove into the project head first. I quickly became the primary developer on the project, with people coming in from other teams to help for a few weeks before returning to their other work (thankfully [@spicycode](http://twitter.com/spicycode) joined later as a full time member of the team). Along the way I learned that being the primary person responsible also meant that people came to me with their needs and wants.

Initially, being a people pleaser, I did everything in my power to fulfill their wishes and desires or promised to work on what they needed later. Quickly this became unsustainable and I became frustrated with my inability to fulfill those requests.

Then I learned the right way to answer questions when asked. I had to frame every question, every want, every wish, in the context of my original commitment. Would satisfying their need further our core goals, and did I have the resources necessary to accomplish it?

### Learn To Say No

Most of the time during the last six months that answer ended up being **no**. This was especially tough for me, I hate saying no, but I had to learn how to do it or risk losing my sanity and disappoint a lot of people.

Thankfully in many cases I didn’t have to say a flat no – instead, we would channel the energy and idea into a feature request that we could talk about more down the road. All of these feature requests were recorded in GitHub Issues and revisited over the following months, taking new shapes, and in some cases being made obsolete by better and newer ideas.

Along the way, we implemented just enough to keep our support team happy, with all of their hair intact. Mostly, we focused on our core goals.

### Conclusion

Last night at midnight we flipped the switch to route all support requests thru our new backend. We still use Tender in a limited capacity for old discussions that are still open, but as time passes those will be archived and eventually we will be able to remove Tender completely as a dependency.

In six months, we laid a solid foundation for the future of support at GitHub by staying focused.
