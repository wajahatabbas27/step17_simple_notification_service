import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';


export class Step01LambdaSubscriptionStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // create a lambda function
    const helloLambda = new lambda.Function(this, "HelloHandler", {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "hello.handler",
    });

    //adding a dead letter queue for the failure of the messages 
    const dlQueue = new sqs.Queue(this, "DeadLetterQueue", {
      queueName: "MySubscriptionDLQ",
      retentionPeriod: Duration.days(14)
    });

    //create sns topic 
    const myTopic = new sns.Topic(this, "MYTPOIC");

    // subscribe lambda function to the topic

    // we have also assinged a filter policy here. The SNS will only invoke the lambda function if the message published on 
    // the topic satisfies the condition in the filter.

    // We have also assigned a dead letter queue to store the failed events
    myTopic.addSubscription(
      new subscriptions.LambdaSubscription(helloLambda, {
        filterPolicy: {
          test: sns.SubscriptionFilter.numericFilter({                                //yh filter lgawa hai 
            between: { start: 100, stop: 200 },                                       //numeric filter hai jo yhn pe ho usko filter krdo 100 aur 200 ke darmiyan
          }),
        },
        deadLetterQueue: dlQueue,                                                     // baki jo fail honge unko dead letter queue mein daldo
      })
    )



  }
}
