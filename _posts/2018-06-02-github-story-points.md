---
title: "\"Will we complete this sprint in time?\": Modifying GitHub To Work For Us"
tags: [side projects,github,mozilla]
---
My team estimates the time to complete an issue using "T-shirt sizing": we assign size labels "S" (<= 1 day), "M" (2-3 days), and "L" (4-5 days). One quick, albeit rough, way to estimate the amount of time it'd take to complete a sprint is to sum together the number of days these size labels represent (we use the upper bounds to be safe) to find out the number of "engineering days" it'll take to complete the sprint. To find out if you'll complete the sprint on time, this number can be subtracted by the number of engineering days until the deadline: the number of days until the deadline multiplied by the number of engineers you have. To make a formula:
```
eng_days_to_complete_sprint = sum(issue_size_days)
eng_days_to_deadline = days_to_deadline * num_eng

days_left_over = eng_days_to_complete_sprint - eng_days_to_deadline
```

It's tedious to calculate these values by hand, especially when the issue list, and its size estimates, is rapidly changing during a sprint planning meeting. At [our Product Manager][barbara]'s suggestion, I created the GitHub Story Points browser add-on to calculate our eng days estimates for us:

![An example of GitHub Story Points in use](/im/posts/story-points-example.png)

You can [get it on addons.mozilla.org][amo] and find [the source on GitHub.][source]

## Notes
I mention "engineering days" but this style of estimation can be used for any type of resourcing days -- I used this terminology because I thought it'd be more intuitive.

A few more notes on our estimation processes:
- There are likely more robust ways of creating software estimates but this process is working well enough for us right now that we'd rather prioritize other work
- The "engineering days" estimate is rough but can be used as a upper-bound baseline to form manual estimates

[amo]: https://addons.mozilla.org/en-US/firefox/addon/github-story-points/
[source]: https://github.com/mcomella/github-story-points
[barbara]: https://twitter.com/bbinto
