#!/bin/bash

if [ "$DEBUG_MODE" = "true" ]; then
    # Start Lambda function with debugger
    exec node --inspect=0.0.0.0:9229 /usr/local/bin/aws-lambda-rie /var/runtime/bootstrap
else
    # Start Lambda function normally
    exec /var/runtime/bootstrap
fi