import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import { Certificate, ICertificate } from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as lambda from 'aws-cdk-lib/aws-lambda'

import { Construct } from 'constructs'


export class IacStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        const stage= process.env.GITHUB_REF_NAME || 'dev'

        // const acmCertificateArn= process.env.ACM_CERTIFICATES_ARN || ''

        // // pensar se realmente precisa do domain2
        // const alternativeDomain2= process.env.ALTERNATIVE_DOMAIN_NAME_2

        // const hostZonedIdValue= process.env.HOSTED_ZONE_ID

        // const projectName= process.env.PROJECT_NAME

        // instanciando s3
        const s3Bucket= new s3.Bucket(
            this,
            `ProjetoNutriEsportivaSaoCamiloFrontBucket-` + stage,
            {
                versioned: true,
                removalPolicy: cdk.RemovalPolicy.DESTROY,
                blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
                accessControl: s3.BucketAccessControl.PRIVATE,
                autoDeleteObjects: true
            }
        )

        // OPRTEI POR NAO UTILIZAR UMA URL PERSONALIZADA NESSA PRIMEIRA VERSAO POR CONTA DOS CUSTOS ADICIONAIS

        // instanciando oac do cloudfront para ele poder acessar o s3
        // const oac= new cloudfront.CfnOriginAccessControl(
        //     this,
        //     "AOC",
        //     {
        //         originAccessControlConfig: {
        //             name: `Projeto Nutri Esportiva SaoCamilo Front S3 OAC` + stage,
        //             originAccessControlOriginType: "s3",
        //             signingBehavior: 'always',
        //             signingProtocol: 'sigv4'
        //         }
        //     }
        // )

        // let viewerCertificate= cloudfront.ViewerCertificate.fromCloudFrontDefaultCertificate()

        // let viewerCertificate: ICertificate | undefined= undefined
        // let domains: string[] = []

        // if (stage === 'dev' || stage === 'homolog') {
        //     viewerCertificate= Certificate.fromCertificateArn(
        //         this,
        //         "ProjetoNutriEsportivaSaoCamiloFrontCertificate-" + stage,
        //         acmCertificateArn
        //     );
        //     domains= [alternativeDomain]
            
            // cloudfront.ViewerCertificate.fromAcmCertificate(
            //     Certificate.fromCertificateArn(
            //         this,
            //         "ProjetoNutriEsportivaSaoCamiloFrontCertificate-" + stage,
            //         acmCertificateArn
            //     ),
            //     {
            //         aliases: [alternativeDomain],
            //         securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021
            //     }
            // )
        // }

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