"""
Returns all of the tags currently in use by blog posts.
"""
import os
from pprint import pprint

tags = set()
for filename in os.listdir('_posts'):
    with open('_posts/' + filename) as f:
        for line in f.readlines():
            if not line.startswith('tags:'):
                continue

            line = line[len('tags: '):].strip()  # Remove key & strip.
            if not line.startswith('['):
                print(filename + ": line unexpectedly doesn't start with [. got: " + line)
                continue
            if not line.endswith(']'):
                print(filename + ": line unexpectedly doesn't end with ]. got: " + line)
                continue
            line = line[1:-1]  # Remove array markers outside tags.

            for tag in line.split(','):
                tags.add(tag.strip())
            break

print('All tags in _posts/:')
pprint(sorted(tags))
