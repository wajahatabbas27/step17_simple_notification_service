import { Expiration, Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as event from 'aws-cdk-lib/aws-events'
import * as targets from 'aws-cdk-lib/aws-events-targets'

export class Step05PublishUsingEventStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // API with appsync
    const api = new appsync.GraphqlApi(this, "Api", {
      name: "appsyncEventbridgeAPI",
      schema: appsync.Schema.fromAsset("schema/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: Expiration.after(Duration.days(365)),
          },
        },
      },
      logConfig: { fieldLogLevel: appsync.FieldLogLevel.ALL },
      xrayEnabled: true,
    });

    //http datasource
    const httpDs = api.addHttpDataSource(
      "ds",
      "https://events." + this.region + ".amazonaws.com/",                                     // This is the ENDPOINT for eventbridge.
      {
        name: "httpDsWithEventBridge",
        description: "From appSync to EventBridge",
        authorizationConfig: {
          signingRegion: this.region,
          signingServiceName: "events",
        },
      }
    );

    //adding event to event bus from httpDs
    event.EventBus.grantAllPutEvents(httpDs);

    //resolver for appsync mutation 
    const putEventResolver = httpDs.createResolver({
      typeName: "Mutation", // add the topic as a target to the rule created above
      fieldName: "createEvent",
      requestMappingTemplate: appsync.MappingTemplate.fromFile("request.vtl"),
      responseMappingTemplate: appsync.MappingTemplate.fromFile("response.vtl")
    })

    //create an sns topic
    const mytopic = new sns.Topic(this, "MyTopic");

    //dead letter Queue
    const dlQueue = new sqs.Queue(this, "DlQueue", {
      queueName: "QueueForSubscriptions",
      retentionPeriod: Duration.days(14)
    });

    //subscription add krrhe hain 
    mytopic.addSubscription(
      new subscriptions.EmailSubscription("wajahatabbas27@gmail.com", {
        json: false,
        deadLetterQueue: dlQueue
      })
    );

    //rule create krrhe hain take eventbridge chale
    const rule = new event.Rule(this, "AppSyncEventBridgeRule", {
      eventPattern: {
        source: ["eru-appsync-events"]                                           // every event that has source = "eru-appsync-events" will be sent to SNS topic
      }
    });

    // add the topic as a target to the rule created above  - event bridge se jrha hai sns pe 
    rule.addTarget(
      new targets.SnsTopic(mytopic)
    )



  }
}
