import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

import { Construct } from 'constructs'


export class IacStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        const stage= process.env.GITHUB_REF_NAME || 'dev'

        const s3Bucket= new s3.Bucket(
            this,
            `pnesc-front-bucket-${stage}`.toLowerCase(),
            {
                versioned: true,
                removalPolicy: cdk.RemovalPolicy.DESTROY,
                blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
                accessControl: s3.BucketAccessControl.PRIVATE,
                autoDeleteObjects: true
            }
        )

        const distribution= new cloudfront.Distribution(
            this,
            "CDN",
            {
                comment: "Projeto Nutri Esportiva SaoCamilo Distribution-" + stage,
                defaultBehavior: {
                    origin: origins.S3BucketOrigin.withOriginAccessControl(s3Bucket),
                    allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
                    compress: true,
                    cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
                    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                    cachePolicy: new cloudfront.CachePolicy(
                        this,
                        "CustomCachePolicy-" + stage,
                        {
                            minTtl: cdk.Duration.seconds(0),
                            maxTtl: cdk.Duration.seconds(86400),
                            defaultTtl: cdk.Duration.seconds(3600)
                        }
                    )
                },

                additionalBehaviors: {
                    'sw.js': {
                        origin: origins.S3BucketOrigin.withOriginAccessControl(s3Bucket),
                        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED                      
                    },
                    'manifest.webmanifest': {
                        origin: origins.S3BucketOrigin.withOriginAccessControl(s3Bucket),
                        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED
                    }
                },
                
                // certificate: viewerCertificate,
                // domainNames: domains.length > 0 ? domains : undefined,
                errorResponses: [
                    {
                        httpStatus: 403,
                        responseHttpStatus: 200,
                        responsePagePath: '/index.html',
                        ttl: cdk.Duration.seconds(0)
                    }
                ]
            }
        )

        new s3deploy.BucketDeployment(
            this,
            "DeployPnescFront-" + stage,
            {
                sources: [s3deploy.Source.asset("../dist")],
                destinationBucket: s3Bucket,
                distribution: distribution,
                distributionPaths: ["/*"]
            }
        );

        new cdk.CfnOutput(
            this,
            'ProjetoNutriEsportivaFrontBucketName-' + stage,
            {
                value: s3Bucket.bucketName
            }
        )

        new cdk.CfnOutput(
            this,
            'ProjetoNutriEsportivaDistributionId-' + stage,
            {
                value: distribution.distributionId
            }
        )

        new cdk.CfnOutput(
            this,
            'ProjetoNutriEsportivaDistributionDomainName-' + stage,
            {
                value: distribution.distributionDomainName
            }
        )
    }
}