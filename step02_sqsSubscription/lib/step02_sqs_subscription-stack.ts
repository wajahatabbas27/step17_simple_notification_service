import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';


export class Step02SqsSubscriptionStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //create an SNS topic
    const myTopic = new sns.Topic(this, "MyTopic");

    //create a queue for subscription
    const myqueue = new sqs.Queue(this, "MyQueue");

    //create a dead letter queue
    const dlQueue = new sqs.Queue(this, "DeadLetterQueue", {
      queueName: "MySubscription_DLQ",
      retentionPeriod: Duration.days(14)
    });

    // subscribe queue to the topic

    // we have also defined a filter policy here. The queue will only recieve events from SNS if  the filter policy is satisfied

    // we have also assigned a dead letter queue to store the failed events
    myTopic.addSubscription(
      new subscriptions.SqsSubscription(myqueue, {
        filterPolicy: {
          test: sns.SubscriptionFilter.stringFilter({
            allowlist: ["test"],                                                        //whitelist mtlb yh ho to phir send kre allowlist use hoga
          }),
        },
        deadLetterQueue: dlQueue                                                        // failure pe dead letter queue mein save krde 
      })
    )

  }
}
