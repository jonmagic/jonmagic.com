---
title: Make Asterisk use Gmail for emailing faxes
date: 2009-09-10
tags:
  - post
  - migrated
---

While [Asterisk](http://www.asterisk.org/) provides a simple way to replace sendmail when sending voicemails, the incoming fax portion of Asterisk is not so easily reconfigured. By studying how it handled an incoming fax from the Asterisk CLI I was able to find this perl script: [ /var/lib/asterisk/bin/fax-process.pl](https://gist.github.com/184641/ddea153508f3373cf2f99ac8ba79fe99ce6fc2fd).

This script uses Net::SMTP to send its faxes as attachments via email. We (and by we I mean [Daniel](http://www.behindlogic.com)) rewired the perl script to use Net::SMTP::SSL instead and made it work with gmail!

There were a few libraries I had to install via cpan:

- force install F/FL/FLORA/Net_SSLeay.pm-1.30.tar.gz
- install S/SU/SULLR/IO-Socket-SSL-1.30.tar.gz
- install GBARR/Authen-SASL-2.12.tar.gz
- install C/CW/CWEST/Net-SMTP-SSL-1.01.tar.gz

And finally here is the rewritten script!  
[http://gist.github.com/184654](http://gist.github.com/184654)
