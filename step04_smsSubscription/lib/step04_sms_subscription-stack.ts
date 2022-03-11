import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';


export class Step04SmsSubscriptionStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //create sns topic
    const myTopic = new sns.Topic(this, "MyTopic");

    //const Dead letter Queue for failed messages
    const dlQueue = new sqs.Queue(this, "dlQueue", {
      queueName: "SMS_DLQ",
      retentionPeriod: Duration.days(14)
    });

    //topics ko subscription provide krrhe hain 
    myTopic.addSubscription(
      new subscriptions.SmsSubscription("+923472923515", {
        deadLetterQueue: dlQueue,
        filterPolicy: {
          test: sns.SubscriptionFilter.numericFilter({                                                 //numeric filter lgaya hai jb isse bara hoga tbhi chakega 
            greaterThan: 100
          })
        }
      })
    )

  }
}
