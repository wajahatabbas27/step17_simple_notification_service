# step17_simple_notification_service

In Modern applications, we need to send the messages so for that , there is a service called the simple notification service by the aws , which when triggered sends notifications

- the service of sns manages the messages delivery to the subscribers from the publisers.
- publishers send messages to topics ,
- subscribers receive the message from the topic.
- publishers only concern is to send the messages to the topic , rest will be handled by the topic to send the messages to the subscriber
- publishers and the subscribers are the services of aws which are triggered when the topic send the messages to them
- We can also use the mobile numbers to send them messages through the sns.
- In FIFO there is technique used frst in first out , but in standard there is no way to be used firstly and send messages randomly in standard way.
- Standard is better as it can send more messages and so the messages are fast enough , while fifo list is slow and cannot process more and has a particular limit, Standard also supports many other services while fifo only supports the sqs ( simple Queue service)
- We can use SNS service to send topics to subscribers as (email,sms,lambda,https,etc)
- we are sending messages from the console as well by using the service of aws that is basically the sns and sending to the email.
- All we have to do is to create the topic and connect it to the subscription , which we want to perform and do , here we also have the protocol where to send the subscription to the lambda function,sms,email,http .

- If message is failed , It goes to the dead letter queue and it is executed in case of it doesnot go to the subscription.
- There is Filter Messages attribute as well , which will going to filter and send the messages to the lambda function if we are using it , but if the messages failed to be executed and trigger the subscribed lambda , it will be going to the dead leader queue.
- There are so many filters for us - numeric filters and the string filters as well.
- We can use sqs to be subscribed and to send the messages to it, if triggered go to the sqs else go to the dead letter queue if failed and we will going to handle it though.
- blacklist ka attribute bhi use kra hai jo blacklist mein hoga wo uspe msg nhi bhejega
- whitelist ka attribute se msg jaega usse hoga yh ke attribute match kreinge to notification chala jaega.

# SQS - Simple Queue Service

- It works similar to the event bridge,
- It can be used as the dead letter queue - for it as a failure so we use sqs -simple queue service.
- Difference between sns and sqs is basically sqs has queue , while sns has topics.
- Its the smaller version of event bridge as there is queue and it sends the messages to the different services
- There is a queue and it gets the messages in the queue and after that the messages will not be lost as it works asynchronously.

# 5th step

- Event Bridge jese kra tha wohi structure hai bs producer se hm send krte the event bus ko phir consumer mein jata tha , yhn pe bh consumer mein jaega lekin consumer sns topic hai hmara lambda function nhi , phr jo sns mein krrhe hnge hm wo kreinge yhn pe jese sms bhj skte hn email sqs mein dal skte hn .
