import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscription from 'aws-cdk-lib/aws-sns-subscriptions'
import { SubscriptionProtocol } from 'aws-cdk-lib/aws-sns';

export class Step00HttpsSubscriptionStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // create a lambda function
    const hello = new lambda.Function(this, "HelloHandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "index.handler",
    });

    //create the api gateway endpoint
    const api = new apigateway.LambdaRestApi(this, "Endpoint", {
      handler: hello
    })

    //create the sns topic
    const mytopic = new sns.Topic(this, "MyTopic");

    // The following command subscribes our endpoint(connected to lambda) to the SNS topic
    mytopic.addSubscription(
      new subscription.UrlSubscription(api.url, {                             //api.url - lambda api endpoint hai yh jb bhi hit ho to phr yh kre yh ke 
        protocol: SubscriptionProtocol.HTTPS                                  //http request chale
      })
    )

  }
}
