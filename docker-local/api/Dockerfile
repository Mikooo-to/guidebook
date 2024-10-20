FROM amazon/aws-lambda-nodejs:20

RUN microdnf install -y unzip && microdnf clean all
COPY api/lambdas/build_lambda_layer/layer.zip .
RUN unzip layer.zip -d /opt
RUN rm layer.zip

# Expose debug port
EXPOSE 9229
# Set up entrypoint script
COPY docker-local/api/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# setup in docker-comopose.yml because debugging
# ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
# if no debug, leave it and remove in docker-compose
# CMD ["api-main.mainHandler"]