For users to tag resources during creation, they must have permissions to use the action that creates the resource, such as elasticloadbalancing:CreateLoadBalancer or elasticloadbalancing:CreateTargetGroup. If tags are specified in the resource-creating action, additional authorization is required on the elasticloadbalancing:AddTags action to verify if users have permissions to apply tags to the resources being created. Therefore, users must also have explicit permissions to use the elasticloadbalancing:AddTags action.

In the IAM policy definition for the elasticloadbalancing:AddTags action, you can use the Condition element with the elasticloadbalancing:CreateAction condition key to give tagging permissions to the action that creates the resource.

The following example demonstrates a policy that allows users to create target groups and apply any tags to them during creation. Users are not permitted to tag any existing resources (they can't call the elasticloadbalancing:AddTags action directly).


```
{
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
         "elasticloadbalancing:CreateTargetGroup"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
         "elasticloadbalancing:AddTags"
      ],
      "Resource": "*",
      "Condition": {
         "StringEquals": {
             "elasticloadbalancing:CreateAction" : "CreateTargetGroup"
          }
       }
    }
  ]
}
```
        
Similarly, the following policy allows users to create a load balancer and apply tags during creation. Users are not permitted to tag any existing resources (they can't call the elasticloadbalancing:AddTags action directly).


```
{
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
         "elasticloadbalancing:CreateLoadBalancer"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
         "elasticloadbalancing:AddTags"
      ],
      "Resource": "*",
      "Condition": {
         "StringEquals": {
             "elasticloadbalancing:CreateAction" : "CreateLoadBalancer"
          }
       }
    }
  ]
}
```
        
The elasticloadbalancing:AddTags action is only evaluated if tags are applied during the resource-creating action. Therefore, a user that has permissions to create a resource (assuming there are no tagging conditions) does not require permissions to use the elasticloadbalancing:AddTags action if no tags are specified in the request. However, if the user attempts to create a resource with tags, the request fails if the user does not have permissions to use the elasticloadbalancing:AddTags action.