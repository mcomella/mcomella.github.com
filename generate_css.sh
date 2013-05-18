#!/bin/zsh

while true; do
  inotifywait -e modify,moved_to res/css/mcomella.less
  lessc res/css/mcomella.less > res/css/mcomella.css
done
