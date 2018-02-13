---
title: Gmail Per-label Notifications for FastMail
tags: FastMail
---
As someone who tries not to check their email often, I've relied on the Gmail Android app to notify me when urgent emails arrive. To do this, I:
1. Use [Gmail filters][] (through the web interface) to add a label to important messages: `notify me`
1. Enable notifications in the Gmail app (Settings -> me@gmail.com -> Notifications)
1. Disable any "Label notifications" enabled by default (e.g. Inbox; Settings -> me@gmail.com -> Manage labels -> Inbox -> Label notifications)
1. Enable "label notifications" for `notify me`

Now I'll receive notifications on my Android phone for urgent emails, labeled `notify me`, but not for other emails - great!

## FastMail
I recently switched to [FastMail][], which does not support notifications on a per-folder basis (folders stand in for labels), so I needed a new solution. I found one in [FastMail's Sieve Notify extension][notify].

FastMail uses the [Sieve][] programming language to filter incoming emails. When a user uses the Rules GUI to create these filters, FastMail will generate the necessary Sieve scripts used behind the scenes. However, the GUI is limited so [they allow users to write custom sieve code][custom sieve] to filter mail in advanced ways.

Their Sieve implementation comes with [many extensions][sieve ext], one of which is the Notify extension. Notify, when called from a Sieve script, can launch a notification from the FastMail mobile app with the user-specified custom text. Note that Notify can also be used to forward an email or send a message through twilio, Slack, or IFTTT.

Here are the basic steps to get Notify working:
1. Write a custom Sieve script (through the web interface) to run Notify on desired emails (Settings -> Rules -> Edit custom sieve code; there will also be auto-generated Sieve code here)
1. Disable notifications (yes disable!) in the FastMail app: this stops notifications for mail that isn't using Notify (Device Settings -> Notifications)

Here's an example Sieve script to open a notification for mail from `a@b.com` or `x@y.xyz`, keep the message, and stop futher filtering:
```
if 
  anyof(
  address :is "From" "a@b.com",
  address :is "From" "x@y.xyz"
  )
 {
  # Notify the app with the specified text
  notify :method "app" :options ["From","Full"] :message "$from$ / $subject$ / $text[500]$";
  
  # Keep the message and don't go through additional filters.
  # Without "keep", "stop" will discard the message so be careful!
  keep;
  stop;
}
```

See additional details at [the Notify documentation here][notify]. I paste this script in the bottom-most custom sieve section (below the rules generated from the Organize Rules GUI) though it could be moved anywhere. Once the script is added and notifications are disabled, the FastMail app will send notifications if and only if they match the Notify filters!

This solution comes with some pros:
- Unlike the alternative solution below, notifications are independent of folders so all mail can end up in the `Inbox`
- In theory, it will work automatically when switching between iOS and Android

And cons (on Android, at least):
- Each email will create a new notification: they don't batch together
- Clicking on a notification does not launch the app: it must be opened from the launcher
- The notifications have no quick actions (e.g. reply, archive, delete)
- With my Sieve order, other filters will take precedence and may prevent Notify from running. This can be fixed.

### An alternative solution
Before finding this solution, I first came up with another: I installed a local mail client that could enable/disable notifications at the folder level ([K-9 Mail][k9]) and mimicked the Gmail app solution. This was unsatisfactory to me because it required me to check two folders for my new mail - `Inbox` and `notify me` - since a FastMail message can only exist in one folder, unlike Gmail labels. This solution also forced me to configure an unfamiliar client (K-9 isn't simple...) and to trust it with login credentials.

[k9]: https://k9mail.github.io/
[FastMail]: https://www.fastmail.com/
[Gmail filters]: https://support.google.com/mail/answer/6579
[Sieve]: https://www.fastmail.com/help/technical/sieve.html
[notify]: https://www.fastmail.com/help/technical/sieve-notify.html
[custom sieve]: https://www.fastmail.com/help/technical/sieve-howto.html
[sieve ext]: https://www.fastmail.com/help/technical/sieve.html#extensions
