---
title: Grim
date: 2011-09-06T00:00:00.000Z
tags:
  - post
  - migrated
description: >-
  Turn PDF pages into images or text with Grim, my first Ruby gem! A nifty tool
  for developers and Speaker Deck users working with presentations.
---

Grim is a simple gem for extracting (reaping) a page from a pdf and converting it to an image as well as extract the text from the page as a string.

[Grim](https://github.com/jonmagic/grim) is my first Ruby gem! Not technically my first OSS contribution, but definitely my first gem. This project came out of [Speaker Deck](http://speakerdeck.com) and is used by Speaker Deck whenever you upload a presentation.

### Sample usage

```ruby
pdf = Grim.reap("/path/to/pdf")
count = pdf.count
pdf[3].save('/path/to/image.png')
text = pdf[3].text

pdf.each do |page|
  puts page.text
end
```

This gem is perfect for anyone working with PDF’s that wants to extract single pages as images or the text from a page using Ruby.

Enjoy!
