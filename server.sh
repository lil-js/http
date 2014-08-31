#!/bin/bash

./node_modules/.bin/http-server -p $1 &
echo $! > .server.pid
