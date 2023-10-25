export const CarAuctionsTableIAM = 
{
    Effect: "Allow",
    Action: [
      "dynamodb:PutItem",
      "dynamodb:Scan",
      "dynamodb:GetItem",
      "dynamodb:UpdateItem",
      "dynamodb:Query",
    ],
    Resource: [
        "${self:custom.CarAuctionsTable.arn}",
        { "Fn::Join" : [ "/", [ '${self:custom.CarAuctionsTable.arn}', 'index', 'statusAndEndDate' ] ] }
    ]
}