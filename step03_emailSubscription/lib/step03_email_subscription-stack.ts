import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';

export class Step03EmailSubscriptionStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // create an sns topic
    const mytopic = new sns.Topic(this, "MyTopic");

    //create a dead Letter Queue for the failures to be saved 
    const dlQueue = new sqs.Queue(this, "DlQueue", {
      queueName: "DeadLetterQueueForEmails",
      retentionPeriod: Duration.days(14)
    });

    //subscribe email to the topic
    mytopic.addSubscription(                                                                       //topic se subscription add krrhe hain hm
      new subscriptions.EmailSubscription("wajahatabbas27@gmail.com", {                            //email subscription derhe hain hmyhn pe
        json: false,
        deadLetterQueue: dlQueue
      })
    )

  }
}
