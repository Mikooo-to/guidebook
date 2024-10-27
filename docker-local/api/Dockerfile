FROM amazon/aws-lambda-nodejs:20

RUN microdnf install -y unzip && microdnf clean all
COPY api/lambdas/build_lambda_layer/layer.zip .
RUN unzip layer.zip -d /opt
RUN rm layer.zip

CMD ["api-main.mainHandler"]