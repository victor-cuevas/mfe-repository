#!/usr/bin/env bash

DISTRIBUTION_ID=$(aws cloudfront list-distributions --output text --query "DistributionList.Items[].{DomainName: DomainName, OriginDomainName: Origins.Items[0].DomainName, Id: Id}[?contains(OriginDomainName, '$BUCKET')] | [0].Id")
echo $DISTRIBUTION_ID
aws cloudfront create-invalidation --distribution-id ${DISTRIBUTION_ID} --paths "/*"
